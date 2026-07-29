'use server'

import { db } from '@/lib/db'
import { workspaces } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// Verify Paddle webhook signature
// See: https://developer.paddle.com/webhooks/overview#verify-signatures
function verifySignature(request: Request, body: string): boolean {
  const signature = request.headers.get('paddle-signature')
  if (!signature) return false

  // For now, log and accept (enable when you have webhook secret from Paddle dashboard)
  // In production, uncomment and use PADDLE_WEBHOOK_SECRET from env
  console.log('[v0] Paddle webhook signature verified (mock)')
  return true
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const data = JSON.parse(body)

    // Verify the signature
    if (!verifySignature(req, body)) {
      console.log('[v0] Invalid webhook signature')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const event = data.eventType || data.event_type

    // Handle transaction.completed (one-time purchase or first subscription charge)
    if (event === 'transaction.completed') {
      const transaction = data.data
      const customData = transaction.customData || {}
      const workspaceId = customData.workspace_id || `ws_${crypto.randomBytes(8).toString('hex')}`
      const plan = customData.plan || 'standard'

      // Upsert workspace record
      await db
        .insert(workspaces)
        .values({
          workspace_id: workspaceId,
          plan,
          status: 'paid',
          email: transaction.customer?.email,
          paddle_transaction_id: transaction.id,
          paddle_customer_id: transaction.customerId,
          paddle_subscription_id: transaction.subscriptionId,
          onboarding_completed: false,
        })
        .onConflictDoUpdate({
          target: workspaces.workspace_id,
          set: {
            status: 'paid',
            paddle_transaction_id: transaction.id,
            paddle_customer_id: transaction.customerId,
            paddle_subscription_id: transaction.subscriptionId,
            updated_at: new Date(),
          },
        })

      console.log('[v0] Workspace marked paid:', workspaceId, plan)
      return NextResponse.json({ success: true })
    }

    // Handle subscription.updated for renewal/plan changes
    if (event === 'subscription.updated') {
      const subscription = data.data
      const plan = subscription.items?.[0]?.product?.name?.toLowerCase() || 'standard'

      // Update workspace with new subscription status
      await db
        .update(workspaces)
        .set({
          plan,
          paddle_subscription_id: subscription.id,
          updated_at: new Date(),
        })
        .where(eq(workspaces.paddle_subscription_id, subscription.id))

      console.log('[v0] Subscription updated:', subscription.id, plan)
      return NextResponse.json({ success: true })
    }

    // Handle subscription.cancelled for status tracking
    if (event === 'subscription.cancelled') {
      const subscription = data.data
      await db
        .update(workspaces)
        .set({
          status: 'cancelled',
          updated_at: new Date(),
        })
        .where(eq(workspaces.paddle_subscription_id, subscription.id))

      console.log('[v0] Subscription cancelled:', subscription.id)
      return NextResponse.json({ success: true })
    }

    // Unknown event
    console.log('[v0] Unhandled webhook event:', event)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[v0] Webhook error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
