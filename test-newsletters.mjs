// Test script to verify newsletter data loading
import { newsletterEditions, getNewsletterBySlug } from './src/content/newsletters/index.ts'

console.log('Total newsletters loaded:', newsletterEditions.length)
console.log('\nAll newsletter slugs:')
newsletterEditions.forEach((n, i) => {
  console.log(`${i + 1}. ${n.slug} - ${n.title.substring(0, 50)}...`)
})

console.log('\nTesting getNewsletterBySlug:')
const testSlug = 'sept-11-2025'
const found = getNewsletterBySlug(testSlug)
if (found) {
  console.log(`✓ Found newsletter with slug "${testSlug}":`)
  console.log(`  Title: ${found.title}`)
  console.log(`  Date: ${found.date}`)
  console.log(`  Content length: ${found.contentHtml.length} characters`)
} else {
  console.log(`✗ Newsletter with slug "${testSlug}" not found!`)
}

const notFoundTest = getNewsletterBySlug('non-existent')
console.log(`\n✓ Non-existent slug returns: ${notFoundTest}`)