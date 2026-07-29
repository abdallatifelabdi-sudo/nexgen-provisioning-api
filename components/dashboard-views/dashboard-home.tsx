'use client'

type ViewType = 'home' | 'chatbot' | 'lead-gen' | 'email' | 'integrations' | 'settings'

const featuresByPlan: Record<string, { title: string; icon: string; view: ViewType; status: 'ready' | 'coming' }[]> = {
  standard: [
    { title: '24/7 AI Chatbot', icon: '💬', view: 'chatbot', status: 'ready' },
    { title: 'Email Automation', icon: '📧', view: 'email', status: 'ready' },
    { title: 'Integrations', icon: '🔗', view: 'integrations', status: 'ready' },
  ],
  pro: [
    { title: 'AI Chatbot', icon: '💬', view: 'chatbot', status: 'ready' },
    { title: 'Lead Generation', icon: '🎯', view: 'lead-gen', status: 'ready' },
    { title: 'Email Automation', icon: '📧', view: 'email', status: 'ready' },
    { title: 'Multi-channel', icon: '📱', view: 'integrations', status: 'coming' },
    { title: 'Integrations', icon: '🔗', view: 'integrations', status: 'ready' },
  ],
  enterprise: [
    { title: 'AI Chatbot', icon: '💬', view: 'chatbot', status: 'ready' },
    { title: 'Lead Generation', icon: '🎯', view: 'lead-gen', status: 'ready' },
    { title: 'Email Automation', icon: '📧', view: 'email', status: 'ready' },
    { title: 'Custom AI Engine', icon: '⚙️', view: 'email', status: 'coming' },
    { title: 'API Access', icon: '🔌', view: 'integrations', status: 'coming' },
    { title: 'Integrations', icon: '🔗', view: 'integrations', status: 'ready' },
  ],
}

export default function DashboardView({
  workspace,
  onNavigate,
}: {
  workspace: any
  onNavigate: (view: ViewType) => void
}) {
  const features = featuresByPlan[workspace.plan.toLowerCase()] || featuresByPlan.standard

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-500/30 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-2">Welcome to Your {workspace.plan.toUpperCase()} Plan</h2>
        <p className="text-slate-300 mb-4">
          Your AI automation system is ready to go. Set up your integrations and configure your first automation below.
        </p>
        <div className="flex gap-4 flex-wrap">
          <button
            onClick={() => onNavigate('chatbot')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-bold"
          >
            Get Started
          </button>
          <button
            onClick={() => onNavigate('integrations')}
            className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition font-bold"
          >
            View Integrations
          </button>
        </div>
      </div>

      {/* Features Grid */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Available Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`p-6 rounded-xl border transition ${
                feature.status === 'ready'
                  ? 'bg-slate-900 border-slate-700 hover:border-indigo-500 cursor-pointer'
                  : 'bg-slate-900/50 border-slate-700/50 opacity-50'
              }`}
              onClick={() => feature.status === 'ready' && onNavigate(feature.view)}
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <p className="font-bold text-white mb-2">{feature.title}</p>
              {feature.status === 'coming' && (
                <span className="inline-block text-xs bg-purple-900/50 text-purple-300 px-2 py-1 rounded">
                  Coming Soon
                </span>
              )}
              {feature.status === 'ready' && (
                <span className="inline-block text-xs bg-green-900/50 text-green-300 px-2 py-1 rounded">
                  Ready to Setup
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Start */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Quick Start Checklist</h3>
        <div className="space-y-2">
          {[
            { title: 'Set up your first AI Chatbot', done: false },
            { title: 'Connect your integrations', done: false },
            { title: 'Configure email automation', done: workspace.plan === 'standard' },
            { title: 'Enable lead generation', done: false, pro: true },
          ].map((item) => (
            (!item.pro || workspace.plan !== 'standard') && (
              <div key={item.title} className="flex items-center gap-3 p-3 bg-slate-900 rounded-lg">
                <input
                  type="checkbox"
                  checked={item.done}
                  className="w-5 h-5 rounded accent-indigo-500"
                  onChange={() => {}}
                />
                <span className={item.done ? 'text-slate-500 line-through' : 'text-slate-300'}>{item.title}</span>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  )
}
