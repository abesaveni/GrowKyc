# GrowKYC — operations (Docker)

## First run / clean rebuild
```bash
cd Growkyc_backend
docker compose build kyc_api           # bake current source into the image
docker compose up -d                   # postgres, redis, api, celery
docker exec -i kyc_api python setup.py  # create tables, migrate, seed demo data
```

`setup.py` is **idempotent** — safe to re-run. It:
1. creates any missing tables (`Base.metadata.create_all`)
2. applies additive column migrations (e.g. `sars.case_id`) via `ADD COLUMN IF NOT EXISTS`
3. seeds the default tenant + one demo user per role (`seed_roles.py`)

> Tenant-scoped tables (`individual_profiles`, `case_assignments`, `edd_workflows`,
> `alerts`) are `NOT NULL` on `tenant_id`; users must belong to a tenant, which
> `setup.py` guarantees.

## Demo accounts
All use password **`GrowKyc@2026`** (change before production):

| Role | Email |
|---|---|
| System Admin | admin@growkyc.com |
| Client | client@growkyc.com |
| AML Analyst | analyst@growkyc.com |
| Compliance Officer | officer@growkyc.com |
| Senior Compliance Officer | senior@growkyc.com |
| Head of Compliance | head@growkyc.com |
| Managing Partner | partner@growkyc.com |

## Smoke test
```bash
docker exec -i -e BASE=http://localhost:8000 kyc_api python smoke_api.py
```
Logs in and runs the core workflow (alerts → escalate → case, SAR, EDD,
notifications); exits non-zero on any failure.

## Frontend (dev)
```bash
cd ../Growkyc-main
npm install
npm run dev          # proxies /api -> http://localhost:18000
```

## Email (KYC invitations)
The "Invite to KYC" flow emails the client a welcome message with their Didit
verification link. Configure SMTP in `.env` to enable real sending (otherwise the
link is still generated and visible in **KYC Verifications**, but no email is sent):
```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USERNAME=apikey
SMTP_PASSWORD=...
SMTP_FROM=GrowKYC <no-reply@yourdomain.com>
SMTP_USE_TLS=true
```

## Known follow-up
- **Didit real-time webhook**: verification currently uses polling. To enable
  push updates, set `DIDIT_WEBHOOK_SECRET` (from the Didit dashboard) and expose
  `POST /api/v1/webhooks/didit` over HTTPS. HMAC-SHA256 verification
  (`X-Signature-V2`, ±300s window) is already implemented server-side.
