'use client'

interface FormData {
  businessName: string
  industry: string
  websiteUrl: string
  targetAudience: string
  knowledgeBase: string
}

export default function OnboardingStep2({
  data,
  onChange,
}: {
  data: FormData
  onChange: (data: FormData) => void
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Knowledge Base & Training Data</h2>
        <p className="text-slate-400 text-sm mb-4">
          Upload or paste your business knowledge base. This is used to train your AI chatbot and automation agents.
        </p>
      </div>

      <div>
        <label className="block text-sm font-bold mb-2">Paste Your Knowledge Base</label>
        <textarea
          placeholder={`Paste your company policies, FAQs, product information, or training materials here...\n\nExample:\n- Our business hours are 9 AM - 5 PM EST\n- We offer 30-day refunds\n- Our top products are: Product A, Product B`}
          value={data.knowledgeBase}
          onChange={(e) => onChange({ ...data, knowledgeBase: e.target.value })}
          className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition resize-none h-48"
        />
        <p className="text-xs text-slate-500 mt-2">Minimum 50 characters recommended for best results</p>
      </div>

      <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
        <p className="text-sm text-slate-300">
          <strong>What happens next:</strong> Your knowledge base will be used to fine-tune the AI models that power your chatbot and automation workflows.
        </p>
      </div>
    </div>
  )
}
