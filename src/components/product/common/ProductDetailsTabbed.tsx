import { useState } from 'react'
import { cn } from '@/lib/utils'

interface Tab {
  id: string
  label: string
  content: React.ReactNode
}

interface ProductDetailsTabbedProps {
  tabs: Tab[]
  defaultTab?: string
}

export function ProductDetailsTabbed({
  tabs,
  defaultTab,
}: ProductDetailsTabbedProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)

  return (
    <section className="py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex gap-8" aria-label="Product details tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'pb-4 text-lg font-medium transition-colors relative',
                  activeTab === tab.id
                    ? 'text-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                )}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="pt-8">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={cn(
                'space-y-6',
                activeTab === tab.id ? 'block' : 'hidden'
              )}
            >
              {tab.content}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
