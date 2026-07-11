# NexGen AI Solutions — Provisioning API

A FastAPI web service deployed on **Render** that automates client onboarding and offboarding for NexGen AI Solutions Enterprise plan clients.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check — used by Render uptime monitor |
| `POST` | `/provision` | Onboard a new Enterprise client |
| `POST` | `/deprovision` | Offboard a cancelled Enterprise client |
| `POST` | `/dry-run` | Simulate deprovisioning without destructive actions |
| `GET` | `/status/{operation_id}` | Poll the status of an operation |

## Authentication

All `POST` endpoints require the `x-api-key` header:

```
x-api-key: YOUR_API_GATEWAY_KEY
```

## Quick Deploy to Render

1. Push this repository to GitHub
2. Go to [render.com](https://render.com) → **New > Web Service**
3. Connect your GitHub repository
4. Render auto-detects the `Dockerfile` and `render.yaml`
5. Set environment variables (see `.env.example`)
6. Click **Deploy**

## Environment Variables

See `.env.example` for all required and optional variables.

## Test Payloads

### Provision
```json
{
  "client_id": "acura-roofing-inc",
  "client_name": "Patrick Moran",
  "client_email": "patrickmoran@acuraroofing.com",
  "plan": "enterprise",
  "business_name": "Acura Roofing Inc.",
  "website_url": "https://acuraroofing.com"
}
```

### Deprovision
```json
{
  "client_id": "acura-roofing-inc",
  "client_name": "Patrick Moran",
  "client_email": "patrickmoran@acuraroofing.com",
  "confirm": true,
  "cancellation_reason": "subscription_cancelled"
}
```
