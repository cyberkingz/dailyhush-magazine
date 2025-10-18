import { Star, Quote } from 'lucide-react'

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

const avatarColorClasses = {
  emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  amber: 'bg-amber-100 text-amber-700 border-amber-200',
  rose: 'bg-rose-100 text-rose-700 border-rose-200'
}

export default function TestimonialsSection() {
  return (
    <section
      className="relative overflow-hidden py-16 md:py-20 lg:py-24 bg-gradient-to-br from-white via-emerald-50/30 to-amber-50/20"
      aria-labelledby="testimonials-heading"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-40 right-20 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2
            id="testimonials-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-emerald-900 mb-4"
          >
            From 72 Hours of Replay to Moving On in 90 Seconds
          </h2>
          <p className="text-lg md:text-xl text-emerald-700 max-w-3xl mx-auto">
            Real stories from women who spent years punishing themselves for existing—until they learned to interrupt the pattern.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid gap-6 lg:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="mt-16 bg-gradient-to-br from-emerald-50 to-amber-50/30 rounded-2xl p-8 border border-emerald-200">
          <h3 className="text-2xl font-bold text-emerald-900 mb-6 text-center">
            Average Results After F.I.R.E. Training
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
    <blockquote
      className="relative bg-white/70 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-emerald-200/40 hover:border-emerald-400/60 hover:shadow-lg transition-all duration-300 h-full flex flex-col"
    >
      {/* Decorative quote mark */}
      <Quote className="absolute top-4 right-4 w-16 h-16 text-amber-400/20" aria-hidden="true" />

      {/* Avatar and name */}
      <div className="flex items-center gap-4 mb-4 relative z-10">
        <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center text-xl font-bold ${avatarColorClasses[testimonial.avatarColor]}`}>
          {testimonial.name.charAt(0)}
        </div>
        <div>
          <cite className="text-lg font-bold text-emerald-900 not-italic">
            {testimonial.name}
          </cite>
          <p className="text-sm text-emerald-600">{testimonial.role}, {testimonial.age}</p>
        </div>
      </div>

      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" aria-hidden="true" />
        ))}
        <span className="sr-only">{testimonial.rating} out of 5 stars</span>
      </div>

      {/* Before/After tags */}
      <div className="space-y-2 mb-4">
        <div className="flex items-start gap-2">
          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded shrink-0">
            Before
          </span>
          <p className="text-sm text-gray-700 flex-1">{testimonial.beforeState}</p>
        </div>
        <div className="flex items-start gap-2">
          <span className="inline-block px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded shrink-0">
            After
          </span>
          <p className="text-sm text-emerald-700 font-medium flex-1">{testimonial.afterState}</p>
        </div>
      </div>

      {/* Quote */}
      <p className="text-emerald-800 leading-relaxed italic flex-1">
        "{testimonial.quote}"
      </p>
    </blockquote>
  )
}

// Stat Card Component
function StatCard({ label, before, after }: { label: string; before: string; after: string }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-emerald-200/50">
      <p className="text-xs font-semibold text-emerald-600 uppercase mb-2">{label}</p>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-500 line-through">{before}</span>
        <span className="text-emerald-600">→</span>
        <span className="text-emerald-700 font-bold">{after}</span>
      </div>
    </div>
  )
}
