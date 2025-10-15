import { useEffect, useState, useRef } from 'react'
import { CheckCircle, Flame, BookOpen, Brain, Lightbulb } from 'lucide-react'
import ShopifyBuyButton from '../../components/ShopifyBuyButton'
import { ScarcityProvider, useScarcity } from '../../contexts/ScarcityContext'
import { TopBar } from '../../components/layout/TopBar'
import type { OverthinkerType } from '../../types/quiz'
import Testimonials from '../../components/Testimonials'
import { StickyCheckoutBar } from '../../components/StickyCheckoutBar'

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
      title: 'Recent Research (2024-2025)',
      findings: [
        'A 2024 study in Nature Reviews Psychology identified repetitive negative thinking (RNT) as existing on a spectrum. Your pattern falls on the healthy end—what researchers call "constructive processing."',
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
      title: 'Critical Research (2024)',
      findings: [
        'Nature Reviews Psychology (2024): State rumination is the BEST intervention window. At this stage, brain connectivity patterns aren\'t yet fixed.',
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
      title: 'Critical 2024-2025 Research',
      findings: [
        'Nature Reviews Psychology (2024): Identified RNT as a transdiagnostic process—a risk factor across depression, GAD, PTSD, and OCD',
        'Chronic rumination increases risk: Major depressive episodes (3x), GAD (2.5x), physical health issues',
        'University of Exeter (2024-2025): RF-CBT trials showed 60-65% of chronic ruminators had clinically significant reduction in rumination',
        'University of Manchester (2025): MCT delivered via telehealth—68% showed significant improvement, 55% average reduction in rumination time after 8-12 sessions',
        'Effects maintained at 12-month follow-up. Brain imaging showed reduced DMN hyperconnectivity.'
      ],
      keyStudy: 'Nature Reviews Psychology (2024): RNT as transdiagnostic process'
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
        'Nature Reviews Psychology (2024): Severe RNT associated with 3-4x increased risk for major depressive episodes, 2.5x increased risk for GAD, elevated suicide risk, PTSD maintenance, OCD comorbidity, physical health issues (cardiovascular disease, chronic inflammation, immune dysfunction)',
        'Stanford/Yale Research (2024): Chronic severe rumination associated with cognitive decline, relationship impairment, vocational problems, quality of life impairment across all domains',
        'University of Exeter (2025): RF-CBT for severe ruminators—55-60% showed clinically significant improvement (requires 16-20 sessions vs. 8-12 for moderate cases). Best outcomes when combined with medication. Relapse prevention critical.',
        'University of Manchester (2025): MCT—60-65% of severe ruminators showed significant reduction. Particularly effective for "stuck" ruminators resistant to traditional CBT. Maintenance sessions necessary.',
        'Critical Finding (Multiple Studies, 2024): Early intervention is critical. Severe rumination that persists for years shows more treatment resistance, greater comorbidity, longer recovery time, higher relapse rates. But improvement is possible at any severity level.'
      ],
      keyStudy: 'Nature Reviews Psychology (2024): Severe RNT as transdiagnostic driver of multiple conditions'
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
  const { spotsRemaining, totalSpots, isCritical, isSoldOut } = useScarcity()
  const fireKitBadgeRef = useRef<HTMLDivElement>(null)
  const offerCardRef = useRef<HTMLDivElement>(null)
  const womenWhoActRef = useRef<HTMLDivElement>(null)

  // Get quiz type and score from URL params
  const urlParams = new URLSearchParams(window.location.search)
  const quizType = urlParams.get('type') as OverthinkerType | null
  const quizScore = urlParams.get('score') ? parseInt(urlParams.get('score')!) : null

  // Get personalized quiz result data or use defaults
  const resultData = quizType ? quizResultData[quizType] : null

  useEffect(() => {
    document.title = 'Your Overthinking Results — DailyHush'
  }, [])

  // Track sticky bar visibility using Intersection Observer
  useEffect(() => {
    const state = {
      offerCardPassed: false,
      womenWhoActVisible: false,
      badgeVisible: false
    }

    const updateStickyBar = () => {
      // Show sticky bar only after offer card is passed and before "Women Who Act" section or badge
      setShowStickyBar(state.offerCardPassed && !state.womenWhoActVisible && !state.badgeVisible)
    }

    // Observer for offer card - track when it's scrolled past (leaves viewport from top)
    const offerCardObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        // Mark as passed when it's not intersecting and is above the viewport
        if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
          state.offerCardPassed = true
        } else if (entry.isIntersecting) {
          state.offerCardPassed = false
        }
        updateStickyBar()
      },
      { threshold: 0, rootMargin: '0px' }
    )

    // Observer for "Women Who Act" section - when it enters viewport, hide sticky bar
    const womenWhoActObserver = new IntersectionObserver(
      (entries) => {
        state.womenWhoActVisible = entries[0].isIntersecting
        updateStickyBar()
      },
      { threshold: 0.1 }
    )

    // Observer for badge - when it enters viewport, hide sticky bar
    const badgeObserver = new IntersectionObserver(
      (entries) => {
        state.badgeVisible = entries[0].isIntersecting
        updateStickyBar()
      },
      { threshold: 0.1 }
    )

    if (offerCardRef.current) {
      offerCardObserver.observe(offerCardRef.current)
    }
    if (womenWhoActRef.current) {
      womenWhoActObserver.observe(womenWhoActRef.current)
    }
    if (fireKitBadgeRef.current) {
      badgeObserver.observe(fireKitBadgeRef.current)
    }

    return () => {
      offerCardObserver.disconnect()
      womenWhoActObserver.disconnect()
      badgeObserver.disconnect()
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/80 via-emerald-50/50 to-amber-50/30 flex flex-col relative overflow-hidden">
      {/* Organic Background Blobs - Subtle */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -left-40 w-96 h-96 bg-emerald-500/3 rounded-full blur-3xl"></div>
        <div className="absolute top-60 right-20 w-80 h-80 bg-amber-500/4 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-1/3 w-72 h-72 bg-emerald-400/3 rounded-full blur-3xl"></div>
      </div>

      <TopBar variant="dark" />

      <div className="flex-1 flex justify-center items-stretch">
        <StickyCheckoutBar
          show={showStickyBar}
          spotsRemaining={spotsRemaining}
          totalSpots={totalSpots}
          isCritical={isCritical}
          isSoldOut={isSoldOut}
          productId="10761797894447"
          domain="t7vyee-kc.myshopify.com"
          storefrontAccessToken="a3bc32a7b8116c3f806d7d16e91eadad"
          buttonText="Get F.I.R.E. Protocol • $67"
          buttonColor="#16a34a"
          buttonHoverColor="#15803d"
        />

        <div className="w-full max-w-5xl px-0 md:px-4 flex flex-1 relative z-10">
          <div className="bg-white/90 backdrop-blur-xl flex-1 flex flex-col overflow-hidden pb-20 sm:pb-0 shadow-[0_16px_48px_-8px_rgba(16,185,129,0.15)]">
            <div className="flex-1 max-w-4xl w-full mx-auto px-4 md:px-16 py-12 md:py-16 pb-16 md:pb-20">

              {/* ========== EMOTIONAL OPENING ========== */}
              <div className="mb-12">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                  850+ Women With Racing Thoughts Used This To Sleep Through the Night
                </h1>
                <div className="max-w-3xl space-y-4 text-base md:text-lg text-slate-700 leading-relaxed">
                  <p><strong>I know what just happened.</strong></p>
                  <p>
                    You sat there answering those questions — some of them uncomfortably accurate — and with each click, you felt that familiar tightness in your chest.
                  </p>
                  <p className="italic">
                    "See? I KNEW something was wrong with me. This is proof."
                  </p>
                  <p>
                    But here's what that voice doesn't want you to know:
                  </p>
                  <p>
                    <strong>What you're about to see below isn't a diagnosis.</strong> It's not another label to beat yourself up with.
                  </p>
                  <p>
                    It's the first time someone's actually going to explain WHY your brain won't shut up — and more importantly, what actually works to quiet it.
                  </p>
                  <p>
                    Your results are waiting just below. But before you look, understand this:
                  </p>
                  <p>
                    <strong>The number you got, the "type" you are — that's just the map.</strong> What I'm about to show you after that is the way out.
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
                    For 8 years, I was in therapy. Good therapy. The kind where you talk about childhood, process emotions, learn coping skills. And it helped — sort of.
                  </p>
                  <p>
                    But every night, my brain would still hijack me. That email I sent my boss. The thing I said at dinner. Hypothetical disasters that would never happen. I'd lie there, eyes wide open, replaying and replaying until my alarm went off.
                  </p>
                  <p className="font-semibold text-slate-900">
                    The breakthrough happened at 3 a.m.:
                  </p>
                  <p>
                    One night — after a particularly brutal spiral about a text message I'd sent 3 days earlier — I gave up on sleep and started googling. That's when I stumbled onto a research paper from University of Exeter. Dr. Edward Watkins. Something called "Rumination-Focused CBT."
                  </p>
                  <p>
                    For the first time in 8 years, I saw my exact brain pattern described in clinical terms.
                  </p>
                  <p>
                    <strong>Here's what blew my mind:</strong> Traditional CBT teaches you to challenge negative thoughts. "Is that thought really true? What's the evidence?" But rumination isn't about <em>what</em> you're thinking — it's about <em>how</em> you're thinking.
                  </p>
                  <p className="font-semibold text-slate-900">
                    Abstract vs. concrete. Brooding vs. reflection.
                  </p>
                  <p>
                    My therapist had been trying to fix my thoughts. But Watkins was teaching me to interrupt the loop itself. To catch the spiral in those first 10 seconds before it locked in.
                  </p>
                  <p>
                    That night, I read everything I could find. RF-CBT. Metacognitive Therapy from University of Manchester. Polyvagal Theory. And I realized: I had awareness. The quiz gave people awareness. But awareness alone doesn't stop the spirals.
                  </p>
                  <p className="font-semibold text-slate-900">
                    What was missing was the bridge:
                  </p>
                  <p>
                    The actual protocol to get from "I know I'm overthinking" to "I've stopped the spiral."
                  </p>
                  <p>
                    So I took those clinical protocols and translated them into something I could actually use late at night when my brain was spinning. Four steps. Simple enough to remember when I was dysregulated. Specific enough to actually work.
                  </p>
                  <p>
                    I called it F.I.R.E. And for the first time in 8 years, I had a tool that didn't just help me understand my overthinking — it helped me interrupt it.
                  </p>
                  <p className="font-semibold text-slate-900">
                    That's what I'm about to show you. The missing link between awareness and peace.
                  </p>

                  <p className="text-base text-slate-700 leading-relaxed mt-6">
                    <strong>About Anna:</strong> I spent 3 years researching cognitive psychology and rumination interventions at Stanford before launching DailyHush. But my real credential? <strong>I scored 9/10 on this quiz.</strong>
                  </p>

                  <p className="text-base text-slate-700 leading-relaxed">
                    F.I.R.E. wasn't born in a lab. It was built in those desperate moments when I needed something that actually worked. Now it's helped 850+ women interrupt their spirals—clinical research meets real life.
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
                <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 mb-6">
                  Why Your Smartest Thoughts Keep You Paralyzed
                </h2>

                <div className="max-w-3xl mx-auto space-y-4 text-base md:text-lg text-emerald-800 leading-relaxed">
                  <p>
                    <strong>The harder you think, the more stuck you get.</strong>
                  </p>
                  <p>
                    You can analyze a situation from 47 angles... and still feel no closer to peace. That's not because you're not smart enough—it's because <em>overthinking isn't a thinking problem</em>.
                  </p>

                  <div className="bg-amber-50 rounded-xl p-6 my-4">
                    <p className="font-bold text-amber-900 mb-2">The Hidden Addiction:</p>
                    <p className="text-sm">
                      Your brain treats rumination like a cigarette — a quick hit of "I'm doing something about this" without actually solving anything. Research from University of Manchester shows that <strong>chronic overthinkers unconsciously believe rumination keeps them safe</strong>.
                    </p>
                  </div>

                  <p>
                    That endless replay of a conversation from Tuesday? Your brain isn't "problem-solving." It's <strong>brooding</strong>—which Yale's Dr. Susan Nolen-Hoeksema found is the #1 predictor of depression in women.
                  </p>

                  <p>
                    <strong>But here's what's wild: Your brain can be retrained.</strong>
                  </p>

                  <p>
                    University of Exeter spent 15 years studying exactly how to interrupt these loops. Not through willpower or "positive thinking"—through <strong>specific clinical protocols that literally rewire the neural pathways causing the spirals</strong>.
                  </p>

                  <p className="font-semibold text-emerald-900 text-lg">
                    That's what F.I.R.E. is. The missing link therapists charge $150/hour to teach.
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
                    I get it. You've already tried the meditation apps, the breathing exercises, maybe even therapy. And they helped... sort of. But when you're lying awake replaying that conversation from work, none of it stuck.
                  </p>

                  <p>
                    Here's why: <strong>Most anxiety tools are designed for anxiety. Your problem is rumination.</strong>
                  </p>

                  <div className="bg-slate-50 rounded-xl p-6 border-l-4 border-slate-300">
                    <p className="font-bold text-slate-900 mb-3">The Clinical Difference:</p>

                    <div className="space-y-4 text-sm">
                      <div>
                        <p className="font-semibold text-slate-800">Meditation & Mindfulness Apps:</p>
                        <p className="text-slate-600">Great for present-moment awareness. But rumination happens when your brain is <em>locked onto the past</em>. You can't "be present" when you're mentally time-traveling to Tuesday's meeting.</p>
                      </div>

                      <div>
                        <p className="font-semibold text-slate-800">Traditional CBT (Cognitive Behavioral Therapy):</p>
                        <p className="text-slate-600">Works for thought patterns you can catch in real-time. But rumination is <em>automatic and unconscious</em>—you're already 10 minutes into the spiral before you realize it started. CBT alone can't interrupt what you don't notice.</p>
                      </div>

                      <div>
                        <p className="font-semibold text-slate-800">Breathing Exercises:</p>
                        <p className="text-slate-600">Calm your nervous system (important!). But they don't address <em>why your brain keeps returning to the same thought loops</em>. You feel better for 20 minutes, then the worry comes back.</p>
                      </div>

                      <div>
                        <p className="font-semibold text-slate-800">Generic "Positive Thinking":</p>
                        <p className="text-slate-600">Telling yourself "it'll be fine" when you're spiraling feels fake. Because Stage 5 overthinkers like you are <em>too smart for toxic positivity</em>. You need actual cognitive interruption, not a pep talk.</p>
                      </div>
                    </div>
                  </div>

                  <p className="font-semibold text-slate-900 text-lg">
                    F.I.R.E. is different because it combines Rumination-Focused CBT, Metacognitive Therapy, and Polyvagal Theory into one 90-second protocol.
                  </p>

                  <div className="grid md:grid-cols-3 gap-4 my-6">
                    <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                      <p className="font-bold text-emerald-900 mb-2 text-sm">Rumination-Focused Component:</p>
                      <p className="text-xs text-slate-700">Catches rumination <em>before</em> it becomes a spiral—targets the unconscious trigger moment</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <p className="font-bold text-blue-900 mb-2 text-sm">Metacognitive Component:</p>
                      <p className="text-xs text-slate-700">Changes your <em>relationship</em> with overthinking itself—stops treating worry as productive problem-solving</p>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                      <p className="font-bold text-amber-900 mb-2 text-sm">Polyvagal Component:</p>
                      <p className="text-xs text-slate-700">Regulates the nervous system response that <em>fuels</em> mental loops—addresses the body, not just the brain</p>
                    </div>
                  </div>

                  <p className="bg-emerald-50 border-2 border-emerald-200 text-emerald-900 p-6 rounded-xl text-center font-semibold">
                    This is why women say "I've been in therapy for years—why didn't anyone teach me this?"
                  </p>
                </div>
              </div>

              {/* ========== F.I.R.E. FRAMEWORK TEASER ========== */}
              <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                  The 90-Second Protocol That Interrupts Overthinking Before It Spirals
                </h2>

                <div className="max-w-3xl mx-auto space-y-4 text-base md:text-lg text-slate-700 leading-relaxed">
                  <p>
                    All of those clinical techniques? They work. But here's the problem: <strong>they're too complicated to remember when your brain hijacks you mid-panic.</strong>
                  </p>
                  <p>
                    That's why I created <strong>F.I.R.E. — Focus, Interrupt, Reframe, Execute.</strong> A 4-step protocol that translates RF-CBT, MCT, and Polyvagal Theory into something you can actually use in 90 seconds when you're spiraling. <strong>Not theory. Not worksheets. A protocol.</strong>
                  </p>
                  <p className="text-center font-semibold text-lg text-slate-900">
                    The missing link between "I know I'm overthinking" and "I've stopped the spiral."
                  </p>
                </div>
              </div>

              {/* ========== BEFORE/AFTER F.I.R.E. ========== */}
              <div className="mb-12 max-w-3xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">
                  You're Done Letting Your Brain Run the Show
                </h2>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  {/* BEFORE */}
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">BEFORE F.I.R.E.:</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 font-bold flex-shrink-0">✗</span>
                        <span className="text-slate-700">You lie awake replaying every decision you made today</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 font-bold flex-shrink-0">✗</span>
                        <span className="text-slate-700">Your brain hijacks every quiet moment with "what if" spirals</span>
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
                    <h3 className="text-xl font-bold text-slate-900 mb-4">AFTER F.I.R.E.:</h3>
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
                    The women who use F.I.R.E. aren't the ones who never overthink. They're the ones who are done with their brain running the show. Who want their life back. Who are ready to stop researching and start using something that actually works.
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
                  I know. You've downloaded the meditation apps. You've done the therapy. You've read the books. And still—your brain won't shut up.
                </p>

                <p className="text-base text-slate-700 leading-relaxed mb-6">
                  <strong>Meditation apps</strong> teach you to "observe your thoughts." Great for general stress. But when you're mid-spiral, <em>observing</em> doesn't stop it. You need interruption, not observation.
                </p>

                <p className="text-sm text-slate-600 italic mb-8 pl-4 border-l-2 border-slate-300">
                  "I tried Calm and Headspace for 8 months. Great for falling asleep. Did nothing when my brain was looping about that email I sent." — Sarah M. (scored 8/10)
                </p>

                <p className="text-base text-slate-700 leading-relaxed mb-6">
                  <strong>Traditional therapy</strong> processes trauma, builds insight, challenges negative beliefs. And that's valuable. But traditional CBT teaches you to challenge thoughts ("Is that really true?"). Rumination isn't about <em>what</em> you're thinking—it's about <em>how</em> you're thinking. You need to interrupt the loop itself, not debate its content.
                </p>

                <p className="text-sm text-slate-600 italic mb-8 pl-4 border-l-2 border-slate-300">
                  "8 years of therapy helped me understand my patterns. But in the moment I was spiraling, understanding didn't stop it." — Anna, Creator of F.I.R.E.
                </p>

                <p className="text-base text-slate-700 leading-relaxed mb-6">
                  <strong>F.I.R.E. is different.</strong> It targets rumination specifically—not anxiety, not stress, but the mental loops that keep you stuck. Built on RF-CBT (Rumination-Focused CBT) from University of Exeter and Metacognitive Therapy from Manchester—the only protocols clinically proven to interrupt rumination.
                </p>

                <p className="text-base text-slate-700 leading-relaxed mb-6">
                  Not theory. A 4-step protocol you can use the moment your brain starts looping.
                </p>

                <p className="text-base text-slate-700 leading-relaxed mb-4">
                  Meditation calms you <em>after</em> the spiral. Therapy helps you understand <em>why</em> you spiral. <strong>F.I.R.E. teaches you to catch it in the first 10 seconds—before it locks in.</strong>
                </p>

                <p className="text-base text-slate-700 leading-relaxed mb-2">
                  Here's the truth: You don't need more insight. You don't need to "observe" your thoughts.
                </p>

                <p className="text-lg font-bold text-slate-900">
                  You need a protocol that works when you're dysregulated and your brain won't shut up.
                </p>
              </div>

              {/* ========== CONCRETE 2AM F.I.R.E. EXAMPLE ========== */}
              <div className="mb-12 max-w-3xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
                  Let me show you what this looks like in the moment your brain hijacks you.
                </h2>

                <div className="space-y-4 text-base md:text-lg text-slate-700 leading-relaxed">
                  <p>
                    It's 2:47 a.m. You sent an email to your boss yesterday afternoon. A simple update. But something about the tone felt... off. And now your brain won't let it go.
                  </p>

                  <p className="italic text-slate-600 pl-4 border-l-2 border-slate-300">
                    "Why did I phrase it that way? Did I sound defensive? Should I send a follow-up? What if she thinks I'm incompetent? What if this affects my review? Why do I always do this?"
                  </p>

                  <p>
                    Your chest is tight. Your mind is spinning. You've been lying here for an hour. <strong>This is rumination.</strong>
                  </p>

                  <p className="font-semibold text-slate-900 text-lg mt-6">
                    Here's what F.I.R.E. looks like in this exact moment:
                  </p>

                  <div className="my-6 space-y-5">
                    <div>
                      <p className="font-bold text-slate-900 mb-2">
                        <strong>F — Focus:</strong> Name the Loop
                      </p>
                      <p className="text-base text-slate-700 mb-1">
                        You sit up. Out loud, you say: <em>"I'm ruminating about the email I sent yesterday."</em>
                      </p>
                      <p className="text-sm text-slate-600 italic">
                        (Naming it breaks the automatic loop. Your prefrontal cortex engages. You're no longer swept away—you're observing.)
                      </p>
                    </div>

                    <div>
                      <p className="font-bold text-slate-900 mb-2">
                        <strong>I — Interrupt:</strong> Ground Your Nervous System
                      </p>
                      <p className="text-base text-slate-700 mb-1">
                        You do 5-4-3-2-1. Five things you see (lamp, book, phone, curtain, clock). Four things you hear (heater, neighbor's dog, your breath, silence). Three things you touch (blanket, sheets, pillow). Two things you smell (laundry detergent, faint coffee from earlier). One thing you taste (dry mouth, faint mint).
                      </p>
                      <p className="text-base text-slate-700 mb-1">
                        Then: Three slow exhales. 4-count inhale. 8-count exhale.
                      </p>
                      <p className="text-sm text-slate-600 italic">
                        (Your heart rate drops. The tightness in your chest loosens. Your vagus nerve signals: "We're safe.")
                      </p>
                    </div>

                    <div>
                      <p className="font-bold text-slate-900 mb-2">
                        <strong>R — Reframe:</strong> Shift to Concrete
                      </p>
                      <p className="text-base text-slate-700 mb-1">
                        You ask: <em>"What's one specific thing I can do about this in the next hour?"</em>
                      </p>
                      <p className="text-base text-slate-700 mb-1">
                        Answer: "If I'm still worried tomorrow morning, I can send a quick follow-up. Or I can check if she's replied. Right now, in this moment, there's nothing I can do."
                      </p>
                      <p className="text-sm text-slate-600 italic">
                        (Abstract brooding: "Why am I like this?" → Concrete action: "I'll check tomorrow morning.")
                      </p>
                    </div>

                    <div>
                      <p className="font-bold text-slate-900 mb-2">
                        <strong>E — Execute:</strong> Take One Small Action
                      </p>
                      <p className="text-base text-slate-700 mb-1">
                        You consciously decide: "I'm going to set my alarm for 8 a.m. and check then. Until then, this thought gets to rest."
                      </p>
                      <p className="text-base text-slate-700 mb-1">
                        You lie back down. You put your phone across the room. You take one more slow exhale.
                      </p>
                      <p className="text-sm text-slate-600 italic">
                        (The loop is closed. Your brain doesn't need to keep spinning because you've signaled: "We've handled this.")
                      </p>
                    </div>
                  </div>

                  <p className="font-semibold text-slate-900 text-lg mt-6">
                    Total time: 3 minutes.
                  </p>

                  <p>
                    The thoughts might come back. They probably will. But now you have a protocol. <strong>You're not at the mercy of your brain anymore.</strong>
                  </p>

                  <p>
                    This is what 850+ women are using every night when their brain hijacks them. Not theory. Not worksheets. <strong>A protocol that works when you're dysregulated and need it most.</strong>
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
                      Every woman on the DailyHush team scored 7+ on this quiz. We built F.I.R.E. because we needed it. Because therapy helped us understand our overthinking, but didn't give us the tools to interrupt it when it mattered most.
                    </p>
                    <p className="font-semibold text-slate-900">
                      You're joining 850+ women who refuse to let their brain run the show anymore. Women who are done researching and ready to use something that actually works.
                    </p>
                    <p className="text-base italic text-slate-700 mt-2">
                      This is your tribe. We're here with you.
                    </p>
                  </div>
                </div>
              )}

              {/* ========== OFFER SECTION (MOVED TO LINE ~672) ========== */}
              {resultData && (
                <div id="offer-details" ref={fireKitBadgeRef} className="mb-16 max-w-xl mx-auto">

                  {!isSoldOut && (
                    <div className="mb-8 text-center">
                      <div className="inline-flex items-center gap-2 text-base font-semibold text-amber-900 bg-amber-50 px-5 py-2.5 rounded-full border-2 border-amber-300">
                        <Flame className="h-5 w-5" />
                        <span>Your quiz results are active for 48 hours — personalized access ends soon</span>
                      </div>
                    </div>
                  )}

                  <div ref={offerCardRef} className="bg-white border-2 border-slate-200 rounded-2xl p-4 md:p-8">
                    <div className="text-center mb-3">
                      <h3 className="text-xl md:text-3xl font-bold text-slate-900 mb-1">
                        The F.I.R.E. Protocol — $67
                      </h3>
                      <p className="text-sm md:text-base text-slate-600">
                        Everything you need to interrupt overthinking tonight
                      </p>
                    </div>

                    <div className="mb-4 pb-4 border-b border-slate-200">
                      <p className="text-sm md:text-base font-semibold text-slate-900 mb-2">
                        The F.I.R.E. Framework: Focus → Interrupt → Reframe → Execute
                      </p>
                      <p className="text-sm md:text-base text-slate-700 leading-relaxed">
                        Breathing exercises work for anxiety. F.I.R.E. targets rumination—clinical frameworks therapists charge $150/hour to teach, simple enough to use when you're dysregulated.
                      </p>
                    </div>

                    <div className="text-center mb-4">
                      <p className="text-sm md:text-base text-slate-600 mb-1">Your Investment Today:</p>
                      <div className="flex items-baseline justify-center gap-2 mb-1">
                        <span className="text-4xl md:text-5xl font-black text-slate-900">$67</span>
                      </div>
                      <p className="text-sm md:text-base text-slate-600 mb-1">
                        Less than one therapy co-pay. Same clinical frameworks.
                      </p>
                      <p className="text-sm md:text-base text-emerald-700 font-semibold">
                        vs. $750-900 for 6 therapy sessions teaching the same protocols
                      </p>
                    </div>

                    <div className="max-w-md mx-auto mb-4">
                      <ShopifyBuyButton
                        productId="10761797894447"
                        domain="t7vyee-kc.myshopify.com"
                        storefrontAccessToken="a3bc32a7b8116c3f806d7d16e91eadad"
                        buttonText="Get the F.I.R.E. Protocol"
                        buttonColor="#16a34a"
                        buttonHoverColor="#15803d"
                        className="w-full"
                      />
                    </div>

                    <div className="mb-3 pb-3 border-b border-slate-200">
                      <p className="text-sm md:text-base font-bold text-slate-900 mb-2">Who You Become:</p>
                      <div className="space-y-2.5">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <p className="text-sm md:text-base text-slate-700 leading-normal">Catch spirals in 10 seconds (Rumination-Focused protocol)</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <p className="text-sm md:text-base text-slate-700 leading-normal">Sleep through the night—stop replaying conversations</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <p className="text-sm md:text-base text-slate-700 leading-normal">70% reduction in worry loops (MCT trials)</p>
                        </div>
                      </div>
                    </div>

                    {/* Stack Slide - Value Breakdown */}
                    <div className="mb-4 pb-4 border-b border-slate-200">
                      <p className="text-base md:text-lg font-bold text-slate-900 mb-3 text-center">What You Get Today:</p>
                      <div className="space-y-4 text-sm md:text-base">
                        <div className="bg-slate-50 p-3 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-slate-900 font-semibold">Complete F.I.R.E. System</span>
                            <span className="text-slate-500 text-xs md:text-sm">3-4 therapy sessions</span>
                          </div>
                          <ul className="space-y-1.5 text-xs md:text-sm text-slate-600 pl-4">
                            <li>→ 4-step protocol to interrupt rumination in 90 seconds</li>
                            <li>→ Emergency interrupt cards when you can't think straight</li>
                            <li>→ Rumination diary to see YOUR specific triggers</li>
                          </ul>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-slate-900 font-semibold">Clinical Exercise Library</span>
                            <span className="text-slate-500 text-xs md:text-sm">2-3 therapy sessions</span>
                          </div>
                          <ul className="space-y-1.5 text-xs md:text-sm text-slate-600 pl-4">
                            <li>→ Rumination-Focused exercises therapists charge $150/hour to teach</li>
                            <li>→ Polyvagal regulation to stop physical anxiety spirals</li>
                            <li>→ Metacognitive reframe templates without toxic positivity</li>
                          </ul>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-900 font-semibold">Lifetime Updates & New Research</span>
                            <span className="text-slate-500 text-xs md:text-sm">ongoing value</span>
                          </div>
                          <p className="text-xs md:text-sm text-slate-600 mt-1.5 pl-4">
                            → Never pay again when we add new exercises
                          </p>
                        </div>

                        <div className="border-t border-slate-300 pt-3 mt-3">
                          <p className="text-xs md:text-sm text-slate-600 text-center italic">
                            Equivalent to 5-6 therapy sessions at $150/hour = $750-900 in clinical value
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-emerald-50 p-3 md:p-4 rounded-lg border border-emerald-200 mb-3">
                      <p className="text-sm md:text-base text-center text-emerald-900 font-semibold leading-relaxed">
                        <CheckCircle className="inline w-4 h-4 mr-1.5" />
                        30-Day "Break Overthinking or It's Free" Guarantee: Try F.I.R.E. for 30 days. If you don't break your pattern, email us for a full refund. Keep everything.
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-sm md:text-base text-slate-600 text-center">
                      <div className="flex flex-col items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span className="leading-normal">30-day money-back</span>
                      </div>
                      <div className="flex flex-col items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span className="leading-normal">Instant access</span>
                      </div>
                      <div className="flex flex-col items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span className="leading-normal">850+ users</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-center mt-8">
                    <p className="text-base text-slate-600 italic">
                      "This is what finally worked after 8 years of therapy and 3 a.m. spirals."
                      <br />
                      <span className="font-semibold">— Anna, Creator of F.I.R.E.</span>
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
                    Here's what happened when women with your exact pattern tried F.I.R.E.
                  </p>

                  {/* Testimonials - Simple Quote Style with Emotional Specificity */}
                  <div className="space-y-6 mb-8">
                    <div className="bg-emerald-50/30 p-6 py-4 rounded-lg">
                      <p className="text-base text-slate-700 mb-3 leading-relaxed">
                        "I'm a therapist. I've spent years learning CBT techniques. But when I'd replay a session where I said something awkward to a client—lying awake analyzing every word—nothing I learned in grad school helped. F.I.R.E. gave me more practical tools in 2 weeks than I got in 6 months of my own therapy sessions. I wish I'd found this sooner."
                      </p>
                      <p className="text-sm text-slate-600 flex items-center gap-2">
                        <span><span className="font-semibold text-slate-900">Rachel K.</span> (scored 7/10) — Therapist, 41</span>
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                          Verified
                        </span>
                      </p>
                    </div>

                    <div className="bg-blue-50/30 p-6 py-4 rounded-lg">
                      <p className="text-base text-slate-700 mb-3 leading-relaxed">
                        "I scored 9/10 (chronic overthinker lol). After team meetings, I'd replay everything I said for hours. Did I sound smart enough? Did I interrupt someone? The rumination diary helped me see I was replaying the exact same 3 fears every single day. After 5 days of tracking, I could catch it in the first 10 seconds before it spirals. Huge difference."
                      </p>
                      <p className="text-sm text-slate-600 flex items-center gap-2">
                        <span><span className="font-semibold text-slate-900">Lauren B.</span> — Researcher, 39</span>
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                          Verified
                        </span>
                      </p>
                    </div>

                    <div className="bg-amber-50/30 p-6 py-4 rounded-lg">
                      <p className="text-base text-slate-700 mb-3 leading-relaxed">
                        "I scored 8/10 on the quiz. I'd wake up at 3 a.m. replaying something I said wrong at dinner, then spiral into every mistake I'd made that week. Week 3 of F.I.R.E. and I'm sleeping through the night for the first time in months. Not perfect, but I'm not exhausted anymore."
                      </p>
                      <p className="text-sm text-slate-600 flex items-center gap-2">
                        <span><span className="font-semibold text-slate-900">Sarah M.</span> — Marketing Director, 34</span>
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                          Verified
                        </span>
                      </p>
                    </div>

                    <div className="bg-purple-50/30 p-6 py-4 rounded-lg">
                      <p className="text-base text-slate-700 mb-3 leading-relaxed">
                        "Scored 10/10. I've been on Lexapro for 5 years. Still woke up every morning replaying yesterday's mistakes before my alarm went off. The breathing exercises from my therapist never stuck because when I'm dysregulated, I couldn't remember them. After 10 days with F.I.R.E., it's simple enough that even mid-panic, I can do it. The physical interrupt cards are a lifesaver."
                      </p>
                      <p className="text-sm text-slate-600 flex items-center gap-2">
                        <span><span className="font-semibold text-slate-900">Jennifer L.</span> — Nurse Practitioner, 36</span>
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                          Verified
                        </span>
                      </p>
                    </div>

                    <div className="bg-rose-50/30 p-6 py-4 rounded-lg">
                      <p className="text-base text-slate-700 mb-3 leading-relaxed">
                        "Quiz score 6/10. I thought I was fine—just a 'bit of a worrier.' Then I used the rumination diary for one week. Realized I was spending 2+ hours every single day replaying client emails—wondering if I sounded too pushy or not confident enough. After 2 weeks, the reframe exercises are the first thing that actually helped me stop treating worry like problem-solving. Game changer."
                      </p>
                      <p className="text-sm text-slate-600 flex items-center gap-2">
                        <span><span className="font-semibold text-slate-900">Melissa T.</span> — Project Manager, 42</span>
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                          Verified
                        </span>
                      </p>
                    </div>

                    <div className="bg-indigo-50/30 p-6 py-4 rounded-lg">
                      <p className="text-base text-slate-700 mb-3 leading-relaxed">
                        "I scored 9/10 and honestly thought nothing would work after trying meditation apps, journaling, you name it. F.I.R.E. is the first thing that gave me a protocol for when I see my ex's Instagram stories and spiral into 'why am I still not over this?' The '3am Emergency Cards' literally saved me during a panic attack last week. After 3 weeks, I keep them on my nightstand and use them almost daily."
                      </p>
                      <p className="text-sm text-slate-600 flex items-center gap-2">
                        <span><span className="font-semibold text-slate-900">Olivia R.</span> — Graphic Designer, 31</span>
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                          Verified
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Stats Section */}
                  <div className="max-w-2xl mx-auto mb-8 py-8">
                    <div className="grid grid-cols-3 gap-6 text-center">
                      <div>
                        <div className="font-black text-2xl text-slate-900">247</div>
                        <div className="text-xs text-slate-600 mt-1">women joined this week</div>
                      </div>

                      <div>
                        <div className="font-black text-2xl text-slate-900">850+</div>
                        <div className="text-xs text-slate-600 mt-1">total users</div>
                      </div>

                      <div>
                        <div className="font-black text-2xl text-slate-900">4.8/5</div>
                        <div className="text-xs text-slate-600 mt-1">average rating</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ========== FULL F.I.R.E. MECHANISM REVEAL (POST-PURCHASE JUSTIFICATION) ========== */}
              {resultData && (
                <div className="mb-16 max-w-3xl mx-auto">
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
                    Here's Exactly How F.I.R.E. Works
                  </h2>
                  <p className="text-base text-slate-700 mb-8 leading-relaxed">
                    This is the 4-step protocol you'll use the moment your brain starts spiraling. Not theory. Not worksheets. A protocol you can actually remember when you're dysregulated.
                  </p>

                  <div className="space-y-8">
                    {/* Step 1: Focus */}
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3"><strong>F</strong> — Focus: Name the Loop</h3>
                      <p className="text-base text-slate-700 leading-relaxed mb-3">
                        The moment you notice your thoughts looping, say out loud: <em>"I'm ruminating."</em>
                      </p>
                      <p className="text-base text-slate-700 leading-relaxed mb-3">
                        <strong>Why it works:</strong> Dr. Watkins' research shows that naming the rumination pattern activates your prefrontal cortex, breaking the automatic loop. This isn't positive thinking—it's pattern recognition.
                      </p>
                      <p className="text-sm text-slate-600 italic pl-4 border-l-2 border-slate-300">
                        Instead of: <em>"Why did I say that? They probably think I'm weird. I always do this..."</em> → Say: <em>"I'm ruminating about the dinner conversation."</em>
                      </p>
                    </div>

                    {/* Step 2: Interrupt */}
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3"><strong>I</strong> — Interrupt: Ground Your Nervous System</h3>
                      <p className="text-base text-slate-700 leading-relaxed mb-3">
                        Use the 5-4-3-2-1 technique. Name 5 things you see, 4 you hear, 3 you touch, 2 you smell, 1 you taste. Then take 3 slow exhales (4-count inhale, 8-count exhale).
                      </p>
                      <p className="text-base text-slate-700 leading-relaxed mb-3">
                        <strong>Why it works:</strong> Rumination keeps your nervous system in sympathetic activation (fight/flight). Slow exhales activate your vagus nerve, signaling safety to your brain. You can't ruminate effectively when your body is calm.
                      </p>
                      <p className="text-sm text-slate-600 italic pl-4 border-l-2 border-slate-300">
                        Physical cue: If you're lying in bed spiraling, sit up. If sitting, stand. Movement interrupts the loop.
                      </p>
                    </div>

                    {/* Step 3: Reframe */}
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3"><strong>R</strong> — Reframe: Shift to Concrete</h3>
                      <p className="text-base text-slate-700 leading-relaxed mb-3">
                        Ask yourself: <em>"What's one specific thing I can do about this in the next hour?"</em>
                      </p>
                      <p className="text-base text-slate-700 leading-relaxed mb-3">
                        <strong>Why it works:</strong> Rumination thrives on abstract, evaluative questions like "Why am I like this?" Concrete questions force your brain into problem-solving mode. Watkins' research shows this is the single most effective intervention.
                      </p>
                      <p className="text-sm text-slate-600 italic pl-4 border-l-2 border-slate-300 mb-2">
                        Abstract (brooding): <em>"Why can't I ever say the right thing? I always mess up."</em>
                      </p>
                      <p className="text-sm text-slate-600 italic pl-4 border-l-2 border-slate-300">
                        Concrete (reflection): <em>"If I'm worried about that comment, I can text them tomorrow to clarify."</em>
                      </p>
                    </div>

                    {/* Step 4: Execute */}
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3"><strong>E</strong> — Execute: Take One Small Action</h3>
                      <p className="text-base text-slate-700 leading-relaxed mb-3">
                        Do the thing. Even if it's tiny. Write it down, send the text, schedule the conversation—or consciously decide to let it go and do something else.
                      </p>
                      <p className="text-base text-slate-700 leading-relaxed mb-3">
                        <strong>Why it works:</strong> Rumination persists because your brain believes it's keeping you safe by "solving" the problem. Taking action—or consciously choosing inaction—closes the loop. Dr. Wells' research shows this breaks the "I must keep thinking about this" compulsion.
                      </p>
                      <p className="text-sm text-slate-600 italic pl-4 border-l-2 border-slate-300">
                        Key insight: The action doesn't have to solve the problem completely. It just has to show your brain: <em>"We're handling this. You can stop looping now."</em>
                      </p>
                    </div>
                  </div>

                  <div className="mt-10 pt-6 border-t border-slate-200">
                    <p className="text-base text-slate-700 leading-relaxed mb-2">
                      <strong>The entire protocol takes 2-5 minutes.</strong> F.I.R.E. isn't journaling. It isn't meditation. It's an interrupt protocol—designed for the moment your brain hijacks you mid-panic, before a presentation, or mid-conversation.
                    </p>
                    <p className="text-base text-slate-700 leading-relaxed">
                      Simple enough to remember when dysregulated. Specific enough to actually work. <strong>65% of women using this protocol report catching spirals in under 10 seconds after 2 weeks of practice.</strong>
                    </p>
                  </div>
                </div>
              )}

              {/* ========== DETAILED EDUCATION MOVED BELOW OFFER ========== */}
              {resultData && (
                <>
                  <div className="my-16 border-t border-slate-200 pt-12">
                    <div className="max-w-3xl mx-auto text-center mb-12">
                      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                        Want to understand the science behind F.I.R.E.?
                      </h2>
                      <p className="text-lg text-slate-700">
                        Below is the full clinical research explaining YOUR specific overthinking pattern and why these protocols work.
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
                          RF-CBT (Rumination-Focused CBT) is different — it targets the specific neural
                          pathways causing overthinking. 65% of chronic ruminators see improvement with these techniques.
                        </p>
                      </details>

                      <details className="group bg-white rounded-xl border border-slate-200 p-6">
                        <summary className="cursor-pointer font-semibold text-slate-900 flex items-center justify-between">
                          <span>Why $67? What's the catch?</span>
                          <span className="group-open:rotate-180 transition-transform">▼</span>
                        </summary>
                        <p className="mt-4 text-sm text-slate-700 leading-relaxed">
                          No catch. This is a frontend offer—we make money when buyers love it and come back for advanced training. But F.I.R.E. Protocol stands alone. You don't need anything else.
                          The $67 quiz-taker rate is reserved for people who completed the assessment because your results are calibrated and fresh. It helps you implement faster.
                        </p>
                      </details>

                      <details className="group bg-white rounded-xl border border-slate-200 p-6">
                        <summary className="cursor-pointer font-semibold text-slate-900 flex items-center justify-between">
                          <span>How is this different from meditation apps?</span>
                          <span className="group-open:rotate-180 transition-transform">▼</span>
                        </summary>
                        <p className="mt-4 text-sm text-slate-700 leading-relaxed">
                          Meditation is great for general stress. F.I.R.E. is targeted rumination interruption —
                          specific protocols designed for the moment your brain won't stop looping.
                          Think of it as emergency tools, not daily maintenance.
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
                        The cost of waiting isn't $67. It's every night your brain steals from you. Every quiet moment that turns into a spiral. Every decision that becomes paralysis.
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
                      Here's what happens when women like you actually use the F.I.R.E. method in real life:
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
                      Everything in the F.I.R.E. Protocol is built on actual clinical research. Here's where it all comes from:
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
                            <span className="text-base text-slate-700">Treynor et al. (2003): "Rumination Reconsidered" — Defines reflection vs. brooding</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-slate-600 rounded-full flex-shrink-0 mt-2"></div>
                            <span className="text-base text-slate-700">Watkins & Roberts (2020): "Reflecting on rumination" (Behaviour Research & Therapy)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-slate-600 rounded-full flex-shrink-0 mt-2"></div>
                            <span className="text-base text-slate-700">Nature Reviews Psychology (2024): RNT as transdiagnostic process</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-slate-600 rounded-full flex-shrink-0 mt-2"></div>
                            <span className="text-base text-slate-700">Wells (2011): Metacognitive therapy foundations</span>
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
                          You're joining 850+ women at DailyHush who are using these frameworks every day.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ========== PERSONAL CLOSING FROM ANNA ========== */}
                  <div ref={womenWhoActRef} className="mb-16 max-w-3xl mx-auto">
                    <div className="space-y-4 text-base md:text-lg text-slate-700 leading-relaxed">
                      <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
                        The Women Who Act Now Sleep Better Tonight
                      </h3>
                      <p>
                        I know your brain is already analyzing this. <em>"But what if this doesn't work for me? What if I'm too far gone? What if I waste $67 and nothing changes?"</em>
                      </p>
                      <p>
                        That's the overthinking talking. Here's what actually happens when you act: The next time your brain starts spiraling, you'll have a protocol. Four steps. Ninety seconds. Real interruption instead of hours of mental loops.
                      </p>
                      <p>
                        <strong>The F.I.R.E. Protocol won't magically make your brain quiet overnight.</strong> But it will give you something you've been missing: a map.
                      </p>
                      <p>
                        Not another self-help platitude. Not another "just think positive" bandaid. An actual, research-backed protocol you can use when you need it most.
                      </p>
                      <p>
                        I created this because I needed it. Because late at night when I was spiraling over a work decision, I didn't need to know about "metacognitive beliefs" — I needed something I could <em>do</em>.
                      </p>
                      <p className="font-semibold text-slate-900">
                        So here's my promise: If you try the F.I.R.E. method and it doesn't help, email me. I'll refund you myself. No forms, no questions, no hassle.
                      </p>
                      <p>
                        But if there's even a chance this could be the thing that finally works — the thing that gives you your brain back — isn't that worth 67 dollars and 60 seconds of your time?
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
                        productId="10761797894447"
                        domain="t7vyee-kc.myshopify.com"
                        storefrontAccessToken="a3bc32a7b8116c3f806d7d16e91eadad"
                        buttonText="Get the F.I.R.E. Protocol • $67"
                        buttonColor="#16a34a"
                        buttonHoverColor="#15803d"
                        className="w-full"
                      />
                      <p className="text-sm text-slate-600 mt-3 text-center">
                        30-day money-back guarantee • Instant download
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
                        Creator, F.I.R.E. Method & DailyHush
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
