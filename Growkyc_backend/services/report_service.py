"""
Report service for generating regulatory compliance exports.
"""

import json
import logging
from datetime import datetime, timezone

from sqlalchemy.orm import Session

from core.enums import ReportType
from core.exceptions import ResourceNotFoundError
from models import Client, Report

logger = logging.getLogger(__name__)


class ReportService:
    """Service to generate SMR, TTR, and IFTI reports."""

    def __init__(self, db: Session):
        self.db = db
        self.logger = logging.getLogger(__name__)

    def generate_report(self, client_id: int, report_type: ReportType) -> Report:
        """
        Produce a compliance report merging client/case/risk data.
        """
        client = self.db.query(Client).filter(Client.id == client_id).first()
        if not client:
            raise ResourceNotFoundError("Client", client_id)

        # Mocking the JSON compilation step based on type
        report_data = {
            "client_name": client.name,
            "risk_score": client.risk_score,
            "risk_level": client.risk_level.value,
            "report_classification": report_type.value,
            "generated_at": datetime.now(timezone.utc).isoformat(),
        }

        # Depending on type, specific rules/aggregations apply (left as
        # placeholder structure per prompt)
        if report_type == ReportType.SMR:
            report_data["suspicion_narrative"] = (
                "Client flagged due to abnormal high velocity PEP matching."
            )

        report = Report(
            client_id=client.id,
            type=report_type,
            data=json.dumps(report_data),
            created_at=datetime.now(timezone.utc),
        )

        self.db.add(report)
        self.db.commit()
        self.db.refresh(report)

        self.logger.info(
            f"Generated {report_type.value} report for Client {client.id}."
        )
        return report
