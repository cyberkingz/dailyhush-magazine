import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PostCard } from '@/components/blog/PostCard'
import { NewsletterCTA } from '@/components/NewsletterCTA'
import { Users } from 'lucide-react'
import NewsletterInlineForm from '@/components/NewsletterInlineForm'

const categories = ['All', 'Wellness','Beauty','Tech'] as const

function unsplashUrl(id: string) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&h=450&q=60`;
}

const demoPosts = [
  // Beauty & Wellness posts
  {
    id: 1,
    title: 'The Rise of AI in Skincare: Can Algorithms Replace Dermatologists?',
    excerpt: 'Exploring how artificial intelligence is revolutionizing skin analysis and personalized treatment recommendations.',
    category: 'Beauty' as const,
    author: 'DailyHush Editorial Team',
    date: 'Jan 10, 2025',
    imageUrl: unsplashUrl('1556228720-195a672e8a03'),
  },
  {
    id: 2,
    title: 'Top 5 Beauty Gadgets of 2025 That Actually Work',
    excerpt: 'Cut through the hype with our expert review of this year\'s most effective beauty technology devices.',
    category: 'Beauty' as const,
    author: 'DailyHush Editorial Team',
    date: 'Jan 9, 2025',
    imageUrl: unsplashUrl('1596462502278-27bfdc403348'),
  },
  {
    id: 3,
    title: 'The Science Behind Red Light Therapy for Skin Health',
    excerpt: 'Understanding the clinical research supporting LED light therapy for anti-aging and skin repair.',
    category: 'Wellness' as const,
    author: 'DailyHush Editorial Team',
    date: 'Jan 8, 2025',
    imageUrl: unsplashUrl('1571019613454-1cb2f99b2d8b'),
  },
  {
    id: 4,
    title: 'How Wearable Tech Is Transforming Fitness and Wellness',
    excerpt: 'From smartwatches to biometric rings, discover how wearables are changing personal health monitoring.',
    category: 'Tech' as const,
    author: 'DailyHush Editorial Team',
    date: 'Jan 7, 2025',
    imageUrl: unsplashUrl('1544367567-0f2fcb009e0b'),
  },
  {
    id: 5,
    title: 'Daily Habits for Clearer Skin: Backed by Science',
    excerpt: 'Evidence-based lifestyle changes that dermatologists recommend for healthier, clearer skin.',
    category: 'Beauty' as const,
    author: 'DailyHush Editorial Team',
    date: 'Jan 6, 2025',
    imageUrl: unsplashUrl('1515377905703-c4788e51af15'),
  },
  // Fashion & Lifestyle posts
  {
    id: 6,
    title: 'Apple Watch as a Fashion Accessory: Style Meets Tech',
    excerpt: 'How the Apple Watch evolved from gadget to statement piece and what your band choice says about you.',
    category: 'Tech' as const,
    author: 'Alexandra Sterling',
    date: 'Jan 5, 2025',
    imageUrl: unsplashUrl('1434493789847-2f02dc6ca35d'),
  },
  {
    id: 7,
    title: 'The Future of Smart Jewelry: Fashion or Function?',
    excerpt: 'Exploring the collision between luxury jewelry and cutting-edge technology in wearable accessories.',
    category: 'Beauty' as const,
    author: 'Victoria Chen-Martinez',
    date: 'Jan 4, 2025',
    imageUrl: unsplashUrl('1515562141207-7a88fb7ce338'),
  },
  {
    id: 8,
    title: 'Top 10 Wellness Trends Dominating Instagram in 2025',
    excerpt: 'From cold plunge therapy to biohacking supplements, which trends are worth your attention and money.',
    category: 'Wellness' as const,
    author: 'Marcus Chen',
    date: 'Jan 3, 2025',
    imageUrl: unsplashUrl('1469474968028-56623f02e42e'),
  },
  {
    id: 9,
    title: 'How Retro Fitness Culture Is Making a Comeback',
    excerpt: 'Why 80s aerobics and Jane Fonda workouts are trending again in our high-tech fitness world.',
    category: 'Wellness' as const,
    author: 'Jamie Rodriguez',
    date: 'Jan 2, 2025',
    imageUrl: unsplashUrl('1518611012118-696072aa579a'),
  },
  // Health & Performance posts  
  {
    id: 10,
    title: 'Biohacking 101: Easy Ways to Upgrade Your Daily Routine',
    excerpt: 'Discover simple, science-backed biohacks that can transform your energy, focus, and overall performance.',
    category: 'Wellness' as const,
    author: 'Marcus Rodriguez',
    date: 'Jan 1, 2025',
    imageUrl: unsplashUrl('1515378791036-0648a3ef77b2'),
  },
  {
    id: 11,
    title: 'Can AI Track Your Stress Levels? The Future of Mental Wellness Apps',
    excerpt: 'How artificial intelligence is revolutionizing stress detection and mental health monitoring.',
    category: 'Tech' as const,
    author: 'Dr. Samantha Liu',
    date: 'Dec 31, 2024',
    imageUrl: unsplashUrl('1559757148-5c350d0d3c56'),
  },
  {
    id: 12,
    title: 'The Best Sleep Tech Devices of 2025 (That Actually Work)',
    excerpt: 'Cut through the marketing hype with our evidence-based review of sleep optimization technology.',
    category: 'Tech' as const,
    author: 'Dr. Michael Chen',
    date: 'Dec 30, 2024',
    imageUrl: unsplashUrl('1541781774459-bb2af2f05b55'),
  },
]

export default function Home() {
  useEffect(() => { document.title = 'DailyHush — Your Daily Dose of Insights' }, [])
  const [selectedCategory, setSelectedCategory] = useState<typeof categories[number]>('All')
  
  const filteredPosts = selectedCategory === 'All' 
    ? demoPosts 
    : demoPosts.filter(post => post.category === selectedCategory)

  // Home page does not feature a specific edition anymore

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full text-sm font-semibold text-amber-600 mb-6">
              <Users className="w-4 h-4" />
              <span>Trusted by 50,000+ Beauty Insiders</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Evidence-based beauty<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-500">
                without the hype
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Get weekly insights on beauty, wellness, and lifestyle trends. Our expert team tests products, 
              analyzes ingredients, and cuts through marketing fluff to bring you what actually works.
            </p>
            
            <div className="max-w-xl mx-auto">
              <NewsletterInlineForm sourcePage="home-hero" />
            </div>
            
            <div className="text-sm text-gray-500 mt-4 space-y-1 max-w-xl mx-auto text-center">
              <p>By subscribing, you agree to receive our newsletter. You can unsubscribe at any time.</p>
              <p><Link to="/privacy" className="underline underline-offset-2 hover:text-gray-700">See our Privacy Policy</Link></p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Newsletter Section removed */}

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
