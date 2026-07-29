'use client'

import { useState } from 'react'
import DashboardHeader from './dashboard-header'
import DashboardSidebar from './dashboard-sidebar'
import DashboardView from './dashboard-views/dashboard-home'
import ChatbotSetup from './dashboard-views/automation-chatbot'
import LeadGenSetup from './dashboard-views/automation-lead-gen'
import EmailSmtpSetup from './dashboard-views/automation-email-smtp'
import IntegrationsView from './dashboard-views/integrations'
import SettingsView from './dashboard-views/settings'

type ViewType = 'home' | 'chatbot' | 'lead-gen' | 'email' | 'integrations' | 'settings'

export default function DashboardContent({
  workspace,
  workspaceId,
}: {
  workspace: any
  workspaceId: string
}) {
  const [activeView, setActiveView] = useState<ViewType>('home')

  const renderView = () => {
    switch (activeView) {
      case 'chatbot':
        return <ChatbotSetup workspaceId={workspaceId} plan={workspace.plan} />
      case 'lead-gen':
        return <LeadGenSetup workspaceId={workspaceId} plan={workspace.plan} />
      case 'email':
        return <EmailSmtpSetup workspaceId={workspaceId} plan={workspace.plan} />
      case 'integrations':
        return <IntegrationsView workspaceId={workspaceId} plan={workspace.plan} />
      case 'settings':
        return <SettingsView workspaceId={workspaceId} workspace={workspace} />
      default:
        return <DashboardView workspace={workspace} onNavigate={setActiveView} />
    }
  }

  return (
    <div className="flex min-h-screen bg-[#050505]">
      <DashboardSidebar activeView={activeView} onNavigate={setActiveView} plan={workspace.plan} />
      <div className="flex-1 flex flex-col">
        <DashboardHeader workspace={workspace} />
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 py-8">{renderView()}</div>
        </main>
      </div>
    </div>
  )
}
