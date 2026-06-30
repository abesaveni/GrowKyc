"""
services/email_service.py
=========================
Lightweight SMTP email sender.

Configured via environment variables:
    SMTP_HOST          e.g. smtp.gmail.com / smtp.sendgrid.net
    SMTP_PORT          default 587
    SMTP_USERNAME
    SMTP_PASSWORD
    SMTP_FROM          default "GrowKYC <no-reply@growkyc.com>"
    SMTP_USE_TLS       default "true"
    APP_PUBLIC_URL     base URL used in email links (default http://localhost:5173)

If SMTP is not configured, send_email() is a safe no-op that logs the message
(so the surrounding flow still works in dev) and returns False.
"""

import logging
import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

logger = logging.getLogger(__name__)


def is_configured() -> bool:
    return bool(os.getenv("SMTP_HOST") and os.getenv("SMTP_USERNAME"))


def send_email(to_email: str, subject: str, html_body: str, text_body: str | None = None) -> bool:
    """Send an email. Returns True if actually sent, False if not configured/failed.

    Never raises — callers treat email as best-effort.
    """
    sender = os.getenv("SMTP_FROM", "GrowKYC <no-reply@growkyc.com>")

    if not is_configured():
        logger.info(
            "EMAIL (SMTP not configured) -> to=%s subject=%r (not sent; configure SMTP_* to enable)",
            to_email, subject,
        )
        return False

    host = os.getenv("SMTP_HOST")
    port = int(os.getenv("SMTP_PORT", "587"))
    username = os.getenv("SMTP_USERNAME")
    password = os.getenv("SMTP_PASSWORD", "")
    use_tls = os.getenv("SMTP_USE_TLS", "true").lower() == "true"

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = sender
    msg["To"] = to_email
    msg.attach(MIMEText(text_body or "Please view this email in an HTML-capable client.", "plain"))
    msg.attach(MIMEText(html_body, "html"))

    try:
        with smtplib.SMTP(host, port, timeout=20) as server:
            if use_tls:
                server.starttls()
            if username:
                server.login(username, password)
            server.sendmail(sender, [to_email], msg.as_string())
        logger.info("EMAIL sent -> to=%s subject=%r", to_email, subject)
        return True
    except Exception as e:  # noqa: BLE001
        logger.error("EMAIL send failed -> to=%s: %s", to_email, e)
        return False


def kyc_invite_email(client_name: str, verification_url: str) -> tuple[str, str, str]:
    """Build (subject, html, text) for the KYC welcome / invitation email."""
    subject = "Complete your identity verification — GrowKYC"
    name = client_name or "there"
    html = f"""\
<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#1f2937">
  <div style="background:#1e293b;color:#fff;padding:24px;border-radius:8px 8px 0 0">
    <h1 style="margin:0;font-size:20px">Welcome to GrowKYC</h1>
  </div>
  <div style="border:1px solid #e5e7eb;border-top:none;padding:24px;border-radius:0 0 8px 8px">
    <p>Hi {name},</p>
    <p>To complete your onboarding, we need to verify your identity. This is quick and secure —
       you'll confirm a few details and upload your identity documents.</p>
    <p style="text-align:center;margin:28px 0">
      <a href="{verification_url}"
         style="background:#2563eb;color:#fff;text-decoration:none;padding:12px 28px;border-radius:6px;font-weight:bold;display:inline-block">
        Start verification
      </a>
    </p>
    <p style="font-size:13px;color:#6b7280">Or copy this link into your browser:<br>
      <a href="{verification_url}" style="color:#2563eb;word-break:break-all">{verification_url}</a></p>
    <p style="font-size:13px;color:#6b7280">This link is personal to you — please don't share it.</p>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0">
    <p style="font-size:12px;color:#9ca3af">Sent by GrowKYC on behalf of your service provider. If you weren't expecting this, you can ignore it.</p>
  </div>
</div>"""
    text = (
        f"Hi {name},\n\n"
        "To complete your onboarding, please verify your identity and upload your documents:\n"
        f"{verification_url}\n\n"
        "This link is personal to you — please don't share it.\n\nGrowKYC"
    )
    return subject, html, text
