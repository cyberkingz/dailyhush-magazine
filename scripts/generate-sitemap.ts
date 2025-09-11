import { writeFileSync } from 'node:fs'

const base = process.env.SITE_URL || 'https://example.com'
const routes = [
  '/',
  '/blog',
  '/about',
  '/contact',
  '/newsletter',
  '/newsletters',
  '/newsletters/sept-9-2025',
  '/newsletters/sept-2-2025',
  '/newsletters/aug-26-2025',
  '/privacy',
  '/terms',
]

const urls = routes.map((p) => `  <url>\n    <loc>${base}${p}</loc>\n  </url>`).join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`

writeFileSync('dist/sitemap.xml', xml)
console.log('sitemap.xml generated')
