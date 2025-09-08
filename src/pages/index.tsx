import { useEffect, useState } from 'react'
import { PostCard } from '@/components/blog/PostCard'
import { NewsletterCTA } from '@/components/NewsletterCTA'

const categories = ['All', 'Wellness','Beauty','Tech'] as const

// Curated Unsplash photo IDs per category to avoid broken Source endpoints
const UNSPLASH_IDS: Record<Exclude<(typeof categories)[number], 'All'>, string[]> = {
  Wellness: [
    '1469474968028-56623f02e42e', // yoga mat
    '1515378791036-0648a3ef77b2', // stones spa
    '1515378791036-0d3b09c62f6f', // candles spa
  ],
  Beauty: [
    '1514136649217-b627b4b9cfb2', // skincare flatlay
    '1487412912498-0447578fcca8', // makeup brushes
    '1519861531473-9200262188bf', // cosmetics
  ],
  Tech: [
    '1498050108023-c5249f4df085', // code laptop
    '1518770660439-4636190af475', // gadgets desk
    '1519389950473-47ba0277781c', // ai abstract
  ],
}

function unsplashUrl(id: string) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&h=450&q=60`;
}

const demoPosts = [
  {
    id: 1,
    title: 'Morning Rituals That Transform Your Day',
    excerpt: 'Discover science-backed morning routines that boost productivity and mental clarity for the entire day.',
    category: 'Wellness' as const,
    author: 'Sarah Chen',
    date: 'Jan 8, 2025',
    imageUrl: unsplashUrl(UNSPLASH_IDS.Wellness[0]),
  },
  {
    id: 2,
    title: 'The Clean Beauty Revolution',
    excerpt: 'Understanding ingredient transparency and how to build a sustainable, effective skincare routine.',
    category: 'Beauty' as const,
    author: 'Emma Rodriguez',
    date: 'Jan 7, 2025',
    imageUrl: unsplashUrl(UNSPLASH_IDS.Beauty[0]),
  },
  {
    id: 3,
    title: 'AI Tools That Actually Save Time',
    excerpt: 'A curated list of AI-powered tools that deliver on their promises and integrate seamlessly into your workflow.',
    category: 'Tech' as const,
    author: 'Marcus Johnson',
    date: 'Jan 6, 2025',
    imageUrl: unsplashUrl(UNSPLASH_IDS.Tech[0]),
  },
  {
    id: 4,
    title: 'The Art of Digital Detox',
    excerpt: 'Practical strategies for reducing screen time without sacrificing productivity or connection.',
    category: 'Wellness' as const,
    author: 'DailyHush Team',
    date: 'Jan 5, 2025',
    imageUrl: unsplashUrl(UNSPLASH_IDS.Wellness[1]),
  },
  {
    id: 5,
    title: 'Minimalist Makeup for Maximum Impact',
    excerpt: 'Master the five-minute face that takes you from desk to dinner with effortless elegance.',
    category: 'Beauty' as const,
    author: 'Lisa Park',
    date: 'Jan 4, 2025',
    imageUrl: unsplashUrl(UNSPLASH_IDS.Beauty[1]),
  },
  {
    id: 6,
    title: 'Privacy-First Browsing in 2025',
    excerpt: 'Essential tools and techniques to protect your digital footprint without compromising convenience.',
    category: 'Tech' as const,
    author: 'Alex Thompson',
    date: 'Jan 3, 2025',
    imageUrl: unsplashUrl(UNSPLASH_IDS.Tech[1]),
  },
]

export default function Home() {
  useEffect(() => { document.title = 'DailyHush — Your Daily Dose of Insights' }, [])
  const [selectedCategory, setSelectedCategory] = useState<typeof categories[number]>('All')
  
  const filteredPosts = selectedCategory === 'All' 
    ? demoPosts 
    : demoPosts.filter(post => post.category === selectedCategory)

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-yellow-50 to-white">
        <div className="mx-auto max-w-7xl px-6 py-16 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Your daily dose of curated insights
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Thoughtfully selected content about wellness, beauty, and technology to keep you informed and inspired.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        {/* Category Filter */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Latest stories</h2>
              <p className="text-gray-600 mt-2">Fresh perspectives delivered daily</p>
            </div>
          </div>
          
          <div className="flex gap-3 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-yellow-400 text-black'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-16">
          {filteredPosts.map((p) => (
            <PostCard key={p.id} title={p.title} excerpt={p.excerpt} category={p.category} author={p.author} date={p.date} imageUrl={p.imageUrl} />
          ))}
        </div>

        {/* Newsletter CTA */}
        <div className="max-w-4xl mx-auto">
          <NewsletterCTA centered />
        </div>
      </section>
    </>
  )
}
