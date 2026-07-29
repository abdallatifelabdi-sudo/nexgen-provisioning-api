'use client'

export default function LeadGenSetup({ workspaceId, plan }: { workspaceId: string; plan: string }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Automated Lead Generation</h2>
        <p className="text-slate-400">Capture, qualify, and nurture leads automatically using AI.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lead Capture */}
        <div className="border border-slate-700 rounded-xl p-6 bg-slate-900">
          <div className="text-3xl mb-4">🎯</div>
          <h3 className="font-bold text-white mb-2">Lead Capture Forms</h3>
          <p className="text-sm text-slate-400 mb-4">
            Create AI-powered forms that auto-respond and qualify leads instantly.
          </p>
          <button className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-bold">
            Create Form
          </button>
        </div>

        {/* Lead Scoring */}
        <div className="border border-slate-700 rounded-xl p-6 bg-slate-900">
          <div className="text-3xl mb-4">⭐</div>
          <h3 className="font-bold text-white mb-2">AI Lead Scoring</h3>
          <p className="text-sm text-slate-400 mb-4">
            Automatically score and rank leads by purchase intent.
          </p>
          <button className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-bold">
            Configure Scoring
          </button>
        </div>

        {/* Email Sequences */}
        <div className="border border-slate-700 rounded-xl p-6 bg-slate-900">
          <div className="text-3xl mb-4">📧</div>
          <h3 className="font-bold text-white mb-2">Drip Campaigns</h3>
          <p className="text-sm text-slate-400 mb-4">
            Auto-send personalized follow-up sequences to qualified leads.
          </p>
          <button className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-bold">
            Build Campaign
          </button>
        </div>

        {/* Multi-channel (Pro+) */}
        {plan !== 'standard' && (
          <div className="border border-slate-700 rounded-xl p-6 bg-slate-900">
            <div className="text-3xl mb-4">📱</div>
            <h3 className="font-bold text-white mb-2">Multi-Channel Outreach</h3>
            <p className="text-sm text-slate-400 mb-4">
              Reach leads via Email, SMS, WhatsApp, and Slack simultaneously.
            </p>
            <button className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-bold">
              Setup Channels
            </button>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-4">
        <p className="text-sm text-indigo-200">
          <strong>How it works:</strong> Connect your CRM, set up lead capture forms, and let AI handle qualification and
          outreach 24/7.
        </p>
      </div>
    </div>
  )
}
