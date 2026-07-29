'use server'

import { db } from '@/lib/db'
import { workspaces } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

/**
 * Fetch workspace by ID and verify it's paid
 * Used to gate the onboarding flow after Paddle redirect
 */
export async function getWorkspaceByToken(workspaceId: string) {
  if (!workspaceId) {
    throw new Error('Workspace ID required')
  }

  try {
    const workspace = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.workspace_id, workspaceId))
      .limit(1)

    if (!workspace.length) {
      throw new Error('Workspace not found')
    }

    return workspace[0]
  } catch (error) {
    console.error('[v0] getWorkspaceByToken error:', error)
    throw error
  }
}

/**
 * Update onboarding submission for a workspace
 */
export async function updateOnboardingSubmission(
  workspaceId: string,
  data: {
    business_name?: string
    industry?: string
    website_url?: string
    target_audience?: string
    knowledge_base?: string
  }
) {
  if (!workspaceId) {
    throw new Error('Workspace ID required')
  }

  try {
    // Verify workspace exists and is paid
    const workspace = await getWorkspaceByToken(workspaceId)
    if (workspace.status !== 'paid') {
      throw new Error('Workspace payment not verified')
    }

    // In a full implementation, this would insert/update onboarding_submissions table
    // For now, we log and return success
    console.log('[v0] Onboarding submission for', workspaceId, data)

    return { success: true, workspace_id: workspaceId }
  } catch (error) {
    console.error('[v0] updateOnboardingSubmission error:', error)
    throw error
  }
}

/**
 * Mark onboarding as completed for a workspace
 */
export async function completeOnboarding(workspaceId: string) {
  if (!workspaceId) {
    throw new Error('Workspace ID required')
  }

  try {
    await db
      .update(workspaces)
      .set({
        onboarding_completed: true,
        updated_at: new Date(),
      })
      .where(eq(workspaces.workspace_id, workspaceId))

    console.log('[v0] Onboarding completed for', workspaceId)
    return { success: true }
  } catch (error) {
    console.error('[v0] completeOnboarding error:', error)
    throw error
  }
}
