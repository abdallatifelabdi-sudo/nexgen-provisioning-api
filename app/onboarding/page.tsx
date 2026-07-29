'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import OnboardingForm from '@/components/onboarding-form'
import OnboardingError from '@/components/onboarding-error'

function OnboardingContent() {
  const searchParams = useSearchParams()
  const workspaceId = searchParams.get('workspace_id')

  if (!workspaceId) {
    return (
      <OnboardingError
        title="Missing Workspace"
        message="No workspace ID provided. Please complete your Paddle checkout first."
        ctaText="Back to Pricing"
        ctaHref="/#pricing"
      />
    )
  }

  return <OnboardingForm workspaceId={workspaceId} />
}

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
          <OnboardingContent />
        </Suspense>
      </div>
    </div>
  )
}
