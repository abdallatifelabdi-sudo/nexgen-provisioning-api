'use server'

import { db } from '@/lib/db'
import { visitors } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

interface VisitorTrackingPayload {
  email: string
  fullName?: string
  companyName?: string
  metrics: {
    databaseSize: number
    ticketValue: number
    newLeads: number
    lostPast: number
    lostMonthly: number
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload: VisitorTrackingPayload = await request.json()

    if (!payload.email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Get client IP
    const ip =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown'
    const userAgent = request.headers.get('user-agent') || undefined

    // Check if visitor already exists
    const existingVisitor = await db
      .select()
      .from(visitors)
      .where(eq(visitors.email, payload.email))
      .limit(1)

    if (existingVisitor.length > 0) {
      // Update existing visitor
      await db
        .update(visitors)
        .set({
          company_name: payload.companyName || existingVisitor[0].company_name,
          database_size: payload.metrics.databaseSize,
          ticket_value: payload.metrics.ticketValue,
          new_leads: payload.metrics.newLeads,
          lost_past_revenue: payload.metrics.lostPast,
          lost_monthly_revenue: payload.metrics.lostMonthly,
          updated_at: new Date(),
        })
        .where(eq(visitors.email, payload.email))
    } else {
      // Create new visitor
      await db.insert(visitors).values({
        email: payload.email,
        company_name: payload.companyName,
        database_size: payload.metrics.databaseSize,
        ticket_value: payload.metrics.ticketValue,
        new_leads: payload.metrics.newLeads,
        lost_past_revenue: payload.metrics.lostPast,
        lost_monthly_revenue: payload.metrics.lostMonthly,
        visitor_ip: ip,
        user_agent: userAgent,
      })
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Visitor tracked successfully',
        email: payload.email,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[v0] Visitor tracking error:', error)
    return NextResponse.json(
      {
        error: 'Failed to track visitor',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
