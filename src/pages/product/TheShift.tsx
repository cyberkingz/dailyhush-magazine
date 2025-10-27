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
import { useCountdown } from '@/hooks/useCountdown'
import { trackProductPageView } from '@/lib/services/productPageEvents'

function TheShiftPage() {
  const { spotsRemaining, totalSpots, isCritical, isSoldOut } = useScarcity()
  const [showStickyBar, setShowStickyBar] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const stickySentinelRef = useRef<HTMLDivElement | null>(null)

  // Initialize countdown target date with safe default
  const [countdownTarget, setCountdownTarget] = useState<Date>(() => {
    // Default to 48 hours from now (will be updated from localStorage)
    return new Date(Date.now() + 48 * 60 * 60 * 1000)
  })

  // Load countdown target from localStorage after mount
  useEffect(() => {
    const COUNTDOWN_KEY = 'quiz_countdown_target'

    // Check if we have a stored target date
    const stored = localStorage.getItem(COUNTDOWN_KEY)
    if (stored) {
      const targetDate = new Date(stored)
      // If the stored date is in the future, use it
      if (targetDate.getTime() > Date.now()) {
        setCountdownTarget(targetDate)
        return
      }
    }

    // Create new target date (48 hours from now)
    const target = new Date(Date.now() + 48 * 60 * 60 * 1000)
    localStorage.setItem(COUNTDOWN_KEY, target.toISOString())
    setCountdownTarget(target)
  }, [])

  const countdown = useCountdown({ targetDate: countdownTarget })

  // Track mount state and mobile viewport to avoid hydration issues
  useEffect(() => {
    setIsMounted(true)
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Track product page view for email campaign attribution
  useEffect(() => {
    trackProductPageView('the-shift')
  }, [])

  // Show sticky bar once the hero has scrolled out of view. Uses IntersectionObserver with scroll fallback.
  useEffect(() => {
    const sentinel = stickySentinelRef.current
    if (!sentinel) return

    const hasIntersectionObserver = typeof IntersectionObserver !== 'undefined'

    // Use IntersectionObserver if available
    if (hasIntersectionObserver) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          // Only show sticky bar if we've scrolled past the sentinel (it was visible and now isn't)
          if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
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
      description: '90 seconds to interrupt a rumination spiral before it snowballs into hours of catastrophizing',
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
        "You don't have anxiety. You have rumination loops. Replaying conversations, catastrophizing about emails, punishing yourself with 'I should've known better.' Meditation apps tell you to 'just breathe,' but when you're spiraling, your brain won't let you remember. The Shift is different: it's a physical interrupt you WEAR. You reach for it the moment the spiral starts, and it stops the loop before it snowballs.",
      ],
      imageSrc: 'https://cdn.shopify.com/s/files/1/0957/4914/4879/files/gold_lifestyle1.webp?v=1760872696',
      imageAlt: 'The Shift breathing necklace in use',
      layout: 'image-left' as const,
    },
    {
      title: "How It Interrupts a Spiral in 90 Seconds",
      content: [
        "Your brain can't spiral and activate your vagus nerve at the same time. The Shift extends your exhale to 10 seconds, triggering your vagus nerve (the 'off switch' for rumination loops). First breath interrupts the spiral. Second breath calms your nervous system. Third breath stops the catastrophizing. You're not 'calming down.' You're breaking the circuit before it steals 3 hours.",
      ],
      imageSrc: 'https://cdn.shopify.com/s/files/1/0957/4914/4879/files/module_2_classic.webp?v=1760891896',
      imageAlt: 'How The Shift works',
      layout: 'image-right' as const,
      backgroundColor: 'emerald' as const,
    },
    {
      title: 'Why We Built This',
      content: [
        "We're chronic overthinkers who tried everything. Meditation apps we forgot to open, therapy that explained WHY we ruminate but didn't stop it, breathing exercises we couldn't remember mid-spiral. Then our therapist taught us a technique with ONE difference: a physical tool you wear. Not something you remember to use. Something you reach for the moment spiraling starts. 6,000+ women use The Shift + F.I.R.E. daily. 1,800+ verified reviews. This simple idea keeps working. If you scored 6+ on the quiz, you know the feeling. This is your circuit breaker.",
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
      question: 'What exactly is The Shift™ Complete Kit?',
      answer: "You get two things: (1) The Shift™ Breathing Necklace. A medical-grade stainless steel tool that extends your exhale to 10 seconds to activate your vagus nerve and interrupt rumination spirals in 90 seconds. (2) The F.I.R.E. Protocol. A complete digital program teaching you the 4-step clinical framework (Focus → Interrupt → Reframe → Execute) used in Rumination-Focused CBT at University of Exeter. The necklace is your emergency brake. The F.I.R.E. Protocol teaches you to drive differently.",
    },
    {
      question: 'What comes in the physical package when it arrives?',
      answer: "Your Complete Kit includes: The Shift™ Breathing Necklace (the tool itself), a premium 26-inch adjustable luxe box chain (so you can wear it immediately), a protective travel pouch (keeps it safe in your purse when not wearing), and a Quick-Start Guide with the F.I.R.E. in 3 Steps (so you can use it the moment it arrives, no learning curve).",
    },
    {
      question: 'What\'s included in the F.I.R.E. Protocol ($67 value)?',
      answer: "The complete digital program includes: (1) The 4-Step Protocol Guide. The full Focus → Interrupt → Reframe → Execute system therapists charge $150/hour to teach. (2) Spiral Trigger Identification Workbook. Helps you map YOUR specific rumination patterns. (3) Vagus Nerve Activation Techniques. 5 clinical methods beyond the necklace. (4) Step-by-Step Protocols for 7 Common Overthinking Situations (the 2am 'I can't believe I said that' spiral, decision paralysis, relationship overthinking, etc.). (5) 30-Day Progress Tracker. So you can see patterns you can't see when you're IN the spiral. You get instant digital access after purchase. You can start reading while the necklace ships.",
    },
    {
      question: 'I scored 6+ on the quiz. Will this actually work for chronic rumination?',
      answer: "The technique in The Shift (extended exhale for vagus nerve activation) is the SAME technique used in RF-CBT (Rumination-Focused Cognitive Behavioral Therapy) at University of Exeter. Clinical trials show 60-65% of chronic ruminators experience significant improvement. The difference between therapy and The Shift: you're wearing the tool, so you can't forget to use it when spiraling. It won't cure rumination, but it gives you a circuit breaker you can trigger in 90 seconds when your brain starts the loop.",
    },
    {
      question: 'What if I\'ve tried therapy and it didn\'t work?',
      answer: "Traditional CBT works for anxiety, but rumination needs specialized protocols. Rumination-Focused CBT is different. It targets the specific neural pathways causing overthinking loops, not general anxiety. If your therapist wasn't trained in RF-CBT or Metacognitive Therapy (MCT), they likely used anxiety techniques that don't work for rumination. The F.I.R.E. Protocol gives you the RF-CBT framework that 65% of chronic ruminators respond to. You're not broken. You just haven't had the right tools for YOUR specific brain pattern.",
    },
    {
      question: 'How does it actually work?',
      answer: "The necklace has a small opening that naturally extends your exhale to 10 seconds (vs. your normal 3-4 seconds). When you exhale this long, it activates your vagus nerve (your body's biological 'off switch' for rumination loops). First breath interrupts the spiral. Second breath downregulates your nervous system. Third breath stops the catastrophizing from escalating. 90 seconds total. It's not meditation or mindfulness. It's direct nervous system intervention. Your brain can argue with thoughts. It can't argue with your vagus nerve.",
    },
    {
      question: 'How is this different from meditation apps I\'ve already tried?',
      answer: "Meditation apps ask you to 'observe your thoughts' or 'let them pass.' For chronic ruminators, observation becomes another spiral. You end up analyzing your analyzing. The Shift is a physiological interrupt, not a mindfulness practice. You're not observing anything. You're activating your vagus nerve to signal your nervous system: 'You're safe. Turn off the threat response.' It's biology, not meditation. And unlike an app you have to remember to open when you're already spiraling, The Shift is a physical object you're wearing (impossible to forget when you need it most).",
    },
    {
      question: 'What if my overthinking is different? I don\'t just ruminate about the past. I spiral about the future too.',
      answer: "Rumination includes past-focused loops ('I can't believe I said that') AND future-focused catastrophizing ('What if everything goes wrong?'). Both are the same neural pattern: your brain treating uncertainty as a threat and trying to 'solve' it with thinking. The F.I.R.E. Protocol includes specific protocols for 7 common spiral types (past regret, future catastrophizing, decision paralysis, relationship overthinking, body image spirals, work performance anxiety, and existential spirals). The vagus nerve activation works the same regardless of what content your brain is looping on.",
    },
    {
      question: 'Will this stop my overthinking completely?',
      answer: "No. And anyone who promises that is lying to you. What it DOES: Gives you a circuit breaker for when spirals start. You'll still overthink (you're an overthinker, that's wired into your nervous system, and that's not changing). But instead of losing 3 hours to 'I can't believe I said that,' you interrupt it in 90 seconds. You can't stop rumination thoughts from STARTING. But you can stop them from SNOWBALLING into 2am exhaustion spirals. That's what this does. It doesn't cure you. It gives you control when you need it most.",
    },
    {
      question: 'Does this replace therapy or medication?',
      answer: "No. This is a TOOL, not a replacement for professional help. If you're in therapy, this gives you something physical to do when spiraling between sessions. If you're on medication, this works alongside it. They target different mechanisms (medication adjusts neurotransmitters, The Shift activates your vagus nerve). Many therapists actually recommend breathing tools like this as part of RF-CBT protocols. Think of it as another tool in your toolkit, not a replacement for the whole toolkit.",
    },
    {
      question: 'How long does it take to work?',
      answer: "90 seconds (2-3 slow breaths). The first breath interrupts the spiral. You'll feel the shift from 'racing thoughts' to 'I'm breathing.' By the third breath, your heart rate slows and the catastrophizing loses momentum. It won't make the thoughts disappear instantly, but it will downregulate the panic response that makes rumination feel so urgent and overwhelming. Most people report feeling noticeably calmer within 2 minutes.",
    },
    {
      question: 'Do I have to wear it all the time?',
      answer: "No. Many people wear it daily as a visual reminder ('I have a tool when I need it'), but you can also keep it in your pocket, purse, or on your nightstand and only use it when spiraling. Some people wear it during high-stress periods (work presentations, difficult conversations) and store it other times. Whatever works for you. The chain is adjustable and comes with a travel pouch, so you have options.",
    },
    {
      question: 'Will people think it\'s weird I\'m breathing through jewelry?',
      answer: "It looks like you're taking a slow, deep breath (which is what you're doing). Most people won't even notice (they're too busy with their own thoughts). If someone asks, just say 'anxiety relief tool.' You'll be surprised how many people respond with 'Where did you get that? I need one.' The women who've been using The Shift report the opposite problem: too many people asking where to buy it.",
    },
    {
      question: 'Can I use it while driving, working, or in public?',
      answer: "Yes. Unlike meditation apps that require you to close your eyes or focus inward, The Shift is just breathing. You can do it anywhere. Driving, in meetings, at your desk, during conversations. It's silent and subtle. You're just breathing slower through a necklace. The only place you can't use it: underwater (obviously). Everywhere else is fair game.",
    },
    {
      question: 'What if I lose it or it breaks?',
      answer: "The necklace is medical-grade stainless steel (hypoallergenic, nickel-free, won't tarnish). It's built to last. But if anything happens within 60 days, email us at support@dailyhush.co and we'll replace it free. After 60 days, we offer replacement necklaces at cost ($12). The chain is adjustable from 18-26 inches, and we include a protective travel pouch to keep it safe when not wearing it.",
    },
    {
      question: 'What\'s your guarantee? What if it doesn\'t work for me?',
      answer: "60-day money-back guarantee. Use The Shift for two full months. If you don't feel it helps interrupt your rumination spirals, email us for a full refund (no questions, no hassle). You even keep the F.I.R.E. Protocol digital program (we can't 'take back' a PDF you've already read). We can afford this guarantee because 60-65% of chronic ruminators respond to vagus nerve activation techniques in clinical trials. The worst case: you get your money back AND keep a $67 clinical framework. The best case: you finally have a tool that works when your brain won't shut up.",
    },
    {
      question: 'Why is it only $37? What\'s the catch?',
      answer: "No catch. Here's the math: The Shift Necklace + Chain normally sells for $67. The F.I.R.E. Protocol (the complete digital program) normally sells separately for $67. The Guides + Resources are valued at $34. That's $168 total value. You're getting everything for $37 because you completed the overthinking quiz. Your results are fresh and calibrated, which means you can implement the F.I.R.E. Protocol immediately with accurate self-knowledge. The clinical timing matters: your recent overthinking patterns are still top-of-mind, making the Spiral Trigger Identification Workbook most effective right now. We'd rather get The Shift in your hands when it can help most, not make you wait while rumination steals more of your sleep.",
    },
    {
      question: 'How much does rumination cost if I don\'t fix it?',
      answer: "Research shows chronic rumination costs an average of 2-4 hours per day in lost productivity, plus sleep deprivation (worth $200-400/month in health costs), relationship strain, and career stagnation from decision paralysis. One University of Michigan study found ruminators earn 14% less over their careers due to missed opportunities and avoidance behavior. The question isn't 'Can I afford $37?' It's 'Can I afford another year of 2am spirals, exhausted mornings, and decisions I'm too paralyzed to make?' The Shift isn't an expense. It's a circuit breaker for a pattern that's already costing you thousands.",
    },
    {
      question: 'Why should I order now instead of thinking about it?',
      answer: "Two reasons: (1) Clinical timing. Your quiz results are fresh. The Spiral Trigger Identification Workbook in the F.I.R.E. Protocol works best when your recent overthinking patterns are still top-of-mind. Waiting means re-analyzing what you've already analyzed (which is... more rumination). (2) The $37 quiz-taker rate is time-sensitive. Once you leave this page, you'll pay the standard $67 rate for the necklace alone (without the F.I.R.E. bonus). The real cost of waiting isn't the price difference. It's every night this week your brain steals from you while you 'think about' getting a tool to stop thinking so much. The irony isn't lost on me.",
    },
    {
      question: 'What happens after I order?',
      answer: "Immediate: You get instant access to the F.I.R.E. Protocol digital program (check your email within 5 minutes). You can start reading the framework tonight while the necklace ships. Shipping: The Shift™ Complete Kit ships within 1-2 business days via USPS. Typical delivery is 5-7 days in the US (international 10-14 days). You'll get tracking info via email. First use: When it arrives, read the Quick-Start Guide (3-minute read) and try your first 90-second breath cycle. Most people report feeling the vagus nerve activation on the first try. 30-day mark: Use the Progress Tracker in F.I.R.E. to see patterns you couldn't see when you were IN the spirals. You'll likely notice you're interrupting spirals earlier, losing less time to rumination, and sleeping better.",
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
              <span className="text-gray-700">Medical-grade stainless steel (hypoallergenic, won't tarnish, lasts for years)</span>
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
              <span className="text-gray-700">60-day money-back guarantee (no questions asked)</span>
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
        </ul>
      ),
    },
    {
      id: 'in-the-box',
      label: 'In the Box',
      collapsible: true,
      content: (
        <div className="space-y-4">
          <div>
            <p className="text-gray-900 font-semibold mb-2">The Shift™ Complete Kit:</p>
            <ul className="space-y-3 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 flex-shrink-0 mt-1">•</span>
                <span className="text-gray-700">The Shift™ Breathing Necklace</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 flex-shrink-0 mt-1">•</span>
                <span className="text-gray-700">Premium 26" Luxe Box Chain</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 flex-shrink-0 mt-1">•</span>
                <span className="text-gray-700">Travel pouch (to store and keep your Shift secure)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 flex-shrink-0 mt-1">•</span>
                <span className="text-gray-700">Quick-Start Guide: F.I.R.E. in 3 Steps</span>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-gray-900 font-semibold mb-2">F.I.R.E. Protocol (Digital Program) - $67 Value:</p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 flex-shrink-0 mt-1">•</span>
                <span className="text-gray-700">Complete 4-Step Protocol Guide (Focus → Interrupt → Reframe → Execute)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 flex-shrink-0 mt-1">•</span>
                <span className="text-gray-700">Spiral Trigger Identification Workbook</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 flex-shrink-0 mt-1">•</span>
                <span className="text-gray-700">Vagus Nerve Activation Techniques</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 flex-shrink-0 mt-1">•</span>
                <span className="text-gray-700">Step-by-Step Protocols for 7 Common Overthinking Situations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 flex-shrink-0 mt-1">•</span>
                <span className="text-gray-700">30-Day Progress Tracker</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar
        message={<>Quiz Complete: Your Shift™ Kit $37 (Reg. $67) + Free Guide</>}
        variant="emerald"
      />
      <TopBar />

      <main className="flex-1">
        {/* Hero Section */}
        <ProductHero
        productName="The Shift™ Breathing Necklace for Chronic Overthinkers"
        tagline="After decades of worrying about everyone else, it's time to quiet your mind"
        badge={`SPECIAL RATE EXPIRES IN: ${countdown}`}
        scarcityMessage="Due to order surge, inventory running low"
        price={{
          current: 37,
          original: 67,
        }}
        images={productImages}
        tabs={productDetailsTabs}
        variantOptions={variantOptions}
        variantImages={variantImages}
        description={
          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Complete System Value:</h4>
            <ul className="space-y-3 mb-4">
              <li className="flex justify-between items-start gap-3">
                <div className="flex items-start gap-2 flex-1">
                  <svg className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">The Shift™ Necklace + Chain</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 line-through text-sm">$67</span>
                  <span className="font-semibold text-gray-900">$37</span>
                </div>
              </li>
              <li className="flex justify-between items-start gap-3">
                <div className="flex items-start gap-2 flex-1">
                  <svg className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">F.I.R.E. Protocol</span>
                </div>
                <span className="font-semibold text-emerald-600">Free Bonus</span>
              </li>
              <li className="flex justify-between items-start gap-3">
                <div className="flex items-start gap-2 flex-1">
                  <svg className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Guides + Resources</span>
                </div>
                <span className="font-semibold text-emerald-600">Free Bonus</span>
              </li>
              <li className="flex justify-between items-start gap-3">
                <div className="flex items-start gap-2 flex-1">
                  <svg className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <div className="text-gray-700">Early Access to DailyHush App</div>
                    <div className="text-sm text-gray-500 italic">Launches November 15th</div>
                  </div>
                </div>
                <span className="font-semibold text-emerald-600">Free Bonus</span>
              </li>
            </ul>
            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-gray-700">The Shift™ Necklace:</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 line-through">$67</span>
                  <span className="text-2xl font-bold text-emerald-700">$37</span>
                </div>
              </div>
              <div className="text-sm text-emerald-600 font-semibold">
                Quiz-Taker Rate (Save $30)
              </div>
            </div>
            <div className="bg-amber-50 border-l-4 border-amber-400 p-5 rounded">
              <p className="text-base text-gray-700 italic leading-relaxed mb-3">
                "You're getting the research-backed F.I.R.E. Protocol as my gift to you. The Shift gives you something physical to reach for while F.I.R.E. teaches you exactly when and how to use it for maximum relief."
              </p>
              <p className="text-sm text-gray-600">Anna, Founder</p>
            </div>
          </div>
        }
        guarantees={[
          '60-Day Money-Back Guarantee',
          'Keep F.I.R.E. even if returned',
          'Free shipping',
        ]}
        reviewCount={1800}
        reviewRating={4.8}
        shopifyProductId="10770901434671"
        shopifyDomain="t7vyee-kc.myshopify.com"
        shopifyStorefrontAccessToken="a3bc32a7b8116c3f806d7d16e91eadad"
      />

      <div ref={stickySentinelRef} aria-hidden className="pointer-events-none h-px w-full opacity-0" />

      {/* Bonus Offer Section */}
      <ShiftBonusOffer
        imageSrc="https://cdn.shopify.com/s/files/1/0957/4914/4879/files/animated.webp?v=1760876323"
        imageAlt="F.I.R.E. Protocol included free"
        title="F.I.R.E. Protocol included as my gift to you."
        description="Learn exactly when and how to use The Shift for maximum relief. The research-backed F.I.R.E. Protocol teaches you the 4-step framework to interrupt rumination spirals before they steal your day. Discover the science behind extended exhales, master the vagus nerve activation technique, and get step-by-step guidance for using The Shift during your most common spiral triggers. The Shift gives you something physical to reach for while F.I.R.E. teaches you exactly when and how to use it."
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
        totalReviews={1800}
      />

      {/* FAQ */}
      <FAQSection faqs={faqs} />

      {/* Final CTA */}
      <FinalCTA
        backgroundImage="https://cdn.shopify.com/s/files/1/0957/4914/4879/files/ClassicProductImage4Gold.webp?v=1760872696"
        heading="Just Breathe Through It"
        subheading="Stop overthinking spirals in 90 seconds"
        ctaText="Get The Shift - $37"
        productId="10770901434671"
        domain="t7vyee-kc.myshopify.com"
        storefrontAccessToken="a3bc32a7b8116c3f806d7d16e91eadad"
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
        buttonText="Get The Shift™ Pack • $37"
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
