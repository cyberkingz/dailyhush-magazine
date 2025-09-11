import { writeFileSync } from 'node:fs'
import { newsletterEditions } from '../src/content/newsletters'

const base = process.env.SITE_URL || 'https://example.com'
const routes = [
  '/',
  '/blog',
  '/about',
  '/contact',
  '/newsletter',
  '/archives',
  '/privacy',
  '/terms',
]

const editionRoutes = newsletterEditions.map((e) => `/archives/${e.slug}`)

const urls = [...routes, ...editionRoutes]
  .map((p) => `  <url>\n    <loc>${base}${p}</loc>\n  </url>`)
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`

writeFileSync('dist/sitemap.xml', xml)
console.log('sitemap.xml generated')
