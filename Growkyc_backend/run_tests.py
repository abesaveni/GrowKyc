"""
Test runner and validation script for KYC Backend API.
Run comprehensive test suite to validate all endpoints.
"""

import os
import subprocess
import sys


def run_tests():
    """Run pytest test suite."""
    print("\n" + "=" * 70)
    print("KYC BACKEND - COMPREHENSIVE TEST SUITE")
    print("=" * 70)
    print("\nRunning all tests...\n")

    # Run pytest with verbose output
    result = subprocess.run(
        [sys.executable, "-m", "pytest", "tests/", "-v", "--tb=short"],
        cwd=os.path.dirname(os.path.abspath(__file__)),
    )

    return result.returncode


def run_coverage():
    """Run tests with coverage report."""
    print("\n" + "=" * 70)
    print("RUNNING TESTS WITH COVERAGE REPORT")
    print("=" * 70 + "\n")

    result = subprocess.run(
        [
            sys.executable,
            "-m",
            "pytest",
            "tests/",
            "--cov=.",
            "--cov-report=html",
            "-v",
        ],
        cwd=os.path.dirname(os.path.abspath(__file__)),
    )

    return result.returncode


def run_specific_test(test_file):
    """Run specific test file."""
    print("\n" + "=" * 70)
    print(f"RUNNING: {test_file}")
    print("=" * 70 + "\n")

    result = subprocess.run(
        [sys.executable, "-m", "pytest", f"tests/{test_file}", "-v"],
        cwd=os.path.dirname(os.path.abspath(__file__)),
    )

    return result.returncode


if __name__ == "__main__":
    if len(sys.argv) > 1:
        if sys.argv[1] == "coverage":
            exit_code = run_coverage()
        elif sys.argv[1] == "auth":
            exit_code = run_specific_test("test_auth.py")
        elif sys.argv[1] == "kyc":
            exit_code = run_specific_test("test_kyc.py")
        elif sys.argv[1] == "admin":
            exit_code = run_specific_test("test_admin.py")
        else:
            print(f"Unknown argument: {sys.argv[1]}")
            print("\nUsage:")
            print("  python run_tests.py          - Run all tests")
            print("  python run_tests.py coverage - Run tests with coverage")
            print("  python run_tests.py auth     - Run auth tests only")
            print("  python run_tests.py kyc      - Run KYC tests only")
            print("  python run_tests.py admin    - Run admin tests only")
            exit_code = 1
    else:
        exit_code = run_tests()

    print("\n" + "=" * 70)
    if exit_code == 0:
        print("SUCCESS: ALL TESTS PASSED")
    else:
        print("FAILED: SOME TESTS FAILED")
    print("=" * 70 + "\n")

    sys.exit(exit_code)
