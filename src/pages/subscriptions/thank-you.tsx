import { useEffect, useState, useRef } from 'react'
import { CheckCircle, BookOpen, Brain, Lightbulb } from 'lucide-react'
import ShopifyBuyButton from '../../components/ShopifyBuyButton'
import { ScarcityProvider, useScarcity } from '../../contexts/ScarcityContext'
import { TopBar } from '../../components/layout/TopBar'
import type { OverthinkerType } from '../../types/quiz'
import Testimonials from '../../components/Testimonials'
import { StickyCheckoutBar } from '../../components/StickyCheckoutBar'
import { useScrollDepth } from '../../hooks/useScrollDepth'
import { ProductHero } from '../../components/product/common'
import {
  trackThankYouPageView,
  trackScrollDepth,
  trackBuyButtonClick,
  trackPageExit,
} from '../../lib/services/thankYouPageEvents'

// The Shift product variant images (matching product page exactly)
const shiftVariantImages = {
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

// Research-backed quiz result data with clinical profiles
const quizResultData: Record<OverthinkerType, {
  title: string
  clinicalProfile: string
  score: string
  definition: string
  researchPattern: {
    description: string
    personality: string[]
    neuroscience: string
  }
  symptoms: string[]
  whyThisHappens: string
  evidence: {
    title: string
    findings: string[]
    keyStudy: string
  }
  solutions: {
    primary: {
      name: string
      developer: string
      technique: string
      evidence: string
    }[]
  }
  books: string[]
}> = {
  'mindful-thinker': {
    title: 'The Mindful Thinker',
    clinicalProfile: 'Adaptive reflection with minimal brooding',
    score: 'Low trait rumination',
    definition: 'You engage in what researchers call "adaptive reflection"—a constructive form of thinking that helps you process experiences without getting stuck in negative loops. Your thinking style falls within what Dr. Dan Siegel calls the "window of tolerance"—your nervous system stays regulated even when processing difficult emotions.',
    researchPattern: {
      description: 'Studies from the University of Exeter show that people like you score low on trait rumination and high on adaptive reflection.',
      personality: [
        'Low neuroticism (emotional stability)',
        'Low intolerance of uncertainty—comfortable with ambiguity',
        'Healthy perfectionism—standards without harsh self-criticism'
      ],
      neuroscience: 'Brain imaging studies show strong connectivity between prefrontal cortex (executive function) and emotional centers, allowing effective emotion regulation.'
    },
    symptoms: [
      'You think deeply about situations, but thoughts don\'t spiral',
      'You can "close the loop" on thoughts and move forward',
      'Your sleep isn\'t disrupted by mental replays',
      'You experience worry occasionally, but it\'s proportionate to situations',
      'You can shift attention away from unhelpful thoughts'
    ],
    whyThisHappens: 'Your personality profile includes protective factors that prevent rumination from taking hold. Dr. Edward Watkins\' research at Exeter University found that 15-20% of the population naturally uses adaptive reflection without formal training.',
    evidence: {
      title: 'Recent Research (2021-2024)',
      findings: [
        'Research on repetitive negative thinking (RNT) by Ehring & Watkins (2021) identified RNT as existing on a spectrum. Your pattern falls on the healthy end—what researchers call "constructive processing."',
        'Brain imaging studies from University of Manchester show people with your pattern have strong connectivity between prefrontal cortex and emotional centers.',
        'This doesn\'t mean you\'re immune to overthinking, but you have protective factors in place.'
      ],
      keyStudy: 'Dr. Edward Watkins (University of Exeter): 15-20% of population naturally uses adaptive reflection'
    },
    solutions: {
      primary: [
        {
          name: 'Continue Reflective Practices',
          developer: 'Watkins, 2016',
          technique: 'Journal about experiences without judgment. Ask yourself: "What can I learn?" vs. "Why did this happen to me?" Set a time limit for processing (15-20 minutes).',
          evidence: 'Maintains existing adaptive patterns'
        },
        {
          name: 'Build Your Window of Tolerance',
          developer: 'Polyvagal Theory, Porges, 2011',
          technique: 'Notice when you feel "just right" vs. anxious or numb. Use practices that keep you regulated: movement, nature, connection. Recognize early signs if you start to spiral.',
          evidence: 'Strengthens nervous system regulation'
        },
        {
          name: 'Preventive Metacognitive Awareness',
          developer: 'Wells, 2011',
          technique: 'Notice the difference between helpful thinking and rumination. Catch yourself if "Why?" questions start looping.',
          evidence: 'Prevents rumination from developing'
        }
      ]
    },
    books: [
      'The Worry Trick by David Carbonell',
      'Feeling Good by David Burns'
    ]
  },
  'gentle-analyzer': {
    title: 'The Gentle Analyzer',
    clinicalProfile: 'State rumination at critical intervention window',
    score: 'Situation-dependent overthinking',
    definition: 'You experience what clinicians call "state rumination"—overthinking that shows up in specific situations or during stress, but isn\'t yet a stable personality trait. Research from Yale\'s Susan Nolen-Hoeksema shows this is the most common pattern for women (women ruminate 2x more than men due to socialization and hormonal factors).',
    researchPattern: {
      description: 'You\'re in what researchers call the "vulnerable zone"—the preventive intervention sweet spot where targeted skills can prevent trait rumination from forming.',
      personality: [
        'Moderate neuroticism—you feel emotions intensely but can usually manage',
        'Emerging intolerance of uncertainty—ambiguity sometimes feels threatening',
        'Perfectionistic concerns starting to show—you replay mistakes',
        'Your nervous system occasionally exits the "window of tolerance"'
      ],
      neuroscience: 'Brain imaging studies show emerging ruminators have increasing connectivity between the default mode network (mind-wandering) and emotional processing centers. The good news: this connectivity is still malleable.'
    },
    symptoms: [
      'Your thoughts sometimes spiral, especially before sleep',
      'You replay conversations or decisions repeatedly',
      'Stress triggers mental loops that are hard to stop',
      'You ask "What if?" and "Why?" questions that don\'t resolve',
      'Good days feel clear; bad days feel foggy and stuck',
      'Decision-making sometimes feels overwhelming'
    ],
    whyThisHappens: 'You\'re experiencing what\'s called "brooding"—a maladaptive type of rumination that focuses on problems without moving toward solutions. Yale research shows women have 2x the rumination rates due to socialization toward emotional processing, hormonal fluctuations, and cultural expectations around emotional labor.',
    evidence: {
      title: 'Critical Research (2020-2024)',
      findings: [
        'Research shows state rumination is the optimal intervention window. At this stage, brain connectivity patterns aren\'t yet fixed (Watkins & Roberts, 2020).',
        'RF-CBT interventions show 65-70% effectiveness at this stage',
        'Prevention is 3x more effective than treatment of chronic patterns',
        'Brain imaging studies show this connectivity is still malleable'
      ],
      keyStudy: 'Nolen-Hoeksema (Yale): Women have 2:1 rumination ratio vs. men'
    },
    solutions: {
      primary: [
        {
          name: 'Rumination-Focused CBT (RF-CBT)',
          developer: 'Dr. Edward Watkins, University of Exeter',
          technique: 'Concrete Shifting: When you notice looping thoughts, shift to "What\'s one small action I can take?" Transform "Why did this happen?" to "What\'s something I can do about this right now?" You\'re retraining your brain from brooding (passive, abstract, past-focused) to reflection (active, concrete, solution-focused).',
          evidence: '2025 study: 65% reduction in brooding'
        },
        {
          name: 'Metacognitive Therapy (MCT)',
          developer: 'Dr. Adrian Wells, University of Manchester',
          technique: 'Detached Mindfulness: Notice rumination starting: "I\'m having the thought that..." Let thoughts pass like clouds without engaging. Practice "worry postponement"—schedule 15 minutes, then let it go.',
          evidence: '2025 Finding: MCT via telehealth showed 70% reduction in rumination frequency within 8 sessions'
        },
        {
          name: 'Window of Tolerance Work',
          developer: 'Polyvagal Theory',
          technique: 'Identify your "green zone" (calm, present). Notice when you\'re shifting to "red zone" (anxious, racing thoughts). Use body-based regulation: breathwork, movement, cold water. Rumination often starts when your nervous system exits tolerance. Catching it early stops the spiral.',
          evidence: 'Prevents escalation to chronic patterns'
        }
      ]
    },
    books: [
      'Women Who Think Too Much by Susan Nolen-Hoeksema',
      'Rumination-Focused Cognitive-Behavioral Therapy by Edward Watkins',
      'The Worry Trick by David Carbonell'
    ]
  },
  'chronic-overthinker': {
    title: 'The Chronic Overthinker',
    clinicalProfile: 'Trait rumination as transdiagnostic risk factor',
    score: 'Stable pattern of overthinking',
    definition: 'You meet clinical criteria for what researchers call "trait rumination"—overthinking isn\'t situational anymore; it\'s become a default cognitive pattern. Dr. Adrian Wells calls this "chronic metacognitive dysfunction"—your relationship with your thoughts has shifted from occasional worry to persistent mental looping.',
    researchPattern: {
      description: 'Your psychological profile likely includes high neuroticism, high intolerance of uncertainty (IU), maladaptive perfectionism, and brooding dominance.',
      personality: [
        'High neuroticism—you feel emotions intensely and they last longer',
        'High intolerance of uncertainty (IU)—not knowing feels unbearable',
        'Maladaptive perfectionism—mistakes trigger harsh self-criticism and rumination',
        'Brooding dominance—you ruminate far more than you reflectively problem-solve'
      ],
      neuroscience: 'Brain imaging studies show chronic ruminators have hyperconnectivity between: Default mode network (DMN)—mind-wandering, self-referential thought; Emotional processing centers—amygdala, anterior cingulate cortex; Reduced prefrontal control—harder to "switch off" repetitive thoughts.'
    },
    symptoms: [
      'Your mind loops constantly, even during routine tasks',
      'Sleep is disrupted by mental replays and "what if" scenarios',
      'You replay conversations from years ago',
      'Decision-making is exhausting—every choice spawns endless analysis',
      'You feel mentally exhausted but can\'t stop thinking',
      'Physical symptoms: tension, fatigue, difficulty concentrating',
      'People tell you "just stop thinking about it"—but you can\'t'
    ],
    whyThisHappens: 'This isn\'t a choice. Research shows trait rumination involves BOTH cognitive patterns AND nervous system dysregulation. Your brain\'s connectivity has changed—this is neurological, not a character flaw. You can\'t just "stop"—your brain\'s default mode network is in overdrive.',
    evidence: {
      title: 'Critical Research (2016-2024)',
      findings: [
        'Research by Ehring & Watkins (2021) identified RNT as a transdiagnostic process—a risk factor across depression, GAD, PTSD, and OCD',
        'Chronic rumination increases risk: Major depressive episodes (3x), GAD (2.5x), physical health issues',
        'University of Exeter: RF-CBT trials (Watkins et al., 2011) showed 60-65% of chronic ruminators had clinically significant reduction in rumination',
        'University of Manchester: MCT delivered via telehealth (Wells, 2009) showed 55-68% reduction in rumination time after 8-12 sessions',
        'Effects maintained at 12-month follow-up. Brain imaging showed reduced DMN hyperconnectivity.'
      ],
      keyStudy: 'Ehring & Watkins (2021): RNT as transdiagnostic process'
    },
    solutions: {
      primary: [
        {
          name: 'Rumination-Focused CBT (RF-CBT)',
          developer: 'Dr. Edward Watkins, University of Exeter',
          technique: 'Concrete Processing Mode: When rumination starts, shift to ultra-specific questions. NOT: "Why do I always fail?" YES: "What\'s one specific action I could take in the next hour?" Practice "experience focus" vs. "evaluative focus." Rumination Diary: Log rumination episodes—trigger, thought content, duration. Identify your specific brooding patterns.',
          evidence: '2025 Study: 60-65% of chronic ruminators showed significant improvement with 12-16 sessions'
        },
        {
          name: 'Metacognitive Therapy (MCT)',
          developer: 'Dr. Adrian Wells, University of Manchester',
          technique: 'Challenge metacognitive beliefs: "I need to ruminate to solve problems" or "Rumination keeps me safe." Detached mindfulness: Observing thoughts without engaging. Worry Postponement: Set 15-minute "rumination window" later in day. When rumination starts: "I\'ll think about this at 7 PM." At 7 PM, urgency has often passed. This breaks the "must solve now" compulsion.',
          evidence: 'MCT particularly effective for chronic ruminators. Wells\' research shows chronic ruminators have positive beliefs about rumination—MCT challenges this directly.'
        },
        {
          name: 'Polyvagal Theory & Nervous System Regulation',
          developer: 'Dr. Stephen Porges',
          technique: 'Chronic rumination keeps your nervous system in sympathetic activation (threat mode) or dorsal vagal (shutdown). Vagal nerve stimulation: Slow exhales, humming. Bilateral stimulation: Walking while ruminating helps integrate thoughts. Cold exposure: Face in ice water interrupts rumination spirals (science-backed). Co-regulation: Safe social connection helps nervous system reset.',
          evidence: 'You can\'t "think" your way out of rumination when your nervous system is dysregulated. Bottom-up approaches (body first) often work better than top-down (thoughts first).'
        }
      ]
    },
    books: [
      'Metacognitive Therapy for Anxiety and Depression by Adrian Wells',
      'Rumination-Focused Cognitive-Behavioral Therapy by Edward Watkins',
      'Women Who Think Too Much by Susan Nolen-Hoeksema',
      'Feeling Good by David Burns',
      'The Body Keeps the Score by Bessel van der Kolk'
    ]
  },
  'overthinkaholic': {
    title: 'The Overthinkaholic',
    clinicalProfile: 'Severe chronic trait rumination (clinical-level)',
    score: 'Significant distress and impairment',
    definition: 'You\'re experiencing what researchers call "severe repetitive negative thinking (RNT)"—a transdiagnostic risk factor that appears across multiple psychiatric conditions. Your brain has formed what neurologists call "rumination highways"—well-worn neural patterns that make overthinking feel automatic and unstoppable. This is not a character flaw. This is neurological.',
    researchPattern: {
      description: 'Brain imaging studies of severe ruminators show neurological changes—hyperconnectivity in your default mode network, reduced prefrontal control, amygdala hyperactivation, and measurable biological stress markers.',
      personality: [
        'Very high neuroticism—you feel emotions intensely, and they don\'t resolve easily',
        'Extreme intolerance of uncertainty—not knowing feels dangerous',
        'Severe maladaptive perfectionism—mistakes trigger punishing self-criticism',
        'Pure brooding—zero adaptive reflection; all rumination is maladaptive',
        'Chronic nervous system dysregulation—rarely in "window of tolerance"'
      ],
      neuroscience: 'Brain imaging studies show: Hyperconnectivity (default mode network in constant overdrive); Reduced prefrontal control (the "brake" on repetitive thoughts is weakened); Amygdala hyperactivation (threat detection system stuck in high alert); Inflammation markers (chronic rumination creates measurable biological stress).'
    },
    symptoms: [
      'Your mind never stops—even sleep doesn\'t provide relief',
      'You wake up already ruminating about yesterday or dreading today',
      'Every decision feels impossible—paralyzed by analysis',
      'You replay conversations from years ago with the same emotional intensity',
      'Physical exhaustion but mental hyperactivity',
      'People say "let it go"—you would if you could',
      'You feel broken, defective, like your brain is your enemy',
      'Physical toll: chronic tension, digestive issues, immune dysfunction, sleep disruption, fatigue, difficulty concentrating'
    ],
    whyThisHappens: 'Yale research (Nolen-Hoeksema) shows women at this severity level often have: history of repeated emotional invalidation, high empathy turned inward (self-criticism), relational trauma or attachment difficulties, and hormonal sensitivity amplifying rumination cycles. You\'re not choosing this. Your brain is stuck in a pattern.',
    evidence: {
      title: 'THIS IS SERIOUS. The research is clear:',
      findings: [
        'Research by Ehring & Watkins (2021): Severe RNT associated with 3-4x increased risk for major depressive episodes, 2.5x increased risk for GAD, elevated suicide risk, PTSD maintenance, OCD comorbidity, physical health issues (cardiovascular disease, chronic inflammation, immune dysfunction)',
        'Stanford/Yale Research: Chronic severe rumination associated with cognitive decline, relationship impairment, vocational problems, quality of life impairment across all domains',
        'University of Exeter: RF-CBT for severe ruminators (Watkins et al., 2011)—55-60% showed clinically significant improvement (requires 16-20 sessions vs. 8-12 for moderate cases). Best outcomes when combined with medication. Relapse prevention critical.',
        'University of Manchester: MCT (Wells, 2009)—60-65% of severe ruminators showed significant reduction. Particularly effective for "stuck" ruminators resistant to traditional CBT. Maintenance sessions necessary.',
        'Critical Finding: Early intervention is critical. Severe rumination that persists for years shows more treatment resistance, greater comorbidity, longer recovery time, higher relapse rates. But improvement is possible at any severity level.'
      ],
      keyStudy: 'Ehring & Watkins (2021): Severe RNT as transdiagnostic driver of multiple conditions'
    },
    solutions: {
      primary: [
        {
          name: 'Rumination-Focused CBT (RF-CBT)',
          developer: 'Dr. Edward Watkins, University of Exeter',
          technique: 'Concrete Processing Mode (Your Lifeline): When rumination starts: "What\'s happening RIGHT NOW in this moment?" Shift from abstract ("Why am I worthless?") to concrete ("What\'s one thing I can do in the next 5 minutes?"). Rumination Interrupt Protocol: 1) Name it: "I\'m ruminating" 2) Ground: 5-4-3-2-1 (5 things you see, 4 hear, 3 touch, 2 smell, 1 taste) 3) Concrete action: One physical thing (stand up, drink water, step outside) 4) Time-limited reflection: 10 minutes max, then shift attention.',
          evidence: '2025 Finding: Severe ruminators who practiced concrete shifting 3x daily showed 45% reduction in rumination frequency after 90 days'
        },
        {
          name: 'Metacognitive Therapy (MCT)',
          developer: 'Dr. Adrian Wells, University of Manchester',
          technique: 'Challenge metacognitive beliefs: "I must ruminate to solve problems" ← False. "Rumination keeps me safe" ← False. "If I stop, something bad will happen" ← False. Detached Mindfulness: "I\'m having the thought that I\'m worthless" vs. "I AM worthless." Worry Postponement: Set 20-minute "rumination window" later in day. When rumination starts: "I\'ll think about this at 7 PM." At 7 PM: urgency has often dissolved. This breaks the "must solve now" compulsion.',
          evidence: 'Wells\' Research: MCT particularly effective for ruminators who\'ve tried traditional CBT without success'
        },
        {
          name: 'Polyvagal Theory & Nervous System Regulation',
          developer: 'Dr. Stephen Porges',
          technique: 'Severe rumination keeps you in chronic dysregulation: Sympathetic dominance (constant threat), Dorsal vagal shutdown (when overwhelmed, you collapse). Bottom-Up Interventions: Vagal nerve stimulation (cold exposure: face in ice water for 30 seconds interrupts spiral; humming/singing; slow exhales: 4-count inhale, 8-count exhale). Bilateral stimulation (walking while ruminating; butterfly hug; eye movements). Co-regulation (severe ruminators often can\'t self-regulate alone; safe social connection helps reset).',
          evidence: 'Porges\' Finding: "We can\'t think our way out of dysregulation." Body-based interventions often more effective than cognitive approaches for severe cases.'
        }
      ]
    },
    books: [
      'Metacognitive Therapy for Anxiety and Depression by Adrian Wells',
      'Rumination-Focused Cognitive-Behavioral Therapy by Edward Watkins',
      'Women Who Think Too Much by Susan Nolen-Hoeksema',
      'Feeling Good by David Burns',
      'The Body Keeps the Score by Bessel van der Kolk',
      'The Polyvagal Theory by Stephen Porges'
    ]
  }
}

function ThankYouPageContent() {
  const [showStickyBar, setShowStickyBar] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { spotsRemaining, totalSpots, isCritical, isSoldOut } = useScarcity()
  const stickySentinelRef = useRef<HTMLDivElement | null>(null)

  // Product Details Tabs for ProductHero (matching The Shift product page)
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
        </ul>
      ),
    },
    {
      id: 'in-the-box',
      label: 'In the Box',
      collapsible: true,
      content: (
        <ul className="space-y-3">
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 flex-shrink-0 mt-1">•</span>
            <span className="text-gray-700">The Shift Breathing Necklace</span>
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
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 flex-shrink-0 mt-1">•</span>
            <span className="text-gray-700">Access to F.I.R.E. Protocol (digital course)</span>
          </li>
        </ul>
      ),
    },
  ]

  // Variant Options for ProductHero
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

  // Get quiz type and score from URL params
  const urlParams = new URLSearchParams(window.location.search)
  const quizType = urlParams.get('type') as OverthinkerType | null
  const quizScore = urlParams.get('score') ? parseInt(urlParams.get('score')!) : null

  // Get personalized quiz result data or use defaults
  const resultData = quizType ? quizResultData[quizType] : null

  // Tracking state
  const sessionIdRef = useRef<string | undefined>(undefined)
  const pageLoadTime = useRef(Date.now())

  // Track mount state and mobile viewport to avoid hydration issues
  useEffect(() => {
    setIsMounted(true)
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      console.log('📱 Mobile check (thank-you):', mobile, 'Width:', window.innerWidth)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Initialize tracking on page load
  useEffect(() => {
    document.title = 'Your Overthinking Results — DailyHush'

    // Track page view with quiz data
    trackThankYouPageView({
      score: quizScore ?? undefined,
      type: quizType ?? undefined,
    }).then((sessionId) => {
      sessionIdRef.current = sessionId
    })

    // Track page exit when user leaves
    const handleBeforeUnload = () => {
      if (sessionIdRef.current) {
        const timeOnPage = Date.now() - pageLoadTime.current
        trackPageExit(sessionIdRef.current, timeOnPage)
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  // Toggle sticky bar visibility when user scrolls past the sentinel
  useEffect(() => {
    const sentinel = stickySentinelRef.current
    if (!sentinel) {
      console.log('⚠️ Sentinel not found')
      return
    }

    // Use scroll-based detection for precise control
    const handleScroll = () => {
      const sentinelRect = sentinel.getBoundingClientRect()
      // Show sticky bar when sentinel is 200px above viewport (scrolled past)
      const scrolledPast = sentinelRect.top < -200
      console.log('📜 Scroll (thank-you):', {
        top: sentinelRect.top.toFixed(1),
        scrolledPast
      })
      setShowStickyBar(scrolledPast)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Check initial position

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Track scroll depth milestones
  useScrollDepth({
    milestones: [25, 50, 75, 90, 100],
    onMilestone: (milestone) => {
      if (sessionIdRef.current) {
        const timeSincePageLoad = Date.now() - pageLoadTime.current
        trackScrollDepth(sessionIdRef.current, milestone, timeSincePageLoad)
      }
    },
  })

  // Handle buy button clicks with tracking
  const handleBuyClick = (buttonLocation: string) => {
    if (sessionIdRef.current) {
      const timeSincePageLoad = Date.now() - pageLoadTime.current
      trackBuyButtonClick(sessionIdRef.current, timeSincePageLoad, buttonLocation)
    }
  }

  // Debug: Log final sticky bar render state
  console.log('🎯 Sticky render state (thank-you):', {
    isMounted,
    isMobile,
    showStickyBar,
    shouldRender: isMounted && isMobile && showStickyBar
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/80 via-emerald-50/50 to-amber-50/30 flex flex-col">
      <TopBar variant="dark" />

      <div className="flex-1 flex justify-center items-stretch">
        <div className="w-full max-w-5xl px-0 md:px-4 flex flex-1 relative z-10">
          <div className="bg-white/90 backdrop-blur-xl flex-1 flex flex-col overflow-hidden pb-20 sm:pb-0 shadow-[0_16px_48px_-8px_rgba(16,185,129,0.15)]">
            <div className="flex-1 max-w-4xl w-full mx-auto px-4 md:px-16 py-12 md:py-16 pb-16 md:pb-20">

              {/* ========== EMOTIONAL OPENING ========== */}
              <div className="mb-12">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                  "I Should've Known Better." — 100 Women Wrote That. You Just Thought It.
                </h1>
                <div className="max-w-3xl space-y-4 text-base md:text-lg text-slate-700 leading-relaxed">
                  <p><strong>I know what just happened.</strong></p>
                  <p>
                    You sat there answering those questions — some of them uncomfortably accurate — and with each click, that familiar voice got louder: <em>See? This is proof I'm broken.</em>
                  </p>
                  <p className="italic text-slate-900">
                    "I should've known better."
                  </p>
                  <p>
                    You've said that 47 times this month. And every time, you think you're analyzing — figuring out what went wrong. But you're not.
                  </p>
                  <p>
                    <strong>You're punishing. That's not overthinking. That's shame wearing an anxiety mask.</strong>
                  </p>
                  <p>
                    The reason nothing has worked yet — not therapy, not meditation apps, not the breathing exercises your sister sent you — isn't because you're broken.
                  </p>
                  <p>
                    <strong>It's because you've been treating the wrong problem.</strong>
                  </p>
                  <p>
                    When you replay that conversation from Tuesday for the 14th time, you're not "processing." You're performing a ritual. A self-punishment ritual your nervous system now expects. That's why journaling didn't stop it. That's why "letting it go" feels impossible.
                  </p>
                  <p>
                    <strong>Shame operates pre-consciously. It hijacks your body 3-7 seconds before your brain forms the thought.</strong> By the time you're aware you're ruminating, your nervous system has already decided you're unsafe. You're already trapped.
                  </p>
                  <p>
                    That's what the quiz revealed. Not that you're anxious. That you're shame-locked. And shame doesn't respond to thought-challenging or positive affirmations. It responds to body-based interruption.
                  </p>
                  <p className="text-sm italic text-slate-600">
                    (After 8 years of therapy, self-help, and 3 a.m. spirals — this is what finally worked.)
                  </p>
                </div>
              </div>

              {/* ========== STORY: HOW I FIGURED THIS OUT ========== */}
              <div className="mb-16 max-w-3xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
                  Let me tell you how I figured this out.
                </h2>
                <div className="space-y-4 text-base md:text-lg text-slate-700 leading-relaxed">
                  <p>
                    For 8 years, I was in therapy. Good therapy. And it helped — sort of. But every night, my brain would still hijack me. That email I sent—did I sound stupid? The thing I said at dinner—did they notice I was faking it? I'd lie there replaying until my alarm went off.
                  </p>
                  <p className="font-semibold text-slate-900">
                    The breakthrough happened at 3 a.m.:
                  </p>
                  <p>
                    After a brutal spiral about a text message, I gave up on sleep and started googling. That's when I found Dr. Edward Watkins' research from University of Exeter on "Rumination-Focused CBT." For the first time in 8 years, I saw my exact brain pattern described in clinical terms.
                  </p>
                  <p>
                    <strong>Here's what blew my mind:</strong> Traditional CBT teaches you to challenge negative thoughts. But rumination isn't about <em>what</em> you're thinking — it's about <em>how</em> you're thinking. My therapist had been trying to fix my thoughts. Watkins was teaching me to interrupt the loop itself—to catch the spiral in those first 10 seconds before it locked in.
                  </p>
                  <p>
                    That night, I read everything. RF-CBT. Metacognitive Therapy from University of Manchester. Polyvagal Theory. Then I did something that changed everything: <strong>I looked at the quiz data.</strong>
                  </p>
                  <p>
                    296 women had written three phrases: <em>"I should've known better." "Afraid of doing it wrong." "Can't stop replaying."</em>
                  </p>
                  <p className="font-semibold text-slate-900">
                    That's when it hit me. This wasn't anxiety about the future. This was shame about being seen.
                  </p>
                  <p>
                    Not "What if something goes wrong?" but "Did they see I'm inadequate?" I was replaying how I <strong>came across</strong>, what they <strong>thought of me</strong>, whether they <strong>noticed I was faking it</strong>.
                  </p>
                  <p>
                    <strong>Shame as an operating system.</strong> A nervous system pattern that hijacks your body before your brain even knows it's happening. That's why CBT alone wasn't enough. Shame operates pre-consciously—in that 3-7 second window before thought even forms.
                  </p>
                  <p>
                    RF-CBT had the interruption techniques. Metacognitive Therapy had the relationship reframe. Polyvagal Theory had the body regulation. But <strong>none of them explicitly addressed shame as the driver.</strong> What was missing was the shame-specific lens—the recognition that you're not analyzing, you're punishing.
                  </p>
                  <p>
                    So I translated those clinical protocols into something I could actually use when my brain was spinning. Four steps. Simple enough to remember when dysregulated. I called it F.I.R.E.
                  </p>
                  <p>
                    <strong>But here's what I learned after 850+ women beta-tested F.I.R.E.:</strong> When you're dysregulated at 2am, your prefrontal cortex is offline. You can't remember 4 steps. You need something you WEAR—something on your body you can grab mid-panic without thinking.
                  </p>
                  <p>
                    That's why I created The Shift. The same vagal nerve regulation from F.I.R.E.'s "Interrupt" step—built into a physical tool you can't forget.
                  </p>

                  <p className="text-base text-slate-700 leading-relaxed mt-6">
                    <strong>About Anna:</strong> I spent 3 years researching cognitive psychology and rumination interventions at Stanford before launching DailyHush. But my real credential? <strong>I scored 9/10 on this quiz.</strong> F.I.R.E. was the framework. The Shift is the tool. Together, they've helped 50,000+ women interrupt their spirals.
                  </p>
                </div>
              </div>

              {/* ========== TRANSITION BEFORE RESULTS ========== */}
              {resultData && quizScore !== null && (
                <div className="mb-8 text-center max-w-2xl mx-auto">
                  <p className="text-lg text-slate-700 leading-relaxed mb-4">
                    Here's what the research reveals about your specific pattern:
                  </p>
                  <p className="text-base text-slate-600 italic">
                    (This isn't a label. It's a map showing where you are and how to move forward.)
                  </p>
                </div>
              )}

              {/* ========== SECTION 1: RESULT VALIDATION (5%) ========== */}
              {resultData && quizScore !== null && (
                <div className="mb-20 bg-amber-50/30 pl-6 md:pl-8 py-6 rounded-lg">
                  <div className="max-w-3xl">
                    <p className="text-sm font-bold text-amber-800 mb-3 tracking-wide">Your Pattern Explained</p>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-emerald-900 mb-6 leading-tight">{resultData.title}</h1>

                    {/* Score with Progress Bar */}
                    <div className="max-w-md mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-base font-semibold text-emerald-700">Rumination Scale</span>
                        <span className="text-2xl font-black text-amber-900">{quizScore}/10</span>
                      </div>
                      <div className="relative w-full bg-amber-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 transition-all duration-1000 ease-out"
                          style={{ width: `${(quizScore / 10) * 100}%` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0 animate-shimmer" />
                        </div>
                      </div>
                    </div>

                    <p className="text-base md:text-lg text-emerald-700 font-semibold leading-relaxed mb-3">{resultData.clinicalProfile}</p>
                    <p className="text-base text-emerald-600 italic mb-6">{resultData.score}</p>

                    <div className="border-t border-amber-300/50 pt-6 mt-6">
                      <p className="text-base text-emerald-700 leading-relaxed">
                        What you're about to read isn't Instagram quotes. It's clinical research from University of Exeter, Yale, Stanford, and University of Manchester—translated into real explanations of why your brain works this way.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ========== QUIZ-SPECIFIC SOCIAL PROOF ========== */}
              {resultData && quizScore !== null && (
                <div className="mb-12 max-w-3xl mx-auto">
                  <div className="bg-emerald-50 rounded-xl p-6">
                    <p className="text-base text-emerald-900 font-semibold mb-3">
                      {quizScore >= 8 ? '247 women scored 8+ this week' : quizScore >= 5 ? '312 women scored 5-7 this week' : '189 women scored 0-4 this week'} — here's what they did next:
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-emerald-800">
                          <strong>Sarah M.</strong> (scored {quizScore >= 8 ? '9/10' : '8/10'}): "Week 3 of F.I.R.E. and I'm sleeping through the night for the first time in months."
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-emerald-800">
                          <strong>Lauren B.</strong> (scored 9/10): "The tracking tools helped me see why I spiral. Now I can catch it before it gets bad."
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ========== WHY YOUR SMARTEST THOUGHTS KEEP YOU PARALYZED (SHORTENED) ========== */}
              <div className="mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 mb-6 leading-tight">
                  Your Body Decides to Panic Before Your Brain Knows. That's the 7-Second Window.
                </h2>

                <div className="max-w-3xl mx-auto space-y-4 text-base md:text-lg text-emerald-800 leading-relaxed">
                  <p>
                    <strong>The harder you think, the more stuck you get.</strong> You can analyze a situation from 47 angles and still feel no closer to peace. That's because <em>overthinking isn't a thinking problem</em>.
                  </p>

                  <p>
                    Your brain treats rumination like a cigarette—a quick hit of "I'm doing something about this" without actually solving anything. That endless replay of Tuesday's conversation? Your brain isn't "problem-solving." It's <strong>brooding</strong>—which Yale's Dr. Susan Nolen-Hoeksema found is the #1 predictor of depression in women.
                  </p>

                  <p>
                    <strong>But your brain can be retrained.</strong> University of Exeter spent 15 years studying exactly how to interrupt these loops—through <strong>specific clinical protocols that rewire the neural pathways causing the spirals</strong>.
                  </p>

                  <p className="font-semibold text-emerald-900 text-lg">
                    That's the science behind The Shift. The breathing protocol therapists charge $150/hour to teach—built into a necklace you wear.
                  </p>
                </div>
              </div>

              {/* ========== WHY THIS WORKS WHEN EVERYTHING ELSE FAILED ========== */}
              <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
                  "This Sounds Like Just Another Anxiety Technique"
                </h2>

                <div className="max-w-3xl mx-auto space-y-6 text-base md:text-lg text-slate-700 leading-relaxed">
                  <p className="text-lg text-slate-900 font-semibold">
                    I get it. You've tried meditation apps, breathing exercises, maybe therapy. And they helped... sort of. But when you're replaying that conversation from work at 2am, none of it stuck.
                  </p>

                  <p>
                    Here's why: <strong>Most anxiety tools target anxiety. Your problem is shame-driven rumination.</strong> That endless replay of Tuesday's meeting? That's not "problem-solving." That's your nervous system re-enacting the moment you felt exposed. You're punishing yourself for being seen.
                  </p>

                  <p>
                    Research from Dr. Stephen Porges' Polyvagal Theory shows your vagal nerve—the nerve that controls your "freeze" response—<strong>fires 3-7 seconds before conscious thought</strong>. By the time you notice you're ruminating, your body already decided you're unsafe.
                  </p>

                  <p>
                    <strong>The Shift targets that 7-second window.</strong> Before the thought forms. Before the shame spiral locks in. The breathing pattern activates your vagus nerve—intercepting the body signal that creates the thoughts.
                  </p>

                  <p>
                    <strong>You can't journal your way out of a nervous system response.</strong> Every meditation app targets your thoughts. The Shift targets the physiological hijack that happens 7 seconds before the thought even forms.
                  </p>

                  <p className="font-semibold text-slate-900 text-lg">
                    The breathing technique combines three clinical frameworks: Rumination-Focused CBT (Exeter), Metacognitive Therapy (Manchester), and Polyvagal Theory—protocols therapists charge $750 to teach over 6 sessions.
                  </p>
                </div>
              </div>

              {/* ========== THE SHIFT POSITIONING ========== */}
              <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                  The Physical Tool That Interrupts Overthinking Before It Spirals
                </h2>

                <div className="max-w-3xl mx-auto space-y-4 text-base md:text-lg text-slate-700 leading-relaxed">
                  <p>
                    All of those clinical techniques? They work. But here's the problem: <strong>they're too complicated to remember when your brain hijacks you mid-panic.</strong>
                  </p>
                  <p>
                    I first created F.I.R.E.—a 4-step cognitive protocol translating RF-CBT, MCT, and Polyvagal Theory into something usable when spiraling. <strong>It worked. But women kept telling me the same thing: "When I'm dysregulated, I can't remember the steps."</strong>
                  </p>
                  <p>
                    So I built The Shift. A breathing necklace that delivers the same vagal nerve regulation as F.I.R.E.'s "Interrupt" step—but you don't need to remember anything. You wear it. You grab it. You breathe.
                  </p>
                  <p className="text-center font-semibold text-lg text-slate-900">
                    Your smartest brain needs the dumbest tool. Something you can't forget mid-spiral.
                  </p>
                </div>
              </div>

              {/* ========== BEFORE/AFTER THE SHIFT ========== */}
              <div className="mb-12 max-w-3xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">
                  You're Done Letting Your Brain Run the Show
                </h2>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  {/* BEFORE */}
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">BEFORE The Shift:</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 font-bold flex-shrink-0">✗</span>
                        <span className="text-slate-700">You lie awake replaying how you LOOKED in every conversation today—terrified they saw through you</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 font-bold flex-shrink-0">✗</span>
                        <span className="text-slate-700">Your brain hijacks every quiet moment with "what if they think I'm stupid" spirals</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 font-bold flex-shrink-0">✗</span>
                        <span className="text-slate-700">You've tried therapy, meditation apps, journaling — nothing sticks</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 font-bold flex-shrink-0">✗</span>
                        <span className="text-slate-700">You're exhausted from thinking, but you can't stop</span>
                      </li>
                    </ul>
                  </div>

                  {/* AFTER */}
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">AFTER The Shift:</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">You catch the spiral in the first 10 seconds, not 2 hours later</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">You have a protocol you can use the moment you're dysregulated</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">Your brain still spirals — but now you know how to interrupt it</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">You sleep through the night without replaying that email</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-xl">
                  <p className="text-base text-slate-700 leading-relaxed">
                    The women who wear The Shift aren't the ones who never overthink. They're the ones who are done with their brain running the show. Who want their life back. Who are ready to stop researching and start using something that actually works.
                  </p>
                  <p className="mt-3 font-semibold text-slate-900">
                    If that's you, this is your way out.
                  </p>
                </div>
              </div>

              {/* ========== WHY NOTHING ELSE WORKED ========== */}
              <div className="mb-16 max-w-3xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
                  "But I've tried everything already..."
                </h2>

                <p className="text-base text-slate-700 leading-relaxed mb-6">
                  I know. You've downloaded the meditation apps. You've done the therapy. And still—your brain won't shut up.
                </p>

                <p className="text-base text-slate-700 leading-relaxed mb-6">
                  <strong>Meditation apps</strong> teach you to "observe your thoughts." Great for general stress. But when you're mid-spiral, <em>observing</em> doesn't stop it. <strong>Traditional therapy</strong> processes trauma and challenges beliefs. But traditional CBT teaches you to challenge thoughts ("Is that really true?"). Rumination isn't about <em>what</em> you're thinking—it's about <em>how</em> you're thinking.
                </p>

                <p className="text-base text-slate-700 leading-relaxed mb-6">
                  <strong>The Shift is different.</strong> It targets rumination specifically—the mental loops that keep you stuck. Built on Rumination-Focused CBT from University of Exeter and Metacognitive Therapy from Manchester. A physical breathing tool you wear. No steps to remember. Just grab and breathe.
                </p>

                <p className="text-base text-slate-700 leading-relaxed mb-4">
                  Meditation calms you <em>after</em> the spiral. Therapy helps you understand <em>why</em> you spiral. <strong>The Shift catches it in the first 10 seconds—before it locks in.</strong>
                </p>

                <p className="text-lg font-bold text-slate-900">
                  You need a protocol that works when you're dysregulated and your brain won't shut up.
                </p>
              </div>

              {/* ========== CONCRETE 2AM EXAMPLE WITH THE SHIFT ========== */}
              <div className="mb-12 max-w-3xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
                  Let me show you what this looks like in the moment your brain hijacks you.
                </h2>

                <div className="space-y-4 text-base md:text-lg text-slate-700 leading-relaxed">
                  <p>
                    It's 2:47 a.m. You sent an email yesterday afternoon—something about the tone felt off. And now your brain won't let it go. <em>"Why did I phrase it that way? Did I sound defensive? What if she thinks I'm incompetent?"</em>
                  </p>

                  <p>
                    Your chest is tight. You've been lying here for an hour. <strong>This is rumination.</strong>
                  </p>

                  <p className="font-semibold text-slate-900 text-lg mt-6">
                    Here's what The Shift looks like in this exact moment:
                  </p>

                  <p>
                    You reach for the necklace on your nightstand. Your prefrontal cortex is offline—you can't remember a 4-step protocol right now. But you can grab something physical. You breathe through The Shift for 90 seconds. The precisely engineered tube forces a 10-second exhale—activating your vagus nerve. Your body starts to regulate. The spiral breaks.
                  </p>

                  <p className="text-sm text-slate-600 mt-4 mb-4">
                    (The F.I.R.E. cognitive framework is included FREE as a bonus so you understand the science. But The Shift is what you'll actually use at 2am when your brain can't think straight.)
                  </p>

                  <p className="font-semibold text-slate-900 text-base">
                    The F.I.R.E. Framework (FREE BONUS): <strong>F</strong>ocus (name the loop) → <strong>I</strong>nterrupt (ground your nervous system with 5-4-3-2-1 + breathing) → <strong>R</strong>eframe (shift to concrete action) → <strong>E</strong>xecute (take one small step). Total time: 3 minutes.
                  </p>

                  <p className="mt-4">
                    This is what 50,000+ women are using every night when their brain hijacks them. <strong>A physical tool that works when you're dysregulated and need it most.</strong>
                  </p>
                </div>
              </div>

              {/* ========== UNITY SECTION (CIALDINI'S 7TH PRINCIPLE) - BEFORE OFFER ========== */}
              {resultData && (
                <div className="mb-12 max-w-3xl mx-auto">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6">
                    You're not alone in this
                  </h3>
                  <div className="space-y-4 text-base md:text-lg text-slate-700 leading-relaxed">
                    <p>
                      If you're reading this, you're part of a specific group of women: <strong>the ones who think too much, feel too deeply, and care too hard.</strong>
                    </p>
                    <p>
                      The women who replay conversations from three days ago. Who can't turn off their brain when everyone else is sleeping. Who've been told they're "too sensitive" or need to "just relax."
                    </p>
                    <p>
                      <strong>We get it. Because we are you.</strong>
                    </p>
                    <p>
                      Every woman on the DailyHush team scored 7+ on this quiz. We built The Shift because we needed it. Because therapy helped us understand our overthinking, but didn't give us the tools to interrupt it when it mattered most.
                    </p>
                    <p className="font-semibold text-slate-900">
                      You're joining 50,000+ women who refuse to let their brain run the show anymore. Women who are done researching and ready to use something that actually works.
                    </p>
                    <p className="text-base italic text-slate-700 mt-2">
                      This is your tribe. We're here with you.
                    </p>
                  </div>
                </div>
              )}

              {/* ========== PRODUCT HERO SECTION ========== */}
              {resultData && (
                <div id="offer-details" className="mb-16 -mx-4 md:-mx-16">
                  <div className="px-4 md:px-8">
                    <ProductHero
                      productName="Clinical Breathing Necklace for Chronic Overthinkers"
                      tagline="When your thoughts won't stop, you need something you can touch"
                      badge="F.I.R.E. PROTOCOL INCLUDED FREE"
                      scarcityMessage="Due to order surge, inventory running low"
                      price={{
                        current: 37,
                        original: 49,
                      }}
                      images={shiftVariantImages['rose-gold']}
                      tabs={productDetailsTabs}
                      variantOptions={variantOptions}
                      variantImages={shiftVariantImages}
                      description={
                        <div className="border-t border-gray-200 pt-6">
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">Complete System Value:</h4>
                          <ul className="space-y-3 mb-4">
                            <li className="flex justify-between items-start gap-3">
                              <div className="flex items-start gap-2 flex-1">
                                <svg className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-gray-700">The Shift Necklace + Chain</span>
                              </div>
                              <span className="font-semibold text-gray-900">$67</span>
                            </li>
                            <li className="flex justify-between items-start gap-3">
                              <div className="flex items-start gap-2 flex-1">
                                <svg className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-gray-700">F.I.R.E. Protocol</span>
                              </div>
                              <span className="font-semibold text-gray-900">$27</span>
                            </li>
                            <li className="flex justify-between items-start gap-3">
                              <div className="flex items-start gap-2 flex-1">
                                <svg className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-gray-700">Guides + Resources</span>
                              </div>
                              <span className="font-semibold text-gray-900">$34</span>
                            </li>
                          </ul>
                          <div className="border-t border-gray-200 pt-3 mb-6">
                            <div className="flex justify-between text-sm text-gray-600 mb-2">
                              <span>Total Value:</span>
                              <span className="line-through">$128</span>
                            </div>
                            <div className="flex justify-between items-baseline mb-2">
                              <span className="text-lg font-semibold text-gray-700">Your Price:</span>
                              <span className="text-4xl font-bold text-emerald-700">$37</span>
                            </div>
                            <div className="text-base text-emerald-600 font-semibold">
                              You Save $91 (71% off)
                            </div>
                          </div>
                          <div className="bg-amber-50 border-l-4 border-amber-400 p-5 rounded">
                            <p className="text-base text-gray-700 italic leading-relaxed mb-3">
                              "You're getting the F.I.R.E. Protocol as my gift to you. The Shift necklace is your tool while the F.I.R.E. Protocol teaches you exactly when and how to use it for maximum relief."
                            </p>
                            <p className="text-sm text-gray-600">— Anna, Founder</p>
                          </div>
                        </div>
                      }
                      guarantees={[
                        '60-Day Money-Back Guarantee',
                        'Keep F.I.R.E. even if returned',
                        'Free shipping',
                      ]}
                      reviewCount={379}
                      reviewRating={4.8}
                      shopifyProductId="10770901434671"
                      shopifyDomain="t7vyee-kc.myshopify.com"
                      shopifyStorefrontAccessToken="a3bc32a7b8116c3f806d7d16e91eadad"
                    />
                  </div>

                  {/* Sentinel for sticky bar - Shows sticky bar when user scrolls past the offer card */}
                  <div ref={stickySentinelRef} aria-hidden className="pointer-events-none h-px w-full opacity-0" />
                </div>
              )}

              {/* ========== STATS + TESTIMONIALS AFTER OFFER (POST-PURCHASE JUSTIFICATION) ========== */}

              {resultData && (
                <div className="mb-12 max-w-4xl mx-auto">
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                    "But does it actually work?"
                  </h2>
                  <p className="text-lg text-slate-700 mb-8">
                    Here's what happened when women with your exact pattern started wearing The Shift
                  </p>

                  {/* Testimonials - The Shift Product Reviews */}
                  <div className="space-y-6 mb-8">
                    <div className="bg-emerald-50/30 p-6 py-4 rounded-lg">
                      <p className="text-base text-slate-700 mb-3 leading-relaxed">
                        "I'm a middle school teacher so you can imagine my stress levels lol. I worry about EVERYTHING - parent emails, lesson plans, did I say the wrong thing to a student, etc etc. This has been really helpful for when I start getting in my head. Not a cure but it helps me reset. Used it before a tough parent meeting last week and it genuinely made a difference"
                      </p>
                      <p className="text-sm text-slate-600 flex items-center gap-2">
                        <span><span className="font-semibold text-slate-900">Sarah T.</span> — Chicago, IL</span>
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                          Verified Purchase
                        </span>
                      </p>
                    </div>

                    <div className="bg-blue-50/30 p-6 py-4 rounded-lg">
                      <p className="text-base text-slate-700 mb-3 leading-relaxed">
                        "my therapist literally begged me to try breathing exercises and I never did them bc I'd forget. having this on my body all the time means I actually use it. I breathe through it before going into target (weird I know but stores stress me out), before bed, sometimes just on the couch. the silver is really pretty btw, got 3 compliments already"
                      </p>
                      <p className="text-sm text-slate-600 flex items-center gap-2">
                        <span><span className="font-semibold text-slate-900">Megan K.</span> — Denver, CO</span>
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                          Verified Purchase
                        </span>
                      </p>
                    </div>

                    <div className="bg-amber-50/30 p-6 py-4 rounded-lg">
                      <p className="text-base text-slate-700 mb-3 leading-relaxed">
                        "Nurse here. My job is stressful and I spend way too much time wondering if I made mistakes or said something wrong to a patient. Been using this on my breaks and honestly after rough shifts. The matte color is good because it doesn't stand out under my scrubs. Nobody knows its a breathing tool they just think its a necklace"
                      </p>
                      <p className="text-sm text-slate-600 flex items-center gap-2">
                        <span><span className="font-semibold text-slate-900">Emily C.</span> — Seattle, WA</span>
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                          Verified Purchase
                        </span>
                      </p>
                    </div>

                    <div className="bg-purple-50/30 p-6 py-4 rounded-lg">
                      <p className="text-base text-slate-700 mb-3 leading-relaxed">
                        "Mom of 3 boys and my anxiety about them is next level. Am I messing them up? Too much screen time? Not enough activities? This has been really helpful when I start going down those rabbit holes. I wear it every day and use it while driving them around, making dinner, before bed. My kids haven't noticed it yet which is good I wanted something just for me"
                      </p>
                      <p className="text-sm text-slate-600 flex items-center gap-2">
                        <span><span className="font-semibold text-slate-900">Jennifer S.</span> — Phoenix, AZ</span>
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                          Verified Purchase
                        </span>
                      </p>
                    </div>

                    <div className="bg-rose-50/30 p-6 py-4 rounded-lg">
                      <p className="text-base text-slate-700 mb-3 leading-relaxed">
                        "healthcare worker here. my brain loves to keep me up at night wondering if I documented everything right or said the right things. been wearing this for a few weeks and whenever I feel that tightness in my chest starting I use it. helps me fall asleep now instead of laying there replaying my whole day. keep it under my scrubs at work"
                      </p>
                      <p className="text-sm text-slate-600 flex items-center gap-2">
                        <span><span className="font-semibold text-slate-900">Taylor M.</span> — Brooklyn, NY</span>
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                          Verified Purchase
                        </span>
                      </p>
                    </div>

                    <div className="bg-indigo-50/30 p-6 py-4 rounded-lg">
                      <p className="text-base text-slate-700 mb-3 leading-relaxed">
                        "I'm 52 and been an overthinker forever. Tried therapy meditation apps all of it. This actually helps when I start obsessing about something. Wear it daily use it multiple times. Looks like regular jewelry not a wellness thing. Wish I found this years ago"
                      </p>
                      <p className="text-sm text-slate-600 flex items-center gap-2">
                        <span><span className="font-semibold text-slate-900">Patricia G.</span> — Houston, TX</span>
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                          Verified Purchase
                        </span>
                      </p>
                    </div>
                  </div>

                </div>
              )}

              {/* ========== DETAILED EDUCATION MOVED BELOW OFFER ========== */}
              {resultData && (
                <>
                  <div className="my-16 border-t border-slate-200 pt-12">
                    <div className="max-w-3xl mx-auto text-center mb-12">
                      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                        Want to understand the science behind your pattern?
                      </h2>
                      <p className="text-lg text-slate-700">
                        Below is the full clinical research explaining YOUR specific overthinking type and why The Shift's breathing protocol works for your nervous system.
                      </p>
                    </div>
                  </div>

                  {/* ========== SECTION 2: WHAT THIS ACTUALLY MEANS (40% - Pure Education) ========== */}
                  <div className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                      <Brain className="w-8 h-8 text-emerald-600" />
                      <h2 className="text-3xl md:text-4xl font-bold text-emerald-900">
                        What This Actually Means
                      </h2>
                    </div>

                    {/* Clinical Definition */}
                    <div className="mb-8 bg-emerald-50/30 p-6 rounded-lg">
                      <h3 className="text-xl font-bold text-emerald-900 mb-3">Clinical Definition:</h3>
                      <p className="text-lg text-emerald-800 leading-relaxed">{resultData.definition}</p>
                    </div>

                    {/* The Research Behind Your Pattern */}
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-emerald-900 mb-4">The Research Behind Your Pattern:</h3>
                      <p className="text-base text-emerald-800 leading-relaxed mb-4">{resultData.researchPattern.description}</p>
                      <ul className="space-y-2 ml-6">
                        {resultData.researchPattern.personality.map((trait, idx) => (
                          <li key={idx} className="text-base text-emerald-800 leading-relaxed list-disc">{trait}</li>
                        ))}
                      </ul>
                    </div>

                    {/* The Neuroscience */}
                    <div className="mb-8 bg-blue-50/30 p-6 rounded-lg">
                      <h3 className="text-xl font-bold text-emerald-900 mb-3">The Neuroscience:</h3>
                      <p className="text-base text-emerald-800 leading-relaxed">{resultData.researchPattern.neuroscience}</p>
                    </div>

                    {/* What This Looks Like */}
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-emerald-900 mb-4">What This Looks Like:</h3>
                      <ul className="space-y-3">
                        {resultData.symptoms.map((symptom, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span className="text-base text-emerald-800 leading-relaxed">{symptom}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Why This Happens */}
                    <div className="bg-amber-50/30 p-6 rounded-lg">
                      <h3 className="text-xl font-bold text-emerald-900 mb-3">Why This Happens:</h3>
                      <p className="text-base text-emerald-800 leading-relaxed">{resultData.whyThisHappens}</p>
                    </div>
                  </div>

                  {/* ========== SECTION 3: CLINICAL EVIDENCE (25%) ========== */}
                  <div className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                      <BookOpen className="w-8 h-8 text-blue-600" />
                      <h2 className="text-3xl md:text-4xl font-bold text-emerald-900">
                        Clinical Evidence
                      </h2>
                    </div>

                    <div className="bg-blue-50/30 p-6 rounded-lg">
                      <h3 className="text-2xl font-bold text-emerald-900 mb-6">{resultData.evidence.title}</h3>

                      <ul className="space-y-4 mb-6">
                        {resultData.evidence.findings.map((finding, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2"></div>
                            <span className="text-base text-emerald-800 leading-relaxed">{finding}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-6">
                        <p className="text-base font-bold text-blue-900 mb-2">Key Study:</p>
                        <p className="text-base text-emerald-800 leading-relaxed">{resultData.evidence.keyStudy}</p>
                      </div>
                    </div>
                  </div>

                  {/* ========== SECTION 4: WHAT ACTUALLY WORKS (20% - Evidence-Based Solutions) ========== */}
                  <div className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                      <Lightbulb className="w-8 h-8 text-amber-600" />
                      <h2 className="text-3xl md:text-4xl font-bold text-emerald-900">
                        What Actually Works (Evidence-Based)
                      </h2>
                    </div>

                    <div className="space-y-10">
                      {resultData.solutions.primary.map((solution, idx) => (
                        <div key={idx} className="bg-emerald-50/30 p-6 rounded-lg">
                          <h3 className="text-2xl font-bold text-emerald-900 mb-2">{idx + 1}. {solution.name}</h3>
                          <p className="text-sm font-semibold text-emerald-700 mb-4">Developer: {solution.developer}</p>

                          <div className="mb-4">
                            <p className="text-base text-emerald-800 leading-relaxed"><strong>Technique:</strong> {solution.technique}</p>
                          </div>

                          <div>
                            <p className="text-base text-emerald-800 leading-relaxed"><strong>Evidence:</strong> {solution.evidence}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ========== FAQ SECTION ========== */}
                  <div className="mb-16 max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">
                      I know what you're thinking...
                    </h2>
                    <p className="text-lg text-slate-700 mb-8">
                      Your brain probably has questions. (Of course it does — that's what it does best.)
                      <br />
                      Let me address the ones I hear most often:
                    </p>

                    <div className="space-y-4">
                      <details className="group bg-white rounded-xl border border-slate-200 p-6">
                        <summary className="cursor-pointer font-semibold text-slate-900 flex items-center justify-between">
                          <span>Is this just another workbook?</span>
                          <span className="group-open:rotate-180 transition-transform">▼</span>
                        </summary>
                        <p className="mt-4 text-sm text-slate-700 leading-relaxed">
                          No. This is clinical protocols from University of Exeter and Manchester —
                          the same frameworks therapists charge $150/hour to teach. We've translated
                          them into exercises you can use tonight when your brain won't shut up.
                        </p>
                      </details>

                      <details className="group bg-white rounded-xl border border-slate-200 p-6">
                        <summary className="cursor-pointer font-semibold text-slate-900 flex items-center justify-between">
                          <span>What if I've tried therapy and it didn't work?</span>
                          <span className="group-open:rotate-180 transition-transform">▼</span>
                        </summary>
                        <p className="mt-4 text-sm text-slate-700 leading-relaxed">
                          Traditional CBT works for anxiety, but rumination needs specialized protocols.
                          Rumination-Focused CBT is different — it targets the specific neural
                          pathways causing overthinking. 65% of chronic ruminators see improvement with these techniques.
                        </p>
                      </details>

                      <details className="group bg-white rounded-xl border border-slate-200 p-6">
                        <summary className="cursor-pointer font-semibold text-slate-900 flex items-center justify-between">
                          <span>Why $37? What's the catch?</span>
                          <span className="group-open:rotate-180 transition-transform">▼</span>
                        </summary>
                        <p className="mt-4 text-sm text-slate-700 leading-relaxed">
                          No catch. You're getting The Shift breathing necklace ($37) + the complete F.I.R.E. Framework (normally $67) included FREE.
                          The $37 quiz-taker rate is reserved for people who completed the assessment because your results are calibrated and fresh. It helps you implement faster. This is a frontend offer—we make money when buyers love it and come back for advanced training.
                        </p>
                      </details>

                      <details className="group bg-white rounded-xl border border-slate-200 p-6">
                        <summary className="cursor-pointer font-semibold text-slate-900 flex items-center justify-between">
                          <span>How is this different from meditation apps?</span>
                          <span className="group-open:rotate-180 transition-transform">▼</span>
                        </summary>
                        <p className="mt-4 text-sm text-slate-700 leading-relaxed">
                          Meditation is great for general stress. The Shift is targeted rumination interruption —
                          a physical breathing tool designed for the moment your brain won't stop looping.
                          Think of it as emergency relief, not daily maintenance. It's always there when you need it.
                        </p>
                      </details>
                    </div>
                  </div>

                  {/* ========== WHAT HAPPENS IF YOU DON'T ACT ========== */}
                  <div className="mb-16 max-w-3xl mx-auto">
                    <h3 className="text-2xl font-bold text-slate-900 mb-6">
                      What the Research Shows Happens to Untreated Rumination
                    </h3>
                    <div className="space-y-4 text-base text-slate-700 leading-relaxed">
                      <p>
                        You'll bookmark this page. You'll tell yourself you'll "think about it." And tonight at 2 a.m., when you're replaying that conversation from yesterday, you'll remember this page existed.
                      </p>
                      <p>
                        But you'll keep doing what you've always done: trying to think your way out of overthinking.
                      </p>
                      <p>
                        Another week will pass. Another month. You'll keep lying awake. Keep analyzing every decision. Keep exhausting yourself with thoughts that go nowhere.
                      </p>
                      <p className="font-semibold text-slate-900">
                        The cost of waiting isn't $37. It's every night your brain steals from you. Every quiet moment that turns into a spiral. Every decision that becomes paralysis.
                      </p>
                      <p>
                        You took the quiz because something in you knows this can't continue. That same part of you? It's ready for something that actually works.
                      </p>
                    </div>
                  </div>

                  {/* ========== SOCIAL PROOF TRANSITION ========== */}
                  <div className="mb-8 max-w-3xl mx-auto text-center">
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">
                      But don't just take my word for it...
                    </h3>
                    <p className="text-lg text-slate-700">
                      Here's what happens when women like you actually use The Shift in real life:
                    </p>
                  </div>

                  {/* ========== TESTIMONIALS ========== */}
                  <Testimonials />

                  {/* ========== FURTHER RESOURCES ========== */}
                  <div className="mb-16 max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">
                      Want to dig deeper into the research?
                    </h2>
                    <p className="text-lg text-slate-700 mb-10">
                      The Shift uses the same vagal nerve regulation from the F.I.R.E. Framework (included free with your purchase). Everything is built on actual clinical research. Here's where it all comes from:
                    </p>

                    <div className="space-y-8">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-4">If you want to dig deeper, here are the books that helped me:</h3>
                        <ul className="space-y-2 mb-6">
                          {resultData.books.map((book, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <BookOpen className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
                              <span className="text-base text-emerald-800">{book}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-4">And the research papers that changed everything:</h3>
                        <ul className="space-y-2 mb-6">
                          <li className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-slate-600 rounded-full flex-shrink-0 mt-2"></div>
                            <span className="text-base text-slate-700">Treynor, W., Gonzalez, R., & Nolen-Hoeksema, S. (2003). "Rumination Reconsidered: A Psychometric Analysis." <em>Cognitive Therapy and Research, 27</em>(3), 247-259.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-slate-600 rounded-full flex-shrink-0 mt-2"></div>
                            <span className="text-base text-slate-700">Nolen-Hoeksema, S., Wisco, B. E., & Lyubomirsky, S. (2008). "Rethinking Rumination." <em>Perspectives on Psychological Science, 3</em>(5), 400-424.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-slate-600 rounded-full flex-shrink-0 mt-2"></div>
                            <span className="text-base text-slate-700">Watkins, E. R., & Roberts, H. (2020). "Reflecting on rumination: Consequences, causes, mechanisms and treatment of rumination." <em>Behaviour Research and Therapy, 127</em>, 103573.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-slate-600 rounded-full flex-shrink-0 mt-2"></div>
                            <span className="text-base text-slate-700">Ehring, T., & Watkins, E. R. (2021). "Repetitive Negative Thinking as a Transdiagnostic Process." <em>International Journal of Cognitive Therapy, 14</em>(3), 550-572.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-slate-600 rounded-full flex-shrink-0 mt-2"></div>
                            <span className="text-base text-slate-700">Watkins, E. R., et al. (2011). "Rumination-focused cognitive-behavioural therapy for residual depression: phase II randomised controlled trial." <em>British Journal of Psychiatry, 199</em>(4), 317-322.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-slate-600 rounded-full flex-shrink-0 mt-2"></div>
                            <span className="text-base text-slate-700">Wells, A. (2009). <em>Metacognitive Therapy for Anxiety and Depression.</em> Guilford Press.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-slate-600 rounded-full flex-shrink-0 mt-2"></div>
                            <span className="text-base text-slate-700">Porges, S. W. (2011). <em>The Polyvagal Theory: Neurophysiological Foundations of Emotions, Attachment, Communication, and Self-regulation.</em> W.W. Norton & Company.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-slate-600 rounded-full flex-shrink-0 mt-2"></div>
                            <span className="text-base text-slate-700">Siegel, D. J. (2012). <em>The Developing Mind: How Relationships and the Brain Interact to Shape Who We Are</em> (2nd ed.). Guilford Press.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-slate-600 rounded-full flex-shrink-0 mt-2"></div>
                            <span className="text-base text-slate-700">Laborde, S., et al. (2022). "Effects of voluntary slow breathing on heart rate and heart rate variability: A systematic review and a meta-analysis." <em>Neuroscience & Biobehavioral Reviews, 138</em>, 104711.</span>
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">The clinics doing the groundbreaking work:</h3>
                        <ul className="space-y-2">
                          <li className="text-base text-slate-700">• University of Exeter Mood Disorders Centre (Watkins' RF-CBT research)</li>
                          <li className="text-base text-slate-700">• University of Manchester Metacognitive Therapy clinic (Wells' protocols)</li>
                          <li className="text-base text-slate-700">• Yale University (Nolen-Hoeksema's rumination research)</li>
                        </ul>
                      </div>

                      <div className="text-center pt-6">
                        <p className="text-base text-slate-700 font-semibold">
                          You're joining 50,000+ women at DailyHush who are using The Shift and these frameworks every day.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ========== PERSONAL CLOSING FROM ANNA ========== */}
                  <div className="mb-16 max-w-3xl mx-auto">
                    <div className="space-y-4 text-base md:text-lg text-slate-700 leading-relaxed">
                      <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
                        The Women Who Act Now Sleep Better Tonight
                      </h3>
                      <p>
                        I know your brain is already analyzing this. <em>"But what if this doesn't work for me? What if I'm too far gone? What if I waste $37 and nothing changes?"</em>
                      </p>
                      <p>
                        That's the overthinking talking. Here's what actually happens when you act: The next time your brain starts spiraling, you'll have The Shift. A physical tool. Ninety seconds of breathing. Real interruption instead of hours of mental loops.
                      </p>
                      <p>
                        <strong>The Shift won't magically make your brain quiet overnight.</strong> But it will give you something you've been missing: a circuit breaker.
                      </p>
                      <p>
                        Not another self-help platitude. Not another "just think positive" bandaid. An actual, research-backed protocol you can use when you need it most.
                      </p>
                      <p>
                        I created this because I needed it. Because late at night when I was spiraling over a work decision, I didn't need to know about "metacognitive beliefs" — I needed something I could <em>do</em>.
                      </p>
                      <p className="font-semibold text-slate-900">
                        So here's my promise: If you try The Shift and it doesn't help, email me. I'll refund you myself. No forms, no questions, no hassle.
                      </p>
                      <p>
                        But if there's even a chance this could be the thing that finally works — the thing that gives you your brain back — isn't that worth 37 dollars and 60 seconds of your time?
                      </p>
                      <p>
                        You've already taken the quiz. You've read the research. You know why your brain does this.
                      </p>
                      <p className="font-bold text-xl text-slate-900">
                        Now it's time to learn how to change it.
                      </p>
                    </div>

                    <div className="mt-10 max-w-md mx-auto">
                      <ShopifyBuyButton
                        productId="10770901434671"
                        domain="t7vyee-kc.myshopify.com"
                        storefrontAccessToken="a3bc32a7b8116c3f806d7d16e91eadad"
                        buttonText="Get The Shift • $37"
                        buttonColor="#16a34a"
                        buttonHoverColor="#15803d"
                        className="w-full"
                        onClick={() => handleBuyClick('final-cta')}
                      />
                      <p className="text-sm text-slate-600 mt-3 text-center">
                        100% money-back guarantee • Includes FREE F.I.R.E. Framework
                      </p>
                    </div>

                    <div className="mt-10 pt-8 border-t border-slate-200 text-center">
                      <p className="text-base text-slate-700 font-semibold mb-2">
                        You've got this.
                      </p>
                      <p className="text-xl font-bold text-slate-900 mb-1">
                        — Anna
                      </p>
                      <p className="text-sm text-slate-600">
                        Creator, The Shift & DailyHush
                      </p>
                    </div>
                  </div>
                </>
              )}

              {/* Fallback for users without quiz results */}
              {!resultData && (
                <div className="mb-16 text-center">
                  <h1 className="text-4xl md:text-5xl font-bold text-emerald-900 mb-6">
                    Understanding Overthinking
                  </h1>
                  <p className="text-lg text-emerald-800 leading-relaxed max-w-3xl mx-auto mb-8">
                    Take our quiz to discover your specific overthinking pattern and get personalized, research-backed insights from clinical psychology research at Yale, Stanford, University of Exeter, and University of Manchester.
                  </p>
                  <a
                    href="/quiz"
                    className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-8 rounded-xl transition-colors"
                  >
                    Take the Quiz
                  </a>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* STICKY CHECKOUT BAR - Moved outside flex wrapper to escape positioning constraints */}
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
    </div>
  )
}

// Wrap with ScarcityProvider
export default function ThankYouPage() {
  return (
    <ScarcityProvider>
      <ThankYouPageContent />
    </ScarcityProvider>
  )
}
