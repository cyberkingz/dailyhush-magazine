import { Modal } from '@/components/ui/Modal'
import NewsletterInlineForm from '@/components/NewsletterInlineForm'

type SubscribeModalProps = {
  open: boolean
  onClose: () => void
}

export function SubscribeModal({ open, onClose }: SubscribeModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Join DailyHush" maxWidthClassName="max-w-xl">
      <p className="text-gray-600 mb-4">
        Get weekly insights on beauty, wellness, and tech — evidence based and hype free.
      </p>
      <NewsletterInlineForm 
        sourcePage="header-modal" 
        buttonLabel="Subscribe" 
        showSparkLoop={true} 
        redirectOnSuccess={false} 
      />
      <p className="text-xs text-gray-500 mt-3">By subscribing, you agree to receive our newsletter. Unsubscribe anytime.</p>
    </Modal>
  )
}

export default SubscribeModal
