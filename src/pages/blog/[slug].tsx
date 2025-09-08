import { useParams, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { NewsletterCTA } from '@/components/NewsletterCTA'

const articleContent: Record<string, {
  title: string
  excerpt: string
  content: string
  category: string
  author: string
  date: string
  readTime: string
  imageUrl: string
}> = {
  'morning-rituals-that-transform-your-day': {
    title: 'Morning Rituals That Transform Your Day',
    excerpt: 'Discover science-backed morning routines that boost productivity and mental clarity for the entire day.',
    category: 'Wellness',
    author: 'Sarah Chen',
    date: 'Jan 8, 2025',
    readTime: '5 min read',
    imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&h=900&q=80',
    content: `
      <p>The way you start your morning sets the tone for your entire day. While scrolling through your phone might feel like an easy wake-up routine, science shows that intentional morning rituals can dramatically improve your productivity, mood, and overall well-being.</p>

      <h2>The Science of Morning Routines</h2>
      <p>Research from neuroscientists at Stanford University reveals that our brains are most receptive to positive habit formation within the first hour of waking. This "neuroplasticity window" makes morning routines particularly powerful for creating lasting change.</p>

      <p>When we engage in consistent morning practices, we activate our prefrontal cortex—the brain's command center for decision-making and emotional regulation. This early activation helps us maintain better focus and emotional stability throughout the day.</p>

      <h2>Five Essential Morning Rituals</h2>
      
      <h3>1. Hydration Before Caffeine</h3>
      <p>After 7-8 hours without water, your body is naturally dehydrated. Starting with 16-24 ounces of room temperature water kickstarts your metabolism and helps flush out toxins. Add a pinch of sea salt and lemon for enhanced mineral absorption.</p>

      <h3>2. Movement and Breath</h3>
      <p>You don't need an hour-long workout to reap the benefits of morning movement. Even 5-10 minutes of gentle stretching or yoga can increase blood flow, reduce cortisol levels, and improve mental clarity. Pair this with deep breathing exercises to oxygenate your brain and body.</p>

      <h3>3. Mindfulness Practice</h3>
      <p>Whether it's meditation, journaling, or simply sitting in silence, taking time for mindfulness helps center your thoughts and intentions for the day. Studies show that just 10 minutes of daily meditation can reduce anxiety by up to 40%.</p>

      <h3>4. Natural Light Exposure</h3>
      <p>Getting sunlight within the first 30 minutes of waking regulates your circadian rhythm, improving both daytime alertness and nighttime sleep quality. Even on cloudy days, outdoor light is significantly brighter than indoor lighting.</p>

      <h3>5. Intentional Planning</h3>
      <p>Before diving into emails or social media, take 5 minutes to review your priorities for the day. Write down your top three tasks and visualize yourself completing them successfully.</p>

      <h2>Making It Stick</h2>
      <p>The key to establishing a morning routine is starting small. Choose one or two practices and commit to them for 21 days before adding more. Remember, the goal isn't perfection—it's progress.</p>

      <p>Track your morning routine in a simple journal, noting how you feel after each practice. This awareness will reinforce the positive benefits and help you stay motivated during the habit-forming process.</p>

      <blockquote>
        <p>"How you spend your morning determines how you spend your day, and how you spend your days determines how you spend your life."</p>
      </blockquote>

      <p>Your morning routine is a gift you give yourself—a sacred time to align your mind, body, and spirit before the demands of the day take over. Start tomorrow with just one new ritual, and watch how it transforms not just your mornings, but your entire life.</p>
    `
  },
  'the-clean-beauty-revolution': {
    title: 'The Clean Beauty Revolution',
    excerpt: 'Understanding ingredient transparency and how to build a sustainable, effective skincare routine.',
    category: 'Beauty',
    author: 'Emma Rodriguez',
    date: 'Jan 7, 2025',
    readTime: '6 min read',
    imageUrl: 'https://images.unsplash.com/photo-1514136649217-b627b4b9cfb2?auto=format&fit=crop&w=1600&h=900&q=80',
    content: `
      <p>The beauty industry is experiencing a seismic shift. Consumers are no longer satisfied with products that merely promise results—they want to know exactly what they're putting on their skin and how it impacts both their health and the environment.</p>

      <h2>What Is Clean Beauty?</h2>
      <p>Clean beauty isn't just a trend; it's a movement toward transparency, sustainability, and efficacy. It means products formulated without ingredients shown or suspected to harm human health or the environment.</p>

      <p>However, "clean" isn't a regulated term, which means brands can interpret it differently. This makes it crucial for consumers to understand ingredients and make informed choices.</p>

      <h2>Ingredients to Embrace</h2>
      <p>Nature and science can work together beautifully. Look for these powerhouse ingredients that deliver results without compromise:</p>
      
      <ul>
        <li><strong>Niacinamide:</strong> Brightens, minimizes pores, and strengthens the skin barrier</li>
        <li><strong>Hyaluronic Acid:</strong> Holds up to 1000x its weight in water for deep hydration</li>
        <li><strong>Bakuchiol:</strong> A plant-based retinol alternative that's gentle yet effective</li>
        <li><strong>Squalane:</strong> Lightweight moisturizer that mimics skin's natural oils</li>
      </ul>

      <h2>Building Your Clean Routine</h2>
      <p>Creating an effective clean beauty routine doesn't mean sacrificing performance. Focus on these essentials:</p>

      <h3>Morning Routine</h3>
      <p>Keep it simple: gentle cleanser, antioxidant serum (vitamin C), moisturizer, and SPF. This combination protects against environmental stressors while maintaining skin health.</p>

      <h3>Evening Routine</h3>
      <p>This is when your skin repairs itself. Double cleanse to remove sunscreen and makeup, apply targeted treatments (retinol alternatives, acids), and finish with a nourishing moisturizer.</p>

      <h2>The Future is Transparent</h2>
      <p>As consumers become more educated, brands are responding with greater transparency. QR codes on packaging now link to complete ingredient breakdowns, sourcing information, and clinical study results.</p>

      <p>The clean beauty revolution isn't about perfection—it's about making better choices for our skin and our planet, one product at a time.</p>
    `
  },
  'ai-tools-that-actually-save-time': {
    title: 'AI Tools That Actually Save Time',
    excerpt: 'A curated list of AI-powered tools that deliver on their promises and integrate seamlessly into your workflow.',
    category: 'Tech',
    author: 'Marcus Johnson',
    date: 'Jan 6, 2025',
    readTime: '7 min read',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&h=900&q=80',
    content: `
      <p>In a world flooded with AI tools promising to revolutionize your workflow, it's hard to separate genuine time-savers from overhyped distractions. After testing dozens of AI tools over the past year, here are the ones that actually deliver measurable productivity gains.</p>

      <h2>Writing and Communication</h2>
      
      <h3>Claude for Deep Work</h3>
      <p>While ChatGPT gets the headlines, Claude excels at nuanced writing tasks. Its ability to maintain context over long conversations makes it ideal for complex projects like research papers, technical documentation, and creative writing.</p>

      <h3>Grammarly's AI Editor</h3>
      <p>Beyond basic grammar checking, Grammarly's AI now offers tone adjustments, clarity improvements, and even helps maintain consistent voice across documents. The enterprise version learns your company's style guide.</p>

      <h2>Visual and Design</h2>
      
      <h3>Midjourney for Rapid Prototyping</h3>
      <p>Designers are using Midjourney not as a replacement for creativity, but as a brainstorming partner. Generate 20 concept variations in minutes, then refine the best ones manually.</p>

      <h3>Canva's Magic Studio</h3>
      <p>The AI-powered design suggestions and automatic resizing features save hours of manual work. Perfect for maintaining brand consistency across multiple platforms.</p>

      <h2>Productivity and Organization</h2>
      
      <h3>Notion AI</h3>
      <p>Integrated directly into your workspace, Notion AI can summarize meeting notes, generate action items, and even write first drafts based on your outlines. The key is its contextual awareness of your existing content.</p>

      <h3>Reclaim.ai for Calendar Management</h3>
      <p>This tool automatically schedules your tasks around meetings, protects focus time, and even reschedules based on priority changes. Users report saving 5+ hours per week on calendar management alone.</p>

      <h2>Development and Coding</h2>
      
      <h3>GitHub Copilot</h3>
      <p>More than just autocomplete, Copilot understands context and can write entire functions based on comments. Developers report 30-50% faster coding for routine tasks.</p>

      <h2>The Integration Factor</h2>
      <p>The most valuable AI tools are those that integrate seamlessly into your existing workflow. A tool that requires you to change your entire process rarely provides net time savings.</p>

      <blockquote>
        <p>"The best AI tool is the one you actually use consistently."</p>
      </blockquote>

      <h2>Looking Forward</h2>
      <p>As AI tools mature, the focus is shifting from impressive demos to practical integration. The winners will be tools that enhance human capabilities rather than trying to replace them.</p>

      <p>Start with one tool that addresses your biggest time sink. Master it before adding others. Remember, the goal isn't to use AI everywhere—it's to use it where it genuinely improves your output or frees up time for more meaningful work.</p>
    `
  }
}

// Default content for any slug not in our content map
const defaultContent = {
  title: 'Article Not Found',
  excerpt: 'The article you\'re looking for is coming soon.',
  category: 'General',
  author: 'DailyHush Team',
  date: 'Jan 2025',
  readTime: '5 min read',
  imageUrl: 'https://images.unsplash.com/photo-1468779036391-52341f60b55d?auto=format&fit=crop&w=1600&h=900&q=80',
  content: `
    <p>We're working on bringing you this content. In the meantime, check out our other articles for daily insights on wellness, beauty, and technology.</p>
    <p>Our team of writers is constantly creating new content to keep you informed and inspired. Subscribe to our newsletter to be the first to know when new articles are published.</p>
  `
}

export default function BlogDetail() {
  const { slug } = useParams()
  const article = slug ? (articleContent[slug] || { ...defaultContent, title: `Article: ${slug}` }) : defaultContent

  useEffect(() => {
    document.title = `${article.title} — DailyHush`
    window.scrollTo(0, 0)
  }, [article.title])

  return (
    <>
      {/* Article Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <Link to="/blog" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to articles
          </Link>
          
          <div className="flex items-center gap-3 text-sm text-gray-600 mb-4">
            <span className="uppercase tracking-wide font-semibold text-yellow-600">{article.category}</span>
            <span className="text-gray-400">•</span>
            <span>{article.date}</span>
            <span className="text-gray-400">•</span>
            <span>{article.readTime}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{article.title}</h1>
          <p className="text-xl text-gray-600 mb-6">{article.excerpt}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div>
                <p className="font-medium text-gray-900">{article.author}</p>
                <p className="text-sm text-gray-600">Contributing Writer</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="rounded-2xl overflow-hidden bg-gray-100">
          <img 
            src={article.imageUrl} 
            alt={article.title}
            className="w-full h-[400px] md:h-[500px] object-cover"
          />
        </div>
      </div>

      {/* Article Content */}
      <article className="mx-auto max-w-4xl px-6 py-12">
        <div 
          className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-yellow-600 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-yellow-400 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-600 prose-ul:text-gray-700 prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>

      {/* Newsletter CTA */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-4xl px-6">
          <NewsletterCTA variant="article" centered />
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">More stories you might like</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <article className="group">
              <div className="aspect-[16/9] bg-gray-100 rounded-xl overflow-hidden mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&h=450&q=60" 
                  alt="Related article"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-bold text-lg text-gray-900 group-hover:text-gray-700 transition-colors">The Power of Afternoon Breaks</h3>
              <p className="text-gray-600 mt-2">Why stepping away from your desk might be the productivity hack you need.</p>
            </article>
            
            <article className="group">
              <div className="aspect-[16/9] bg-gray-100 rounded-xl overflow-hidden mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1487412912498-0447578fcca8?auto=format&fit=crop&w=800&h=450&q=60" 
                  alt="Related article"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-bold text-lg text-gray-900 group-hover:text-gray-700 transition-colors">Sustainable Beauty Swaps</h3>
              <p className="text-gray-600 mt-2">Easy changes that reduce waste without sacrificing your routine.</p>
            </article>
            
            <article className="group">
              <div className="aspect-[16/9] bg-gray-100 rounded-xl overflow-hidden mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&h=450&q=60" 
                  alt="Related article"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-bold text-lg text-gray-900 group-hover:text-gray-700 transition-colors">Remote Work Tech Essentials</h3>
              <p className="text-gray-600 mt-2">The tools and gadgets that make working from home actually work.</p>
            </article>
          </div>
        </div>
      </section>
    </>
  )
}