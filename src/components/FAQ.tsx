import { useState } from 'react'

type FAQItem = {
  question: string
  answer: string
}

type FAQProps = {
  title?: string
  items: FAQItem[]
  className?: string
}

export function FAQ({ title = "❓ FAQ", items, className = "" }: FAQProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set())

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index)
    } else {
      newOpenItems.add(index)
    }
    setOpenItems(newOpenItems)
  }

  return (
    <div className={className}>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      
      <div className="space-y-4 mb-6">
        {items.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleItem(index)}
              className="w-full text-left p-4 font-bold hover:bg-gray-50 transition-colors flex items-center justify-between"
            >
              <span>{item.question}</span>
              <span className="text-gray-400 ml-2">
                {openItems.has(index) ? '−' : '+'}
              </span>
            </button>
            {openItems.has(index) && (
              <div className="px-4 pb-4 text-gray-700">
                <div dangerouslySetInnerHTML={{ __html: item.answer }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Static version for simple display (no collapsing)
export function StaticFAQ({ title = "❓ FAQ", items, className = "" }: FAQProps) {
  return (
    <div className={className}>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      
      <div className="space-y-4 mb-6">
        {items.map((item, index) => (
          <div key={index}>
            <p className="font-bold mb-2">{item.question}</p>
            <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: item.answer }} />
          </div>
        ))}
      </div>
    </div>
  )
}