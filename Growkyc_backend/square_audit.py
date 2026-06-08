"""
Temporary Square credential audit script.
Run: python square_audit.py
Delete after use.
"""
import os
from dotenv import load_dotenv

load_dotenv()

token  = os.getenv("SQUARE_ACCESS_TOKEN", "")
app_id = os.getenv("SQUARE_APPLICATION_ID", "")
env    = os.getenv("SQUARE_ENV", "sandbox")
loc_id = os.getenv("SQUARE_LOCATION_ID", "")
secret = os.getenv("SQUARE_APPLICATION_SECRET", "")

def masked(val, show=8):
    if len(val) <= show:
        return "[TOO SHORT: " + val + "]"
    return val[:show] + "..." + val[-4:]

print("=== SQUARE CREDENTIAL AUDIT ===")
print(f"SQUARE_ENV                   : [{env}]")
print(f"SQUARE_APPLICATION_ID        : [{masked(app_id)}]  len={len(app_id)}")
print(f"SQUARE_ACCESS_TOKEN          : [{masked(token)}]  len={len(token)}")
print(f"SQUARE_LOCATION_ID           : [{loc_id}]  len={len(loc_id)}")
print(f"SQUARE_APPLICATION_SECRET    : [{masked(secret)}]  len={len(secret)}")
print()

issues = []

# --- Placeholder detection ---
if token == "REPLACE_WITH_YOUR_SANDBOX_ACCESS_TOKEN":
    issues.append("CRITICAL: SQUARE_ACCESS_TOKEN is still the placeholder value.")
if "REPLACE_WITH" in app_id:
    issues.append("CRITICAL: SQUARE_APPLICATION_ID is still the placeholder value.")
if "REPLACE_WITH" in secret:
    issues.append("WARNING: SQUARE_APPLICATION_SECRET is still the placeholder value.")

# --- Whitespace / hidden char detection ---
if token != token.strip():
    issues.append("CRITICAL: SQUARE_ACCESS_TOKEN has leading/trailing whitespace.")
if app_id != app_id.strip():
    issues.append("CRITICAL: SQUARE_APPLICATION_ID has leading/trailing whitespace.")
if "\r" in token or "\n" in token:
    issues.append("CRITICAL: SQUARE_ACCESS_TOKEN contains embedded newline characters.")
if "\r" in app_id or "\n" in app_id:
    issues.append("CRITICAL: SQUARE_APPLICATION_ID contains embedded newline characters.")

# --- Empty value detection ---
if not token:
    issues.append("CRITICAL: SQUARE_ACCESS_TOKEN is empty.")
if not app_id:
    issues.append("CRITICAL: SQUARE_APPLICATION_ID is empty.")

# --- Token format detection ---
if token and not token.startswith("REPLACE"):
    if env == "sandbox" and not token.startswith("EAAAl") and not token.startswith("EAAA"):
        issues.append(
            f"WARNING: SQUARE_ENV=sandbox but token prefix [{token[:8]}] does not look like a "
            "sandbox Personal Access Token (expected to start with 'EAAAl')."
        )
    if env == "production" and token.startswith("sandbox"):
        issues.append("CRITICAL: SQUARE_ENV=production but token appears to be a sandbox token.")
    if env == "sandbox" and token.startswith("sq0atp-"):
        issues.append(
            "INFO: Token starts with 'sq0atp-' — this is an OAuth token. "
            "Make sure it was obtained against the SANDBOX environment."
        )

# --- Location ID ---
if not loc_id:
    issues.append(
        "INFO: SQUARE_LOCATION_ID is empty. "
        "The service will call locations.list() on every request. "
        "If the token lacks MERCHANT_PROFILE_READ scope, this call will fail with 401."
    )

# --- Environment mismatch ---
if env not in ("sandbox", "production"):
    issues.append(f"WARNING: SQUARE_ENV=[{env}] is not 'sandbox' or 'production'. Will default to sandbox.")

print("=== ISSUES FOUND ===")
if issues:
    for i, issue in enumerate(issues, 1):
        print(f"  [{i}] {issue}")
else:
    print("  No obvious configuration issues detected in .env values.")

print()
print("=== ENVIRONMENT VARIABLE SOURCE CHECK ===")
# Detect if the variable is also set at OS level (which would override .env)
os_token = os.environ.get("SQUARE_ACCESS_TOKEN")
print(f"  SQUARE_ACCESS_TOKEN in OS env: {'YES — value will override .env' if os_token else 'NOT SET (only from .env)'}")
os_env = os.environ.get("SQUARE_ENV")
print(f"  SQUARE_ENV in OS env: {os_env if os_env else 'NOT SET (only from .env)'}")
