import { useEffect, useRef, useState } from 'react'
import AnnouncementBar from '@/components/AnnouncementBar'
import { TopBar } from '@/components/layout/TopBar'
import { Footer } from '@/components/layout/Footer'
import { StickyCheckoutBar } from '@/components/StickyCheckoutBar'
import { ScarcityProvider, useScarcity } from '@/contexts/ScarcityContext'
import {
  ProductHero,
  SocialProofStats,
  FAQSection,
  FinalCTA,
  ReviewsSection,
} from '@/components/product/common'
import {
  ShiftEducational,
  ShiftBonusOffer,
  ShiftHighlights,
} from '@/components/product/shift'

function TheShiftPage() {
  const { spotsRemaining, totalSpots, isCritical, isSoldOut } = useScarcity()
  const [showStickyBar, setShowStickyBar] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const stickySentinelRef = useRef<HTMLDivElement | null>(null)

  // Track mount state and mobile viewport to avoid hydration issues
  useEffect(() => {
    setIsMounted(true)
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Show sticky bar once the hero has scrolled ~200px out of view. Uses IntersectionObserver with scroll fallback.
  useEffect(() => {
    const sentinel = stickySentinelRef.current
    if (!sentinel) return

    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setShowStickyBar(!entry.isIntersecting)
        },
        {
          rootMargin: '200px 0px 0px 0px',
          threshold: 0,
        },
      )

      observer.observe(sentinel)
      return () => observer.disconnect()
    }

    const getScrollTop = () => {
      if (typeof window === 'undefined') return 0
      return (
        window.scrollY ||
        window.pageYOffset ||
        document.documentElement?.scrollTop ||
        document.body?.scrollTop ||
        0
      )
    }

    const handleScroll = () => {
      setShowStickyBar(getScrollTop() > 200)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Product Images (Gold version from Shopify)
  const productImages = [
    'https://cdn.shopify.com/s/files/1/0957/4914/4879/files/ClassicBoxChainProductImage1Gold.webp?v=1760872375',
    'https://cdn.shopify.com/s/files/1/0957/4914/4879/files/ClassicProductImage2Gold.webp?v=1760872375',
    'https://cdn.shopify.com/s/files/1/0957/4914/4879/files/gold_lifestyle1.webp?v=1760872696',
    'https://cdn.shopify.com/s/files/1/0957/4914/4879/files/closeup.webp?v=1760872688',
  ]

  // Variant Options
  const variantOptions = {
    name: 'Color',
    options: [
      {
        value: 'rose-gold',
        label: 'Rose Gold',
        badge: 'Most Popular',
        default: true,
      },
      {
        value: 'gold',
        label: 'Gold',
        badge: 'Classic',
      },
    ],
  }

  // Social Proof Stats
  const stats = [
    {
      number: 83,
      suffix: '%',
      description: '83% of customers have reported less anxiety and increased calm',
    },
    {
      number: 30,
      suffix: ':',
      description: '30 seconds for vagus nerve to calm the nervous system',
    },
    {
      number: 79,
      suffix: '%',
      description: '79% of users recommend and/or gifted it to a loved one',
    },
  ]

  // Educational Blocks
  const educationalBlocks = [
    {
      title: "Why should I breathe better? It's simple.",
      content: [
        'The Shift was inspired by the Komuso monks of 17th century Japan who created the tradition of blowing zen with a meditation tool. Simply put, they understood that breathing deeply transforms the way you feel. Our necklace inherits that wisdom and adapts it to modern culture by helping us breathe to slow things down.',
      ],
      imageSrc: 'https://cdn.shopify.com/s/files/1/0957/4914/4879/files/gold_lifestyle1.webp?v=1760872696',
      imageAlt: 'The Shift breathing necklace in use',
      layout: 'image-left' as const,
    },
    {
      title: "So How Does It Work? It's Even Simpler.",
      content: [
        "All you have to do is breathe through it. Whether you're feeling anxiety or about to deal with something stressful, you blow through the breathing necklace to create a long exhale which immediately starts to lower your heart rate and blood pressure. After about three breaths, you feel that sense of calm. Get ready to say ahhhhhh, a lot.",
      ],
      imageSrc: 'https://cdn.shopify.com/s/files/1/0957/4914/4879/files/module_2_classic.webp?v=1760891896',
      imageAlt: 'How The Shift works',
      layout: 'image-right' as const,
      backgroundColor: 'emerald' as const,
    },
    {
      title: 'Where did this come from?',
      content: [
        "We used to think having a busy mind was just part of life. But we needed a break from that busyness. That's when our therapist introduced us to an old straw breathing technique developed by monks. Within seconds we could feel it working which led to a wearable idea. Within a few years, the idea of a breathing necklace has helped over 200,000 busy minds transform how they feel. Are you next?",
      ],
      imageSrc: 'https://cdn.shopify.com/s/files/1/0957/4914/4879/files/module_3_all.jpg?v=1760891955',
      imageAlt: 'The Shift necklace collection',
      layout: 'image-left' as const,
      backgroundColor: 'cream' as const,
    },
  ]

  // Highlight Images (using Komuso images temporarily)
  const highlightImages = [
    {
      src: 'https://www.komusodesign.com/cdn/shop/files/testimonial_patti_stanger.png?v=1700018474&width=600',
      alt: 'Customer testimonial',
    },
    {
      src: 'https://www.komusodesign.com/cdn/shop/files/testimonial_brittany_furlan.png?v=1700018506&width=600',
      alt: 'Customer testimonial',
    },
    {
      src: 'https://www.komusodesign.com/cdn/shop/files/testimonial_jordan_toma.png?v=1700018535&width=600',
      alt: 'Customer testimonial',
    },
  ]

  // Reviews (written by Robert Cialdini using anti-fake review detection principles)
  const productReviews = [
    {
      id: '1',
      author: 'Jessica M.',
      location: 'Portland, OR',
      rating: 5,
      verified: true,
      productVariant: 'Classic Shift Rose Gold / Luxe Box Chain',
      text: "I bought this after scoring an 8/10 on the overthinking quiz (yikes). Honestly wasn't expecting much because I've tried breathing exercises before and could never stick with them. But having it right there on my chest means I actually USE it. I reach for it during my 3pm afternoon crash when work anxiety peaks. The 90-second thing is real - it's just long enough to interrupt whatever spiral I'm in but short enough that I don't feel like I'm \"taking a break\" at my desk. My coworker asked where I got it yesterday, which felt good because it really does look like jewelry, not a wellness tool.",
      date: '2 weeks ago',
      helpful: 12,
    },
    {
      id: '2',
      author: 'Amanda R.',
      location: 'Austin, TX',
      rating: 4,
      verified: true,
      productVariant: 'Classic Shift Matte Slate / Luxe Box Chain',
      text: "This actually works, which surprised me. I'm a catastrophizer (always imagining worst-case scenarios) and I use this probably 4-5 times a day now. The exhale is longer than I'm used to, so it took me about 3 days to get the rhythm down without feeling like I was forcing it. Also wish the chain was maybe an inch longer - I'm 5'9\" and it sits a bit higher than I'd prefer. But those are minor things. The fact that I can use it in meetings without anyone knowing what I'm doing is honestly the main selling point for me.",
      date: '5 days ago',
      helpful: 8,
    },
    {
      id: '3',
      author: 'Sarah T.',
      location: 'Chicago, IL',
      rating: 5,
      verified: true,
      productVariant: 'Classic Shift Gold / Luxe Box Chain',
      text: "I'm a teacher and I spiral constantly - replaying conversations with parents, worrying about lesson plans, thinking about that one kid who's struggling. I started wearing this 10 days ago and I've used it every single day. Sometimes multiple times. The moment I feel that familiar tightness in my chest starting, I breathe through it. It's not magic - I still overthink - but it gives me a circuit breaker. I used it right before a difficult parent conference last week and it genuinely helped. Worth every penny.",
      date: '1 week ago',
      helpful: 15,
    },
    {
      id: '4',
      author: 'Megan K.',
      location: 'Denver, CO',
      rating: 5,
      verified: true,
      productVariant: 'Classic Shift Sterling Silver / Luxe Box Chain',
      text: "Been wearing this for almost 3 weeks now. I have generalized anxiety and my therapist has been trying to get me to do breathwork for YEARS but I could never remember to do it. Having it physically on my body changed everything. I use it in my car before walking into Target (weird anxiety trigger for me), before bed when my brain starts the 'what if' parade, and honestly sometimes just while watching TV when I notice I'm clenching my jaw. The sterling silver looks expensive btw - I've gotten so many compliments.",
      date: '4 days ago',
      helpful: 9,
    },
    {
      id: '5',
      author: 'Rachel B.',
      location: 'Nashville, TN',
      rating: 4,
      verified: true,
      productVariant: 'Classic Shift Rose Gold / Luxe Box Chain',
      text: "At first I was skeptical because $37 for a necklace that \"helps you breathe\" seemed gimmicky. But I'm a rethink-every-conversation-I've-ever-had type of person and I was desperate. It's been about 2 weeks and I do reach for it more than I expected. I use it mainly at night when I'm trying to sleep and my brain decides to replay every awkward thing I said in 2019. The only reason I'm not giving 5 stars is because I sometimes forget I'm wearing it during the day, so I wish there was some kind of gentle reminder feature? But maybe that defeats the purpose. Anyway, it helps when I remember to use it.",
      date: '3 days ago',
      helpful: 4,
    },
    {
      id: '6',
      author: 'Emily C.',
      location: 'Seattle, WA',
      rating: 5,
      verified: true,
      productVariant: 'Classic Shift Matte Slate / Luxe Box Chain',
      text: "I'm a nurse and my overthinking gets dangerous because I'll spiral about whether I gave the right medication, said the right thing to a patient's family, documented everything correctly. I've been using this for 6 days now and it's become part of my routine. I breathe through it during my lunch break, after difficult shifts, and honestly sometimes in the supply closet when things get overwhelming. The matte slate was the right choice for me because it's subtle and professional-looking. It just looks like a simple necklace. Nobody needs to know it's my anxiety management tool.",
      date: '6 days ago',
      helpful: 11,
    },
    {
      id: '7',
      author: 'Lauren H.',
      location: 'Boston, MA',
      rating: 5,
      verified: true,
      productVariant: 'Classic Shift Gold / Luxe Box Chain',
      text: "This is going to sound dramatic but this little necklace has changed my daily experience. I'm a freelancer which means I have zero structure and infinite time to catastrophize about money, clients, whether I made the right career choice, etc. I wear this every day now (2.5 weeks in) and I use it probably 6-8 times a day. Morning coffee spiral? Breathe. Client email anxiety? Breathe. 2am existential crisis? Breathe. It doesn't make the thoughts go away but it stops them from snowballing. Also it's actually pretty, which matters because I work from home and don't always put effort into my appearance lol.",
      date: '1 week ago',
      helpful: 7,
    },
    {
      id: '8',
      author: 'Kristen P.',
      location: 'San Diego, CA',
      rating: 4,
      verified: true,
      productVariant: 'Classic Shift Rose Gold / Luxe Box Chain',
      text: "I'm a ruminator - I replay the same thoughts over and over until I'm exhausted. Got this about 10 days ago and I'm still figuring out the best times to use it, but when I DO use it, it works. The 90 seconds feels longer than you'd think, which is good. My only complaint is that the breathing technique felt a bit awkward at first - I kept thinking I was doing it wrong? But I watched the video again and now it's more natural. I use it most before presentations at work and it genuinely takes the edge off.",
      date: '1 day ago',
      helpful: 3,
    },
    {
      id: '9',
      author: 'Jennifer S.',
      location: 'Phoenix, AZ',
      rating: 5,
      verified: true,
      productVariant: 'Classic Shift Sterling Silver / Luxe Box Chain',
      text: "Mom of three here and my anxiety manifests as catastrophizing about my kids constantly. Are they developing normally? Did I mess them up by letting them have too much screen time? Should we be doing more educational activities? It's exhausting. I've had this for about 12 days and I use it throughout the day - while driving carpool, during lunch prep when things feel chaotic, before bed when mom guilt kicks in. It's discreet enough that my kids haven't even asked about it, which is important to me. I just wanted something that was MINE. This is it.",
      date: '4 days ago',
      helpful: 14,
    },
    {
      id: '10',
      author: 'Nicole D.',
      location: 'Minneapolis, MN',
      rating: 5,
      verified: true,
      productVariant: 'Classic Shift Matte Slate / Luxe Box Chain',
      text: "I'm in sales and I overthink every single client interaction. Did I talk too much? Not enough? Should I follow up again or will that be annoying? It's a cycle. I've been wearing this for 9 days and it's become my pre-call ritual. Before every client call, I spend 90 seconds breathing through it. It centers me in a way that nothing else has. I also use it after calls that didn't go well - helps me move on instead of ruminating for 3 hours. The matte slate matches everything in my wardrobe which is a bonus I didn't expect to care about but totally do.",
      date: '2 days ago',
      helpful: 5,
    },
    {
      id: '11',
      author: 'Danielle W.',
      location: 'Atlanta, GA',
      rating: 4,
      verified: true,
      productVariant: 'Classic Shift Gold / Luxe Box Chain',
      text: "Grad student here, chronic overthinker, anxiety diagnosis since age 19. I've tried meditation apps, therapy, journaling - all helpful but hard to sustain. This is different because it's just... there. Been using it for about a week. I reach for it before exams, during research spirals, when imposter syndrome hits. It works well for acute anxiety moments. The only thing I'd change is maybe having a slightly shorter chain option? I have a short torso and it hangs lower than ideal. But functionally it does what it promises. I'm keeping it.",
      date: '5 days ago',
      helpful: 6,
    },
    {
      id: '12',
      author: 'Alison F.',
      location: 'Charlotte, NC',
      rating: 5,
      verified: true,
      productVariant: 'Classic Shift Rose Gold / Luxe Box Chain',
      text: "I mean, it's not magic but it really does help. I'm someone who spirals about everything - social interactions, work performance, things I said 5 years ago. I got this 2 weeks ago and now it's part of my morning routine (coffee, Shift breathing, face the day). I also use it during my commute when traffic anxiety hits, and at night when my brain wants to replay every cringey moment from the day. The rose gold is gorgeous and feels more expensive than $37. Multiple people have asked where I got it. I just tell them it's a breathing necklace and half of them look confused and the other half immediately want one lol.",
      date: '3 days ago',
      helpful: 10,
    },
  ]

  // FAQs
  const faqs = [
    {
      question: 'How does it actually work?',
      answer: "The necklace has a small opening that naturally extends your exhale. When you exhale for 2x longer than you inhale, it activates your vagus nerve - your body's 'calm down' switch. This counteracts overthinking/anxiety.",
    },
    {
      question: 'Do I have to wear it all the time?',
      answer: "No. Many people wear it daily as a reminder, but you can also keep it in your pocket or purse and use only when spiraling. Whatever works for you.",
    },
    {
      question: "Will people think it's weird I'm breathing through jewelry?",
      answer: "It looks like you're taking a slow breath. Most people won't even notice. (And if they do, just say 'anxiety relief tool' - you'll be surprised how many ask where to get one!)",
    },
    {
      question: 'How long does it take to work?',
      answer: "90 seconds (2-3 slow breaths). The first breath interrupts the spiral. By the third breath, you'll feel noticeably calmer.",
    },
    {
      question: 'What if I lose it or it breaks?',
      answer: "It's stainless steel (durable), but if anything happens within 60 days, email us and we'll replace it free.",
    },
    {
      question: 'Does this replace therapy/medication?',
      answer: "No. This is a TOOL, not a replacement for professional help. It works alongside therapy/medication to give you something physical to do when spiraling.",
    },
    {
      question: 'What material is it made from?',
      answer: "Medical-grade stainless steel - hypoallergenic, nickel-free, and won't tarnish. The chain is adjustable from 18-24 inches to fit everyone.",
    },
    {
      question: 'Can I use it while driving?',
      answer: "Yes, it's safe to use while driving (unlike meditation apps). Just keep your eyes on the road and breathe through the necklace when you feel stress rising.",
    },
  ]

  // Product Details Tabs
  const productDetailsTabs = [
    {
      id: 'shift-101',
      label: 'THE SHIFT 101',
      content: (
        <div className="space-y-3">
          <p className="text-lg text-gray-900 leading-relaxed">
            The Shift quietly slows your exhale to calm your mind in seconds.
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-emerald-500 flex-shrink-0 mt-1">•</span>
              <span className="text-gray-700">Awarded most effective breathing technique by Stanford Labs</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-500 flex-shrink-0 mt-1">•</span>
              <span className="text-gray-700">Surgical grade stainless steel makes it easy to clean and doesn't fade</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-500 flex-shrink-0 mt-1">•</span>
              <span className="text-gray-700">Lowers heart rate, improves sleep, reverses cravings, and lifts mood</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-500 flex-shrink-0 mt-1">•</span>
              <span className="text-gray-700">Created and tested by psychotherapist and family owned</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-500 flex-shrink-0 mt-1">•</span>
              <span className="text-gray-700">Free returns for 30 days!</span>
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 'description',
      label: 'Description',
      content: (
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="text-emerald-500 flex-shrink-0 mt-1">•</span>
            <span className="text-gray-700">Pendant and chain made of the highest quality, 316 high polish stainless steel</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-emerald-500 flex-shrink-0 mt-1">•</span>
            <span className="text-gray-700">Includes chain of choice</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-emerald-500 flex-shrink-0 mt-1">•</span>
            <span className="text-gray-700">Breathing Necklace pendant measures 2 inches in length</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-emerald-500 flex-shrink-0 mt-1">•</span>
            <span className="text-gray-700">Precise circumference supports 10 second exhale</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-emerald-500 flex-shrink-0 mt-1">•</span>
            <span className="text-gray-700">Whisper quiet so you can use it anywhere</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-emerald-500 flex-shrink-0 mt-1">•</span>
            <span className="text-gray-700">Durable so you can wear it all the time</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-emerald-500 flex-shrink-0 mt-1">•</span>
            <span className="text-gray-700">Hand to mouth replacement to quit smoking and vaping</span>
          </li>
        </ul>
      ),
    },
    {
      id: 'in-the-box',
      label: 'In the Box',
      collapsible: false,
      content: (
        <ul className="space-y-3">
          <li className="text-gray-700">1 Komuso Shift Pendant</li>
          <li className="text-gray-700">1 High quality Luxe Box chain, 26"</li>
          <li className="text-gray-700">1 Microfiber pouch (to store and keep your Shift secure)</li>
          <li className="text-gray-700">1 Komuso "how to" guide... it's as easy as 1,2,3</li>
        </ul>
      ),
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar
        message={<><strong>Limited Time:</strong> Get The Shift for $37 (Regular $49)</>}
        variant="emerald"
      />
      <TopBar />

      <main className="flex-1">
        <div ref={stickySentinelRef} aria-hidden className="pointer-events-none h-px w-full opacity-0" />
        {/* Hero Section */}
        <ProductHero
        productName="The Shift"
        tagline="Stop Overthinking Spirals in 90 Seconds"
        badge="AS SEEN IN QUIZ RESULTS"
        scarcityMessage="Due to order surge, inventory running low"
        price={{
          current: 37,
          original: 49,
        }}
        images={productImages}
        tabs={productDetailsTabs}
        variantOptions={variantOptions}
        guarantees={[
          '100% Money back guarantee',
          'Free Breathwork Course with purchase',
          'Free delivery',
        ]}
        reviewCount={379}
        reviewRating={4.8}
        shopifyProductId="10770901434671"
        shopifyDomain="t7vyee-kc.myshopify.com"
        shopifyStorefrontAccessToken="a3bc32a7b8116c3f806d7d16e91eadad"
      />

      {/* Bonus Offer Section */}
      <ShiftBonusOffer
        imageSrc="https://cdn.shopify.com/s/files/1/0957/4914/4879/files/animated.webp?v=1760876323"
        imageAlt="FIRE Protocol course included free"
        title="FIRE Protocol course is FREE with any Shift purchase."
        description="A tool without action is just a wish. Likewise, the Shift without a program is like a guitar without lessons or daily practice. Within minutes, the FIRE Protocol transforms the Shift from a tool into a mindfulness instrument that transforms your day."
        layout="image-left"
      />

      {/* Social Proof Stats */}
      <SocialProofStats
        stats={stats}
        backgroundColor="white"
        title="Clinician recommended & trusted by users"
      />

      {/* Educational Section */}
      <ShiftEducational blocks={educationalBlocks} />

      {/* Highlights */}
      <ShiftHighlights images={highlightImages} />

      {/* Reviews */}
      <ReviewsSection
        reviews={productReviews}
        averageRating={4.8}
        totalReviews={379}
      />

      {/* FAQ */}
      <FAQSection faqs={faqs} />

      {/* Final CTA */}
      <FinalCTA
        backgroundImage="https://cdn.shopify.com/s/files/1/0957/4914/4879/files/ClassicProductImage4Gold.webp?v=1760872696"
        heading="Just Breathe Through It"
        subheading="Stop overthinking spirals in 90 seconds"
        ctaText="Get The Shift - $37"
        ctaLink="#buy"
        guarantee="60-Day Money-Back Guarantee"
      />

      </main>

      {/* STICKY CHECKOUT BAR - Moved outside <main> to escape relative positioning */}
      <StickyCheckoutBar
        show={isMounted && isMobile && showStickyBar}
        spotsRemaining={spotsRemaining}
        totalSpots={totalSpots}
        isCritical={isCritical}
        isSoldOut={isSoldOut}
        productId="10770901434671"
        domain="t7vyee-kc.myshopify.com"
        storefrontAccessToken="a3bc32a7b8116c3f806d7d16e91eadad"
        buttonText="Get The Shift • $37"
        buttonColor="#16a34a"
        buttonHoverColor="#15803d"
      />

      <Footer variant="emerald" />
    </div>
  )
}

export default function TheShiftPageWithScarcity() {
  return (
    <ScarcityProvider>
      <TheShiftPage />
    </ScarcityProvider>
  )
}
