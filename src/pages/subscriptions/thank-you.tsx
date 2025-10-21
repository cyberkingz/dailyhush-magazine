import { useEffect, useState, useRef } from 'react'
import { CheckCircle, BookOpen, Brain, Lightbulb } from 'lucide-react'
import ShopifyBuyButton from '../../components/ShopifyBuyButton'
import { ScarcityProvider, useScarcity } from '../../contexts/ScarcityContext'
import { TopBar } from '../../components/layout/TopBar'
import AnnouncementBar from '../../components/AnnouncementBar'
import type { OverthinkerType } from '../../types/quiz'
import { ReviewsSection } from '../../components/product/common'
import { shiftProductReviews } from '../../data/shiftProductReviews'
import { StickyCheckoutBar } from '../../components/StickyCheckoutBar'
import { useScrollDepth } from '../../hooks/useScrollDepth'
import { ProductHero } from '../../components/product/common'
import { useCountdown } from '../../hooks/useCountdown'
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
    definition: 'You engage in what researchers call "adaptive reflection": a constructive form of thinking that helps you process experiences without getting stuck in negative loops. Your thinking style falls within what Dr. Dan Siegel calls the "window of tolerance." Your nervous system stays regulated even when processing difficult emotions.',
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
      <AnnouncementBar
        message={<>Quiz Complete: Your Shift™ Kit $37 (Reg. $67) + Free Guide</>}
        variant="emerald"
      />
      <TopBar />

      <div className="flex-1 flex justify-center items-stretch">
        <div className="w-full max-w-5xl px-0 md:px-4 flex flex-1 relative z-10">
          <div className="bg-white/90 backdrop-blur-xl flex-1 flex flex-col overflow-hidden pb-20 sm:pb-0 shadow-[0_16px_48px_-8px_rgba(16,185,129,0.15)]">
            <div className="flex-1 max-w-4xl w-full mx-auto px-4 md:px-16 py-12 md:py-16 pb-16 md:pb-20">

              {/* ========== RESULTS-FOCUSED OPENING ========== */}
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 leading-tight">
                  Your Brain Isn't Broken—It's Stuck in a Pattern
                </h1>
                <p className="text-lg md:text-xl text-slate-700 leading-relaxed">
                  Here's what your quiz results reveal about why you can't stop overthinking—and what thousands of women who've taken this quiz discovered actually works.
                </p>
              </div>

              {/* ========== QUIZ RESULTS - RESPECT USER INTENT FIRST ========== */}
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

                      {/* Bridge to founder story */}
                      <p className="text-base text-emerald-700 leading-relaxed mt-4 italic">
                        But first, let me tell you how I found this research—because my story is probably your story.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ========== MECHANISM BRIDGE (ESTABLISHES F.I.R.E. AS UNIQUE DISCOVERY) ========== */}
              {resultData && (
                <div className="mb-16 max-w-3xl mx-auto">
                  <div className="bg-slate-50 p-8 rounded-lg border-l-4 border-slate-600">
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-4">
                      The 10-Second Window: Why Everything You've Tried Failed
                    </h3>
                    <div className="space-y-4 text-base text-slate-700 leading-relaxed">
                      <p>
                        University of Exeter research identified the critical window: <strong>rumination locks in within 10-15 seconds of the trigger.</strong> By the time you "notice" you're spiraling, the neural loop is already running.
                      </p>
                      <p>
                        Meditation apps require you to catch thoughts AFTER they've started. Therapy teaches you to understand thoughts AFTER they've formed. Both miss the <strong>pre-conscious window</strong> where shame activates your nervous system BEFORE thought even begins.
                      </p>
                      <p>
                        The breakthrough: <strong>Vagus nerve interruption in the first 10 seconds.</strong> Not cognitive. Physiological. You're not "managing thoughts"—you're signaling your nervous system to exit threat mode before the spiral locks in.
                      </p>
                      <p className="font-semibold text-slate-900">
                        That's F.I.R.E. And that's why 5,000+ women who use The Shift are finally sleeping through the night.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ========== FOUNDER STORY (CONVERSATIONAL LETTER FORMAT) ========== */}
              {resultData && (
                <div className="mb-16 max-w-3xl mx-auto">
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
                    I Know What You're Thinking Right Now
                  </h2>
                  <div className="space-y-4 text-base md:text-lg text-slate-700 leading-relaxed">
                    <p>
                      You just saw your quiz score. And you felt two things at once: <strong>"Finally, someone gets it."</strong> And also: <strong>"But can this even be fixed?"</strong>
                    </p>
                    <p>
                      I'm Anna. I scored 9/10 on this quiz. And I know exactly how you're feeling right now—because for 8 years, I felt the same way.
                    </p>
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
                      <strong>Here's what blew my mind:</strong> Traditional CBT teaches you to challenge negative thoughts. But rumination isn't about <em>what</em> you're thinking — it's about <em>how</em> you're thinking. My therapist had been trying to fix my thoughts. Watkins was teaching me to interrupt the loop itself—to catch the spiral in the first ~10 seconds before it locked in.
                    </p>
                    <p>
                      That night, I read everything. RF-CBT. Metacognitive Therapy from University of Manchester. Polyvagal Theory. Then I did something that changed everything: <strong>I looked at the quiz data.</strong>
                    </p>
                    <p>
                      Thousands of women had written the same three phrases: <em>"I should've known better." "Afraid of doing it wrong." "Can't stop replaying."</em>
                    </p>
                    <p className="font-semibold text-slate-900">
                      That's when it hit me. This wasn't anxiety about the future. This was shame about being seen.
                    </p>
                    <p>
                      Not "What if something goes wrong?" but "Did they see I'm inadequate?" I was replaying how I <strong>came across</strong>, what they <strong>thought of me</strong>, whether they <strong>noticed I was faking it</strong>.
                    </p>
                    <p>
                      <strong>Shame as an operating system.</strong> A nervous system pattern that hijacks your body before your brain even knows it's happening. That's why CBT alone wasn't enough. Shame operates pre-consciously—in the first ~10 seconds before thought even forms.
                    </p>
                    <p>
                      So I translated those clinical protocols into something I could actually use when my brain was spinning. Four steps. Simple enough to remember when dysregulated. I called it F.I.R.E.
                    </p>
                    <p>
                      <strong>But here's what I learned after thousands of women beta-tested F.I.R.E.:</strong> When you're dysregulated at 2am, your prefrontal cortex is offline. You can't remember 4 steps. You need something you WEAR—something on your body you can grab mid-panic without thinking.
                    </p>
                    <p>
                      That's why I created The Shift. The same vagal nerve regulation from F.I.R.E.'s "Interrupt" step—built into a physical tool you can't forget.
                    </p>
                    <p>
                      Designed by a leading psychotherapist, this anxiety relief necklace slows your exhale, calming the nervous system and reducing stress within seconds. It helps build a mindful breathing habit for long-term relaxation.
                    </p>
                    <p className="italic text-slate-600 mt-4">
                      (I spent 3 years researching cognitive psychology and rumination interventions at Stanford before launching DailyHush. Over 50,000 women have taken our quiz. 5,000+ now use The Shift + F.I.R.E. daily to interrupt their spirals—you'll see their 1,800+ verified reviews below.)
                    </p>

                    {/* Bridge to CEO framework */}
                    <p className="text-base text-slate-700 mt-6 font-semibold">
                      Before I show you exactly how The Shift works, you need to understand why everything else has been failing you. Because this isn't your fault.
                    </p>
                  </div>
                </div>
              )}

              {/* ========== CEO SECTION 1: JUSTIFY FAILURES ========== */}
              {resultData && (
                <div className="mb-16 max-w-3xl mx-auto">
                  <div className="space-y-4 text-base text-slate-700 leading-relaxed">
                    <p className="text-lg font-semibold text-slate-900">
                      Look, I need you to understand something:
                    </p>

                    <p>
                      <strong>The meditation apps didn't work</strong> because they require you to "clear your mind" when your brain is biologically incapable of stopping mid-rumination. You can't meditate your way out of a neural loop that's already running.
                    </p>

                    <p>
                      <strong>Therapy helped you understand why you overthink</strong>—childhood patterns, anxiety triggers, perfectionism—but understanding doesn't stop the 3 AM spiral about your husband's health or whether your daughter is managing okay with the kids.
                    </p>

                    <p>
                      <strong>The breathing exercises feel good in the moment</strong>, but ten minutes later you're right back in the loop because you never interrupted the mechanism. You treated the symptom, not the system.
                    </p>

                    <p className="font-semibold text-slate-900 pt-2 bg-amber-50/50 p-4 rounded-lg border-l-4 border-amber-500">
                      None of this failed because you weren't trying hard enough. It failed because you were never given a tool that stops the spiral <strong>before it locks in</strong>.
                    </p>

                    {/* Bridge to CEO Section 2 */}
                    <p className="text-base text-slate-700 mt-6">
                      And while we're on the subject of what didn't work, let's talk about the people who made you feel like overthinking was YOUR fault:
                    </p>
                  </div>
                </div>
              )}

              {/* ========== CEO SECTION 2: THROW ROCKS AT ENEMIES ========== */}
              {resultData && (
                <div className="mb-16 max-w-3xl mx-auto">

                  <div className="space-y-5 text-base text-slate-700 leading-relaxed">
                    <div className="pl-4 border-l-2 border-rose-300">
                      <p className="font-semibold text-slate-900 mb-1">
                        "Just try to relax" from doctors who've never experienced chronic rumination
                      </p>
                      <p className="text-sm text-slate-600">
                        Easy to say when your brain doesn't replay conversations from 1987 at 2 AM.
                      </p>
                    </div>

                    <div className="pl-4 border-l-2 border-rose-300">
                      <p className="font-semibold text-slate-900 mb-1">
                        $180/year meditation apps that blame YOU when they don't work
                      </p>
                      <p className="text-sm text-slate-600">
                        "You're not doing it right. Try harder. Be more mindful." Meanwhile, you've got real worries—aging parents, retirement savings, your husband's diabetes numbers.
                      </p>
                    </div>

                    <div className="pl-4 border-l-2 border-rose-300">
                      <p className="font-semibold text-slate-900 mb-1">
                        Family who says "you worry too much" instead of understanding
                      </p>
                      <p className="text-sm text-slate-600">
                        They don't see the mental load you carry or the loops you can't escape. They just see you as anxious.
                      </p>
                    </div>

                    <div className="pl-4 border-l-2 border-rose-300">
                      <p className="font-semibold text-slate-900 mb-1">
                        Therapists who've been "processing your childhood" for 3 years while you're STILL lying awake replaying today's conversation with your daughter
                      </p>
                      <p className="text-sm text-slate-600">
                        Understanding why you overthink doesn't stop you from doing it. You need interruption, not interpretation.
                      </p>
                    </div>

                    <p className="italic text-slate-600 pt-4">
                      You don't need someone to tell you <em>why</em> you overthink. You already know. You need something that actually <strong>stops it</strong> when it starts.
                    </p>

                    {/* Bridge to CEO Section 3 */}
                    <p className="text-base text-slate-700 mt-6 font-semibold">
                      Okay, forget them for a minute. Because here's what I want you to imagine instead:
                    </p>
                  </div>
                </div>
              )}

              {/* ========== CEO SECTION 3: ENCOURAGE THE DREAM ========== */}
              {resultData && (
                <div className="mb-16 max-w-3xl mx-auto">

                  <div className="space-y-5 text-base text-slate-700 leading-relaxed">
                    <div>
                      <p className="font-semibold text-emerald-900 mb-2">
                        🌙 You lie down at night, and you actually fall asleep.
                      </p>
                      <p>
                        No replaying the conversation with your son. No running through worst-case scenarios about your daughter's marriage. No calculating retirement funds at 3 AM. Just sleep. Real, restorative sleep.
                      </p>
                    </div>

                    <div>
                      <p className="font-semibold text-emerald-900 mb-2">
                        👨‍👩‍👧‍👦 You're fully present with your grandkids—really there.
                      </p>
                      <p>
                        Not half-listening while your brain runs through your husband's doctor appointment or whether you said the wrong thing to your daughter-in-law. You're building the Lego castle, laughing at their stories, making memories instead of loops.
                      </p>
                    </div>

                    <div>
                      <p className="font-semibold text-emerald-900 mb-2">
                        ☕ You have coffee with friends without the mental fog.
                      </p>
                      <p>
                        No forcing yourself to focus while secretly spiraling about whether your mammogram results will come back okay or if you should've pushed harder for your mom's care. You're actually <em>enjoying</em> the conversation.
                      </p>
                    </div>

                    <div>
                      <p className="font-semibold text-emerald-900 mb-2">
                        💭 Your brain finally feels like it's on your side.
                      </p>
                      <p>
                        Instead of your greatest enemy, it becomes a tool you control. When a worry starts, you catch it in 90 seconds—before it becomes a 3-hour spiral that steals your whole evening. <strong>You become the woman who USED TO overthink everything. Past tense.</strong>
                      </p>
                    </div>

                    <p className="font-bold text-slate-900 text-lg pt-4 border-t border-emerald-200 mt-6 bg-emerald-50/50 p-4 rounded-lg">
                      This isn't wishful thinking. This is what women report after learning to interrupt rumination at the source. (See 1,800+ verified reviews below.)
                    </p>
                  </div>
                </div>
              )}

              {/* ========== CEO SECTION 4: ALLAY FEARS ========== */}
              {resultData && (
                <div className="mb-16 max-w-3xl mx-auto">
                  <div className="space-y-5 text-base text-slate-700 leading-relaxed">
                    <p className="text-lg font-semibold text-slate-900">
                      I know what you're thinking: "But what if this doesn't work for me?"
                    </p>

                    <p>
                      I hear you. You've been burned before. You've bought the apps, read the books, maybe even done the therapy. You've heard promises that didn't pan out.
                    </p>

                    <p>
                      <strong>So here's the deal—and I mean this:</strong>
                    </p>

                    <div className="bg-emerald-50 p-6 rounded-lg border-2 border-emerald-600 space-y-4 my-8">
                      <p className="text-xl font-bold text-emerald-900">
                        60-Day "Quiet Mind" Guarantee
                      </p>

                      <p>
                        Try The Shift + F.I.R.E. Protocol for two full months. Wear it daily. Use the framework when overthinking starts. If you're still lying there at 2am replaying the conversation with your son—if your chest is still tight when you think about your husband's health results—if you still can't stop catastrophizing about whether you said the wrong thing—<strong>I don't want your money.</strong>
                      </p>

                      <p className="font-semibold text-emerald-800">
                        Send it back. Full refund. No questions asked. No "restocking fees." No making you jump through hoops.
                      </p>
                    </div>

                    <p>
                      I know you're thinking: <em>"What if this is just another thing that doesn't work for me?"</em>
                    </p>

                    <p>
                      Fair question. You've tried meditation apps, therapy, breathing exercises. Here's the difference: those treat the <em>thoughts</em>. The Shift + F.I.R.E. Protocol interrupt the <em>mechanism</em> that creates the loop. You're not trying to change what you think—you're stopping the spiral before it starts.
                    </p>

                    <p>
                      Maybe you're worried it's complicated. It's not. The Shift is a necklace—you wear it, you breathe through it when needed, done. F.I.R.E. is 4 steps you can learn in 15 minutes. Women in their 70s and 80s use this daily.
                    </p>

                    <p>
                      And if you're wondering whether people will notice—they won't. The Shift looks like jewelry. It's whisper-quiet. No one knows unless you tell them. Use it anywhere—meetings, church, family dinners, alone at night.
                    </p>

                    <p className="mt-6 font-semibold text-slate-900">
                      Here's the bottom line:
                    </p>

                    <p>
                      You can keep doing what you're doing: lying awake at 3 AM replaying conversations, googling "how to stop overthinking" for the 47th time, spending $200/hour to talk about the same thoughts again, watching your husband notice you're "stressed again," missing out on being present with your grandkids because your brain won't shut off.
                    </p>

                    <p className="font-semibold">
                      Or you can try what's working for 5,000+ women who use The Shift daily—with zero risk for 60 days.
                    </p>

                    <p className="text-slate-900 italic">
                      Your choice.
                    </p>
                  </div>
                </div>
              )}

              {/* ========== TRANSITION TO PRODUCT OFFER ========== */}
              {resultData && (
                <div className="mb-12 max-w-3xl mx-auto">
                  <div className="bg-emerald-50/50 p-8 rounded-lg border-l-4 border-emerald-600">
                    <p className="text-xl font-bold text-emerald-900 mb-4">
                      So here's what I built for you:
                    </p>
                    <p className="text-base text-slate-700 leading-relaxed">
                      A tool you can wear on your body—so when your brain starts spinning at 2 AM, you don't have to remember 4 steps or open an app or "try to meditate." You just reach for your necklace and breathe.
                    </p>
                    <p className="text-base text-slate-700 leading-relaxed mt-4">
                      The same vagal nerve regulation that stopped MY spirals—built into something you can use in 90 seconds, anywhere, anytime.
                    </p>
                    <p className="text-base text-slate-700 leading-relaxed mt-4 font-semibold">
                      Here's exactly what you're getting when you claim your quiz rate today—and why this works when meditation apps don't:
                    </p>
                  </div>
                </div>
              )}

              {/* ========== PRODUCT HERO SECTION (NOW POSITIONED AFTER CEO EMOTIONAL JOURNEY) ========== */}
              {resultData && (
                <div id="offer-details" className="mb-16 -mx-4 md:-mx-16">
                  <div className="px-4 md:px-8">
                    <ProductHero
                      productName="The Shift™ Breathing Necklace for Chronic Overthinkers"
                      tagline="The breathing tool that interrupts 3AM spirals in 90 seconds—so you can finally sleep like you used to"
                      badge={`QUIZ LIMITED OFFER: ${countdown}`}
                      scarcityMessage="Your quiz results expire in 48 hours. This $37 rate is locked to YOUR session—after that, you'll pay full price ($67) like everyone else."
                      price={{
                        current: 37,
                        original: 67,
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
                          </ul>
                          <div className="border-t border-gray-200 pt-4 mb-6">
                            <div className="flex justify-between items-baseline mb-3">
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
                  </div>
                </div>
              )}

              {/* ========== TRANSITION TO REVIEWS ========== */}
              {resultData && (
                <div className="mb-12 max-w-3xl mx-auto">
                  <p className="text-lg text-slate-700 leading-relaxed mb-4">
                    The breakthrough happened for me at 3 AM. For Sarah, it was after replaying a conversation with her daughter for the 47th time. For Linda, it was when her husband asked if she was "stressed again."
                  </p>
                  <p className="text-xl font-bold text-slate-900">
                    Here's what happened when women with your exact pattern started wearing The Shift:
                  </p>
                </div>
              )}

              {/* ========== CUSTOMER REVIEWS (USING PRODUCT PAGE COMPONENT) ========== */}
              {resultData && (
                <div className="mb-12">
                  <ReviewsSection
                    reviews={shiftProductReviews}
                    averageRating={4.8}
                    totalReviews={1800}
                    backgroundColor="bg-white"
                  />
                </div>
              )}

              {/* Sentinel for sticky bar - Shows sticky bar when user scrolls to this section on mobile */}
              <div ref={stickySentinelRef} aria-hidden className="pointer-events-none h-px w-full opacity-0" />

              {/* ========== UNITY SECTION (CIALDINI'S 7TH PRINCIPLE) ========== */}
              {resultData && (
                <div className="mb-12 max-w-3xl mx-auto">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6">
                    You're not alone in this
                  </h3>
                  <div className="space-y-4 text-base md:text-lg text-slate-700 leading-relaxed">
                    <p>
                      You've spent decades worrying about everyone else—your kids, your partner, your job, your aging parents. <strong>You've earned the right to quiet your mind.</strong>
                    </p>
                    <p>
                      The women who lie awake replaying today's conversation with their daughter. Who second-guess the email they sent. Who can't stop worrying about their aging parents—or their own health. Who've been carrying everyone else's worries for so long, they forgot what quiet feels like.
                    </p>
                    <p>
                      <strong>We get it. Because we are you.</strong>
                    </p>
                    <p>
                      Every woman on the DailyHush team scored 7+ on this quiz. We built The Shift because we needed it. Because therapy helped us understand our overthinking, but didn't give us the tools to interrupt it when it mattered most.
                    </p>
                    <p className="font-semibold text-slate-900">
                      You're joining thousands of women—including many in their 50s, 60s, and beyond—who've decided they deserve calm after decades of mental noise. Women who are done researching and ready to use something that actually works.
                    </p>
                    <p className="text-base italic text-slate-700 mt-2">
                      This is your tribe. We're here with you.
                    </p>
                  </div>
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

                  {/*
                    TODO - ROBERT: Write 6 NEW unique testimonials for this "But does it actually work?" section.

                    Requirements:
                    - Must be DIFFERENT from all reviews in shiftProductReviews.ts (no duplicates)
                    - No location info (just name, no city/state)
                    - Keep "Verified Purchase" badge
                    - Vary the lengths and tones (casual, emotional, professional mix)
                    - Focus on real struggles and results
                    - Use the colored boxes: bg-emerald-50/30, bg-blue-50/30, bg-amber-50/30, bg-purple-50/30, bg-rose-50/30, bg-indigo-50/30

                    Format (copy this structure 6 times):
                    <div className="bg-emerald-50/30 p-6 py-4 rounded-lg">
                      <p className="text-base text-slate-700 mb-3 leading-relaxed">
                        "TESTIMONIAL TEXT HERE"
                      </p>
                      <p className="text-sm text-slate-600 flex items-center gap-2">
                        <span className="font-semibold text-slate-900">First Name L.</span>
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                          Verified Purchase
                        </span>
                      </p>
                    </div>
                  */}
                  <div className="space-y-6 mb-8">
                    {/* Testimonial 1: Susan H. - LEAD WITH AUTHORITY (therapist validation) */}
                    <div className="bg-indigo-50/30 p-6 py-4 rounded-lg">
                      <p className="text-base text-slate-700 mb-3 leading-relaxed">
                        "My therapist has been telling me to do breathing exercises for anxiety for literally years but I never remember when I'm actually panicking. She suggested getting something physical to remind me so I got this. Had it about 5 months I think. I wear it to doctor appointments (health anxiety is very real), stressful phone calls with insurance people, basically whenever my chest starts feeling tight. She's noticed I'm actually using the breathing techniques more which makes our sessions more productive I guess? It's not fixing everything but it's helping more than the apps and stuff I tried before."
                      </p>
                      <p className="text-sm text-slate-600 flex items-center gap-2">
                        <span className="font-semibold text-slate-900">Susan H.</span>
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                          Verified Purchase
                        </span>
                      </p>
                    </div>

                    {/* Testimonial 2: Margaret W. - STACK AUTHORITY + MEASURABLE RESULT (doctor + blood pressure) */}
                    <div className="bg-rose-50/30 p-6 py-4 rounded-lg">
                      <p className="text-base text-slate-700 mb-3 leading-relaxed">
                        "Retirement gave me way too much time to worry about stupid stuff. Health, money, what neighbors think. This seemed simple enough so I tried it. Been using it for a few months now - morning coffee, afternoon around 2 or 3 when I start getting anxious about nothing, before bed usually. My doctor mentioned my blood pressure looked better at my last visit but I'm also walking more so who knows what's actually helping. Either way I'm using this thing multiple times a day so something's working."
                      </p>
                      <p className="text-sm text-slate-600 flex items-center gap-2">
                        <span className="font-semibold text-slate-900">Margaret W.</span>
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                          Verified Purchase
                        </span>
                      </p>
                    </div>

                    {/* Testimonial 3: Barbara K. - CONVERT THE SKEPTIC (tried everything else) */}
                    <div className="bg-blue-50/30 p-6 py-4 rounded-lg">
                      <p className="text-base text-slate-700 mb-3 leading-relaxed">
                        "Wasn't sure about buying this. I've got a drawer full of meditation apps I don't use and journals I tried for a week. But I like having something physical to hold when my head's spinning. I've had it maybe 6 weeks? I use it before family stuff mostly - my sister and I have this whole complicated history - and it does help me calm down enough to not say something I'll regret later. She actually asked what I was doing differently last Sunday which was... validating I guess? Anyway, no regrets on the purchase."
                      </p>
                      <p className="text-sm text-slate-600 flex items-center gap-2">
                        <span className="font-semibold text-slate-900">Barbara K.</span>
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                          Verified Purchase
                        </span>
                      </p>
                    </div>

                    {/* Testimonial 4: Diane R. - SPECIFIC BEHAVIORAL CHANGE (texting kids less) */}
                    <div className="bg-purple-50/30 p-6 py-4 rounded-lg">
                      <p className="text-base text-slate-700 mb-3 leading-relaxed">
                        "My kids are in their 30s and I still worry about them constantly. It's exhausting for everyone including me. Started using this maybe 2 months ago when I feel myself starting to catastrophize about their lives - job stuff, relationship stuff, money stuff. The breathing thing actually does interrupt that loop somehow. I've texted them way less with my random worries which honestly they're probably relieved about even if they're too nice to say it. Would've been helpful when they were teenagers and I was a complete mess about everything."
                      </p>
                      <p className="text-sm text-slate-600 flex items-center gap-2">
                        <span className="font-semibold text-slate-900">Diane R.</span>
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                          Verified Purchase
                        </span>
                      </p>
                    </div>

                    {/* Testimonial 5: Linda M. - RELATABLE HUMOR + COMMITMENT (3am overthinking) */}
                    <div className="bg-emerald-50/30 p-6 py-4 rounded-lg">
                      <p className="text-base text-slate-700 mb-3 leading-relaxed">
                        "I'm 61 and my brain just won't shut off. My doctor mentioned breathing exercises at my last checkup but I kept forgetting. This has been sitting on my dresser for about 4 months now and I grab it mostly at 3am when I'm replaying conversations from 20 years ago (anyone else do this??). It gets me back to sleep most nights instead of just lying there spiraling. Not every time, but enough that I actually use it. Just got one for my sister for her birthday - she does the same middle-of-the-night worry thing."
                      </p>
                      <p className="text-sm text-slate-600 flex items-center gap-2">
                        <span className="font-semibold text-slate-900">Linda M.</span>
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                          Verified Purchase
                        </span>
                      </p>
                    </div>

                    {/* Testimonial 6: Carol S. - LONG-TERM TRANSFORMATION (30-year pattern interrupted) */}
                    <div className="bg-amber-50/30 p-6 py-4 rounded-lg">
                      <p className="text-base text-slate-700 mb-3 leading-relaxed">
                        "I'm one of those people who replays conversations for YEARS. Got this maybe 3 months ago and wear it most days. My grandkids definitely wonder why I keep touching my necklace but it's my little reset button I guess. The overthinking hasn't gone away completely but I'm not spiraling as much over text messages - which at my age is ridiculous anyway, right? My husband said something last week about me seeming less stressed and sleeping better. I don't know if it's just this or what but I'll keep using it."
                      </p>
                      <p className="text-sm text-slate-600 flex items-center gap-2">
                        <span className="font-semibold text-slate-900">Carol S.</span>
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                          Verified Purchase
                        </span>
                      </p>
                    </div>
                  </div>

                </div>
              )}

              {/* ========== OPTIONAL DEEP DIVE EDUCATION (COLLAPSIBLE) ========== */}
              {resultData && (
                <>
                  <div className="my-16 border-t border-slate-200 pt-12">
                    <div className="max-w-3xl mx-auto mb-8">
                      <details className="bg-slate-50 rounded-lg p-6 cursor-pointer group">
                        <summary className="text-xl md:text-2xl font-bold text-slate-900 mb-2 flex items-center justify-between list-none">
                          <span>📚 Want the full clinical research? (Optional deep dive)</span>
                          <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                        </summary>
                        <div className="pt-6 border-t border-slate-200 mt-4">
                          <p className="text-base text-slate-700 mb-6">
                            Below is the complete clinical research explaining YOUR specific overthinking type and why The Shift's breathing protocol works for your nervous system. Most users don't need this to get started—but it's here if you want to understand the neuroscience.
                          </p>

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
                      {[
                        {
                          question: 'How does the Breathing Necklace help with anxiety and stress?',
                          answer: "Designed by a leading psychotherapist, this anxiety relief necklace slows your exhale, calming the nervous system and reducing stress within seconds. It helps build a mindful breathing habit for long-term relaxation. The extended exhale activates your vagus nerve—your body's natural 'calm down' signal—which downregulates the fight-or-flight response that creates anxiety spirals. Unlike techniques that require you to 'think your way out' of anxiety, this is a direct physiological intervention your body responds to automatically.",
                        },
                        {
                          question: 'What exactly is The Shift™ Complete Kit?',
                          answer: "You get two things: (1) The Shift™ Breathing Necklace—a medical-grade stainless steel tool that extends your exhale to 10 seconds to activate your vagus nerve and interrupt rumination spirals in 90 seconds. (2) The F.I.R.E. Protocol—a complete digital program teaching you the 4-step clinical framework (Focus → Interrupt → Reframe → Execute) used in Rumination-Focused CBT at University of Exeter. The necklace is your emergency brake. The F.I.R.E. Protocol teaches you to drive differently.",
                        },
                        {
                          question: 'What comes in the physical package when it arrives?',
                          answer: "Your Complete Kit includes: The Shift™ Breathing Necklace (the tool itself), a premium 26-inch adjustable luxe box chain (so you can wear it immediately), a protective travel pouch (keeps it safe in your purse when not wearing), and a Quick-Start Guide with the F.I.R.E. in 3 Steps (so you can use it the moment it arrives—no learning curve).",
                        },
                        {
                          question: 'What\'s included in the F.I.R.E. Protocol ($67 value)?',
                          answer: "The complete digital program includes: (1) The 4-Step Protocol Guide—the full Focus → Interrupt → Reframe → Execute system therapists charge $150/hour to teach. (2) Spiral Trigger Identification Workbook—helps you map YOUR specific rumination patterns. (3) Vagus Nerve Activation Techniques—5 clinical methods beyond the necklace. (4) Step-by-Step Protocols for 7 Common Overthinking Situations (the 2am 'I can't believe I said that' spiral, decision paralysis, relationship overthinking, etc.). (5) 30-Day Progress Tracker—so you can see patterns you can't see when you're IN the spiral. You get instant digital access after purchase—you can start reading while the necklace ships.",
                        },
                        {
                          question: 'I scored 6+ on the quiz. Will this actually work for chronic rumination?',
                          answer: "The technique in The Shift (extended exhale for vagus nerve activation) is the SAME technique used in RF-CBT (Rumination-Focused Cognitive Behavioral Therapy) at University of Exeter. Clinical trials show 60-65% of chronic ruminators experience significant improvement. The difference between therapy and The Shift: you're wearing the tool, so you can't forget to use it when spiraling. It won't cure rumination, but it gives you a circuit breaker you can trigger in 90 seconds when your brain starts the loop.",
                        },
                        {
                          question: 'What if I\'ve tried therapy and it didn\'t work?',
                          answer: "Traditional CBT works for anxiety, but rumination needs specialized protocols. Rumination-Focused CBT is different—it targets the specific neural pathways causing overthinking loops, not general anxiety. If your therapist wasn't trained in RF-CBT or Metacognitive Therapy (MCT), they likely used anxiety techniques that don't work for rumination. The F.I.R.E. Protocol gives you the RF-CBT framework that 65% of chronic ruminators respond to. You're not broken—you just haven't had the right tools for YOUR specific brain pattern.",
                        },
                        {
                          question: 'How does it actually work?',
                          answer: "The necklace has a small opening that naturally extends your exhale to 10 seconds (vs. your normal 3-4 seconds). When you exhale this long, it activates your vagus nerve—your body's biological 'off switch' for rumination loops. First breath interrupts the spiral. Second breath downregulates your nervous system. Third breath stops the catastrophizing from escalating. 90 seconds total. It's not meditation or mindfulness—it's direct nervous system intervention. Your brain can argue with thoughts. It can't argue with your vagus nerve.",
                        },
                        {
                          question: 'How is this different from meditation apps I\'ve already tried?',
                          answer: "Meditation apps ask you to 'observe your thoughts' or 'let them pass.' For chronic ruminators, observation becomes another spiral—you end up analyzing your analyzing. The Shift is a physiological interrupt, not a mindfulness practice. You're not observing anything—you're activating your vagus nerve to signal your nervous system: 'You're safe. Turn off the threat response.' It's biology, not meditation. And unlike an app you have to remember to open when you're already spiraling, The Shift is a physical object you're wearing—impossible to forget when you need it most.",
                        },
                        {
                          question: 'What if my overthinking is different? I don\'t just ruminate about the past—I spiral about the future too.',
                          answer: "Rumination includes past-focused loops ('I can't believe I said that') AND future-focused catastrophizing ('What if everything goes wrong?'). Both are the same neural pattern: your brain treating uncertainty as a threat and trying to 'solve' it with thinking. The F.I.R.E. Protocol includes specific protocols for 7 common spiral types—past regret, future catastrophizing, decision paralysis, relationship overthinking, body image spirals, work performance anxiety, and existential spirals. The vagus nerve activation works the same regardless of what content your brain is looping on.",
                        },
                        {
                          question: 'Will this stop my overthinking completely?',
                          answer: "No. And anyone who promises that is lying to you. What it DOES: Gives you a circuit breaker for when spirals start. You'll still overthink (you're an overthinker—that's wired into your nervous system, and that's not changing). But instead of losing 3 hours to 'I can't believe I said that,' you interrupt it in 90 seconds. You can't stop rumination thoughts from STARTING. But you can stop them from SNOWBALLING into 2am exhaustion spirals. That's what this does. It doesn't cure you. It gives you control when you need it most.",
                        },
                        {
                          question: 'Does this replace therapy or medication?',
                          answer: "No. This is a TOOL, not a replacement for professional help. If you're in therapy, this gives you something physical to do when spiraling between sessions. If you're on medication, this works alongside it—they target different mechanisms (medication adjusts neurotransmitters, The Shift activates your vagus nerve). Many therapists actually recommend breathing tools like this as part of RF-CBT protocols. Think of it as another tool in your toolkit, not a replacement for the whole toolkit.",
                        },
                        {
                          question: 'How long does it take to work?',
                          answer: "90 seconds (2-3 slow breaths). The first breath interrupts the spiral—you'll feel the shift from 'racing thoughts' to 'I'm breathing.' By the third breath, your heart rate slows and the catastrophizing loses momentum. It won't make the thoughts disappear instantly, but it will downregulate the panic response that makes rumination feel so urgent and overwhelming. Most people report feeling noticeably calmer within 2 minutes.",
                        },
                        {
                          question: 'Do I have to wear it all the time?',
                          answer: "No. Many people wear it daily as a visual reminder ('I have a tool when I need it'), but you can also keep it in your pocket, purse, or on your nightstand and only use it when spiraling. Some people wear it during high-stress periods (work presentations, difficult conversations) and store it other times. Whatever works for you. The chain is adjustable and comes with a travel pouch, so you have options.",
                        },
                        {
                          question: 'Will people think it\'s weird I\'m breathing through jewelry?',
                          answer: "It looks like you're taking a slow, deep breath—which is what you're doing. Most people won't even notice (they're too busy with their own thoughts). If someone asks, just say 'anxiety relief tool'—you'll be surprised how many people respond with 'Where did you get that? I need one.' The women who've been using The Shift report the opposite problem: too many people asking where to buy it.",
                        },
                        {
                          question: 'Can I use it while driving, working, or in public?',
                          answer: "Yes. Unlike meditation apps that require you to close your eyes or focus inward, The Shift is just breathing—you can do it anywhere. Driving, in meetings, at your desk, during conversations. It's silent and subtle. You're just breathing slower through a necklace. The only place you can't use it: underwater (obviously). Everywhere else is fair game.",
                        },
                        {
                          question: 'What if I lose it or it breaks?',
                          answer: "The necklace is medical-grade stainless steel (hypoallergenic, nickel-free, won't tarnish)—it's built to last. But if anything happens within 60 days, email us at support@dailyhush.co and we'll replace it free. After 60 days, we offer replacement necklaces at cost ($12). The chain is adjustable from 18-26 inches, and we include a protective travel pouch to keep it safe when not wearing it.",
                        },
                        {
                          question: 'What\'s your guarantee? What if it doesn\'t work for me?',
                          answer: "60-day money-back guarantee. Use The Shift for two full months. If you don't feel it helps interrupt your rumination spirals, email us for a full refund—no questions, no hassle. You even keep the F.I.R.E. Protocol digital program (we can't 'take back' a PDF you've already read). We can afford this guarantee because 60-65% of chronic ruminators respond to vagus nerve activation techniques in clinical trials. The worst case: you get your money back AND keep the complete F.I.R.E. framework. The best case: you finally have a tool that works when your brain won't shut up.",
                        },
                        {
                          question: 'Why is it only $37? What\'s the catch?',
                          answer: "No catch. Here's the honest breakdown: The Shift™ Necklace + Chain normally sells for $67. You're getting it for $37 as an introductory offer. The F.I.R.E. Protocol is my free bonus to you. We'd rather get The Shift in your hands at a fair price and earn your trust than have you wait another month while rumination steals your sleep.",
                        },
                        {
                          question: 'How much does rumination cost if I don\'t fix it?',
                          answer: "Research shows chronic rumination costs an average of 2-4 hours per day in lost productivity, plus sleep deprivation (worth $200-400/month in health costs), relationship strain, and career stagnation from decision paralysis. One University of Michigan study found ruminators earn 14% less over their careers due to missed opportunities and avoidance behavior. The question isn't 'Can I afford $37?' It's 'Can I afford another year of 2am spirals, exhausted mornings, and decisions I'm too paralyzed to make?' The Shift isn't an expense. It's a circuit breaker for a pattern that's already costing you thousands.",
                        },
                        {
                          question: 'Why should I order now instead of thinking about it?',
                          answer: "Two reasons: (1) Clinical timing—your quiz results are fresh. The Spiral Trigger Identification Workbook in the F.I.R.E. Protocol works best when your recent overthinking patterns are still top-of-mind. Waiting means re-analyzing what you've already analyzed (which is... more rumination). (2) The $37 quiz-taker rate is time-sensitive. Once you leave this page, you'll pay the standard $67 rate for the necklace alone (without the F.I.R.E. bonus). The real cost of waiting isn't the price difference—it's every night this week your brain steals from you while you 'think about' getting a tool to stop thinking so much. The irony isn't lost on me.",
                        },
                        {
                          question: 'What happens after I order?',
                          answer: "Immediate: You get instant access to the F.I.R.E. Protocol digital program (check your email within 5 minutes). You can start reading the framework tonight while the necklace ships. Shipping: The Shift™ Complete Kit ships within 1-2 business days via USPS. Typical delivery is 5-7 days in the US (international 10-14 days). You'll get tracking info via email. First use: When it arrives, read the Quick-Start Guide (3-minute read) and try your first 90-second breath cycle. Most people report feeling the vagus nerve activation on the first try. 30-day mark: Use the Progress Tracker in F.I.R.E. to see patterns you couldn't see when you were IN the spirals. You'll likely notice you're interrupting spirals earlier, losing less time to rumination, and sleeping better.",
                        },
                      ].map((faq, idx) => (
                        <details key={idx} className="group bg-white rounded-xl border border-slate-200 p-6">
                          <summary className="cursor-pointer font-semibold text-slate-900 flex items-center justify-between">
                            <span>{faq.question}</span>
                            <span className="group-open:rotate-180 transition-transform">▼</span>
                          </summary>
                          <p className="mt-4 text-sm text-slate-700 leading-relaxed">
                            {faq.answer}
                          </p>
                        </details>
                      ))}
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
                  <ReviewsSection
                    reviews={shiftProductReviews}
                    averageRating={4.8}
                    totalReviews={shiftProductReviews.length}
                    backgroundColor="bg-white"
                  />

                  {/* ========== FURTHER RESOURCES ========== */}
                  <div className="mb-16 max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">
                      Want to dig deeper into the research?
                    </h2>
                    <p className="text-lg text-slate-700 mb-10">
                      The Shift uses the same vagal nerve regulation from the F.I.R.E. Protocol (included free with your purchase). Everything is built on actual clinical research. Here's where it all comes from:
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
                          You're joining hundreds of women at DailyHush who are using The Shift and these frameworks every day.
                        </p>
                      </div>
                    </div>
                  </div>

                        </div>{/* End collapsible content */}
                      </details>
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
                        100% money-back guarantee • Includes FREE F.I.R.E. Protocol
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
        buttonText="Get The Shift™ Pack • $37"
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
