'use client'

import { useState, useEffect } from 'react'
import { getWorkspaceByToken, updateOnboardingSubmission, completeOnboarding } from '@/app/actions/workspace'
import OnboardingStep1 from './onboarding-steps/step1-business-info'
import OnboardingStep2 from './onboarding-steps/step2-knowledge-base'
import OnboardingStep3 from './onboarding-steps/step3-integrations'
import OnboardingStep4 from './onboarding-steps/step4-strategy-call'
import OnboardingError from './onboarding-error'

interface FormData {
  businessName: string
  industry: string
  websiteUrl: string
  targetAudience: string
  knowledgeBase: string
}

export default function OnboardingForm({ workspaceId }: { workspaceId: string }) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [workspace, setWorkspace] = useState<any>(null)
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    industry: '',
    websiteUrl: '',
    targetAudience: '',
    knowledgeBase: '',
  })

  // Verify workspace on mount
  useEffect(() => {
    const verifyWorkspace = async () => {
      try {
        const ws = await getWorkspaceByToken(workspaceId)
        if (ws.status !== 'paid') {
          setError('Payment not verified. Please complete checkout.')
          return
        }
        setWorkspace(ws)
      } catch (err) {
        console.error('[v0] Verification failed:', err)
        setError((err as Error).message || 'Workspace not found')
      } finally {
        setLoading(false)
      }
    }

    verifyWorkspace()
  }, [workspaceId])

  const handleNext = async () => {
    if (step < getTotalSteps()) {
      setStep(step + 1)
    } else {
      // Submit and complete
      await handleSubmit()
    }
  }

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      await updateOnboardingSubmission(workspaceId, {
        business_name: formData.businessName,
        industry: formData.industry,
        website_url: formData.websiteUrl,
        target_audience: formData.targetAudience,
        knowledge_base: formData.knowledgeBase,
      })
      await completeOnboarding(workspaceId)

      // Redirect to dashboard
      window.location.href = `/dashboard?workspace_id=${workspaceId}`
    } catch (err) {
      console.error('[v0] Submit error:', err)
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const getTotalSteps = () => {
    if (!workspace) return 4
    // Enterprise gets 4 steps (including strategy call)
    // Standard & Pro get 3 steps
    return workspace.plan === 'enterprise' ? 4 : 3
  }

  const totalSteps = getTotalSteps()

  if (loading && !workspace) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        <p className="mt-4 text-slate-400">Verifying your workspace...</p>
      </div>
    )
  }

  if (error) {
    return (
      <OnboardingError
        title="Onboarding Error"
        message={error}
        ctaText="Back to Pricing"
        ctaHref="/#pricing"
      />
    )
  }

  if (!workspace) {
    return (
      <OnboardingError
        title="Workspace Not Found"
        message="Unable to load your workspace. Please try again."
        ctaText="Back to Home"
        ctaHref="/"
      />
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight mb-2">
          Let&apos;s set up your{' '}
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            {workspace.plan.toUpperCase()}
          </span>{' '}
          plan
        </h1>
        <p className="text-slate-400">Step {step} of {totalSteps}</p>
      </div>

      {/* Progress bar */}
      <div className="mb-8 flex gap-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition ${
              i < step ? 'bg-indigo-500' : i === step - 1 ? 'bg-indigo-400' : 'bg-slate-700'
            }`}
          />
        ))}
      </div>

      {/* Steps */}
      {step === 1 && <OnboardingStep1 data={formData} onChange={setFormData} />}
      {step === 2 && <OnboardingStep2 data={formData} onChange={setFormData} />}
      {step === 3 && <OnboardingStep3 data={formData} plan={workspace.plan} onChange={setFormData} />}
      {step === 4 && workspace.plan === 'enterprise' && (
        <OnboardingStep4 workspaceId={workspaceId} email={workspace.email} />
      )}

      {/* Navigation */}
      <div className="flex gap-4 mt-12">
        <button
          onClick={handlePrev}
          disabled={step === 1}
          className="flex-1 py-3 px-4 border border-slate-700 text-white rounded-xl hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition font-bold"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={loading}
          className="flex-1 py-3 px-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-bold"
        >
          {loading ? 'Processing...' : step === totalSteps ? 'Complete Setup' : 'Next'}
        </button>
      </div>
    </div>
  )
}
