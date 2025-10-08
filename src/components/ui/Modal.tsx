import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

type ModalProps = {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  maxWidthClassName?: string
}

export function Modal({ open, onClose, title, children, maxWidthClassName = 'max-w-lg' }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onMouseDown={(e) => {
        if (e.target === overlayRef.current) onClose()
      }}
      aria-modal="true"
      role="dialog"
    >
      <div className={`w-full ${maxWidthClassName} rounded-3xl bg-white/90 backdrop-blur-xl backdrop-saturate-[200%] border border-emerald-200/40 shadow-[0_16px_48px_-8px_rgba(16,185,129,0.15),0_24px_56px_-12px_rgba(245,158,11,0.12)] ring-1 ring-white/40 overflow-hidden`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-200/40">
          <h3 className="text-lg font-bold text-emerald-900">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-emerald-700/60 hover:bg-amber-500/20 hover:text-emerald-900 transition-all duration-300"
          >
            <span className="text-xl leading-none">×</span>
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}

export default Modal
