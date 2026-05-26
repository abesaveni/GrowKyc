"""
services/storage/s3_backend.py
==============================
AWS S3 / MinIO compatible storage backend.
Requires: boto3 installed, AWS_* env vars configured.
"""
import logging
import os
from services.storage.base import BaseStorageBackend

logger = logging.getLogger(__name__)


class S3StorageBackend(BaseStorageBackend):
    """AWS S3 or MinIO-compatible object storage backend."""

    def __init__(self):
        try:
            import boto3
            self.client = boto3.client(
                "s3",
                endpoint_url=os.getenv("S3_ENDPOINT_URL"),       # None = AWS, set for MinIO
                aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
                aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
                region_name=os.getenv("AWS_REGION", "ap-southeast-2"),
            )
            self.bucket = os.getenv("S3_BUCKET_NAME", "growkyc-documents")
        except ImportError:
            raise RuntimeError("boto3 is required for S3 storage. Run: pip install boto3")

    def upload(self, key: str, content: bytes, content_type: str = "application/octet-stream") -> str:
        self.client.put_object(
            Bucket=self.bucket,
            Key=key,
            Body=content,
            ContentType=content_type,
            ServerSideEncryption="AES256",
        )
        logger.info(f"[S3Storage] Uploaded s3://{self.bucket}/{key}")
        return key

    def generate_signed_url(self, key: str, expiry_seconds: int = 3600) -> str:
        url = self.client.generate_presigned_url(
            "get_object",
            Params={"Bucket": self.bucket, "Key": key},
            ExpiresIn=expiry_seconds,
        )
        return url

    def delete(self, key: str) -> bool:
        self.client.delete_object(Bucket=self.bucket, Key=key)
        return True
