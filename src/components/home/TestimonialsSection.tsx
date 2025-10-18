import { Star } from 'lucide-react'

interface Testimonial {
  id: string
  name: string
  age: number
  role: string
  beforeState: string
  afterState: string
  quote: string
  rating: number
  avatarColor: 'emerald' | 'amber' | 'rose'
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah M.',
    age: 34,
    role: 'Marketing Director',
    beforeState: 'Replaying conversations for 72 hours',
    afterState: 'Moved on by the next morning',
    quote: "I can't believe how much energy I was spending on punishment. The first time I interrupted the pattern in the 7-second window and didn't replay something for 72 hours, I cried. I didn't know that was possible. I thought this was just who I was.",
    rating: 5,
    avatarColor: 'emerald'
  },
  {
    id: '2',
    name: 'Jessica L.',
    age: 29,
    role: 'Small Business Owner',
    beforeState: 'Afraid to speak up, waking at 3 AM',
    afterState: 'Sharing ideas without fear',
    quote: "All three phrases—'I should've known better,' 'afraid of doing it wrong,' 'can't stop replaying.' That was me. When I learned this was shame, not anxiety, everything clicked. The 7-second window made sense. I'm sleeping through the night for the first time in years.",
    rating: 5,
    avatarColor: 'amber'
  },
  {
    id: '3',
    name: 'Rachel K.',
    age: 41,
    role: 'Teacher & Mother',
    beforeState: 'Constant shame spirals, replaying for years',
    afterState: 'Peaceful nights, present with family',
    quote: "I was replaying a conversation with my daughter from three years ago. THREE YEARS. Every meditation app told me to 'notice and let go.' But by the time I noticed, my body had already decided I was unsafe. F.I.R.E. taught me to catch it in those crucial 7 seconds.",
    rating: 5,
    avatarColor: 'rose'
  }
]

export default function TestimonialsSection() {
  return (
    <section
      className="py-16 md:py-24"
      aria-labelledby="testimonials-heading"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2
            id="testimonials-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-emerald-900 mb-6"
          >
            From 72 Hours of Replay to Moving On in 90 Seconds
          </h2>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
            Real stories from women who spent years punishing themselves for existing—until they learned to interrupt the pattern.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid gap-8 md:grid-cols-3 mb-16">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="bg-gray-50 p-8 border border-gray-200">
          <h3 className="text-2xl font-bold text-emerald-900 mb-8 text-center">
            Average Results After F.I.R.E. Training
          </h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Replay Duration"
              before="72 hours"
              after="0-15 minutes"
            />
            <StatCard
              label="Replays Per Week"
              before="8-12"
              after="0-2"
            />
            <StatCard
              label="Sleep Quality"
              before="4-5 hours"
              after="7+ hours"
            />
            <StatCard
              label="Time To Move On"
              before="Days"
              after="90 seconds"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

// Testimonial Card Component
function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <blockquote className="bg-white border border-gray-200 p-8 h-full flex flex-col">
      {/* Name */}
      <div className="mb-4">
        <cite className="text-lg font-bold text-gray-900 not-italic">
          {testimonial.name}
        </cite>
        <p className="text-sm text-gray-600">{testimonial.role}, {testimonial.age}</p>
      </div>

      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" aria-hidden="true" />
        ))}
        <span className="sr-only">{testimonial.rating} out of 5 stars</span>
      </div>

      {/* Before/After */}
      <div className="space-y-3 mb-6">
        <div>
          <span className="text-xs font-semibold text-gray-500 uppercase">Before</span>
          <p className="text-sm text-gray-700">{testimonial.beforeState}</p>
        </div>
        <div>
          <span className="text-xs font-semibold text-emerald-600 uppercase">After</span>
          <p className="text-sm text-gray-900 font-medium">{testimonial.afterState}</p>
        </div>
      </div>

      {/* Quote */}
      <p className="text-gray-700 leading-relaxed flex-1">
        "{testimonial.quote}"
      </p>
    </blockquote>
  )
}

// Stat Card Component
function StatCard({ label, before, after }: { label: string; before: string; after: string }) {
  return (
    <div className="text-center">
      <p className="text-xs font-semibold text-gray-600 uppercase mb-3">{label}</p>
      <div className="text-sm text-gray-500 mb-1 line-through">{before}</div>
      <div className="text-lg font-bold text-emerald-600">{after}</div>
    </div>
  )
}
