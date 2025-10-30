// Testimonials for the DailyHush Quiz experience

export type QuizReview = {
  id: string
  author: string
  location?: string
  rating: number
  verified: boolean
  productVariant: string
  text: string
  date: string
  helpful?: number
}

export const quizReviews: QuizReview[] = [
  {
    id: 'quiz-1',
    author: 'Danielle R.',
    location: 'Austin, TX',
    rating: 5,
    verified: true,
    productVariant: 'Loop Type: Social Replay',
    text: 'Sixty seconds to name the exact loop I’ve been mislabeling as anxiety for years. The quiz nailed the “after the meeting replay” habit and the email breakdown showed the F.I.R.E. steps in plain language. I forwarded it to my therapist.',
    date: '2 weeks ago',
    helpful: 21,
  },
  {
    id: 'quiz-2',
    author: 'Marilyn K.',
    location: 'Toronto, Canada',
    rating: 5,
    verified: true,
    productVariant: 'Loop Type: Night Rumination',
    text: 'It told me why I wake up at 2:17 a.m. replaying conversations. The protocol download had a 90-second reset that actually worked the first night. Felt like someone finally mapped my brain instead of giving generic “sleep hygiene” advice.',
    date: '5 days ago',
    helpful: 18,
  },
  {
    id: 'quiz-3',
    author: 'Imani S.',
    location: 'Atlanta, GA',
    rating: 4.5,
    verified: true,
    productVariant: 'Loop Type: Decision Spiral',
    text: 'As a product manager I loved how clear the process was. The quiz result showed exactly where my decision fatigue spikes and paired it with the right F.I.R.E. cadence. The follow-up resources were incredibly helpful. Would love more examples inside the results page, hence the 4.5.',
    date: '1 week ago',
    helpful: 9,
  },
  {
    id: 'quiz-4',
    author: 'Caroline M.',
    location: 'Denver, CO',
    rating: 5,
    verified: true,
    productVariant: 'Loop Type: Perfectionism Loop',
    text: 'The quiz read my mind: “Ship at 90% or perfectionism becomes punishment.” I printed the summary and taped it to my monitor. The follow-up email spelled out the exact F.I.R.E. rep to run between edits.',
    date: '3 days ago',
    helpful: 14,
  },
  {
    id: 'quiz-5',
    author: 'Nora L.',
    location: 'Paris, France',
    rating: 5,
    verified: true,
    productVariant: 'Loop Type: Shame-Driven Overthinking',
    text: 'I’ve done every enneagram, MBTI, astrology chart… none of them told me what to DO when the shame loop hits. This quiz did. I knew my loop within a minute and the app invite showed me how to practice F.I.R.E. before bed.',
    date: '6 days ago',
    helpful: 11,
  },
  {
    id: 'quiz-6',
    author: 'Priya S.',
    location: 'London, UK',
    rating: 4.8,
    verified: true,
    productVariant: 'Loop Type: Sleep-Decision Hybrid',
    text: 'I loved the diagnostic depth—especially the hybrid explanation. The PDF I received after the quiz gave me a structured nightly ritual. Took off 0.2 because I wanted even more neuroscience references, but the protocol works.',
    date: '1 week ago',
    helpful: 7,
  },
]

