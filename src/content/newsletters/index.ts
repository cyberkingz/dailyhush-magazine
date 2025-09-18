import type { NewsletterEdition } from './types'

// Import all newsletter editions
import { sep182025 } from './sep-18-2025'
import sept11 from './sept-11-2025'
import sept13 from './sept-13-2025'
import sept9 from './sept-9-2025'
import sept2 from './sept-2-2025'
import aug26 from './aug-26-2025'
import aug19 from './aug-19-2025'
import aug12 from './aug-12-2025'
import aug5 from './aug-05-2025'
import jul29 from './jul-29-2025'
import jul22 from './jul-22-2025'
import jul15 from './jul-15-2025'
import jul8 from './jul-08-2025'
import jul1 from './jul-01-2025'
import jun24 from './jun-24-2025'

// High-quality newsletter archive for SparkLoop Partner Network approval
export const newsletterEditions: NewsletterEdition[] = [
  sep182025,
  sept11,
  sept13,
  sept9,
  jul1,
  jun24,
  aug19,
  aug12,
  aug5,
  jul29,
  jul22,
  jul15,
  jul8,
  sept2,
  aug26,
]

export function getNewsletterBySlug(slug: string): NewsletterEdition | undefined {
  return newsletterEditions.find((n) => n.slug === slug)
}

// Re-export the type for convenience
export type { NewsletterEdition } from './types'