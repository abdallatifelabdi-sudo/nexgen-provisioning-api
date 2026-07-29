import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, company, phone, lostRevenue } = body

    const webhookUrl = process.env.MAKE_STRATEGY_CALL_WEBHOOK
    if (!webhookUrl) {
      throw new Error('MAKE_STRATEGY_CALL_WEBHOOK is not defined in environment variables.')
    }

    // Send data securely and directly to Make.com
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipientEmail: 'abdallatifelabdi@gmail.com',
        leadName: name,
        leadEmail: email,
        leadCompany: company,
        leadPhone: phone,
        estimatedLostRevenue: lostRevenue,
        timestamp: new Date().toISOString(),
        source: 'NexGen AI Solutions - Strategy Call'
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to trigger Make.com webhook: ${response.statusText}`)
    }

    return NextResponse.json({ success: true, message: 'Strategy call request dispatched successfully.' })
  } catch (error: any) {
    console.error('API Error:', error.message)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
