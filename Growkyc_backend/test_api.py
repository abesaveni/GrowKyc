"""
Test script for KYC Backend API.
Demonstrates the complete workflow from registration to admin operations.

Usage:
    python test_api.py

Requirements:
    - FastAPI server running on http://localhost:8000
    - All dependencies installed (pip install -r requirements.txt)
"""

import logging

import requests

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

BASE_URL = "http://localhost:8000"


class KYCAPITester:
    """Test client for KYC Backend API"""

    def __init__(self, base_url: str = BASE_URL):
        self.base_url = base_url
        self.user_token = None
        self.admin_token = None
        self.user_id = None
        self.kyc_id = None

    def test_health_check(self):
        """Test the health check endpoint"""
        logger.info("Testing health check...")
        response = requests.get(f"{self.base_url}/health")
        assert response.status_code == 200
        logger.info(f"✓ Health check passed: {response.json()}")

    def test_registration(self):
        """Test user registration"""
        logger.info("\n=== Testing Registration ===")

        # Register a new user
        user_data = {
            "name": "Test User",
            "email": "testuser@example.com",
            "password": "TestPass123456",
        }

        logger.info(f"Registering user: {user_data['email']}")
        response = requests.post(f"{self.base_url}/auth/register", json=user_data)

        assert response.status_code == 200, f"Registration failed: {response.text}"
        user = response.json()
        self.user_id = user["id"]

        logger.info("✓ User registered successfully")
        logger.info(f"  - ID: {user['id']}")
        logger.info(f"  - Name: {user['name']}")
        logger.info(f"  - Email: {user['email']}")
        logger.info(f"  - Role: {user['role']}")

        return user

    def test_duplicate_registration(self):
        """Test that duplicate email registration fails"""
        logger.info("\nTesting duplicate registration...")

        user_data = {
            "name": "Another User",
            "email": "testuser@example.com",  # Same email
            "password": "AnotherPass123",
        }

        response = requests.post(f"{self.base_url}/auth/register", json=user_data)
        assert response.status_code == 409, "Duplicate registration should fail"

        logger.info("✓ Duplicate registration correctly rejected")

    def test_login(self):
        """Test user login"""
        logger.info("\n=== Testing Login ===")

        login_data = {
            "email": "testuser@example.com",
            "password": "TestPass123456",
        }

        logger.info(f"Logging in user: {login_data['email']}")
        response = requests.post(f"{self.base_url}/auth/login", json=login_data)

        assert response.status_code == 200, f"Login failed: {response.text}"
        data = response.json()
        self.user_token = data["access_token"]

        logger.info("✓ Login successful")
        logger.info(f"  - Token Type: {data['token_type']}")
        logger.info(f"  - Expires In: {data['expires_in']} seconds")
        logger.info(f"  - User Role: {data['user']['role']}")

    def test_invalid_login(self):
        """Test login with incorrect password"""
        logger.info("\nTesting invalid login...")

        login_data = {
            "email": "testuser@example.com",
            "password": "WrongPassword",
        }

        response = requests.post(f"{self.base_url}/auth/login", json=login_data)
        assert response.status_code == 401, "Invalid login should fail"

        logger.info("✓ Invalid login correctly rejected")

    def test_kyc_submission(self):
        """Test KYC submission"""
        logger.info("\n=== Testing KYC Submission ===")

        kyc_data = {"aadhaar": "123456789012", "pan": "ABCDE1234F"}

        headers = {"Authorization": f"Bearer {self.user_token}"}
        logger.info("Submitting KYC information...")
        response = requests.post(
            f"{self.base_url}/kyc/submit", json=kyc_data, headers=headers
        )

        assert response.status_code == 200, f"KYC submission failed: {response.text}"
        kyc = response.json()
        self.kyc_id = kyc["id"]

        logger.info("✓ KYC submitted successfully")
        logger.info(f"  - KYC ID: {kyc['id']}")
        logger.info(f"  - Status: {kyc['status']}")
        logger.info(f"  - Aadhaar: {kyc['aadhaar']}")
        logger.info(f"  - PAN: {kyc['pan']}")

    def test_duplicate_kyc_submission(self):
        """Test that duplicate KYC submission fails"""
        logger.info("\nTesting duplicate KYC submission...")

        kyc_data = {"aadhaar": "999999999999", "pan": "ZZZZZZ9999Z"}

        headers = {"Authorization": f"Bearer {self.user_token}"}
        response = requests.post(
            f"{self.base_url}/kyc/submit", json=kyc_data, headers=headers
        )

        assert response.status_code == 409, "Duplicate KYC submission should fail"
        logger.info("✓ Duplicate KYC submission correctly rejected")

    def test_document_upload(self):
        """Test document upload"""
        logger.info("\n=== Testing Document Upload ===")

        doc_data = {
            "file_path": "/uploads/aadhaar_123456.pdf",
            "document_type": "Aadhaar",
        }

        headers = {"Authorization": f"Bearer {self.user_token}"}
        logger.info(f"Uploading {doc_data['document_type']} document...")
        response = requests.post(
            f"{self.base_url}/kyc/upload-document",
            json=doc_data,
            headers=headers,
        )

        assert response.status_code == 200, f"Document upload failed: {response.text}"
        doc = response.json()

        logger.info("✓ Document uploaded successfully")
        logger.info(f"  - Document ID: {doc['id']}")
        logger.info(f"  - Type: {doc['type']}")
        logger.info(f"  - File Path: {doc['file_path']}")

        # Upload another document
        doc_data2 = {
            "file_path": "/uploads/pan_123456.pdf",
            "document_type": "PAN",
        }
        response = requests.post(
            f"{self.base_url}/kyc/upload-document",
            json=doc_data2,
            headers=headers,
        )
        assert response.status_code == 200
        logger.info("✓ Second document uploaded successfully")

    def test_kyc_status(self):
        """Test getting KYC status"""
        logger.info("\n=== Testing KYC Status Retrieval ===")

        headers = {"Authorization": f"Bearer {self.user_token}"}
        logger.info(f"Fetching KYC status for user {self.user_id}...")
        response = requests.get(
            f"{self.base_url}/kyc/status/{self.user_id}", headers=headers
        )

        assert response.status_code == 200, f"Status fetch failed: {response.text}"
        kyc = response.json()

        logger.info("✓ KYC status retrieved")
        logger.info(f"  - Status: {kyc['status']}")
        logger.info(f"  - Documents: {len(kyc['documents'])}")
        for i, doc in enumerate(kyc["documents"], 1):
            logger.info(f"    {i}. {doc['type']} - {doc['file_path']}")

    def test_admin_login(self):
        """Test admin login"""
        logger.info("\n=== Testing Admin Login ===")

        login_data = {
            "email": "admin@kyc.com",
            "password": "admin123",  # Default password from sample data
        }

        logger.info("Logging in as admin...")
        response = requests.post(f"{self.base_url}/auth/login", json=login_data)

        assert response.status_code == 200, f"Admin login failed: {response.text}"
        data = response.json()
        self.admin_token = data["access_token"]

        logger.info("✓ Admin login successful")
        logger.info(f"  - User Role: {data['user']['role']}")

    def test_get_pending_kyc(self):
        """Test getting pending KYC records (admin only)"""
        logger.info("\n=== Testing Get Pending KYC (Admin) ===")

        headers = {"Authorization": f"Bearer {self.admin_token}"}
        logger.info("Fetching pending KYC records...")
        response = requests.get(
            f"{self.base_url}/admin/kyc/pending?limit=10", headers=headers
        )

        assert response.status_code == 200, f"Pending KYC fetch failed: {response.text}"
        pending_list = response.json()

        logger.info(f"✓ Retrieved {len(pending_list)} pending KYC records")
        for kyc in pending_list[:3]:  # Show first 3
            logger.info(
                f"  - KYC ID: {kyc['id']}, User ID: {kyc['user_id']}, "
                f"Status: {kyc['status']}"
            )

    def test_approve_kyc(self):
        """Test KYC approval (admin only)"""
        logger.info("\n=== Testing KYC Approval (Admin) ===")

        approve_data = {
            "approval_reason": "All documents verified and validated successfully"
        }

        headers = {"Authorization": f"Bearer {self.admin_token}"}
        logger.info(f"Approving KYC {self.kyc_id}...")
        response = requests.put(
            f"{self.base_url}/admin/kyc/{self.kyc_id}/approve",
            json=approve_data,
            headers=headers,
        )

        assert response.status_code == 200, f"KYC approval failed: {response.text}"
        kyc = response.json()

        logger.info("✓ KYC approved successfully")
        logger.info(f"  - New Status: {kyc['status']}")
        logger.info(f"  - Approved At: {kyc['approved_at']}")

    def test_reject_kyc(self):
        """Test KYC rejection (admin only)"""
        logger.info("\n=== Testing KYC Rejection (Admin) ===")

        # First, create a new KYC to reject
        logger.info("Creating a new user for rejection test...")

        # Register
        user_data = {
            "name": "Test User 2",
            "email": "testuser2@example.com",
            "password": "TestPass123456",
        }
        reg_response = requests.post(f"{self.base_url}/auth/register", json=user_data)
        reg_response.json()["id"]

        # Login
        login_response = requests.post(
            f"{self.base_url}/auth/login",
            json={
                "email": "testuser2@example.com",
                "password": "TestPass123456",
            },
        )
        token = login_response.json()["access_token"]

        # Submit KYC
        headers = {"Authorization": f"Bearer {token}"}
        kyc_response = requests.post(
            f"{self.base_url}/kyc/submit",
            json={"aadhaar": "999999999999", "pan": "ZZZZZZ9999Z"},
            headers=headers,
        )
        kyc_id = kyc_response.json()["id"]

        # Now reject it
        reject_data = {
            "rejection_reason": (
                "Document quality is insufficient and PAN details do not match"
            )
        }

        admin_headers = {"Authorization": f"Bearer {self.admin_token}"}
        logger.info(f"Rejecting KYC {kyc_id}...")
        response = requests.put(
            f"{self.base_url}/admin/kyc/{kyc_id}/reject",
            json=reject_data,
            headers=admin_headers,
        )

        assert response.status_code == 200, f"KYC rejection failed: {response.text}"
        kyc = response.json()

        logger.info("✓ KYC rejected successfully")
        logger.info(f"  - New Status: {kyc['status']}")
        logger.info(f"  - Rejection Reason: {kyc['rejection_reason']}")
        logger.info(f"  - Rejected At: {kyc['rejected_at']}")

    def test_audit_log(self):
        """Test audit log retrieval (admin only)"""
        logger.info("\n=== Testing Audit Log (Admin) ===")

        headers = {"Authorization": f"Bearer {self.admin_token}"}
        logger.info(f"Fetching audit log for KYC {self.kyc_id}...")
        response = requests.get(
            f"{self.base_url}/admin/kyc/{self.kyc_id}/audit-log",
            headers=headers,
        )

        assert response.status_code == 200, f"Audit log fetch failed: {response.text}"
        audit_log = response.json()

        logger.info(f"✓ Audit log retrieved (showing {len(audit_log)} entries)")
        for entry in audit_log:
            logger.info(
                f"  - {entry['old_status']} → {entry['new_status']} "
                f"at {entry['changed_at']}"
            )
            if entry["change_reason"]:
                logger.info(f"    Reason: {entry['change_reason']}")

    def run_all_tests(self):
        """Run all tests in sequence"""
        logger.info("=" * 60)
        logger.info("KYC BACKEND API - COMPREHENSIVE TEST SUITE")
        logger.info("=" * 60)

        try:
            # Basic tests
            self.test_health_check()
            self.test_registration()
            self.test_duplicate_registration()
            self.test_login()
            self.test_invalid_login()

            # User operations
            self.test_kyc_submission()
            self.test_duplicate_kyc_submission()
            self.test_document_upload()
            self.test_kyc_status()

            # Admin operations
            self.test_admin_login()
            self.test_get_pending_kyc()
            self.test_approve_kyc()
            self.test_reject_kyc()
            self.test_audit_log()

            logger.info("\n" + "=" * 60)
            logger.info("✓ ALL TESTS PASSED SUCCESSFULLY!")
            logger.info("=" * 60)

        except AssertionError as e:
            logger.error(f"\n✗ TEST FAILED: {str(e)}")
            raise
        except Exception as e:
            logger.error(f"\n✗ UNEXPECTED ERROR: {str(e)}")
            raise


def main():
    """Main entry point"""
    try:
        tester = KYCAPITester()
        tester.run_all_tests()
    except Exception as e:
        logger.error(f"Test execution failed: {str(e)}")
        exit(1)


if __name__ == "__main__":
    main()
