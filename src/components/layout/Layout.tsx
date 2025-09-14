import type { ReactNode } from 'react'
import { useState } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import { SubscribeModal } from '@/components/newsletter/SubscribeModal'

export function Layout({ children }: { children: ReactNode }) {
  const [subscribeOpen, setSubscribeOpen] = useState(false)
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header onSubscribeClick={() => setSubscribeOpen(true)} />
      <main className="flex-1 bg-white">
        {children}
      </main>
      <Footer />
      <SubscribeModal open={subscribeOpen} onClose={() => setSubscribeOpen(false)} />
    </div>
  )
}
