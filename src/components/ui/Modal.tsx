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
      <div className={`w-full ${maxWidthClassName} rounded-[16px] bg-[hsla(200,10%,60%,0.25)] backdrop-blur-[48px] backdrop-saturate-[200%] border border-[hsla(200,16%,80%,0.18)] shadow-[0_16px_32px_-8px_rgba(31,45,61,0.12),0_24px_48px_-12px_rgba(31,45,61,0.18),0_1px_0_0_rgba(255,255,255,0.15)_inset] overflow-hidden`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[hsla(200,18%,85%,0.14)]">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] text-white/60 hover:bg-[hsla(200,14%,78%,0.18)] hover:text-white transition-all duration-[250ms]"
          >
            <span className="text-xl leading-none">×</span>
          </button>
        </div>
        <div className="px-6 py-5 text-white">{children}</div>
      </div>
    </div>
  )
}

export default Modal
