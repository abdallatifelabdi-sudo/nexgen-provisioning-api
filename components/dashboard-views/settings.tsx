'use client'

export default function SettingsView({ workspaceId, workspace }: { workspaceId: string; workspace: any }) {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Settings</h2>
        <p className="text-slate-400">Manage your workspace and account preferences.</p>
      </div>

      {/* Workspace Info */}
      <div className="border border-slate-700 rounded-xl p-6 bg-slate-900 space-y-4">
        <h3 className="font-bold text-white">Workspace Information</h3>
        
        <div>
          <label className="text-sm text-slate-400 block mb-2">Workspace ID</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={workspaceId}
              readOnly
              className="flex-1 px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
            />
            <button className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition text-sm font-bold">
              Copy
            </button>
          </div>
        </div>

        <div>
          <label className="text-sm text-slate-400 block mb-2">Plan</label>
          <div className="px-4 py-2 bg-indigo-900/20 border border-indigo-500/30 rounded-lg text-white font-bold">
            {workspace.plan.toUpperCase()}
          </div>
        </div>

        <div>
          <label className="text-sm text-slate-400 block mb-2">Status</label>
          <div className="px-4 py-2 bg-green-900/20 border border-green-500/30 rounded-lg text-green-300 font-bold">
            ACTIVE
          </div>
        </div>

        {workspace.email && (
          <div>
            <label className="text-sm text-slate-400 block mb-2">Account Email</label>
            <input
              type="email"
              value={workspace.email}
              readOnly
              className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
            />
          </div>
        )}
      </div>

      {/* API Keys */}
      <div className="border border-slate-700 rounded-xl p-6 bg-slate-900 space-y-4">
        <h3 className="font-bold text-white">API Configuration</h3>
        <p className="text-sm text-slate-400">Configure API keys and webhooks for advanced integrations.</p>
        
        <button className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-bold">
          Generate API Key
        </button>

        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-xs text-slate-400 mb-2">Webhook URL (for receiving updates)</p>
          <code className="text-xs text-slate-300 break-all">
            https://api.nexgenaio.com/webhooks/{'{'}workspace_id{'}'}
          </code>
        </div>
      </div>

      {/* Billing */}
      <div className="border border-slate-700 rounded-xl p-6 bg-slate-900 space-y-4">
        <h3 className="font-bold text-white">Billing</h3>
        
        <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
          <div>
            <p className="font-bold text-white">Monthly Subscription</p>
            <p className="text-sm text-slate-400">Billing cycle: Monthly</p>
          </div>
          <button className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition text-sm font-bold">
            Manage
          </button>
        </div>

        <div className="text-sm">
          <p className="text-slate-400 mb-2">Payment Method</p>
          <p className="text-white">Paddle (Merchant of Record)</p>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="border border-red-900/50 rounded-xl p-6 bg-red-900/10 space-y-4">
        <h3 className="font-bold text-red-400">Danger Zone</h3>
        
        <button className="w-full py-2 px-4 bg-red-900/20 text-red-400 border border-red-900/50 rounded-lg hover:bg-red-900/30 transition font-bold">
          Cancel Subscription
        </button>

        <button className="w-full py-2 px-4 bg-red-900/20 text-red-400 border border-red-900/50 rounded-lg hover:bg-red-900/30 transition font-bold">
          Delete Workspace
        </button>

        <p className="text-xs text-red-300">
          These actions cannot be undone. Please proceed with caution.
        </p>
      </div>
    </div>
  )
}
