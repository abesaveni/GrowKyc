"""
smoke_api.py — end-to-end smoke test for the live API.
======================================================

Exercises the core compliance workflow against a running instance and prints a
PASS/FAIL line per check. Exits non-zero if anything fails (CI-friendly).

Standard library only, so it runs anywhere:

    python smoke_api.py                       # defaults to http://localhost:18000
    BASE=http://host:port python smoke_api.py

Requires the demo accounts (run setup.py first).
"""

import json
import os
import sys
import urllib.error
import urllib.request

BASE = os.getenv("BASE", "http://localhost:18000")
PASSWORD = os.getenv("DEMO_PASSWORD", "GrowKyc@2026")

failures = 0


def call(method, path, token=None, body=None):
    url = f"{BASE}{path}"
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method=method)
    req.add_header("Content-Type", "application/json")
    if token:
        req.add_header("Authorization", f"Bearer {token}")
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return resp.status, json.loads(resp.read() or "null")
    except urllib.error.HTTPError as e:
        return e.code, None
    except Exception as e:  # noqa: BLE001
        return 0, str(e)


def check(name, ok, detail=""):
    global failures
    mark = "PASS" if ok else "FAIL"
    if not ok:
        failures += 1
    print(f"[{mark}] {name}{(' — ' + str(detail)) if detail else ''}")


def login(email):
    status, data = call("POST", "/api/v1/auth/login", body={"email": email, "password": PASSWORD})
    token = (data or {}).get("access_token") if isinstance(data, dict) else None
    check(f"login {email}", status == 200 and bool(token), status)
    return token


def main():
    print(f"Smoke testing {BASE}\n")
    officer = login("officer@growkyc.com")
    login("admin@growkyc.com")
    if not officer:
        print("\nCannot continue without an officer token.")
        sys.exit(1)

    for path in ["/api/v1/dashboard/", "/api/v1/clients?limit=1", "/api/v1/alerts/stats",
                 "/api/v1/edd", "/api/v1/sars", "/api/v1/cases"]:
        status, _ = call("GET", path, officer)
        check(f"GET {path}", status == 200, status)

    _, clients = call("GET", "/api/v1/clients?limit=1", officer)
    items = (clients or {}).get("items", []) if isinstance(clients, dict) else []
    if items:
        cid = items[0]["id"]
    else:
        _, c = call("POST", "/api/v1/clients/individual", officer, {"first_name": "Smoke", "last_name": "Test"})
        cid = (c or {}).get("id")
    check("have a client id", bool(cid), cid)

    if cid:
        status, alert = call("POST", "/api/v1/alerts", officer,
                             {"client_id": cid, "alert_type": "high_risk", "severity": "critical", "title": "Smoke alert"})
        check("create alert", status == 201, status)
        aid = (alert or {}).get("id")
        if aid:
            status, esc = call("POST", f"/api/v1/alerts/{aid}/escalate", officer)
            check("escalate alert -> case (linked)", status == 200 and bool((esc or {}).get("case_id")), status)

        status, _ = call("POST", "/api/v1/sars", officer, {"client_id": cid, "reason_for_suspicion": "smoke"})
        check("raise SAR", status == 201, status)

        status, _ = call("POST", "/api/v1/edd/initiate", officer, {"client_id": cid, "trigger_reason": "manual"})
        check("initiate EDD", status in (201, 200), status)

    status, _ = call("GET", "/api/v1/notifications?limit=5", officer)
    check("notifications endpoint", status == 200, status)

    print(f"\n{'ALL PASSED' if failures == 0 else str(failures) + ' CHECK(S) FAILED'}")
    sys.exit(1 if failures else 0)


if __name__ == "__main__":
    main()
