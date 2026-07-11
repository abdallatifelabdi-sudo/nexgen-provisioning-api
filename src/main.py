"""
NexGen AI Solutions — Render Deployment API
===========================================
FastAPI web service wrapping the provision and deprovision logic.
Replaces AWS Lambda + API Gateway with a single Render web service.

Endpoints:
  POST /provision      — Onboard a new Enterprise client
  POST /deprovision    — Offboard a cancelled Enterprise client
  POST /dry-run        — Simulate deprovisioning without destructive actions
  GET  /status/{id}    — Poll the status of an in-progress operation
  GET  /health         — Health check for Render uptime monitor

Author:  NexGen AI Solutions — Lead Technical Engineer
Version: 1.0.0
Runtime: Python 3.11 (Render Docker)
"""

import json
import logging
import os
import time
from datetime import datetime, timezone
from typing import Optional

import requests
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse

# ── Logging ───────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s"
)
logger = logging.getLogger("nexgen-api")

# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="NexGen AI Solutions — Provisioning API",
    description="Automated client onboarding and offboarding for NexGen AI Solutions Enterprise plan.",
    version="1.0.0"
)

# ── Environment Variables ─────────────────────────────────────────────────────
API_GATEWAY_KEY            = os.environ.get("API_GATEWAY_KEY", "")
OPENAI_API_KEY             = os.environ.get("OPENAI_API_KEY", "")
GHL_API_KEY                = os.environ.get("GHL_API_KEY", "")
GHL_ENTERPRISE_SNAPSHOT_ID = os.environ.get("GHL_ENTERPRISE_SNAPSHOT_ID", "")
SLACK_WEBHOOK_URL          = os.environ.get("SLACK_WEBHOOK_URL", "")
CLICKUP_API_KEY            = os.environ.get("CLICKUP_API_KEY", "")
CLICKUP_LIST_ID            = os.environ.get("CLICKUP_LIST_ID", "")
ENGINEER_EMAIL             = os.environ.get("ENGINEER_EMAIL", "engineering@nexgenaisolutions.com")
MAKE_WEBHOOK_URL           = os.environ.get("MAKE_WEBHOOK_URL", "")

# ── In-memory operation status store ─────────────────────────────────────────
operation_store: dict = {}


# ─────────────────────────────────────────────────────────────────────────────
# AUTH HELPER
# ─────────────────────────────────────────────────────────────────────────────

def _check_auth(request: Request):
    if not API_GATEWAY_KEY:
        return  # open mode if key not set
    api_key = request.headers.get("x-api-key")
    if not api_key or api_key != API_GATEWAY_KEY:
        logger.warning("Unauthorized request — invalid API key")
        raise HTTPException(status_code=401, detail="Invalid or missing x-api-key header")


# ─────────────────────────────────────────────────────────────────────────────
# HELPER FUNCTIONS
# ─────────────────────────────────────────────────────────────────────────────

def _post_slack(message: str):
    if not SLACK_WEBHOOK_URL:
        logger.info("Slack not configured — skipping")
        return
    try:
        resp = requests.post(
            SLACK_WEBHOOK_URL,
            json={"text": message, "username": "NexGen AI Bot", "icon_emoji": ":robot_face:"},
            timeout=10
        )
        logger.info(f"Slack: HTTP {resp.status_code}")
    except Exception as e:
        logger.error(f"Slack error: {e}")


def _create_clickup_task(title: str, description: str, due_days: int = 17) -> Optional[str]:
    if not CLICKUP_API_KEY or not CLICKUP_LIST_ID:
        return None
    try:
        due_ts = int((time.time() + due_days * 86400) * 1000)
        resp = requests.post(
            f"https://api.clickup.com/api/v2/list/{CLICKUP_LIST_ID}/task",
            json={"name": title, "description": description, "priority": 1, "due_date": due_ts, "due_date_time": True},
            headers={"Authorization": CLICKUP_API_KEY, "Content-Type": "application/json"},
            timeout=15
        )
        if resp.status_code in (200, 201):
            task_id = resp.json().get("id")
            logger.info(f"ClickUp task created: {task_id}")
            return task_id
        logger.error(f"ClickUp failed: {resp.status_code} {resp.text}")
        return None
    except Exception as e:
        logger.error(f"ClickUp error: {e}")
        return None


def _create_ghl_subaccount(client_name: str, client_email: str, business_name: str, website_url: str) -> Optional[str]:
    if not GHL_API_KEY:
        return None
    try:
        resp = requests.post(
            "https://services.leadconnectorhq.com/locations/",
            json={
                "name": f"[ENTERPRISE] {business_name}",
                "email": client_email,
                "website": website_url,
                "timezone": "America/Chicago",
                "tags": ["nexgen-client", "enterprise-plan"]
            },
            headers={"Authorization": f"Bearer {GHL_API_KEY}", "Content-Type": "application/json", "Version": "2021-07-28"},
            timeout=20
        )
        if resp.status_code in (200, 201):
            data = resp.json()
            location_id = data.get("id") or data.get("location", {}).get("id")
            logger.info(f"GHL sub-account created: {location_id}")
            return location_id
        logger.error(f"GHL failed: {resp.status_code} {resp.text}")
        return None
    except Exception as e:
        logger.error(f"GHL error: {e}")
        return None


def _create_openai_assistant(business_name: str, website_url: str) -> Optional[str]:
    if not OPENAI_API_KEY:
        return None
    try:
        resp = requests.post(
            "https://api.openai.com/v1/assistants",
            json={
                "name": f"{business_name} AI Assistant",
                "instructions": (
                    f"You are a professional AI assistant for {business_name} ({website_url}). "
                    "You help homeowners with roofing questions, booking inspections, and 24/7 support. "
                    "Always be helpful and guide prospects toward booking a free inspection."
                ),
                "model": "gpt-4o",
                "tools": [{"type": "file_search"}]
            },
            headers={
                "Authorization": f"Bearer {OPENAI_API_KEY}",
                "Content-Type": "application/json",
                "OpenAI-Beta": "assistants=v2"
            },
            timeout=20
        )
        if resp.status_code in (200, 201):
            assistant_id = resp.json().get("id")
            logger.info(f"OpenAI Assistant created: {assistant_id}")
            return assistant_id
        logger.error(f"OpenAI failed: {resp.status_code} {resp.text}")
        return None
    except Exception as e:
        logger.error(f"OpenAI error: {e}")
        return None


def _trigger_make_webhook(event_payload: dict):
    if not MAKE_WEBHOOK_URL:
        return
    try:
        resp = requests.post(MAKE_WEBHOOK_URL, json=event_payload, timeout=15)
        logger.info(f"Make.com webhook triggered: HTTP {resp.status_code}")
    except Exception as e:
        logger.error(f"Make.com error: {e}")


# ─────────────────────────────────────────────────────────────────────────────
# ROUTES
# ─────────────────────────────────────────────────────────────────────────────

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "service": "NexGen AI Solutions — Provisioning API",
        "version": "1.0.0",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }


@app.post("/provision")
async def provision(request: Request):
    """Onboard a new Enterprise client. Triggered by Make.com on Paddle subscription.created."""
    _check_auth(request)

    try:
        payload = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON body")

    client_id     = payload.get("client_id", "")
    client_name   = payload.get("client_name", "")
    client_email  = payload.get("client_email", "")
    business_name = payload.get("business_name", "")
    website_url   = payload.get("website_url", "")

    if not client_id or not client_email:
        raise HTTPException(status_code=400, detail="client_id and client_email are required")

    logger.info(f"🚀 Provisioning: {client_id} | {business_name}")
    operation_id = f"prov-{client_id}-{int(time.time())}"
    operation_store[operation_id] = {
        "status": "in_progress", "steps": [],
        "started_at": datetime.now(timezone.utc).isoformat()
    }

    # Step 1 — GHL Sub-Account
    location_id = _create_ghl_subaccount(client_name, client_email, business_name, website_url)
    operation_store[operation_id]["steps"].append({"step": "ghl_subaccount", "status": "success" if location_id else "skipped", "value": location_id})

    # Step 2 — OpenAI Assistant
    assistant_id = _create_openai_assistant(business_name, website_url)
    operation_store[operation_id]["steps"].append({"step": "openai_assistant", "status": "success" if assistant_id else "skipped", "value": assistant_id})

    # Step 3 — ClickUp Task
    clickup_task_id = _create_clickup_task(
        title=f"[ENTERPRISE] {business_name} — Onboarding",
        description=(
            f"**Client:** {client_name}\n**Email:** {client_email}\n**Website:** {website_url}\n"
            f"**GHL Location ID:** {location_id or 'N/A'}\n**OpenAI Assistant ID:** {assistant_id or 'N/A'}\n\n"
            "**Checklist:**\n- [ ] Apply Enterprise GHL snapshot\n- [ ] Upload FAQ to OpenAI Vector Store\n"
            "- [ ] Configure WhatsApp Business API\n- [ ] Test AI chatbot\n- [ ] Deliver embed code to client"
        )
    )
    operation_store[operation_id]["steps"].append({"step": "clickup_task", "status": "success" if clickup_task_id else "skipped", "value": clickup_task_id})

    # Step 4 — Slack Alert
    _post_slack(
        f"🚀 *New Enterprise Client Onboarded!*\n*Business:* {business_name}\n"
        f"*Contact:* {client_name} ({client_email})\n*GHL:* {location_id or 'N/A'}\n"
        f"*OpenAI:* {assistant_id or 'N/A'}\n*ClickUp:* {clickup_task_id or 'N/A'}"
    )
    operation_store[operation_id]["steps"].append({"step": "slack_alert", "status": "sent"})

    # Step 5 — Make.com Welcome Email Trigger
    _trigger_make_webhook({
        "event": "client_onboarded",
        "client_email": client_email, "client_name": client_name,
        "business_name": business_name, "ghl_location_id": location_id,
        "openai_assistant_id": assistant_id, "timestamp": datetime.now(timezone.utc).isoformat()
    })
    operation_store[operation_id]["steps"].append({"step": "welcome_email_trigger", "status": "sent"})

    operation_store[operation_id]["status"] = "completed"
    operation_store[operation_id]["completed_at"] = datetime.now(timezone.utc).isoformat()

    logger.info(f"✅ Provisioning complete: {operation_id}")
    return JSONResponse(status_code=200, content={
        "status": "success", "operation_id": operation_id,
        "client_id": client_id, "business_name": business_name,
        "ghl_location_id": location_id, "openai_assistant_id": assistant_id,
        "clickup_task_id": clickup_task_id,
        "steps_completed": len(operation_store[operation_id]["steps"]),
        "message": f"Enterprise provisioning complete for {business_name}"
    })


@app.post("/deprovision")
async def deprovision(request: Request):
    """Offboard a cancelled Enterprise client. Triggered by Make.com on Paddle subscription.cancelled."""
    _check_auth(request)

    try:
        payload = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON body")

    client_id    = payload.get("client_id", "")
    client_name  = payload.get("client_name", "")
    client_email = payload.get("client_email", "")
    confirm      = payload.get("confirm", False)

    if not client_id:
        raise HTTPException(status_code=400, detail="client_id is required")
    if not confirm:
        raise HTTPException(status_code=400, detail="confirm=true is required to execute deprovisioning")

    logger.info(f"🔴 Deprovisioning: {client_id}")
    operation_id = f"deprov-{client_id}-{int(time.time())}"
    operation_store[operation_id] = {
        "status": "in_progress", "steps": [],
        "started_at": datetime.now(timezone.utc).isoformat()
    }

    # Step 1 — Slack Alert
    _post_slack(
        f"🔴 *Enterprise Client Offboarding*\n*Client ID:* {client_id}\n"
        f"*Name:* {client_name} ({client_email})\n"
        f"*Reason:* {payload.get('cancellation_reason', 'N/A')}"
    )
    operation_store[operation_id]["steps"].append({"step": "slack_alert", "status": "sent"})

    # Step 2 — ClickUp Update
    clickup_task_id = payload.get("clickup_task_id")
    if clickup_task_id and CLICKUP_API_KEY:
        try:
            resp = requests.put(
                f"https://api.clickup.com/api/v2/task/{clickup_task_id}",
                json={"status": "cancelled"},
                headers={"Authorization": CLICKUP_API_KEY, "Content-Type": "application/json"},
                timeout=15
            )
            logger.info(f"ClickUp task updated: HTTP {resp.status_code}")
        except Exception as e:
            logger.error(f"ClickUp update error: {e}")
    operation_store[operation_id]["steps"].append({"step": "clickup_update", "status": "completed"})

    # Step 3 — Audit Log
    audit_record = {
        "event": "client_deprovisioned", "client_id": client_id,
        "client_name": client_name, "client_email": client_email,
        "cancellation_reason": payload.get("cancellation_reason"),
        "operation_id": operation_id,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    logger.info(f"AUDIT: {json.dumps(audit_record)}")
    operation_store[operation_id]["steps"].append({"step": "audit_log", "status": "written"})

    # Step 4 — Make.com Offboarding Trigger
    _trigger_make_webhook({**audit_record, "event": "client_offboarded"})
    operation_store[operation_id]["steps"].append({"step": "make_offboarding_trigger", "status": "sent"})

    operation_store[operation_id]["status"] = "completed"
    operation_store[operation_id]["completed_at"] = datetime.now(timezone.utc).isoformat()

    logger.info(f"✅ Deprovisioning complete: {operation_id}")
    return JSONResponse(status_code=200, content={
        "status": "success", "operation_id": operation_id,
        "client_id": client_id,
        "steps_completed": len(operation_store[operation_id]["steps"]),
        "message": f"Deprovisioning complete for client {client_id}"
    })


@app.post("/dry-run")
async def dry_run(request: Request):
    """Simulate deprovisioning without executing any destructive actions."""
    _check_auth(request)
    try:
        payload = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON body")

    client_id = payload.get("client_id", "unknown")
    logger.info(f"🟡 Dry-run for client: {client_id}")
    return JSONResponse(status_code=200, content={
        "status": "dry_run_success", "client_id": client_id,
        "message": "Dry run complete — no resources were modified",
        "would_execute": [
            "Post Slack alert to #enterprise-offboarding",
            "Update ClickUp task status to cancelled",
            "Write audit log record",
            "Trigger Make.com offboarding webhook"
        ]
    })


@app.get("/status/{operation_id}")
async def get_status(operation_id: str, request: Request):
    """Poll the status of an in-progress or completed operation."""
    _check_auth(request)
    if operation_id not in operation_store:
        raise HTTPException(status_code=404, detail=f"Operation {operation_id} not found")
    return JSONResponse(status_code=200, content=operation_store[operation_id])
