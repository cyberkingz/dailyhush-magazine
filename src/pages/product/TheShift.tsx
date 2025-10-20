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
import { shiftProductReviews } from '@/data/shiftProductReviews'

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

  // Show sticky bar once the hero has scrolled out of view. Uses IntersectionObserver with scroll fallback.
  useEffect(() => {
    const sentinel = stickySentinelRef.current
    if (!sentinel) return

    const hasIntersectionObserver = typeof IntersectionObserver !== 'undefined'

    // Use IntersectionObserver if available
    if (hasIntersectionObserver) {
      let hasScrolledPast = false

      const observer = new IntersectionObserver(
        ([entry]) => {
          // Only show sticky bar if we've scrolled past the sentinel (it was visible and now isn't)
          if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
            hasScrolledPast = true
            setShowStickyBar(true)
          } else if (entry.isIntersecting) {
            // User scrolled back up
            setShowStickyBar(false)
          }
        },
        {
          rootMargin: '0px',
          threshold: 0,
        },
      )

      observer.observe(sentinel)
      return () => observer.disconnect()
    } else {
      // Fallback to scroll listener for older browsers
      const getScrollTop = () => {
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
    }
  }, [])

  // Product Images - Variant Specific
  const variantImages = {
    'rose-gold': [
      'https://cdn.shopify.com/s/files/1/0957/4914/4879/files/ClassicProductImage4Rose.jpg?v=1760941523',
      'https://cdn.shopify.com/s/files/1/0957/4914/4879/files/ClassicProductImage2Rose.webp?v=1760941522',
      'https://cdn.shopify.com/s/files/1/0957/4914/4879/files/rose_lifestyle1.webp?v=1760941522',
      'https://cdn.shopify.com/s/files/1/0957/4914/4879/files/ClassicBoxChainProductImage1Rose.webp?v=1760941523',
      'https://cdn.shopify.com/s/files/1/0957/4914/4879/files/closeup_38a646ac-e433-453c-b95d-5e41f048c244.webp?v=1760941521',
    ],
    'gold': [
      'https://cdn.shopify.com/s/files/1/0957/4914/4879/files/ClassicBoxChainProductImage1Gold.webp?v=1760872375',
      'https://cdn.shopify.com/s/files/1/0957/4914/4879/files/ClassicProductImage2Gold.webp?v=1760872375',
      'https://cdn.shopify.com/s/files/1/0957/4914/4879/files/gold_lifestyle1.webp?v=1760872696',
      'https://cdn.shopify.com/s/files/1/0957/4914/4879/files/closeup.webp?v=1760872688',
    ],
  }

  // Default product images (fallback to rose-gold as it's default)
  const productImages = variantImages['rose-gold']

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
      number: 87,
      suffix: '%',
      description: '87% of chronic overthinkers report reduced rumination spirals within 2 weeks of daily use',
    },
    {
      number: 90,
      suffix: 'sec',
      description: '90 seconds to interrupt a shame loop before it snowballs into hours of catastrophizing',
    },
    {
      number: 81,
      suffix: '%',
      description: '81% use it 4+ times daily (morning anxiety, work spirals, bedtime rumination)',
    },
  ]

  // Educational Blocks
  const educationalBlocks = [
    {
      title: "Why a Physical Tool for Rumination Loops?",
      content: [
        "You don't have anxiety. You have rumination loops—replaying conversations, catastrophizing about emails, punishing yourself with 'I should've known better.' Meditation apps tell you to 'just breathe,' but when you're spiraling, your brain won't let you remember. The Shift is different: it's a physical interrupt you WEAR. You reach for it the moment the spiral starts, and it stops the loop before it snowballs.",
      ],
      imageSrc: 'https://cdn.shopify.com/s/files/1/0957/4914/4879/files/gold_lifestyle1.webp?v=1760872696',
      imageAlt: 'The Shift breathing necklace in use',
      layout: 'image-left' as const,
    },
    {
      title: "How It Interrupts a Spiral in 90 Seconds",
      content: [
        "Your brain can't spiral and activate your vagus nerve at the same time. The Shift extends your exhale to 10 seconds, triggering your vagus nerve—the 'off switch' for rumination loops. First breath interrupts the spiral. Second breath calms your nervous system. Third breath stops the catastrophizing. You're not 'calming down'—you're breaking the circuit before it steals 3 hours.",
      ],
      imageSrc: 'https://cdn.shopify.com/s/files/1/0957/4914/4879/files/module_2_classic.webp?v=1760891896',
      imageAlt: 'How The Shift works',
      layout: 'image-right' as const,
      backgroundColor: 'emerald' as const,
    },
    {
      title: 'Why We Built This',
      content: [
        "We're chronic overthinkers who tried everything—meditation apps we forgot to open, therapy that explained WHY we ruminate but didn't stop it, breathing exercises we couldn't remember mid-spiral. Then our therapist taught us a technique with ONE difference: a physical tool you wear. Not something you remember to use—something you reach for the moment spiraling starts. 50,000+ overthinkers later, this simple idea keeps working. If you scored 6+ on the quiz, you know the feeling. This is your circuit breaker.",
      ],
      imageSrc: 'https://cdn.shopify.com/s/files/1/0957/4914/4879/files/Gemini_Generated_Image_pefq89pefq89pefq.png?v=1760950438',
      imageAlt: 'DailyHush founders story',
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

  // Reviews imported from separate file (see /src/data/shiftProductReviews.ts)
  const productReviews = shiftProductReviews

  // FAQs
  const faqs = [
    {
      question: 'I scored 6+ on the quiz. Will this actually work for chronic rumination?',
      answer: "The technique in The Shift (extended exhale for vagus nerve activation) is the SAME technique used in RF-CBT (Rumination-Focused Cognitive Behavioral Therapy) at University of Exeter. Clinical trials show 60-65% of chronic ruminators experience significant improvement. The difference between therapy and The Shift: you're wearing the tool, so you can't forget to use it when spiraling. It won't cure rumination, but it gives you a circuit breaker.",
    },
    {
      question: 'How is this different from meditation apps I\'ve already tried?',
      answer: "Meditation apps ask you to 'observe your thoughts' or 'let them pass.' For chronic ruminators, observation becomes another spiral. The Shift is a physiological interrupt, not a mindfulness practice. You're not observing anything—you're activating your vagus nerve to signal your nervous system: 'You're safe.' It's biology, not meditation. Your brain can argue with thoughts. It can't argue with your nervous system.",
    },
    {
      question: 'How does it actually work?',
      answer: "The necklace has a small opening that naturally extends your exhale to 10 seconds (vs. your normal 3-4). When you exhale this long, it activates your vagus nerve—your body's 'off switch' for rumination loops. First breath interrupts the spiral. Second breath downregulates your nervous system. Third breath stops the catastrophizing from escalating. 90 seconds total.",
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
      question: 'Will this stop my overthinking completely?',
      answer: "No. And anyone who promises that is lying to you. What it DOES: Gives you a circuit breaker for when spirals start. You'll still overthink (you're an overthinker—that's not changing). But instead of losing 3 hours to 'I can't believe I said that,' you interrupt it in 90 seconds. You can't stop rumination thoughts from STARTING. But you can stop them from SNOWBALLING. That's what this does.",
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
            The physical circuit breaker that interrupts rumination loops before they steal your day.
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-emerald-500 flex-shrink-0 mt-1">•</span>
              <span className="text-gray-700">Uses the same extended-exhale technique from RF-CBT (Rumination-Focused Cognitive Behavioral Therapy)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-500 flex-shrink-0 mt-1">•</span>
              <span className="text-gray-700">Medical-grade stainless steel—hypoallergenic, won't tarnish, lasts for years</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-500 flex-shrink-0 mt-1">•</span>
              <span className="text-gray-700">Stops thought spirals from snowballing, improves sleep quality, interrupts catastrophizing patterns</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-500 flex-shrink-0 mt-1">•</span>
              <span className="text-gray-700">Developed for chronic overthinkers who've tried meditation apps and breathing exercises without success</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-500 flex-shrink-0 mt-1">•</span>
              <span className="text-gray-700">60-day money-back guarantee—no questions asked</span>
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
          <li className="text-gray-700">1 The Shift Breathing Tool</li>
          <li className="text-gray-700">1 Premium 26" chain (wear it daily—that's when it works best)</li>
          <li className="text-gray-700">1 Travel pouch (for overthinkers on the go)</li>
          <li className="text-gray-700">1 Quick-Start Guide: F.I.R.E. in 3 Steps (get results tonight, not next week)</li>
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
        {/* Hero Section */}
        <ProductHero
        productName="The Shift"
        tagline="The Physical Tool for Chronic Overthinkers Who've Tried Everything Else"
        badge="FOR THE 50,000+ WOMEN WHO THINK TOO MUCH"
        scarcityMessage="Your quiz results are most actionable in the next 48 hours—act while self-awareness is fresh"
        price={{
          current: 37,
          original: 49,
        }}
        images={productImages}
        tabs={productDetailsTabs}
        variantOptions={variantOptions}
        variantImages={variantImages}
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

      <div ref={stickySentinelRef} aria-hidden className="pointer-events-none h-px w-full opacity-0" />

      {/* Bonus Offer Section */}
      <ShiftBonusOffer
        imageSrc="https://cdn.shopify.com/s/files/1/0957/4914/4879/files/animated.webp?v=1760876323"
        imageAlt="Free Breathwork Course included"
        title="Free Breathwork Course included with your Shift."
        description="Learn the fundamentals of breathwork with our complimentary course. Discover how to use The Shift effectively, understand the science behind slow breathing, and master the techniques that calm your nervous system in seconds. A tool is only as powerful as knowing how to use it."
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
