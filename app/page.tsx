"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { initializePaddle, type Paddle } from "@paddle/paddle-js"

const pricingPlans = [
  {
    name: "Standard",
    description: "Ideal for small businesses automating basic operations.",
    price: 1000,
    priceId: "pri_01kvbmx7mxcn1wmq78v8hznccz",
    highlighted: false,
    features: [
      "24/7 AI Customer Support Chatbot setup",
      "Basic Lead Generation & CRM Integration",
      "Email & SMS Marketing Automation",
      "Monthly ROI & Performance Reports",
    ],
  },
  {
    name: "Pro",
    description: "Designed for growing SMEs looking to scale sales and workflows.",
    price: 2000,
    priceId: "pri_01kvbzv9bxwx3eprpst6q4m10x",
    highlighted: true,
    features: [
      "Everything in Standard + Advanced AI Sales Agents",
      "Full Workflow & Internal Process Automation",
      "Automated Lead Nurturing & Follow-ups",
      "Multi-channel integration (WhatsApp, Email, CRM)",
      "Bi-weekly strategic optimization calls",
    ],
  },
  {
    name: "Enterprise",
    description: "Tailored for large businesses requiring custom AI frameworks.",
    price: 3500,
    priceId: "pri_01kvbnhgrdrhvv7fvwp1ax2nnq",
    highlighted: false,
    features: [
      "Custom AI Solutions built from scratch for your business infrastructure",
      "Unlimited contact management and database synching",
      "Dedicated AI Engineer & VIP Support (Immediate Response)",
      "Full white-glove implementation and weekly strategy sessions",
    ],
  },
]

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

  const openCheckout = (priceId: string) => {
    if (!paddleRef.current) {
      console.log("[v0] Paddle not initialized yet")
      return
    }
    paddleRef.current.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      settings: {
        locale: "en",
      },
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
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4">
            {"✦ AI-POWERED ANALYSIS"}
          </span>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 bg-gradient-to-r from-white via-slate-300 to-slate-400 bg-clip-text text-transparent">
            Calculate Your Revenue Impact
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Analyze your organization's hidden opportunities. Our AI quantifies dormant accounts and conversion gaps with industry-leading precision.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* SLIDERS CARD */}
          <div className="lg:col-span-7 bg-gradient-to-br from-slate-900 to-slate-950 border border-indigo-500/20 p-8 sm:p-10 rounded-2xl shadow-2xl shadow-indigo-500/10">
            <h3 className="text-lg font-bold text-white mb-8">Configure Your Metrics</h3>
            
            {/* Slider 1 */}
            <div className="mb-10">
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-slate-200">Active Client Base</label>
                <span className="text-indigo-300 font-mono font-bold px-3 py-1 rounded-lg bg-indigo-500/15 text-sm border border-indigo-500/30">
                  {databaseSize.toLocaleString()} accounts
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="10000"
                step="50"
                value={databaseSize}
                onChange={(e) => setDatabaseSize(Number(e.target.value))}
                className="w-full accent-indigo-500 bg-slate-800 h-2 rounded-full cursor-pointer hover:accent-indigo-400 transition"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-2 font-medium">
                <span>100 accounts</span>
                <span>10K+ accounts</span>
              </div>
            </div>

            {/* Slider 2 */}
            <div className="mb-10">
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-slate-200">Average Deal Value</label>
                <span className="text-indigo-300 font-mono font-bold px-3 py-1 rounded-lg bg-indigo-500/15 text-sm border border-indigo-500/30">
                  ${ticketValue.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="20000"
                step="100"
                value={ticketValue}
                onChange={(e) => setTicketValue(Number(e.target.value))}
                className="w-full accent-indigo-500 bg-slate-800 h-2 rounded-full cursor-pointer hover:accent-indigo-400 transition"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-2 font-medium">
                <span>$500</span>
                <span>$20,000</span>
              </div>
            </div>

            {/* Slider 3 */}
            <div className="mb-10">
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-slate-200">Monthly Conversions</label>
                <span className="text-indigo-300 font-mono font-bold px-3 py-1 rounded-lg bg-indigo-500/15 text-sm border border-indigo-500/30">
                  {newLeads.toLocaleString()} deals/mo
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="500"
                step="5"
                value={newLeads}
                onChange={(e) => setNewLeads(Number(e.target.value))}
                className="w-full accent-indigo-500 bg-slate-800 h-2 rounded-full cursor-pointer hover:accent-indigo-400 transition"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-2 font-medium">
                <span>10 deals</span>
                <span>500+ deals</span>
              </div>
            </div>

            <button
              onClick={calculateRevenue}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:scale-105"
            >
              {isLoading ? "Analyzing Impact..." : "Calculate Revenue Impact"}
            </button>
          </div>

          {/* RESULTS CARD */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 border border-indigo-500/20 p-8 sm:p-10 rounded-2xl shadow-2xl shadow-indigo-500/10 min-h-[400px] flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none"></div>
            <div className="relative z-10">
              {!showResults ? (
                <div className="my-auto text-center py-12">
                  <div className="mb-4">
                    <svg className="w-12 h-12 mx-auto text-indigo-400/50 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">Ready to Calculate</h3>
                  <p className="text-sm text-slate-400">
                    Adjust your metrics above and click to unlock your revenue potential analysis.
                  </p>
                </div>
              ) : (
                <div className="space-y-7">
                  <div className="p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                    <span className="text-xs uppercase tracking-wider font-bold text-indigo-300 block mb-2">
                      Hidden Revenue Opportunity
                    </span>
                    <div className="text-4xl font-black text-indigo-400 font-mono">
                      ${results.lostPast.toLocaleString()}
                    </div>
                    <p className="text-xs text-slate-400 mt-2">Annual value locked in inactive accounts</p>
                  </div>

                  <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                    <span className="text-xs uppercase tracking-wider font-bold text-purple-300 block mb-2">
                      Monthly Revenue Gap
                    </span>
                    <div className="text-4xl font-black text-purple-400 font-mono">
                      ${results.lostMonthly.toLocaleString()}{" "}
                      <span className="text-base text-slate-400 font-sans font-normal">/mo</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">Recurring opportunity through reactivation</p>
                  </div>

                  <div className="pt-4">
                    <button className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/50 transform hover:scale-105">
                      Schedule Strategy Session
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-20 border-t border-white/10 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-5">
              {"✦ FLEXIBLE PLANS"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-3 text-balance">
              Choose Your{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Growth Engine
              </span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-pretty">
              Transparent monthly pricing built to scale with your pipeline. Cancel or upgrade anytime.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl p-8 transition-all ${
                  plan.highlighted
                    ? "bg-[#13121c] border-2 border-indigo-500 shadow-2xl shadow-indigo-500/20 md:-translate-y-3"
                    : "bg-[#0f0f12] border border-white/10"
                }`}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wide">
                    Most Popular
                  </span>
                )}

                <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-sm text-slate-400 mb-6 min-h-[40px]">{plan.description}</p>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-extrabold text-white font-mono">${plan.price.toLocaleString()}</span>
                  <span className="text-slate-500 text-sm">/month</span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-slate-300">
                      <span
                        className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${
                          plan.highlighted ? "bg-indigo-500/20 text-indigo-400" : "bg-white/5 text-slate-400"
                        }`}
                        aria-hidden="true"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => openCheckout(plan.priceId)}
                  className={`w-full font-bold py-3.5 rounded-xl transition ${
                    plan.highlighted
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20"
                      : "bg-white text-black hover:bg-slate-200"
                  }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

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
