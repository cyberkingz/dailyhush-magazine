import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users } from 'lucide-react'
// import NewsletterInlineForm from '@/components/NewsletterInlineForm'
import ProblemRecognitionSection from '../components/home/ProblemRecognitionSection'
import FireProtocolSection from '../components/home/FireProtocolSection'
import FinalCTASection from '../components/home/FinalCTASection'
import { HomeBlogSection } from '@/components/home/HomeBlogSection'
import { homeBlogPosts } from '@/data/homeBlogPosts'
import { ReviewsSection } from '@/components/product/common/ReviewsSection'
import { quizReviews } from '@/data/quizReviews'

export default function Home() {
  useEffect(() => { document.title = 'DailyHush — Stop Overthinking & Quiet Your Mind' }, [])

  // Home page does not feature a specific edition anymore

  const homepageReviews = quizReviews.slice(0, 6)
  const homepageAverageRating = 4.9
  const homepageTotalReviews = 12700

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-50/80 via-emerald-50/50 to-amber-50/30 relative overflow-hidden">
        {/* Organic Background Blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 -left-40 w-96 h-96 bg-emerald-500/8 rounded-full blur-3xl"></div>
          <div className="absolute top-60 right-20 w-80 h-80 bg-amber-500/8 rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 left-1/3 w-72 h-72 bg-emerald-400/8 rounded-full blur-3xl"></div>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-20 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border-2 border-amber-500/40 text-amber-900 px-4 py-2 rounded-full text-sm font-bold mb-6 backdrop-blur-xl ring-1 ring-white/40 shadow-[0_4px_16px_rgba(245,158,11,0.15)]">
              <Users className="w-4 h-4" />
              <span>Join 50,000+ Women Who Finally Quieted Their Minds</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-emerald-900 mb-6 leading-tight md:leading-none">
              You're Not Broken.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-600">
                You're Just Overthinking Wrong.
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-emerald-800 max-w-3xl mx-auto mb-8 leading-relaxed">
              It's 2 AM. Eyes open. Replaying that conversation. Again.
            </p>

            <p className="text-lg text-emerald-700/80 max-w-3xl mx-auto mb-8">
              You've tried meditation apps, therapy, positive thinking. Nothing works because you're using the wrong METHOD. 847 women discovered the F.I.R.E. framework and stopped spiraling in 7 days.
            </p>

            <div className="max-w-xl mx-auto">
              <Link
                to="/quiz"
                className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-bold px-10 py-4 rounded-full transition-all shadow-[0_4px_20px_rgba(245,158,11,0.4)] hover:shadow-[0_6px_28px_rgba(245,158,11,0.5)] hover:scale-105 active:scale-95 text-lg"
              >
                Take the Free Quiz →
              </Link>

              {/* Original email opt-in form - commented out because users should take quiz first
              <NewsletterInlineForm
                sourcePage="home-hero"
                buttonLabel="Take Quiz →"
                showSparkLoop={true}
                redirectOnSuccess={true}
              />
              */}
            </div>

            <div className="text-sm text-emerald-700/70 mt-4 space-y-1 max-w-xl mx-auto text-center">
              <p>✓ Free 60-second quiz  ✓ Your overthinker type  ✓ The F.I.R.E. protocol that works</p>
            </div>
          </div>
        </div>
      </section>

      {/* New Home Page Sections */}
      <ProblemRecognitionSection />
      <FireProtocolSection />
      <HomeBlogSection posts={homeBlogPosts} />
      <ReviewsSection
        reviews={homepageReviews}
        averageRating={homepageAverageRating}
        totalReviews={homepageTotalReviews}
        title="What DailyHush Women Say After Practicing F.I.R.E."
        backgroundColor="bg-gradient-to-b from-white via-emerald-50/40 to-white"
      />
      <FinalCTASection />

      {/* <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Latest 3 Editions</h2>
            <p className="text-gray-600 mt-2">A quick snapshot of our most recent newsletters.</p>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-16">
          {newsletterEditions
            .slice()
            .sort((a, b) => (a.date < b.date ? 1 : -1))
            .slice(0, 3)
            .map((n) => (
              <Link key={n.slug} to={`/newsletter/${n.slug}`} className="block group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition">
                {n.heroImage && (
                  <div className="h-48 w-full overflow-hidden">
                    <img src={n.heroImage} alt={n.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                    <span>{n.displayDate}</span>
                    <span>•</span>
                    <span>5 min read</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition">{n.title}</h3>
                  <p className="text-gray-700 line-clamp-3">{n.summary}</p>
                </div>
              </Link>
          ))}
        </div> 


        <div className="max-w-4xl mx-auto">
          <NewsletterCTA centered showSparkLoop={true} redirectOnSuccess={false} />
        </div> 

      </section>  */}
      
    </>
  )
}
