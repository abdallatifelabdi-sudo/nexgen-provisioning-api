'use client'

import { useState } from 'react'

interface FormData {
  businessName: string
  industry: string
  websiteUrl: string
  targetAudience: string
  knowledgeBase: string
}

export default function OnboardingStep1({
  data,
  onChange,
}: {
  data: FormData
  onChange: (data: FormData) => void
}) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const industries = [
    'Retail',
    'SaaS',
    'E-commerce',
    'Healthcare',
    'Finance',
    'Education',
    'Manufacturing',
    'Other',
  ]

  const handleChange = (field: keyof FormData, value: string) => {
    onChange({ ...data, [field]: value })
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-bold mb-2">Business Name</label>
        <input
          type="text"
          placeholder="e.g. Acme Corp"
          value={data.businessName}
          onChange={(e) => handleChange('businessName', e.target.value)}
          className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition"
        />
        {errors.businessName && <p className="text-red-400 text-sm mt-1">{errors.businessName}</p>}
      </div>

      <div>
        <label className="block text-sm font-bold mb-2">Industry</label>
        <select
          value={data.industry}
          onChange={(e) => handleChange('industry', e.target.value)}
          className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-indigo-500 focus:outline-none transition"
        >
          <option value="">Select an industry</option>
          {industries.map((ind) => (
            <option key={ind} value={ind}>
              {ind}
            </option>
          ))}
        </select>
        {errors.industry && <p className="text-red-400 text-sm mt-1">{errors.industry}</p>}
      </div>

      <div>
        <label className="block text-sm font-bold mb-2">Website URL</label>
        <input
          type="url"
          placeholder="https://example.com"
          value={data.websiteUrl}
          onChange={(e) => handleChange('websiteUrl', e.target.value)}
          className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition"
        />
        {errors.websiteUrl && <p className="text-red-400 text-sm mt-1">{errors.websiteUrl}</p>}
      </div>

      <div>
        <label className="block text-sm font-bold mb-2">Target Audience</label>
        <textarea
          placeholder="Describe your ideal customers..."
          value={data.targetAudience}
          onChange={(e) => handleChange('targetAudience', e.target.value)}
          className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition resize-none h-24"
        />
        {errors.targetAudience && <p className="text-red-400 text-sm mt-1">{errors.targetAudience}</p>}
      </div>
    </div>
  )
}
