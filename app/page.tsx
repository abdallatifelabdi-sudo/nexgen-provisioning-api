'use client'

import { useState } from 'react'

type PaddleCheckout = {
  open: (options: {
    items: { priceId: string; quantity: number }[]
    settings: { displayMode: 'overlay'; theme: 'dark'; successUrl: string }
  }) => void
}

type PaddleGlobal = {
  Checkout: PaddleCheckout
}

declare global {
  interface Window {
    Paddle?: PaddleGlobal
  }
}

const setupPriceId = 'pri_01m1shqcndzt6xxxlkcq4nz4ptv'
const monthlyPriceId = 'pri_01m1sj4rgc3px4x85yppq5ysh2'
const successUrl = 'https://dentalai.site/onboarding'

function openPilotCheckout() {
  if (!window.Paddle) return false

  window.Paddle.Checkout.open({
    items: [
      { priceId: setupPriceId, quantity: 1 },
      { priceId: monthlyPriceId, quantity: 1 },
    ],
    settings: {
      displayMode: 'overlay',
      theme: 'dark',
      successUrl,
    },
  })

  return true
}

export default function Page() {
  const [checkoutMessage, setCheckoutMessage] = useState('')

  function handleCheckout() {
    const didOpen = openPilotCheckout()
    if (!didOpen) {
      setCheckoutMessage('Checkout is still loading. Please try again in a moment.')
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 sm:px-10 lg:px-16">
        <header className="flex items-center justify-between border-b border-border/70 py-6">
          <a href="#top" className="flex items-center gap-3" aria-label="DentalAI home">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-none stroke-current" strokeWidth="1.8">
                <path d="M8.7 4.5c1.2-.8 2.1.2 3.3.2s2.1-1 3.3-.2c2.3 1.5 2.9 4.7 2.2 7.6-.7 2.9-1.6 7.3-3.4 7.3-1.2 0-1.4-2.5-2.1-2.5s-.9 2.5-2.1 2.5c-1.8 0-2.7-4.4-3.4-7.3C5.8 9.2 6.4 6 8.7 4.5Z" />
                <path d="M12 4.7V2.8M10.1 3.3 9 1.9M13.9 3.3 15 1.9" />
              </svg>
            </span>
            <span className="font-mono text-sm font-semibold tracking-[0.18em] text-primary">DENTALAI</span>
          </a>
          <button type="button" onClick={handleCheckout} className="hidden rounded-full border border-border px-5 py-2.5 text-sm font-medium transition hover:border-primary hover:text-primary sm:block">
            Get started <span aria-hidden="true">↗</span>
          </button>
        </header>

        <section id="top" className="grid flex-1 items-center gap-14 py-20 lg:grid-cols-[1.08fr_0.92fr] lg:gap-20 lg:py-28">
          <div className="max-w-2xl">
            <p className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
              <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
              AI-powered dental operations
            </p>
            <h1 className="max-w-xl text-balance font-sans text-5xl font-semibold leading-[1.04] tracking-[-0.055em] text-primary sm:text-7xl">
              Your practice, <span className="text-accent">thinking ahead.</span>
            </h1>
            <p className="mt-8 max-w-lg text-pretty text-lg leading-8 text-muted-foreground sm:text-xl">
              DentalAI turns the daily noise of a modern practice into clear next steps—so your team can focus on the patients in front of you.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <button type="button" onClick={handleCheckout} className="group inline-flex items-center justify-center gap-3 rounded-full bg-primary px-7 py-4 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/10 transition hover:-translate-y-0.5 hover:bg-primary/90">
                Start pilot
                <span className="flex size-6 items-center justify-center rounded-full bg-accent text-accent-foreground transition group-hover:translate-x-0.5" aria-hidden="true">↗</span>
              </button>
              <span className="text-sm text-muted-foreground">$500 setup + $500 / month</span>
            </div>
            <p className="mt-5 text-xs leading-5 text-muted-foreground">Secure payment via Paddle. Your onboarding link arrives after checkout.</p>
            {checkoutMessage ? <p role="status" className="mt-3 text-sm font-medium text-accent">{checkoutMessage}</p> : null}
          </div>

          <div className="relative mx-auto w-full max-w-md lg:justify-self-end">
            <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-primary/10 bg-primary p-8 text-primary-foreground shadow-2xl shadow-primary/15 sm:p-12">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.2) 1px, transparent 1px)', backgroundSize: '42px 42px' }} aria-hidden="true" />
              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-start justify-between">
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary-foreground/60">Practice intelligence / 01</span>
                  <span className="size-3 rounded-full bg-accent shadow-[0_0_24px_rgba(116,227,190,.8)]" aria-label="System active" />
                </div>
                <div>
                  <div className="mb-8 flex size-24 items-center justify-center rounded-[1.5rem] border border-primary-foreground/20 bg-primary-foreground/10 backdrop-blur sm:size-32">
                    <svg aria-hidden="true" viewBox="0 0 80 80" className="size-16 fill-none stroke-accent sm:size-24" strokeWidth="2">
                      <path d="M29 18c5-3 8 2 11 2s6-5 11-2c8 5 10 15 7 25-3 10-6 23-12 23-5 0-4-10-6-10s-1 10-6 10c-6 0-9-13-12-23-3-10-1-20 7-25Z" />
                      <path d="M40 20V8M33 13l-5-7M47 13l5-7" />
                    </svg>
                  </div>
                  <p className="max-w-xs text-2xl font-medium leading-tight tracking-[-0.03em] sm:text-3xl">Less admin. More care.</p>
                </div>
                <div className="flex items-end justify-between border-t border-primary-foreground/20 pt-5 font-mono text-[10px] uppercase tracking-[0.14em] text-primary-foreground/60">
                  <span>Live pilot system</span>
                  <span>v.01</span>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-5 rounded-2xl border border-border bg-card px-4 py-3 shadow-xl sm:-left-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Signal detected</p>
              <p className="mt-1 text-sm font-semibold text-primary">Ready for your team</p>
            </div>
          </div>
        </section>

        <section className="grid border-t border-border py-10 sm:grid-cols-3 sm:gap-10">
          <div className="border-b border-border pb-6 sm:border-b-0 sm:border-r sm:pb-0"><p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">01 / Clarity</p><p className="mt-3 max-w-xs text-sm leading-6">Turn scattered practice data into a calm, prioritized view.</p></div>
          <div className="border-b border-border py-6 sm:border-b-0 sm:border-r sm:py-0 sm:pl-8"><p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">02 / Momentum</p><p className="mt-3 max-w-xs text-sm leading-6">Spot opportunities and bottlenecks before they cost your team time.</p></div>
          <div className="pt-6 sm:pt-0 sm:pl-8"><p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">03 / Partnership</p><p className="mt-3 max-w-xs text-sm leading-6">A thoughtful AI layer that works alongside the people who care.</p></div>
        </section>

        <footer className="flex flex-col gap-4 border-t border-border py-7 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 DentalAI</span>
          <span>Built for better days in dentistry.</span>
        </footer>
      </div>
    </main>
  )
}

export {}
