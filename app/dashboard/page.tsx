'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { getWorkspaceByToken } from '@/app/actions/workspace'
import DashboardError from '@/components/dashboard-error'
import DashboardContent from '@/components/dashboard-content'

function DashboardInner() {
  const searchParams = useSearchParams()
  const workspaceId = searchParams.get('workspace_id')
  const [workspace, setWorkspace] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWorkspace = async () => {
      if (!workspaceId) {
        setError('Missing workspace ID')
        setLoading(false)
        return
      }

      try {
        const ws = await getWorkspaceByToken(workspaceId)
        if (!ws || ws.status !== 'paid') {
          setError('Workspace not found or payment not verified')
          setLoading(false)
          return
        }
        setWorkspace(ws)
      } catch (err) {
        console.error('[v0] Dashboard fetch error:', err)
        setError((err as Error).message || 'Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchWorkspace()
  }, [workspaceId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mb-4"></div>
          <p className="text-slate-400">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return <DashboardError message={error} />
  }

  if (!workspace) {
    return <DashboardError message="Workspace not found" />
  }

  return <DashboardContent workspace={workspace} workspaceId={workspaceId!} />
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <DashboardInner />
    </Suspense>
  )
}
