import { pgTable, uuid, text, boolean, timestamp } from "drizzle-orm/pg-core"

export const workspaces = pgTable("workspaces", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: text("workspace_id").notNull().unique(),
  plan: text("plan").notNull(),
  status: text("status").notNull().default("pending_payment"),
  email: text("email"),
  paddleTransactionId: text("paddle_transaction_id"),
  paddleCustomerId: text("paddle_customer_id"),
  paddleSubscriptionId: text("paddle_subscription_id"),
  onboardingCompleted: boolean("onboarding_completed").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})

export const onboardingSubmissions = pgTable("onboarding_submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: text("workspace_id").notNull(),
  businessName: text("business_name").notNull(),
  industry: text("industry").notNull(),
  websiteUrl: text("website_url"),
  targetAudience: text("target_audience"),
  knowledgeBase: text("knowledge_base"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export const chatbotInstances = pgTable("chatbot_instances", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: text("workspace_id").notNull(),
  status: text("status").notNull().default("pending"),
  externalBotId: text("external_bot_id"),
  embedCode: text("embed_code"),
  provider: text("provider").default("openai_assistant"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})

export const integrationBindings = pgTable("integration_bindings", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: text("workspace_id").notNull(),
  provider: text("provider").notNull(),
  label: text("label"),
  status: text("status").notNull().default("connected"),
  credentialsSet: boolean("credentials_set").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})

export const enterpriseResources = pgTable("enterprise_resources", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: text("workspace_id").notNull(),
  dedicatedDbStatus: text("dedicated_db_status").notNull().default("provisioning"),
  dedicatedSchemaName: text("dedicated_schema_name"),
  strategyCallBooked: boolean("strategy_call_booked").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})
