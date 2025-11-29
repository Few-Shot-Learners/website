import type { Metadata } from 'next'
import { Instrument_Serif } from 'next/font/google'
import './globals.css'
import 'katex/dist/katex.min.css'
import ThemeToggle from '@/components/ThemeToggle'

const instrumentSerif = Instrument_Serif({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-instrument-serif'
})

export const metadata: Metadata = {
  title: 'Few Shot Learners',
  description: 'Deeply technical learnings about everything AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme');
                const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                const finalTheme = theme || systemTheme;
                if (finalTheme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`${instrumentSerif.variable} font-sans`}>
        <ThemeToggle />
        {children}
      </body>
    </html>
  )
}
