'use client'

import { useState } from 'react'

export default function EmailSmtpSetup({ workspaceId, plan }: { workspaceId: string; plan: string }) {
  const [provider, setProvider] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Email Automation</h2>
        <p className="text-slate-400">Connect your email provider and set up automated campaigns.</p>
      </div>

      {/* Provider Selection */}
      <div>
        <h3 className="font-bold text-white mb-4">Choose Your Email Provider</h3>
        <div className="space-y-3">
          {[
            { name: 'SMTP', description: 'Use your existing email account', icon: '📧' },
            { name: 'Sendgrid', description: 'Enterprise email delivery', icon: '🚀' },
            { name: 'Mailgun', description: 'Developer-friendly email API', icon: '⚡' },
            { name: 'Resend', description: 'Modern email for developers', icon: '💌' },
          ].map((p) => (
            <button
              key={p.name}
              onClick={() => setProvider(p.name)}
              className={`w-full flex items-start gap-4 p-4 rounded-xl border transition ${
                provider === p.name
                  ? 'bg-indigo-900/20 border-indigo-500'
                  : 'bg-slate-900 border-slate-700 hover:border-indigo-500'
              }`}
            >
              <div className="text-2xl">{p.icon}</div>
              <div className="text-left flex-1">
                <p className="font-bold text-white">{p.name}</p>
                <p className="text-sm text-slate-400">{p.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Configuration Form */}
      {provider && (
        <div className="border border-slate-700 rounded-xl p-6 bg-slate-900 space-y-4">
          <h3 className="font-bold text-white">Configure {provider}</h3>

          {provider === 'SMTP' && (
            <>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">SMTP Server</label>
                <input
                  type="text"
                  placeholder="smtp.gmail.com"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="your-email@example.com"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Password / App Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </>
          )}

          {(provider === 'Sendgrid' || provider === 'Mailgun' || provider === 'Resend') && (
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">API Key</label>
              <input
                type="password"
                placeholder="••••••••••••••••••"
                className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
              <p className="text-xs text-slate-500 mt-2">
                Get your API key from your {provider} dashboard
              </p>
            </div>
          )}

          <button className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-bold">
            Connect {provider}
          </button>
        </div>
      )}

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-slate-700 rounded-xl p-4 bg-slate-900">
          <div className="text-2xl mb-2">📝</div>
          <p className="font-bold text-white text-sm mb-1">Email Templates</p>
          <p className="text-xs text-slate-400">Pre-built templates or create your own</p>
        </div>
        <div className="border border-slate-700 rounded-xl p-4 bg-slate-900">
          <div className="text-2xl mb-2">📊</div>
          <p className="font-bold text-white text-sm mb-1">Analytics</p>
          <p className="text-xs text-slate-400">Track opens, clicks, and conversions</p>
        </div>
      </div>
    </div>
  )
}
