type NewsletterCTAProps = {
  variant?: 'default' | 'article'
  centered?: boolean
}

export function NewsletterCTA({ variant = 'default', centered = false }: NewsletterCTAProps) {
  const isArticle = variant === 'article'
  
  return (
    <div className={`rounded-2xl p-8 md:p-10 bg-yellow-50 border border-yellow-200 ${centered ? 'text-center' : ''}`}>
      <div className={centered ? 'max-w-2xl mx-auto' : 'max-w-2xl'}>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          {isArticle ? 'Enjoyed this article?' : 'Stay in the loop'}
        </h2>
        <p className="text-base md:text-lg text-gray-600 mt-2 md:mt-3">
          {isArticle 
            ? 'Get more insights delivered to your inbox weekly.'
            : 'Subscribe to our newsletter for weekly insights.'}
        </p>
        <form className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
          <input 
            className="border border-gray-300 px-5 py-3 rounded-full w-full bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-900 placeholder-gray-500" 
            placeholder="you@example.com" 
            type="email"
            required
          />
          <button 
            type="submit" 
            className="bg-yellow-400 text-black font-semibold px-6 sm:px-8 py-3 rounded-full hover:bg-yellow-300 transition-colors w-full sm:w-auto"
          >
            Subscribe
          </button>
        </form>
        <p className="text-sm text-gray-500 mt-4">
          Join 10,000+ readers. No spam, unsubscribe anytime.
        </p>
      </div>
    </div>
  )
}