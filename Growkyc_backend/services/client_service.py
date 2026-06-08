"""
services/client_service.py
==========================
Single source of truth for Client onboarding and profile management.
Handles both Individual (KYC) and Entity (KYB) flows, automatically
triggering the screening and risk engines.
"""

import logging
from typing import Optional

from sqlalchemy.orm import Session

from core.exceptions import DatabaseError
from core.tenant_context import get_tenant_id
from models import Client, EntityProfile, IndividualProfile
from schemas import EntityProfileCreate, IndividualProfileCreate
from services.risk_service import RiskService
from services.screening_service import ScreeningService

logger = logging.getLogger(__name__)


class ClientService:
    """Service for managing Client lifecycle and profiles."""

    def __init__(self, db: Session):
        self.db = db
        self.logger = logger

    def create_individual_client(
        self,
        user_id: int,
        profile_data: IndividualProfileCreate,
        trigger_async: bool = False,
    ) -> Client:
        """
        Create a new retail Client and their IndividualProfile.

        Args:
            user_id: ID of the user owning this profile.
            profile_data: Schema containing PII.
            trigger_async: If True, uses Celery for screening/risk.
        """
        tenant_id = get_tenant_id()

        try:
            # 1. Create Base Client
            # Use full name logic from profile
            name = " ".join(
                filter(
                    None,
                    [
                        profile_data.first_name,
                        profile_data.middle_name,
                        profile_data.last_name,
                    ],
                )
            )
            if not name:
                name = "Unknown Individual"

            client = Client(
                user_id=user_id,
                tenant_id=tenant_id,
                name=name,
                geography=profile_data.country_of_birth or profile_data.nationality,
            )
            self.db.add(client)
            self.db.flush()  # Get client.id

            # 2. Create Individual Profile
            individual_profile = IndividualProfile(
                client_id=client.id,
                tenant_id=tenant_id,
                **profile_data.model_dump(exclude_unset=True),
            )
            self.db.add(individual_profile)
            self.db.commit()
            self.db.refresh(client)

            # 3. Trigger Engines
            self._trigger_onboarding_engines(client, trigger_async)

            return client

        except Exception as e:
            self.db.rollback()
            self.logger.error(f"Failed to create individual client: {e}")
            raise DatabaseError("Failed to create retail profile") from e

    def create_entity_client(
        self,
        user_id: int,
        profile_data: EntityProfileCreate,
        trigger_async: bool = False,
    ) -> Client:
        """
        Create a new corporate Client and their EntityProfile.
        """
        tenant_id = get_tenant_id()

        try:
            # 1. Create Base Client
            client = Client(
                user_id=user_id,
                tenant_id=tenant_id,
                name=profile_data.legal_name,
                geography=profile_data.incorporation_country,
            )
            self.db.add(client)
            self.db.flush()

            # 2. Create Entity Profile
            entity_profile = EntityProfile(
                client_id=client.id,
                tenant_id=tenant_id,
                **profile_data.model_dump(exclude_unset=True),
            )
            self.db.add(entity_profile)
            self.db.commit()
            self.db.refresh(client)

            # 3. Trigger Engines
            self._trigger_onboarding_engines(client, trigger_async)

            return client

        except Exception as e:
            self.db.rollback()
            self.logger.error(f"Failed to create entity client: {e}")
            raise DatabaseError("Failed to create corporate profile") from e

    def _trigger_onboarding_engines(self, client: Client, trigger_async: bool) -> None:
        """Orchestrate screening and risk calculation during onboarding."""
        if trigger_async:
            from core.tenant_context import get_correlation_id
            from tasks.screening_tasks import run_async_screening

            run_async_screening.delay(
                client_id=client.id,
                user_id=client.user_id,
                tenant_id=client.tenant_id,
                correlation_id=get_correlation_id(),
            )
            self.logger.info(f"Dispatched async screening for client_id={client.id}")
        else:
            self.logger.info(f"Running synchronous screening for client_id={client.id}")
            # Synchronous execution
            ScreeningService(self.db).perform_screening(
                client, triggered_by_user_id=client.user_id
            )
            RiskService(self.db).calculate_risk(
                client, user_id=client.user_id, trigger="onboarding"
            )

    def get_client_by_id(self, client_id: int) -> Optional[Client]:
        """Fetch a client with their nested profiles."""
        return self.db.query(Client).filter(Client.id == client_id).first()
