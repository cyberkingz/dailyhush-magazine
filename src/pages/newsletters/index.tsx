import { Link } from 'react-router-dom'
import { newsletterEditions } from '@/content/newsletters'
import { Mail, Users, Award, TrendingUp, Clock, Eye, Share2, ArrowRight, Calendar } from 'lucide-react'
import NewsletterInlineForm from '@/components/NewsletterInlineForm'
import { NewsletterCTA } from '@/components/NewsletterCTA'

export default function NewslettersArchive() {
  const editions = [...newsletterEditions].sort((a, b) => (a.date < b.date ? 1 : -1))
  const latest = editions.slice(0, 3)

  return (
    <main className="py-10 min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-yellow-50 via-amber-50 to-orange-50 py-20 px-6 mb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(250,204,21,0.1)_50%,transparent_75%)] animate-pulse"></div>
        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-5 py-2 rounded-full text-sm font-semibold text-amber-700 mb-8 shadow-md border border-amber-200">
            <Award className="w-4 h-4" />
            <span>Trusted by 50,000+ Beauty Insiders</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            DailyHush Newsletter
            <span className="block text-transparent bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text">
              Archive
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 mb-10 max-w-3xl mx-auto leading-relaxed">
            Evidence-based beauty, wellness, and lifestyle insights. No fluff, no sponsored content - just tested truths from our team of beauty experts.
          </p>
          
          <div className="flex flex-wrap justify-center gap-8 mb-10">
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur px-4 py-3 rounded-full shadow-sm">
              <Users className="w-6 h-6 text-amber-600" />
              <span className="font-semibold text-gray-900">50,000+ Subscribers</span>
            </div>
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur px-4 py-3 rounded-full shadow-sm">
              <Mail className="w-6 h-6 text-amber-600" />
              <span className="font-semibold text-gray-900">Weekly Edition</span>
            </div>
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur px-4 py-3 rounded-full shadow-sm">
              <TrendingUp className="w-6 h-6 text-amber-600" />
              <span className="font-semibold text-gray-900">92% Open Rate</span>
            </div>
          </div>
          
          <div className="mt-8 max-w-xl mx-auto">
            <NewsletterInlineForm sourcePage="newsletter-archive" />
          </div>
        </div>
      </div>


      {/* Newsletter Archive Grid */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Latest 3 Editions
            </h2>
            <p className="text-lg text-gray-600">Our three most recent newsletters</p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>Publishing weekly since 2023</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {latest.map((n) => (
            <article 
              key={n.slug} 
              className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
            >
              <Link to={`/newsletters/${n.slug}`} className="block">
                {/* Image Container */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                  {n.heroImage ? (
                    <img 
                      src={n.heroImage} 
                      alt={n.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-yellow-100 to-amber-200 flex items-center justify-center">
                      <Mail className="w-12 h-12 text-amber-600" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent group-hover:from-black/20 transition-colors"></div>
                  
                  {/* Floating badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-2 py-1 rounded-lg text-xs font-medium shadow-sm">
                      5 min read
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{n.displayDate}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>47K opens</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-amber-600 transition-colors line-clamp-2">
                    {n.title}
                  </h3>
                  
                  <p className="text-gray-700 mb-4 leading-relaxed line-clamp-3">
                    {n.summary}
                  </p>
                  
                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-amber-600 font-semibold group-hover:text-amber-700 transition-colors">
                      <span>Read Edition</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Share2 className="w-3 h-3" />
                      <span>2.3K</span>
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
        
        {/* Load More Button (for future use) */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            That's all for now! New editions every Monday.
          </p>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-6 mb-20">
        <NewsletterCTA centered />
        <p className="text-sm text-gray-600 mt-4 flex items-center justify-center gap-2">
          <Clock className="w-4 h-4" />
          <span>Delivered every Monday at 7am EST</span>
        </p>
      </section>
    </main>
  )
}
