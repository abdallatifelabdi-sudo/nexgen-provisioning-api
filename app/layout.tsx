import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DentalAI — Practice intelligence for modern dentistry',
  description: 'DentalAI turns the daily noise of a modern dental practice into clear next steps.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#eef4f2',
  viewportFit: 'cover',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="bg-background">
      <body className="antialiased">
        {children}
        <Script src="https://cdn.paddle.com/paddle/v2/paddle.js" strategy="afterInteractive" />
        <Script id="paddle-init" strategy="afterInteractive">
          {`(function initializePaddle() {
            if (window.Paddle) {
              window.Paddle.Environment.set('production');
              window.Paddle.Initialize({ token: 'live_e6b6b97077f98b60b8d40def0e3' });
              return;
            }
            window.setTimeout(initializePaddle, 100);
          })();`}
        </Script>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
