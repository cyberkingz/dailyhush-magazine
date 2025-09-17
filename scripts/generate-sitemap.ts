import { writeFileSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

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

// Extract edition slugs without importing app code (avoids asset imports)
const newsletterIndexSrc = readFileSync(resolve('src/content/newsletters/index.ts'), 'utf8')
// Extract imported file names from the index
const importMatches = Array.from(newsletterIndexSrc.matchAll(/from\s+'\.\/([^']+)'/g))
const slugs = importMatches.map(m => m[1])
const editionRoutes = slugs.flatMap((slug) => [
  `/archives/${slug}`,
  `/newsletter/${slug}`,
])

const urls = [...routes, ...editionRoutes]
  .map((p) => `  <url>\n    <loc>${base}${p}</loc>\n  </url>`)
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`

writeFileSync('dist/sitemap.xml', xml)
console.log('sitemap.xml generated')
