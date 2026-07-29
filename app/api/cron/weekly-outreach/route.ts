import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    // Security verification of Cron Secret to prevent random calls
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response('Unauthorized', { status: 401 })
    }

    const webhookUrl = process.env.MAKE_WEEKLY_OUTREACH_WEBHOOK
    if (!webhookUrl) {
      throw new Error('MAKE_WEEKLY_OUTREACH_WEBHOOK is not defined.')
    }

    // Call Make.com to execute the weekly outreach automation
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trigger: 'weekly_outreach_execution', timestamp: new Date().toISOString() })
    })

    if (!response.ok) throw new Error('Triggering outreach automation failed.')

    return NextResponse.json({ success: true, message: 'Weekly outreach sequence triggered.' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
