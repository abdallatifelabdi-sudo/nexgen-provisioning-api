'use client'

import Link from 'next/link'

export default function DashboardError({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] text-white px-4">
      <div className="text-center max-w-md">
        <div className="mb-6 text-6xl">❌</div>
        <h1 className="text-3xl font-black tracking-tight mb-3">Dashboard Error</h1>
        <p className="text-slate-400 mb-8">{message}</p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-bold"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
