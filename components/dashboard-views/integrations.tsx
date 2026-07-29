'use client'

export default function IntegrationsView({ workspaceId, plan }: { workspaceId: string; plan: string }) {
  const integrationsByPlan: Record<string, { name: string; icon: string; connected: boolean }[]> = {
    standard: [
      { name: 'Email (SMTP)', icon: '📧', connected: false },
      { name: 'SMS (Twilio)', icon: '💬', connected: false },
    ],
    pro: [
      { name: 'Email (SMTP)', icon: '📧', connected: false },
      { name: 'SMS (Twilio)', icon: '💬', connected: false },
      { name: 'WhatsApp', icon: '💚', connected: false },
      { name: 'Slack', icon: '💙', connected: false },
      { name: 'CRM (Salesforce)', icon: '🔄', connected: false },
      { name: 'CRM (HubSpot)', icon: '🔄', connected: false },
    ],
    enterprise: [
      { name: 'Email (SMTP)', icon: '📧', connected: false },
      { name: 'SMS (Twilio)', icon: '💬', connected: false },
      { name: 'WhatsApp', icon: '💚', connected: false },
      { name: 'Slack', icon: '💙', connected: false },
      { name: 'CRM (Salesforce)', icon: '🔄', connected: false },
      { name: 'CRM (HubSpot)', icon: '🔄', connected: false },
      { name: 'Make.com', icon: '🔗', connected: false },
      { name: 'Zapier', icon: '⚡', connected: false },
      { name: 'Custom API', icon: '🛠️', connected: false },
    ],
  }

  const integrations = integrationsByPlan[plan.toLowerCase()] || integrationsByPlan.standard

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Integrations</h2>
        <p className="text-slate-400">Connect external tools and services to your AI automation system.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((integration) => (
          <div
            key={integration.name}
            className="border border-slate-700 rounded-xl p-6 bg-slate-900 hover:border-indigo-500 transition"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="text-3xl">{integration.icon}</div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  integration.connected
                    ? 'bg-green-900/30 text-green-300'
                    : 'bg-slate-700/50 text-slate-400'
                }`}
              >
                {integration.connected ? 'Connected' : 'Not Connected'}
              </span>
            </div>
            <p className="font-bold text-white mb-4 text-sm">{integration.name}</p>
            <button
              className={`w-full py-2 px-4 rounded-lg transition text-sm font-bold ${
                integration.connected
                  ? 'bg-slate-700 text-white hover:bg-slate-600'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {integration.connected ? 'Manage' : 'Connect'}
            </button>
          </div>
        ))}
      </div>

      {/* Custom Integration */}
      {plan === 'enterprise' && (
        <div className="border border-dashed border-indigo-500/50 rounded-xl p-8 text-center">
          <div className="text-4xl mb-4">🔧</div>
          <h3 className="font-bold text-white mb-2">Need a Custom Integration?</h3>
          <p className="text-slate-400 text-sm mb-4">
            Our team can build custom integrations tailored to your specific needs.
          </p>
          <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-bold">
            Request Custom Integration
          </button>
        </div>
      )}
    </div>
  )
}
