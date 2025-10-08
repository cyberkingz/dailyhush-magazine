import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users } from 'lucide-react'
import NewsletterInlineForm from '@/components/NewsletterInlineForm'

export default function Home() {
  useEffect(() => { document.title = 'DailyHush — Stop Overthinking & Quiet Your Mind' }, [])

  // Home page does not feature a specific edition anymore

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full text-sm font-semibold text-amber-600 mb-6">
              <Users className="w-4 h-4" />
              <span>Join 50,000+ Women Who Finally Quieted Their Minds</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight md:leading-none">
              You're Not Broken.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-500">
                You're Just Overthinking Wrong.
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed">
              It's 2 AM. Eyes open. Replaying that conversation. Again.
            </p>

            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              You've tried meditation apps, therapy, positive thinking. Nothing works because you're using the wrong METHOD. 847 women discovered the F.I.R.E. framework and stopped spiraling in 7 days.
            </p>

            <div className="max-w-xl mx-auto">
              <NewsletterInlineForm
                sourcePage="home-hero"
                buttonLabel="Take Quiz →"
                showSparkLoop={true}
                redirectOnSuccess={true}
              />
            </div>

            <div className="text-sm text-gray-500 mt-4 space-y-1 max-w-xl mx-auto text-center">
              <p>✓ Free 60-second quiz  ✓ Your overthinker type  ✓ The F.I.R.E. protocol that works</p>
              <p className="text-xs"><Link to="/privacy" className="underline underline-offset-2 hover:text-gray-700">Privacy Policy</Link> • Unsubscribe anytime</p>
            </div>
          </div>
        </div>
      </section>



      
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
