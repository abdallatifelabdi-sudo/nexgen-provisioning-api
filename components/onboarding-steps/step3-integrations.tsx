'use client'

import { useState } from 'react'

interface FormData {
  businessName: string
  industry: string
  websiteUrl: string
  targetAudience: string
  knowledgeBase: string
}

const integrationsByPlan: Record<string, { name: string; description: string; icon: string }[]> = {
  standard: [
    { name: 'Email (SMTP)', description: 'Send transactional emails', icon: '📧' },
    { name: 'SMS (Twilio)', description: 'Send text messages', icon: '💬' },
  ],
  pro: [
    { name: 'Email (SMTP)', description: 'Send transactional emails', icon: '📧' },
    { name: 'SMS (Twilio)', description: 'Send text messages', icon: '💬' },
    { name: 'WhatsApp', description: 'Send WhatsApp messages', icon: '💚' },
    { name: 'Slack', description: 'Send Slack notifications', icon: '💙' },
    { name: 'CRM (Salesforce/HubSpot)', description: 'Sync leads and contacts', icon: '🔄' },
  ],
  enterprise: [
    { name: 'Email (SMTP)', description: 'Send transactional emails', icon: '📧' },
    { name: 'SMS (Twilio)', description: 'Send text messages', icon: '💬' },
    { name: 'WhatsApp', description: 'Send WhatsApp messages', icon: '💚' },
    { name: 'Slack', description: 'Send Slack notifications', icon: '💙' },
    { name: 'CRM (Salesforce/HubSpot)', description: 'Sync leads and contacts', icon: '🔄' },
    { name: 'Make.com Webhooks', description: 'Custom workflow automation', icon: '🔗' },
    { name: 'Zapier', description: 'Connect 5000+ apps', icon: '⚡' },
    { name: 'Custom API', description: 'Build your own integrations', icon: '🛠️' },
  ],
}

export default function OnboardingStep3({
  data,
  plan,
  onChange,
}: {
  data: FormData
  plan: string
  onChange: (data: FormData) => void
}) {
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([])
  const integrations = integrationsByPlan[plan.toLowerCase()] || []

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Select Integrations</h2>
        <p className="text-slate-400 text-sm mb-4">
          Choose which platforms you want to connect to your AI automation system. You can add more later.
        </p>
      </div>

      <div className="grid gap-4">
        {integrations.map((integration) => (
          <label
            key={integration.name}
            className="flex items-start gap-4 p-4 bg-slate-900 border border-slate-700 rounded-xl hover:border-indigo-500 cursor-pointer transition"
          >
            <input
              type="checkbox"
              checked={selectedIntegrations.includes(integration.name)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedIntegrations([...selectedIntegrations, integration.name])
                } else {
                  setSelectedIntegrations(
                    selectedIntegrations.filter((i) => i !== integration.name)
                  )
                }
              }}
              className="w-5 h-5 mt-1 rounded accent-indigo-500 cursor-pointer"
            />
            <div className="flex-1">
              <p className="font-bold text-white">{integration.name}</p>
              <p className="text-sm text-slate-400">{integration.description}</p>
            </div>
            <span className="text-2xl">{integration.icon}</span>
          </label>
        ))}
      </div>

      <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-4">
        <p className="text-sm text-indigo-300">
          <strong>Next step:</strong> After onboarding, you&apos;ll configure API keys and credentials for each integration in your dashboard.
        </p>
      </div>
    </div>
  )
}
