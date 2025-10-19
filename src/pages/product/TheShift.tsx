import { Layout } from '@/components/layout/Layout'
import {
  ProductHero,
  SocialProofStats,
  FAQSection,
  FinalCTA,
} from '@/components/product/common'
import {
  ShiftHowItWorks,
  ShiftEducational,
  ShiftTestimonials,
} from '@/components/product/shift'

export default function TheShiftPage() {
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
      number: 87,
      suffix: '%',
      description: 'of overthinkers felt noticeably calmer within first use',
    },
    {
      number: 90,
      suffix: 's',
      description: 'to interrupt a spiraling thought pattern',
    },
    {
      number: 83,
      suffix: '%',
      description: 'use it daily as their #1 overthinking tool',
    },
  ]

  // How It Works Steps
  const steps = [
    {
      number: 1,
      icon: '🧠',
      title: 'Thoughts Start Spiraling',
      description: "You notice you're in a loop. Same thought, over and over.",
    },
    {
      number: 2,
      icon: '🪙',
      title: 'Grab Your Necklace',
      description: 'Hold it to your lips. This is your pattern interrupt.',
    },
    {
      number: 3,
      icon: '💨',
      title: 'Exhale Slowly',
      description: 'Breathe out through the small opening. Takes 5-8 seconds. Your exhale becomes 2x your inhale automatically.',
    },
    {
      number: 4,
      icon: '✨',
      title: 'Feel the Shift',
      description: 'By the 3rd breath (90 seconds), your nervous system calms down. Spiral interrupted.',
    },
  ]

  // Educational Blocks
  const educationalBlocks = [
    {
      title: 'Your Brain Gets Stuck in Loops',
      content: [
        "As an overthinker, your brain replays the same thoughts over and over. The more you try to 'think your way out,' the deeper you spiral. You need a pattern interrupt.",
        'The Shift gives you something physical to DO when thoughts won\'t stop. Instead of fighting your brain, you redirect it.',
      ],
      imageSrc: 'https://cdn.shopify.com/s/files/1/0957/4914/4879/files/gold_lifestyle1.webp?v=1760872696',
      imageAlt: 'The Shift breathing necklace in use',
      layout: 'image-left' as const,
    },
    {
      title: 'Breathing Activates Your Calm Switch',
      content: [
        "When you exhale for 2x longer than you inhale, it signals your vagus nerve to activate. This is your body's 'rest and digest' mode - the opposite of overthinking/anxiety.",
        "The Shift's design naturally extends your exhale. You don't have to count or think. Just breathe.",
      ],
      imageSrc: 'https://cdn.shopify.com/s/files/1/0957/4914/4879/files/closeup.webp?v=1760872688',
      imageAlt: 'Close-up of The Shift breathing mechanism',
      layout: 'image-right' as const,
    },
  ]

  // Testimonials
  const testimonials = [
    {
      quote: "I used to spiral for HOURS. Now I grab my necklace and I'm calm in 90 seconds. Life-changing.",
      author: 'Sarah K.',
      role: 'Ruminator Type',
    },
    {
      quote: "It's so discreet. I use it in meetings when I feel myself starting to overthink. Nobody even notices.",
      author: 'Jessica M.',
      role: 'Spiraler Type',
    },
    {
      quote: "The rose gold is GORGEOUS. I get compliments weekly. Little do they know it's also my anxiety tool.",
      author: 'Amanda R.',
      role: 'Catastrophizer Type',
    },
    {
      quote: 'I was skeptical - how can a necklace help? But the first time I used it during a work presentation, it literally saved me.',
      author: 'Michael T.',
      role: 'Catastrophizer Type',
    },
    {
      quote: "My therapist recommended breathing exercises but I could never remember to do them. This necklace is always there when I need it.",
      author: 'Lisa W.',
      role: 'Ruminator Type',
    },
    {
      quote: "I've tried everything for my anxiety. This is the first thing that works instantly without making me feel weird.",
      author: 'David C.',
      role: 'Spiraler Type',
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

  return (
    <Layout>
      {/* Hero Section */}
      <ProductHero
        productName="The Shift"
        tagline="Stop Overthinking Spirals in 90 Seconds"
        badge="AS SEEN IN QUIZ RESULTS"
        price={{
          current: 37,
          original: 49,
        }}
        images={productImages}
        variantOptions={variantOptions}
        guarantees={[
          '60-day money-back guarantee',
          'Free shipping (US)',
          '2-3 week delivery',
        ]}
        reviewCount={379}
        reviewRating={4.8}
        description="The discreet breathing necklace designed specifically for women who can't turn their brain off. When racing thoughts won't stop, grab your necklace and breathe - it works like a reset button for your nervous system."
      />

      {/* Social Proof Stats */}
      <SocialProofStats stats={stats} backgroundColor="cream" />

      {/* Educational Section */}
      <ShiftEducational blocks={educationalBlocks} />

      {/* How It Works */}
      <ShiftHowItWorks steps={steps} />

      {/* Testimonials */}
      <ShiftTestimonials testimonials={testimonials} />

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
    </Layout>
  )
}
