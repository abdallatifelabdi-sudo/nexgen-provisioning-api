# Webhook & Outreach Integration Setup Guide

## Features Implemented

### 1. Webhook Notification Integration
- **Endpoint:** `/api/webhooks/strategy-call-booked`
- **Trigger:** When a user clicks "Book Automation Strategy Call" after calculating lost revenue
- **Function:** Captures strategy call bookings with calculated metrics and sends email notifications to `abdallatifelabdi@gmail.com`
- **Database:** Stores events in `webhook_events` table and updates `visitors` table
- **Integration:** Hooks into Make.com via `MAKE_STRATEGY_CALL_WEBHOOK` env var

### 2. Automated Weekly Outreach Engine
- **Endpoint:** `/api/cron/weekly-outreach`
- **Trigger:** Call via Vercel Cron (GET request with Bearer token)
- **Function:** Identifies unconverted visitors who need follow-up, triggers cold email sequences via Make.com
- **Logic:** 
  - Max 5 outreach attempts per visitor
  - 7-day interval between attempts
  - Stops after conversion or max attempts reached
- **Schedule:** Deploy with Vercel's Cron feature to run weekly

### 3. Pricing Section UI Refinement
- **Grid Layout:** 3-column responsive design (grid-cols-1 md:grid-cols-3)
- **Hover Effects:** 
  - Card scale: 105% on hover
  - Shadow lift: Dynamic shadow intensification
  - Button gradients: Indigo→Purple with scale transformation
- **Animations:** Pulsing "Most Popular" badge, smooth transitions
- **High-Conversion Design:** Distinct visual hierarchy with Pro plan highlighted

## Environment Variables Required

Add these to your Vercel project settings:

```
DATABASE_URL=              # Already configured via Neon integration
CRON_SECRET=               # Random bearer token for weekly-outreach security (e.g., openssl rand -base64 32)
MAKE_STRATEGY_CALL_WEBHOOK=  # Make.com webhook URL for strategy call notifications
MAKE_WEEKLY_OUTREACH_WEBHOOK= # Make.com webhook URL for cold email sequences
```

## Database Schema

Three new tables created:

### `visitors` table
Tracks all app visitors and cold outreach state:
- `email` (unique, primary key for tracking)
- `company_name`, `website`
- `database_size`, `ticket_value`, `new_leads` (calculator inputs)
- `lost_past_revenue`, `lost_monthly_revenue` (calculated metrics)
- `selected_tier` (Standard/Pro/Enterprise)
- `outreach_count`, `last_outreach_date` (for weekly sequence)
- `converted_workspace_id`, `conversion_date` (conversion tracking)
- `visitor_ip`, `user_agent` (metadata)

### `webhook_events` table
Audit log of all webhook triggers:
- `event_type` (e.g., "strategy_call_booked")
- `visitor_email`, `selected_tier`
- `metrics` (JSON: databaseSize, ticketValue, newLeads, etc.)
- `payload` (full webhook payload)

## Integration Flow

### Strategy Call Booking
1. User enters metrics in calculator
2. Clicks "Book Automation Strategy Call" button
3. Opens modal to collect name + company
4. Submits → Triggers `/api/webhooks/strategy-call-booked`
5. Webhook stores event in DB and calls Make.com
6. Email notification sent to `abdallatifelabdi@gmail.com`
7. Visitor record created/updated with selected tier

### Weekly Outreach Sequence
1. Cron job runs weekly (configure in Vercel)
2. Queries `visitors` table for unconverted prospects needing follow-up
3. For each prospect, calls Make.com webhook with:
   - Email address
   - Attempt number (1-5)
   - Calculated revenue metrics
   - Calculator URL link
   - Dynamic subject line based on attempt
4. Updates `last_outreach_date` and `outreach_count`
5. Stops after 5 attempts or conversion

## Vercel Cron Setup

Add to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/weekly-outreach",
      "schedule": "0 9 * * 1"
    }
  ]
}
```

This runs every Monday at 9 AM UTC. Include `Authorization: Bearer {CRON_SECRET}` header.

## Make.com Integration

### Strategy Call Webhook Payload
```json
{
  "recipient": "abdallatifelabdi@gmail.com",
  "subject": "Strategy Call Booking: ENTERPRISE - user@example.com",
  "body": "User details and calculated metrics...",
  "visitor_data": { ... }
}
```

### Weekly Outreach Webhook Payload
```json
{
  "recipient": "user@example.com",
  "visitor_name": "Company Inc",
  "attempt_number": 1,
  "max_attempts": 5,
  "metrics": {
    "lost_past_revenue": 45000,
    "lost_monthly_revenue": 3750,
    "database_size": 2500
  },
  "calculator_url": "https://lost-revenue-calculator-sandy.vercel.app/",
  "subject_line": "Your Hidden Revenue Opportunity – $50K+ Uncovered"
}
```

## API Endpoints Summary

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/track-visitor` | POST | Track calculator submission |
| `/api/webhooks/strategy-call-booked` | POST | Capture strategy call bookings |
| `/api/cron/weekly-outreach` | GET | Weekly outreach cron (Vercel scheduled) |
| `/api/webhooks/paddle` | POST | Paddle payment webhooks (existing) |

## Testing

### Local Testing
```bash
# Test visitor tracking
curl -X POST http://localhost:3000/api/track-visitor \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "companyName": "Test Inc",
    "metrics": {
      "databaseSize": 1000,
      "ticketValue": 1500,
      "newLeads": 50,
      "lostPast": 45000,
      "lostMonthly": 3750
    }
  }'

# Test strategy call webhook
curl -X POST http://localhost:3000/api/webhooks/strategy-call-booked \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "fullName": "John Doe",
    "companyName": "Test Inc",
    "selectedTier": "pro",
    "metrics": { ... }
  }'

# Test weekly outreach cron
curl -X GET http://localhost:3000/api/cron/weekly-outreach \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## Monitoring & Analytics

Track metrics in your dashboard:
- **New visitors:** Query `visitors` table, count by `created_at`
- **Outreach performance:** Monitor `outreach_count` and `conversion_date`
- **Webhook events:** Query `webhook_events` for strategy call trends
- **Conversion rate:** `COUNT(converted_workspace_id) / COUNT(*)` in visitors

## Security Notes

- Cron endpoint requires `CRON_SECRET` bearer token
- Webhook payloads contain sensitive visitor data—ensure Make.com webhooks use HTTPS
- Database queries are parameterized to prevent SQL injection
- Visitor IP logging can be disabled if privacy required (remove `visitor_ip` column)
