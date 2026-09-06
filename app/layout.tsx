import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DentalAI — Patient lead recovery for dental practices',
  description: 'DentalAI captures missed calls, qualifies inquiries, and books high-value treatment plans directly into your PMS.',
  generator: 'v0.app',
}

export const viewport: Viewport = { colorScheme: 'light', themeColor: '#102d3a', viewportFit: 'cover' }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className="bg-background"><body className="antialiased">{children}<Script src="https://cdn.paddle.com/paddle/v2/paddle.js" strategy="afterInteractive"/><Script id="paddle-init" strategy="afterInteractive">{`(function initializePaddle() {
  if (window.Paddle) {
    window.Paddle.Environment.set('production');
    window.Paddle.Initialize({
      token: 'live_e6b6b97077f98b60b8d40def0e3',
      eventCallback: function(data) {
        if (data.name === 'checkout.completed') window.location.href = 'https://dentalai.site/onboarding';
      }
    });
    return;
  }
  window.setTimeout(initializePaddle, 100);
})();`}</Script>{process.env.NODE_ENV === 'production' && <Analytics/>}</body></html>
}
