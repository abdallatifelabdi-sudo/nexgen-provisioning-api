import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, company, email, lostRevenue } = body

    // Validate required fields
    if (!name || !company || !email || lostRevenue === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: name, company, email, lostRevenue' },
        { status: 400 }
      )
    }

    const webhookUrl = process.env.MAKE_STRATEGY_CALL_WEBHOOK
    if (!webhookUrl) {
      return NextResponse.json(
        { error: 'MAKE_STRATEGY_CALL_WEBHOOK is not configured' },
        { status: 500 }
      )
    }

    // Send to Make.com webhook
    const makeResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipientEmail: email,
        leadName: name,
        leadCompany: company,
        estimatedLostRevenue: lostRevenue,
        timestamp: new Date().toISOString(),
        source: 'NexGen AI Solutions Strategy Call Booking',
      }),
    })

    if (!makeResponse.ok) {
      throw new Error(`Make.com webhook failed: ${makeResponse.statusText}`)
    }

    return NextResponse.json(
      { success: true, message: 'Strategy call booking submitted' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Strategy call error:', error)
    return NextResponse.json(
      { error: 'Failed to process strategy call booking' },
      { status: 500 }
    )
  }
}
