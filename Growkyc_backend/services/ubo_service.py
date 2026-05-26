"""
services/ubo_service.py
=======================
Service for managing Ultimate Beneficial Owners, Corporate Directors,
and modeling layered corporate structures for KYB due diligence.
"""

import logging
from typing import List, Dict, Any, Optional

from sqlalchemy.orm import Session

from core.exceptions import DatabaseError, ValidationError
from core.tenant_context import get_tenant_id
from models import Client, BeneficialOwner, EntityDirector, OwnershipRelationship
from schemas import BeneficialOwnerCreate, EntityDirectorCreate, OwnershipRelationshipCreate

logger = logging.getLogger(__name__)


class UBOService:
    """Enterprise service for UBO resolution and management."""

    def __init__(self, db: Session):
        self.db = db
        self.logger = logger

    def add_beneficial_owner(self, client_id: int, ubo_data: BeneficialOwnerCreate) -> BeneficialOwner:
        """Add a UBO to an entity client."""
        tenant_id = get_tenant_id()
        
        try:
            ubo = BeneficialOwner(
                client_id=client_id,
                tenant_id=tenant_id,
                **ubo_data.model_dump(exclude_unset=True)
            )
            self.db.add(ubo)
            self.db.commit()
            self.db.refresh(ubo)
            
            # Note: We trigger screening asynchronously. In a real system we would use the Celery task.
            # We skip direct import to avoid circular dependencies if screening service uses this.
            return ubo
        except Exception as e:
            self.db.rollback()
            self.logger.error(f"Failed to add UBO to client {client_id}: {e}")
            raise DatabaseError("Could not add Beneficial Owner") from e

    def add_entity_director(self, client_id: int, director_data: EntityDirectorCreate) -> EntityDirector:
        """Add a Director or corporate officer to an entity client."""
        tenant_id = get_tenant_id()
        
        try:
            director = EntityDirector(
                client_id=client_id,
                tenant_id=tenant_id,
                **director_data.model_dump(exclude_unset=True)
            )
            self.db.add(director)
            self.db.commit()
            self.db.refresh(director)
            return director
        except Exception as e:
            self.db.rollback()
            self.logger.error(f"Failed to add Director to client {client_id}: {e}")
            raise DatabaseError("Could not add Entity Director") from e

    def add_ownership_relationship(self, relationship_data: OwnershipRelationshipCreate) -> OwnershipRelationship:
        """
        Create a link in the ownership graph. Validates to prevent circular references.
        """
        tenant_id = get_tenant_id()
        
        # Prevent trivial self-reference
        if relationship_data.parent_owner_id == relationship_data.child_owner_id:
            raise ValidationError("An entity cannot own itself.")
            
        # Check for circular paths (graph traversal)
        if self._is_circular_ownership(relationship_data.child_owner_id, relationship_data.parent_owner_id):
            raise ValidationError("Adding this relationship creates a circular ownership structure.")

        try:
            rel = OwnershipRelationship(
                tenant_id=tenant_id,
                **relationship_data.model_dump(exclude_unset=True)
            )
            self.db.add(rel)
            self.db.commit()
            self.db.refresh(rel)
            return rel
        except Exception as e:
            self.db.rollback()
            self.logger.error(f"Failed to add ownership relationship: {e}")
            raise DatabaseError("Could not create ownership link") from e

    def _is_circular_ownership(self, start_id: int, target_id: int, visited: set = None) -> bool:
        """
        DFS traversal to detect if target_id is reachable from start_id, 
        meaning adding an edge from target_id -> start_id would create a cycle.
        """
        if visited is None:
            visited = set()
            
        if start_id == target_id:
            return True
            
        visited.add(start_id)
        
        children_rels = self.db.query(OwnershipRelationship).filter(
            OwnershipRelationship.parent_owner_id == start_id
        ).all()
        
        for rel in children_rels:
            if rel.child_owner_id not in visited:
                if self._is_circular_ownership(rel.child_owner_id, target_id, visited):
                    return True
                    
        return False

    def get_ownership_tree(self, client_id: int) -> Dict[str, Any]:
        """
        Return the resolved ownership tree for a client.
        Currently returns a flat list of owners and their relationships
        as building a nested graph response requires a specific UI schema.
        """
        ubos = self.db.query(BeneficialOwner).filter(BeneficialOwner.client_id == client_id).all()
        ubo_ids = [u.id for u in ubos]
        
        relationships = self.db.query(OwnershipRelationship).filter(
            OwnershipRelationship.parent_owner_id.in_(ubo_ids) | 
            OwnershipRelationship.child_owner_id.in_(ubo_ids)
        ).all()
        
        return {
            "client_id": client_id,
            "nodes": [{"id": u.id, "name": u.full_name, "type": u.ownership_type} for u in ubos],
            "edges": [
                {
                    "parent_id": r.parent_owner_id, 
                    "child_id": r.child_owner_id, 
                    "type": r.relationship_type,
                    "percentage": r.percentage_control
                } 
                for r in relationships
            ]
        }

    def aggregate_ubo_summary(self, client_id: int) -> Dict[str, Any]:
        """Aggregate data to summarize total known ownership and identify risk."""
        ubos = self.db.query(BeneficialOwner).filter(BeneficialOwner.client_id == client_id).all()
        
        total_percentage = sum([u.ownership_percentage for u in ubos if u.ownership_percentage is not None and u.ownership_type == 'direct'])
        high_risk_count = sum([1 for u in ubos if u.is_pep or u.is_sanctioned])
        is_complex = len(ubos) > 3 or any(u.is_trust_structure for u in ubos)
        
        return {
            "total_ubos": len(ubos),
            "total_percentage_identified": min(total_percentage, 100.0),
            "high_risk_ubos": high_risk_count,
            "is_complex_structure": is_complex
        }
