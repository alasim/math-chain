import './globals.css'
import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import { Providers } from '@/components/providers';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/header';

const _montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Math Chain',
  description: 'Interact with MathChain',

}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={_montserrat.className}>
        <Providers>
          <Header />
          {children}
          <Toaster />
        </Providers>

      </body>
    </html>
  )
}
