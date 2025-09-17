export type NewsletterEdition = {
  slug: string
  title: string
  date: string // ISO string for sorting
  displayDate: string
  summary: string
  heroImage?: string
  contentHtml: string
}