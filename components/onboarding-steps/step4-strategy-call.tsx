'use client'

import { useState } from 'react'

export default function OnboardingStep4({
  workspaceId,
  email,
}: {
  workspaceId: string
  email: string | null
}) {
  const [loading, setLoading] = useState(false)

  const bookStrategyCall = async () => {
    setLoading(true)
    try {
      // Send to Make.com webhook (replace with your actual webhook URL)
      const payload = {
        workspace_id: workspaceId,
        email: email || 'no-email-provided',
        event_type: 'ENTERPRISE_STRATEGY_CALL_BOOKED',
        timestamp: new Date().toISOString(),
      }

      // Mock webhook call - replace with your actual Make.com URL
      console.log('[v0] Booking strategy call:', payload)

      // Simulate webhook delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirect to Calendly (replace with your actual link)
      window.location.href =
        'https://calendly.com/your-calendar-link?email=' + encodeURIComponent(email || 'customer@example.com')
    } catch (error) {
      console.error('[v0] Strategy call error:', error)
      alert('Failed to book call. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Strategy Call Booking</h2>
        <p className="text-slate-400 text-sm mb-6">
          As an Enterprise customer, you get a dedicated AI engineer and VIP support. Let&apos;s schedule your
          onboarding strategy call to align on your unique needs and roadmap.
        </p>
      </div>

      <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-500/30 rounded-xl p-6 space-y-4">
        <div className="flex gap-3">
          <span className="text-2xl">📅</span>
          <div>
            <p className="font-bold text-white">Dedicated Strategy Call</p>
            <p className="text-sm text-slate-400 mt-1">30-minute session with your assigned AI Engineer</p>
          </div>
        </div>

        <div className="flex gap-3">
          <span className="text-2xl">👥</span>
          <div>
            <p className="font-bold text-white">Customized AI Solution Design</p>
            <p className="text-sm text-slate-400 mt-1">We&apos;ll build a solution tailored to your business</p>
          </div>
        </div>

        <div className="flex gap-3">
          <span className="text-2xl">🚀</span>
          <div>
            <p className="font-bold text-white">White-glove Implementation</p>
            <p className="text-sm text-slate-400 mt-1">Our team handles all setup and integration</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
        <p className="text-sm text-slate-300">
          <strong>Email for scheduling:</strong> {email || 'No email provided'}
        </p>
        <p className="text-xs text-slate-500 mt-2">
          You&apos;ll receive a Calendly invitation to select your preferred time slot.
        </p>
      </div>

      <button
        onClick={bookStrategyCall}
        disabled={loading}
        className="w-full py-4 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-bold text-lg"
      >
        {loading ? 'Redirecting to Calendly...' : 'Book Your Strategy Call'}
      </button>

      <p className="text-xs text-slate-500 text-center">
        Our team typically responds within 2 hours during business hours.
      </p>
    </div>
  )
}
