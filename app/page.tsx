"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { initializePaddle, type Paddle } from "@paddle/paddle-js"
import ProfessionalPricingGrid from "@/components/professional-pricing-grid"



const policies = {
  terms: {
    title: "Terms of Service",
    body: "Welcome to NexGen AI Solutions. By accessing our website and using our services, you agree to comply with and be bound by the following terms. All payments are processed securely via our merchant of record, Paddle. Subscriptions automatically renew unless cancelled by the user before the billing cycle ends. NexGen AI Solutions is not liable for any financial decisions made based on these calculations.",
  },
  privacy: {
    title: "Privacy Policy",
    body: "At NexGen AI Solutions, we value your privacy. We collect inputs provided in our calculator and account information required for service delivery. Your business metrics are processed locally to generate your revenue leakage report and are not shared with third parties, except for payment processing via Paddle.",
  },
  refund: {
    title: "Refund Policy",
    body: "Users can cancel their NexGen AI Solutions subscription at any time. Due to the digital and instantaneous nature of AI-driven automation services and software provisioning, we generally do not offer refunds once a billing cycle has been processed.",
  },
} as const

type PolicyKey = keyof typeof policies

export default function Page() {
  // Sliders
  const [databaseSize, setDatabaseSize] = useState(1000)
  const [ticketValue, setTicketValue] = useState(1500)
  const [newLeads, setNewLeads] = useState(50)

  // UI states
  const [isLoading, setIsLoading] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [activePolicy, setActivePolicy] = useState<PolicyKey | null>(null)
  const [showStrategyCall, setShowStrategyCall] = useState(false)
  const [strategyCallForm, setStrategyCallForm] = useState({
    fullName: "",
    companyName: "",
  })

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  })

  // Calculated results
  const [results, setResults] = useState({ lostPast: 0, lostMonthly: 0 })

  // Paddle.js
  const paddleRef = useRef<Paddle | null>(null)

  useEffect(() => {
    initializePaddle({
      environment: "production",
      token: "live_e581869a45363d71a6d6a4f1cea",
    }).then((paddle) => {
      if (paddle) paddleRef.current = paddle
    })
  }, [])

  const bookStrategyCall = async (selectedTier: string) => {
    if (!strategyCallForm.fullName || !strategyCallForm.companyName) {
      alert("Please fill in all required fields")
      return
    }

    const payload = {
      name: strategyCallForm.fullName,
      company: strategyCallForm.companyName,
      email: "abdallatifelabdi@gmail.com",
      lostRevenue: results.lostMonthly,
    }

    try {
      const res = await fetch("/api/strategy-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        alert("Strategy call booking submitted! We'll be in touch shortly.")
        setShowStrategyCall(false)
        setStrategyCallForm({ fullName: "", companyName: "" })
      } else {
        throw new Error("Failed to submit")
      }
    } catch (error) {
      console.error(error)
      alert("Failed to book strategy call. Please try again.")
    }
  }

  const openCheckout = (priceId: string, planName: string) => {
    if (!paddleRef.current) {
      console.log("[v0] Paddle not initialized yet")
      return
    }

    // Generate a unique workspace ID for this purchase
    const workspaceId = `ws_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    paddleRef.current.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      settings: {
        locale: "en",
      },
      customer: {
        email: "", // Leave empty; user provides in checkout
      },
      customData: {
        workspace_id: workspaceId,
        plan: planName.toLowerCase(),
      },
      successUrl: `${typeof window !== "undefined" ? window.location.origin : ""}/onboarding?workspace_id=${workspaceId}`,
    })
  }

  const calculateRevenue = () => {
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)

      const lostPastRevenue = databaseSize * 0.15 * ticketValue
      const monthlyLostRevenue = newLeads * 0.4 * ticketValue

      setResults({
        lostPast: lostPastRevenue,
        lostMonthly: monthlyLostRevenue,
      })

      setShowPopup(true)
    }, 2000)
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("[v0] Customer Leads Data:", formData)

    setShowPopup(false)
    setShowResults(true)
  }

  const scrollToCalculator = () => {
    document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* HEADER / NAV */}
      <header className="border-b border-white/10 bg-[#050505]/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white">
              N
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              NexGen AI
            </span>
          </div>
          <button
            onClick={scrollToCalculator}
            className="bg-white text-black hover:bg-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            Book Strategy Call
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden py-20 lg:py-32 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-6">
            {"✦ AI-DRIVEN REVENUE RECOVERY • 2026 SUITE"}
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none mb-6 text-balance">
            Stop Leaving{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Millions
            </span>{" "}
            On The Table.
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed text-pretty">
            Our intelligent automation engine reactivates stale databases and captures leakage in your sales funnel.
            Calculate your potential growth in seconds.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={scrollToCalculator}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-indigo-500/20 transition-all"
            >
              {"Analyze My Pipeline →"}
            </button>
            <button className="w-full sm:w-auto bg-slate-900 border border-white/10 hover:bg-slate-800 text-white font-bold px-8 py-4 rounded-xl transition-all">
              Explore Systems
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mt-16 border-t border-white/5 pt-8">
            <div>
              <div className="text-2xl font-bold text-white">98%</div>
              <div className="text-xs text-slate-500 uppercase">Accuracy Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">12x</div>
              <div className="text-xs text-slate-500 uppercase">Avg. ROI</div>
            </div>
          </div>
        </div>
      </section>

      {/* CALCULATOR SECTION */}
      <section id="calculator" className="py-20 max-w-5xl mx-auto px-4 scroll-mt-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Enterprise Revenue Opportunity Assessment</h2>
          <p className="text-slate-400">
            Analyze your organization's untapped revenue potential. Input your metrics to quantify lost opportunities and competitive gaps.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* SLIDERS CARD */}
          <div className="lg:col-span-7 bg-[#0f0f12] border border-white/10 p-6 sm:p-8 rounded-2xl shadow-xl">
            {/* Slider 1 */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-slate-300">Active Client Portfolio</label>
                <span className="text-indigo-400 font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-sm">
                  {databaseSize.toLocaleString()} Organizations
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="10000"
                step="50"
                value={databaseSize}
                onChange={(e) => setDatabaseSize(Number(e.target.value))}
                className="w-full accent-indigo-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>100 Clients</span>
                <span>10,000 Clients</span>
              </div>
            </div>

            {/* Slider 2 */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-slate-300">Average Annual Contract Value (ACV)</label>
                <span className="text-indigo-400 font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-sm">
                  ${ticketValue.toLocaleString()} USD
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="20000"
                step="100"
                value={ticketValue}
                onChange={(e) => setTicketValue(Number(e.target.value))}
                className="w-full accent-indigo-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>$500</span>
                <span>$20,000</span>
              </div>
            </div>

            {/* Slider 3 */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-slate-300">Monthly Service Inquiries Lost to Competitors</label>
                <span className="text-indigo-400 font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-sm">
                  {newLeads.toLocaleString()} Inquiries
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="500"
                step="5"
                value={newLeads}
                onChange={(e) => setNewLeads(Number(e.target.value))}
                className="w-full accent-indigo-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>10 Inquiries</span>
                <span>500 Inquiries</span>
              </div>
            </div>

            <button
              onClick={calculateRevenue}
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading ? "Analyzing Database Loss Patterns..." : "CALCULATE MY LOST REVENUE ➔"}
            </button>
          </div>

          {/* RESULTS CARD */}
          <div className="lg:col-span-5 bg-[#0f0f12] border border-white/10 p-6 sm:p-8 rounded-2xl shadow-xl min-h-[380px] flex flex-col justify-between relative overflow-hidden">
            {!showResults ? (
              <div className="my-auto text-center py-12">
                <h3 className="text-lg font-medium text-slate-200 mb-1">Analysis Status: Pending</h3>
                <p className="text-sm text-slate-500 max-w-xs mx-auto">
                  Configure your slider metrics and press the calculation action button above to lock in your pipeline
                  diagnostic.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 block mb-1">
                    Annual Revenue Loss (Inactive Accounts)
                  </span>
                  <div className="text-3xl sm:text-4xl font-extrabold text-indigo-400 font-mono">
                    ${results.lostPast.toLocaleString()}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 block mb-1">
                    Monthly Opportunity Cost
                  </span>
                  <div className="text-3xl sm:text-4xl font-extrabold text-purple-400 font-mono">
                    ${results.lostMonthly.toLocaleString()}{" "}
                    <span className="text-xs text-slate-500 font-sans font-normal">/ mo</span>
                  </div>
                </div>

                <div className="pt-6 space-y-3">
                  <p className="text-xs text-slate-400 text-center">Ready to discuss your optimization strategy?</p>
                  <a
                    href="mailto:abdallatifelabdi@gmail.com?subject=AI%20Service%20Package%20Inquiry%20-%20Revenue%20Analysis"
                    className="w-full bg-white text-black hover:bg-slate-200 font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 block"
                  >
                    Contact Me Directly via Email
                  </a>
                  <p className="text-xs text-slate-500 text-center">
                    Email: <span className="text-indigo-400 font-semibold">abdallatifelabdi@gmail.com</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* PROFESSIONAL PRICING SECTION */}
      <ProfessionalPricingGrid
        onTierSelect={(tierName) => {
          console.log("[v0] Tier selected:", tierName)
          setShowStrategyCall(true)
        }}
      />

      {/* LEAD CAPTURE POPUP MODAL */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0f0f12] border border-white/10 p-6 sm:p-8 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-1">Unlock Your Revenue Report</h3>
              <p className="text-sm text-slate-400">Enter your details below to instantly view your calculations.</p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Business Email</label>
                <input
                  type="email"
                  required
                  placeholder="john@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition mt-2"
              >
                {"Reveal Results →"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* STRATEGY CALL BOOKING MODAL */}
      {showStrategyCall && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setShowStrategyCall(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="strategy-title"
        >
          <div
            className="bg-[#0f0f12] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h3 id="strategy-title" className="text-lg font-bold text-white">
                Book Your Strategy Call
              </h3>
              <button
                onClick={() => setShowStrategyCall(false)}
                aria-label="Close"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-300 block mb-2">Full Name</label>
                <input
                  type="text"
                  value={strategyCallForm.fullName}
                  onChange={(e) => setStrategyCallForm({ ...strategyCallForm, fullName: e.target.value })}
                  placeholder="Your name"
                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-300 block mb-2">Company Name</label>
                <input
                  type="text"
                  value={strategyCallForm.companyName}
                  onChange={(e) => setStrategyCallForm({ ...strategyCallForm, companyName: e.target.value })}
                  placeholder="Your company"
                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4">
                <p className="text-xs text-slate-400 mb-2">Your calculated revenue potential:</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-slate-500">Hidden Revenue:</span>
                    <p className="font-bold text-indigo-400">${results.lostPast.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Monthly Loss:</span>
                    <p className="font-bold text-purple-400">${results.lostMonthly.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-white/10 space-y-2">
              <button
                onClick={() => bookStrategyCall("standard")}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 rounded-lg transition-all duration-300 hover:scale-105"
              >
                Schedule Strategy Call
              </button>
              <button
                onClick={() => setShowStrategyCall(false)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium py-3 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#050505]">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="max-w-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white">
                  N
                </div>
                <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                  NexGen AI
                </span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                AI-driven revenue recovery. Reactivate dormant databases and capture every lead with intelligent
                automation.
              </p>
            </div>

            <nav className="flex flex-col sm:flex-row gap-x-8 gap-y-3">
              <button
                onClick={() => setActivePolicy("terms")}
                className="text-sm text-slate-400 hover:text-white transition text-left"
              >
                Terms of Service
              </button>
              <button
                onClick={() => setActivePolicy("privacy")}
                className="text-sm text-slate-400 hover:text-white transition text-left"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => setActivePolicy("refund")}
                className="text-sm text-slate-400 hover:text-white transition text-left"
              >
                Refund Policy
              </button>
            </nav>
          </div>

          <div className="border-t border-white/5 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-slate-600">
              &copy; {new Date().getFullYear()} NexGen AI Solutions. All rights reserved.
            </p>
            <p className="text-xs text-slate-600">Payments securely processed by Paddle.</p>
          </div>
        </div>
      </footer>

      {/* POLICY MODAL */}
      {activePolicy && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setActivePolicy(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="policy-title"
        >
          <div
            className="bg-[#0f0f12] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h3 id="policy-title" className="text-lg font-bold text-white">
                {policies[activePolicy].title}
              </h3>
              <button
                onClick={() => setActivePolicy(null)}
                aria-label="Close"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <p className="text-sm text-slate-400 leading-relaxed">{policies[activePolicy].body}</p>
            </div>
            <div className="p-6 border-t border-white/10">
              <button
                onClick={() => setActivePolicy(null)}
                className="w-full bg-white text-black hover:bg-slate-200 font-bold py-3 rounded-xl transition"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
