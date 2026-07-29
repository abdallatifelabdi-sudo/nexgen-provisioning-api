import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  jsonb,
  boolean,
} from 'drizzle-orm/pg-core'

export const workspaces = pgTable('workspaces', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspace_id: text('workspace_id').notNull().unique(),
  plan: text('plan').notNull(),
  status: text('status').notNull().default('pending_payment'),
  email: text('email'),
  paddle_transaction_id: text('paddle_transaction_id'),
  paddle_customer_id: text('paddle_customer_id'),
  paddle_subscription_id: text('paddle_subscription_id'),
  onboarding_completed: boolean('onboarding_completed').notNull().default(false),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const onboarding_submissions = pgTable('onboarding_submissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspace_id: text('workspace_id').notNull(),
  business_name: text('business_name').notNull(),
  industry: text('industry').notNull(),
  website_url: text('website_url'),
  target_audience: text('target_audience'),
  knowledge_base: text('knowledge_base'),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const chatbot_instances = pgTable('chatbot_instances', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspace_id: text('workspace_id').notNull(),
  status: text('status').notNull().default('pending'),
  external_bot_id: text('external_bot_id'),
  embed_code: text('embed_code'),
  provider: text('provider').default('openai_assistant'),
  error_message: text('error_message'),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const integration_bindings = pgTable('integration_bindings', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspace_id: text('workspace_id').notNull(),
  provider: text('provider').notNull(),
  label: text('label'),
  status: text('status').notNull().default('connected'),
  credentials_set: boolean('credentials_set').notNull().default(false),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const enterprise_resources = pgTable('enterprise_resources', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspace_id: text('workspace_id').notNull(),
  dedicated_db_status: text('dedicated_db_status').notNull().default('provisioning'),
  dedicated_schema_name: text('dedicated_schema_name'),
  strategy_call_booked: boolean('strategy_call_booked').notNull().default(false),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const visitors = pgTable('visitors', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull(),
  company_name: text('company_name'),
  website: text('website'),
  database_size: integer('database_size'),
  ticket_value: integer('ticket_value'),
  new_leads: integer('new_leads'),
  lost_past_revenue: integer('lost_past_revenue'),
  lost_monthly_revenue: integer('lost_monthly_revenue'),
  selected_tier: text('selected_tier'),
  outreach_count: integer('outreach_count').notNull().default(0),
  last_outreach_date: timestamp('last_outreach_date', { withTimezone: true }),
  converted_workspace_id: text('converted_workspace_id'),
  conversion_date: timestamp('conversion_date', { withTimezone: true }),
  visitor_ip: text('visitor_ip'),
  user_agent: text('user_agent'),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const webhook_events = pgTable('webhook_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  event_type: text('event_type').notNull(),
  workspace_id: text('workspace_id'),
  visitor_email: text('visitor_email'),
  selected_tier: text('selected_tier'),
  metrics: jsonb('metrics'),
  payload: jsonb('payload'),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
