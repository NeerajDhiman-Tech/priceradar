import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AuthProvider from '@/components/SessionProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PriceRadar - Compare Prices Across Every Store in India',
  description: 'Compare prices from Amazon, Flipkart, Myntra, Meesho, Croma and 30+ Indian shopping sites instantly. Find the best deals and save money.',
  keywords: 'price comparison, amazon, flipkart, myntra, best price, india shopping',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
