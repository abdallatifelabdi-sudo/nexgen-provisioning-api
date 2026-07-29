'use client'

import { useState } from 'react'

export default function ChatbotSetup({ workspaceId, plan }: { workspaceId: string; plan: string }) {
  const [status, setStatus] = useState<'setup' | 'training' | 'ready'>('setup')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">AI Customer Support Chatbot</h2>
        <p className="text-slate-400">Set up your 24/7 AI-powered customer support chatbot in minutes.</p>
      </div>

      {/* Status */}
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-white">Setup Status</h3>
          <span className={`text-sm px-3 py-1 rounded-full ${
            status === 'ready' ? 'bg-green-900/30 text-green-300' :
            status === 'training' ? 'bg-yellow-900/30 text-yellow-300' :
            'bg-slate-700/30 text-slate-300'
          }`}>
            {status === 'setup' ? 'Not Started' : status === 'training' ? 'Training...' : 'Ready'}
          </span>
        </div>
        <div className="flex gap-2">
          {['setup', 'training', 'ready'].map((s, i) => (
            <div
              key={s}
              className={`flex-1 h-1 rounded-full ${
                ['setup', 'training', 'ready'].indexOf(status) >= i ? 'bg-indigo-500' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Setup Options */}
      <div className="space-y-4">
        <h3 className="font-bold text-white">Choose Your Setup Method</h3>
        
        <div className="border border-slate-700 rounded-xl p-6 hover:border-indigo-500 cursor-pointer transition bg-slate-900">
          <div className="flex items-start gap-4">
            <div className="text-3xl">🤖</div>
            <div className="flex-1">
              <p className="font-bold text-white mb-1">OpenAI Assistant (Recommended)</p>
              <p className="text-sm text-slate-400 mb-4">Use OpenAI&apos;s latest GPT models with your knowledge base.</p>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-bold">
                Configure OpenAI
              </button>
            </div>
          </div>
        </div>

        {plan !== 'standard' && (
          <div className="border border-slate-700 rounded-xl p-6 hover:border-indigo-500 cursor-pointer transition bg-slate-900">
            <div className="flex items-start gap-4">
              <div className="text-3xl">🧠</div>
              <div className="flex-1">
                <p className="font-bold text-white mb-1">Langflow (Advanced)</p>
                <p className="text-sm text-slate-400 mb-4">Build custom AI workflows with visual node editor.</p>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-bold">
                  Launch Langflow
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="border border-slate-700 rounded-xl p-6 hover:border-indigo-500 cursor-pointer transition bg-slate-900">
          <div className="flex items-start gap-4">
            <div className="text-3xl">💬</div>
            <div className="flex-1">
              <p className="font-bold text-white mb-1">Chatbase AI</p>
              <p className="text-sm text-slate-400 mb-4">Upload documents and get instant Q&A chatbot.</p>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-bold">
                Connect Chatbase
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-4">
        <p className="text-sm text-indigo-200">
          <strong>Next step:</strong> After setup, you&apos;ll get an embed code to add your chatbot to your website.
        </p>
      </div>
    </div>
  )
}
