'use client'

type ViewType = 'home' | 'chatbot' | 'lead-gen' | 'email' | 'integrations' | 'settings'

const menuItems: Record<string, { label: string; view: ViewType; icon: string; plans?: string[] }[]> = {
  standard: [
    { label: 'Overview', view: 'home', icon: '📊' },
    { label: 'AI Chatbot', view: 'chatbot', icon: '💬' },
    { label: 'Email Automation', view: 'email', icon: '📧' },
    { label: 'Integrations', view: 'integrations', icon: '🔗' },
    { label: 'Settings', view: 'settings', icon: '⚙️' },
  ],
  pro: [
    { label: 'Overview', view: 'home', icon: '📊' },
    { label: 'AI Chatbot', view: 'chatbot', icon: '💬' },
    { label: 'Lead Generation', view: 'lead-gen', icon: '🎯' },
    { label: 'Email Automation', view: 'email', icon: '📧' },
    { label: 'Integrations', view: 'integrations', icon: '🔗' },
    { label: 'Settings', view: 'settings', icon: '⚙️' },
  ],
  enterprise: [
    { label: 'Overview', view: 'home', icon: '📊' },
    { label: 'AI Chatbot', view: 'chatbot', icon: '💬' },
    { label: 'Lead Generation', view: 'lead-gen', icon: '🎯' },
    { label: 'Email Automation', view: 'email', icon: '📧' },
    { label: 'Integrations', view: 'integrations', icon: '🔗' },
    { label: 'Settings', view: 'settings', icon: '⚙️' },
  ],
}

export default function DashboardSidebar({
  activeView,
  onNavigate,
  plan,
}: {
  activeView: ViewType
  onNavigate: (view: ViewType) => void
  plan: string
}) {
  const items = menuItems[plan.toLowerCase()] || menuItems.standard

  return (
    <aside className="w-64 border-r border-slate-800 bg-[#0f0f12] p-6 hidden sm:flex flex-col">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white">
          N
        </div>
        <span className="font-bold text-white">NexGen</span>
      </div>

      <nav className="space-y-2 flex-1">
        {items.map((item) => (
          <button
            key={item.view}
            onClick={() => onNavigate(item.view)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
              activeView === item.view
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="pt-6 border-t border-slate-800">
        <p className="text-xs text-slate-600 mb-4">Version 1.0 • Beta</p>
        <button className="w-full py-2 px-3 text-sm bg-red-900/20 text-red-400 rounded-lg hover:bg-red-900/30 transition border border-red-900/30">
          Logout
        </button>
      </div>
    </aside>
  )
}
