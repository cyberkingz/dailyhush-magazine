import type { NewsletterEdition } from './types'

const newsletter: NewsletterEdition = {
  slug: 'aug-12-2025',
  title: 'Smart Rings, Honestly: Sensors, Battery, and Accuracy',
  date: '2025-08-12',
  displayDate: 'August 12, 2025',
  summary:
    'We compared 4 smart rings over 30 days. HRV trends are solid, calorie math is fantasy, and battery anxiety is real unless you do this one thing.',
  heroImage:
    'https://images.unsplash.com/photo-1510627498534-cf7e9002facc?auto=format&fit=crop&w=1600&h=900&q=80',
  contentHtml: `
    <h2>What Rings Measure Well</h2>
    <p>Resting heart rate, HRV trend, temperature deviation. Daily calories remain unreliable. Treat rings as <em>trend devices</em>, not precise trackers.</p>
    <h3>Battery Tip</h3>
    <p>Top up during showers and desk time; avoid full drains — lithium cells last longer when kept between 30–80%.</p>
  `,
}

export default newsletter