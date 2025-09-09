import React, { useEffect, useMemo, useRef } from 'react'
import mermaid from 'mermaid'
import { cn } from '@/lib/utils'

mermaid.initialize({
  startOnLoad: false,
  securityLevel: 'loose',
  theme: 'dark',
  themeVariables: {
    primaryColor: '#1a294a',
    primaryTextColor: '#eaf1ff',
    lineColor: '#6aa9ff',
    secondaryColor: '#0f1830',
    tertiaryColor: '#122040',
  },
})

type MermaidProps = {
  code: string
  className?: string
}

export const Mermaid: React.FC<MermaidProps> = ({ code, className }) => {
  const id = useMemo(() => `mermaid-${Math.random().toString(36).slice(2)}`, [])
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let canceled = false
    const render = async () => {
      try {
        // Reset target content
        if (ref.current) ref.current.innerHTML = `<div class="mermaid">${code}</div>`
        await mermaid.run({ querySelector: `#${id} .mermaid` })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Mermaid render error', e)
      }
    }
    render()
    return () => {
      canceled = true
    }
  }, [code, id])

  return <div id={id} ref={ref} className={cn('overflow-auto', className)} />
}

