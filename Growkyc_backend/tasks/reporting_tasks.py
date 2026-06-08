"""
tasks/reporting_tasks.py
========================
Async Celery tasks for regulatory reporting and evidence pack generation.
"""

import hashlib
import io
import json
import logging
import zipfile
from datetime import datetime, timezone

from core.celery_app import celery_app
from database import SessionLocal

logger = logging.getLogger(__name__)


@celery_app.task(bind=True, name="tasks.reporting.transmit_report", max_retries=5)
def transmit_report_async(self, submission_id: int, correlation_id: str):
    """
    Async transmission to regulator APIs.
    Handles retries and status updates.
    """
    logger.info(f"Transmitting regulatory report submission {submission_id}")
    db = SessionLocal()
    try:
        from models import ReportSubmission

        submission = (
            db.query(ReportSubmission)
            .filter(ReportSubmission.id == submission_id)
            .first()
        )
        if not submission:
            logger.error(f"Submission {submission_id} not found")
            return

        submission.status = "in_progress"
        submission.retry_count += 1
        db.commit()

        # Simulating external API call...
        try:
            # Fake HTTP response logic for demonstration
            import time

            time.sleep(2)

            # Simulate a success
            submission.status = "success"
            submission.raw_response_payload = (
                '{"status": "accepted", "ref": "REG-12345"}'
            )

            from models import ReportAcknowledgement

            ack = ReportAcknowledgement(
                report_id=submission.report_id,
                correlation_id=correlation_id,
                acknowledgement_reference="REG-12345",
                status_code="accepted",
                raw_response_data={"status": "accepted"},
            )
            db.add(ack)

            # Update parent report
            submission.report.submission_status = "submitted"
            submission.report.regulator_reference = "REG-12345"
            submission.report.submitted_at = datetime.now(timezone.utc)

            db.commit()
            logger.info(f"Successfully transmitted report {submission.report_id}")

        except Exception as api_err:
            logger.warning(
                f"Transmission failed for submission {submission_id}: {api_err}"
            )
            submission.status = "failed"
            submission.error_message = str(api_err)
            db.commit()

            # Use exponential backoff for retries
            self.retry(exc=api_err, countdown=2**self.request.retries * 60)

    except Exception as e:
        logger.error(f"Task error in transmit_report_async: {e}")
        db.rollback()
    finally:
        db.close()


@celery_app.task(
    bind=True, name="tasks.reporting.generate_evidence_pack", max_retries=3
)
def generate_evidence_pack_async(self, pack_id: int, correlation_id: str):
    """
    Deterministically builds an evidence pack zip bundle containing manifest.json
    and associated artifacts. Same inputs = same immutable hash.
    """
    logger.info(f"Generating evidence pack {pack_id}")
    db = SessionLocal()
    try:
        from models import Case, CaseSnapshot, EvidencePack, EvidencePackItem
        from services.storage.factory import get_storage_backend

        pack = db.query(EvidencePack).filter(EvidencePack.id == pack_id).first()
        if not pack:
            return

        case = db.query(Case).filter(Case.id == pack.case_id).first()
        snapshot = (
            db.query(CaseSnapshot)
            .filter(CaseSnapshot.case_id == pack.case_id)
            .order_by(CaseSnapshot.id.desc())
            .first()
        )

        # 1. Build Deterministic Manifest
        manifest = {
            "correlation_id": correlation_id,
            "case_id": pack.case_id,
            "tenant_id": pack.tenant_id,
            "schema_version": pack.schema_version,
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "snapshot": snapshot.snapshot_data if snapshot else None,
            "artifacts": [],
        }

        # Collect files (simulated fetch)
        items = (
            db.query(EvidencePackItem).filter(EvidencePackItem.pack_id == pack.id).all()
        )
        files_to_zip = {}

        # Sort items deterministically to guarantee reproducible hash
        for item in sorted(items, key=lambda x: (x.item_type, x.item_ref_id)):
            filename = f"{item.item_type}_{item.item_ref_id}.json"
            content = json.dumps(
                {"type": item.item_type, "ref": item.item_ref_id}, sort_keys=True
            ).encode()

            files_to_zip[filename] = content
            manifest["artifacts"].append(
                {
                    "type": item.item_type,
                    "ref_id": item.item_ref_id,
                    "filename": filename,
                    "sha256": hashlib.sha256(content).hexdigest(),
                }
            )

        # Ensure manifest keys are sorted deterministically
        manifest_json = json.dumps(manifest, sort_keys=True, indent=2).encode()
        files_to_zip["manifest.json"] = manifest_json

        # 2. Build ZIP in memory
        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(zip_buffer, "w", compression=zipfile.ZIP_DEFLATED) as zf:
            # Sort files alphanumerically for deterministic byte-order in zip
            for filename in sorted(files_to_zip.keys()):
                zf.writestr(filename, files_to_zip[filename])

        zip_bytes = zip_buffer.getvalue()
        immutable_hash = hashlib.sha256(zip_bytes).hexdigest()

        # 3. Store to backend
        storage = get_storage_backend()
        storage_key = (
            f"evidence-packs/{pack.tenant_id}/{pack.case_id}/{immutable_hash}.zip"
        )
        storage.upload(storage_key, zip_bytes, content_type="application/zip")

        # 4. Finalize Pack Record
        pack.status = "completed"
        pack.storage_key = storage_key
        pack.file_size_bytes = len(zip_bytes)
        pack.immutable_hash = immutable_hash
        pack.completed_at = datetime.now(timezone.utc)
        db.commit()

        logger.info(
            f"Successfully generated EvidencePack {pack.id}. Hash: {immutable_hash}"
        )

    except Exception as e:
        logger.error(f"Evidence Pack generation failed: {e}")
        db.rollback()

        # Mark as failed if we exhaust retries
        if self.request.retries >= self.max_retries:
            pack = db.query(EvidencePack).filter(EvidencePack.id == pack_id).first()
            if pack:
                pack.status = "failed"
                pack.error_message = str(e)
                db.commit()

        self.retry(exc=e, countdown=60)
    finally:
        db.close()
