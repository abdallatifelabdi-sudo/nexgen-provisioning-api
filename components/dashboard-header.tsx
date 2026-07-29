'use client'

export default function DashboardHeader({ workspace }: { workspace: any }) {
  return (
    <header className="border-b border-slate-800 bg-[#0f0f12] px-4 py-4 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Your Workspace</h1>
          <p className="text-sm text-slate-400 mt-1">
            Plan: <span className="font-bold text-indigo-400">{workspace.plan.toUpperCase()}</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">Status: <span className="text-green-400 font-bold">ACTIVE</span></p>
          <p className="text-xs text-slate-500 mt-1">ID: <code className="bg-slate-900 px-2 py-1 rounded text-[11px]">{workspace.workspace_id.slice(0, 12)}...</code></p>
        </div>
      </div>
    </header>
  )
}
