import { useEffect, useState, useRef } from 'react'
import { CheckCircle, Flame, BookOpen, Brain, Lightbulb } from 'lucide-react'
import ShopifyBuyButton from '../../components/ShopifyBuyButton'
import { ScarcityProvider, useScarcity } from '../../contexts/ScarcityContext'
import { TopBar } from '../../components/layout/TopBar'
import type { OverthinkerType } from '../../types/quiz'
import Testimonials from '../../components/Testimonials'

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

  // Get quiz type and score from URL params
  const urlParams = new URLSearchParams(window.location.search)
  const quizType = urlParams.get('type') as OverthinkerType | null
  const quizScore = urlParams.get('score') ? parseInt(urlParams.get('score')!) : null

  // Get personalized quiz result data or use defaults
  const resultData = quizType ? quizResultData[quizType] : null

  useEffect(() => {
    document.title = 'Your Overthinking Results — DailyHush'
  }, [])

  // Track scroll position for sticky bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercentage = (scrollTop / docHeight) * 100

      let isAboveBadge = true
      if (fireKitBadgeRef.current) {
        const badgePosition = fireKitBadgeRef.current.getBoundingClientRect().top + window.scrollY
        const viewportBottom = scrollTop + window.innerHeight
        isAboveBadge = viewportBottom < badgePosition
      }

      setShowStickyBar(scrollPercentage >= 20 && isAboveBadge)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
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
        {/* Mobile Sticky Bottom Bar */}
        <div className={`fixed bottom-0 left-0 right-0 z-40 sm:hidden transition-transform duration-500 ease-out ${
          showStickyBar ? 'translate-y-0' : 'translate-y-full'
        }`}>
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/98 to-white/95 backdrop-blur-2xl" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-200/40 to-transparent" />
          <div className="relative px-4 py-4 space-y-3">
            {!isSoldOut && (
              <div className="space-y-2">
                <div className="relative w-full bg-slate-200/60 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${
                      isCritical
                        ? 'bg-gradient-to-r from-rose-400 to-pink-400'
                        : 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400'
                    }`}
                    style={{ width: `${(spotsRemaining / totalSpots) * 100}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0 animate-shimmer" />
                  </div>
                </div>
                <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-slate-700">
                  <Flame className={`h-3.5 w-3.5 ${isCritical ? 'text-rose-600' : 'text-amber-600'}`} />
                  <span>{spotsRemaining}/{totalSpots} spots left today</span>
                </div>
              </div>
            )}
            <ShopifyBuyButton
              productId="10761797894447"
              domain="t7vyee-kc.myshopify.com"
              storefrontAccessToken="a3bc32a7b8116c3f806d7d16e91eadad"
              buttonText="Get F.I.R.E. Kit • $27"
              buttonColor="#16a34a"
              buttonHoverColor="#15803d"
              className="w-full"
            />
            <div className="flex items-center justify-center text-xs text-slate-600">
              <CheckCircle className="h-3 w-3 text-emerald-600 flex-shrink-0 mr-1" />
              <span>30-day money-back guarantee</span>
            </div>
          </div>
          <div className="h-safe-area-inset-bottom bg-gradient-to-t from-white to-transparent" />
        </div>

        <div className="w-full max-w-5xl px-0 md:px-4 flex flex-1 relative z-10">
          <div className="bg-white/90 backdrop-blur-xl flex-1 flex flex-col overflow-hidden pb-20 sm:pb-0 shadow-[0_16px_48px_-8px_rgba(16,185,129,0.15)]">
            <div className="flex-1 max-w-4xl w-full mx-auto px-4 md:px-16 py-12 md:py-16 pb-16 md:pb-20">

              {/* ========== EMOTIONAL OPENING ========== */}
              <div className="mb-12">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-emerald-900 mb-6 leading-tight">
                  Listen... If your brain never shuts up — this will finally make sense.
                </h1>
                <div className="max-w-3xl space-y-4 text-base md:text-lg text-emerald-800 leading-relaxed">
                  <p>I know what just happened.</p>
                  <p>
                    You sat there answering those questions — some of them uncomfortably accurate — and with each click, you felt that familiar tightness in your chest. That voice in your head saying <em>"See? I KNEW something was wrong with me. This is proof."</em>
                  </p>
                  <p>
                    But here's what that voice doesn't want you to know: <strong>What you're about to see below isn't a diagnosis.</strong> It's not another label to beat yourself up with. It's the first time someone's actually going to explain WHY your brain won't shut up — and more importantly, what actually works to quiet it.
                  </p>
                  <p>
                    Your results are waiting just below. But before you look, understand this: <strong>The number you got, the "type" you are — that's just the map.</strong> What I'm about to show you after that is the way out.
                  </p>
                  <p className="text-sm italic text-emerald-700">
                    (After 8 years of therapy, self-help, and 3 a.m. spirals — this is what finally worked.)
                  </p>
                </div>
              </div>

              {/* ========== SECTION 1: RESULT VALIDATION (5%) ========== */}
              {resultData && quizScore !== null && (
                <div className="mb-16 bg-amber-50/30 border-l-4 border-amber-500 pl-6 md:pl-8 py-6 rounded-r-lg">
                  <div className="max-w-3xl">
                    <p className="text-sm font-bold text-amber-800 mb-3 tracking-wide">🧠 YOUR CLINICAL PROFILE</p>
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

              {/* ========== EARLY TEASER CARD ========== */}
              <div className="mb-12 max-w-2xl mx-auto">
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center text-white">
                        <Lightbulb className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900 mb-2">
                        The F.I.R.E. Kit translates this research into daily practice
                      </p>
                      <p className="text-sm text-slate-700">
                        40+ exercises based on the protocols you're reading below. $27.{' '}
                        <a href="#offer-details" className="underline font-semibold hover:text-emerald-900">
                          See details ↓
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ========== WHY YOUR SMARTEST THOUGHTS KEEP YOU PARALYZED ========== */}
              <div className="mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 mb-6 text-center">
                  Why Your Smartest Thoughts Keep You Paralyzed
                </h2>

                <div className="max-w-3xl mx-auto space-y-6 text-base md:text-lg text-emerald-800 leading-relaxed">
                  <p>
                    Here's the paradox researchers at Yale discovered:
                  </p>
                  <p>
                    <strong>The harder you think, the more stuck you get.</strong>
                  </p>
                  <p>
                    You've probably noticed: You can analyze a situation from 47 angles... and still feel no closer to peace. That's not because you're not smart enough—it's because <em>overthinking isn't a thinking problem</em>.
                  </p>

                  <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-xl p-6 my-6">
                    <p className="font-bold text-amber-900 mb-2">The Hidden Addiction You Never Noticed:</p>
                    <p>
                      Your brain treats rumination like a cigarette — a quick hit of "I'm doing something about this" without actually solving anything. Research from University of Manchester shows that <strong>chronic overthinkers unconsciously believe rumination keeps them safe</strong>.
                    </p>
                    <p className="mt-4">
                      Spoiler: It doesn't. It just keeps you spinning.
                    </p>
                  </div>

                  <p>
                    That 3 a.m. replay of a conversation from Tuesday? Your brain isn't "problem-solving." It's <strong>brooding</strong>—which Yale's Dr. Susan Nolen-Hoeksema found is the #1 predictor of depression in women.
                  </p>

                  <p>
                    But here's what's wild: <strong>Your brain can be retrained.</strong>
                  </p>

                  <p>
                    University of Exeter spent 15 years studying exactly how to interrupt these loops. Not through willpower or "positive thinking"—through specific techniques that literally rewire the neural pathways causing the spirals.
                  </p>

                  <p className="font-semibold text-emerald-900">
                    That's what the research below explains. And that's what F.I.R.E. Kit teaches you to do.
                  </p>
                </div>
              </div>

              {/* ========== SECTION 2: WHAT THIS ACTUALLY MEANS (40% - Pure Education) ========== */}
              {resultData && (
                <>
                  <div className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                      <Brain className="w-8 h-8 text-emerald-600" />
                      <h2 className="text-3xl md:text-4xl font-bold text-emerald-900">
                        What This Actually Means
                      </h2>
                    </div>

                    {/* Clinical Definition */}
                    <div className="mb-8 border-l-4 border-emerald-500 pl-6">
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
                    <div className="mb-8 border-l-4 border-blue-500 pl-6">
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
                    <div className="border-l-4 border-amber-500 pl-6">
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

                    <div className="border-l-4 border-blue-500 pl-6">
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
                        <div key={idx} className="border-l-4 border-emerald-500 pl-6">
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

                  {/* ========== F.I.R.E. FRAMEWORK BREAKDOWN ========== */}
                  <div className="mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 mb-6 text-center">
                      The F.I.R.E. Method Explained
                    </h2>

                    <div className="max-w-3xl mx-auto mb-12 space-y-4 text-base md:text-lg text-emerald-800 leading-relaxed">
                      <p>
                        All of those clinical techniques you just read? They work. But here's the problem: <strong>they're too complicated to remember at 3 a.m. when your brain is spinning.</strong>
                      </p>
                      <p>
                        That's why we created F.I.R.E. — a framework that translates RF-CBT, MCT, and Polyvagal Theory into 4 steps you can actually use when you're spiraling.
                      </p>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-6">
                      {/* F - Feel */}
                      <div className="group relative">
                        <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 md:p-8 border-2 border-rose-200/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01]">
                          <div className="flex items-start gap-4 md:gap-6">
                            <div className="relative flex-shrink-0">
                              <div className="absolute inset-0 bg-rose-600 rounded-2xl blur-md opacity-40 group-hover:opacity-60 transition-opacity"></div>
                              <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center text-white font-black text-2xl md:text-3xl shadow-lg">
                                F
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-3">
                                <span className="text-xs font-bold tracking-wider text-rose-700 uppercase">Step 1</span>
                                <div className="flex-1 h-px bg-gradient-to-r from-rose-300 to-transparent"></div>
                              </div>
                              <h3 className="text-xl md:text-2xl font-bold text-rose-900 mb-4">
                                FEEL → Notice the spiral without judgment
                              </h3>
                              <div className="space-y-3">
                                <div className="flex items-start gap-2">
                                  <span className="text-sm font-semibold text-rose-800 whitespace-nowrap">What it is:</span>
                                  <p className="text-sm md:text-base text-slate-700 leading-relaxed">
                                    The moment you catch yourself looping. Not 20 minutes in — the first 10 seconds.
                                  </p>
                                </div>
                                <div className="flex items-start gap-2">
                                  <span className="text-sm font-semibold text-rose-800 whitespace-nowrap">Why it matters:</span>
                                  <p className="text-sm md:text-base text-slate-700 leading-relaxed">
                                    Metacognitive Therapy (University of Manchester) shows that awareness is 50% of the battle. You can't interrupt what you don't notice.
                                  </p>
                                </div>
                                <div className="mt-4 bg-white/60 rounded-lg p-4 border border-rose-200/50">
                                  <p className="text-xs font-semibold text-rose-700 mb-1 uppercase tracking-wide">Example</p>
                                  <p className="text-sm text-slate-600 italic">
                                    "I'm ruminating about what Sarah said at lunch" vs. "Sarah's comment means I'm a terrible friend and..."
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Connector - Enhanced */}
                      <div className="flex justify-center items-center py-2">
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-0.5 h-6 bg-gradient-to-b from-rose-400/50 via-amber-400/50 to-amber-500/50"></div>
                          <div className="w-2 h-2 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 shadow-sm"></div>
                          <div className="w-0.5 h-6 bg-gradient-to-b from-amber-500/50 via-amber-400/50 to-amber-400/50"></div>
                        </div>
                      </div>

                      {/* I - Interrupt */}
                      <div className="group relative">
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 md:p-8 border-2 border-amber-200/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01]">
                          <div className="flex items-start gap-4 md:gap-6">
                            <div className="relative flex-shrink-0">
                              <div className="absolute inset-0 bg-amber-600 rounded-2xl blur-md opacity-40 group-hover:opacity-60 transition-opacity"></div>
                              <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-black text-2xl md:text-3xl shadow-lg">
                                I
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-3">
                                <span className="text-xs font-bold tracking-wider text-amber-700 uppercase">Step 2</span>
                                <div className="flex-1 h-px bg-gradient-to-r from-amber-300 to-transparent"></div>
                              </div>
                              <h3 className="text-xl md:text-2xl font-bold text-amber-900 mb-4">
                                INTERRUPT → Break the loop (physically)
                              </h3>
                              <div className="space-y-3">
                                <div className="flex items-start gap-2">
                                  <span className="text-sm font-semibold text-amber-800 whitespace-nowrap">What it is:</span>
                                  <p className="text-sm md:text-base text-slate-700 leading-relaxed">
                                    A physical pattern interrupt. Cold water on your face. 10 jumping jacks. Splashing your wrists. Humming.
                                  </p>
                                </div>
                                <div className="flex items-start gap-2">
                                  <span className="text-sm font-semibold text-amber-800 whitespace-nowrap">Why it matters:</span>
                                  <p className="text-sm md:text-base text-slate-700 leading-relaxed">
                                    Polyvagal Theory research shows rumination = nervous system dysregulation. You can't think your way out. You have to interrupt the physiological state.
                                  </p>
                                </div>
                                <div className="mt-4 bg-white/60 rounded-lg p-4 border border-amber-200/50">
                                  <p className="text-xs font-semibold text-amber-700 mb-1 uppercase tracking-wide">Example</p>
                                  <p className="text-sm text-slate-600 italic">
                                    Face in ice water for 30 seconds activates your vagus nerve and literally resets your nervous system.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Connector - Enhanced */}
                      <div className="flex justify-center items-center py-2">
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-0.5 h-6 bg-gradient-to-b from-amber-400/50 via-emerald-400/50 to-emerald-500/50"></div>
                          <div className="w-2 h-2 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 shadow-sm"></div>
                          <div className="w-0.5 h-6 bg-gradient-to-b from-emerald-500/50 via-emerald-400/50 to-emerald-400/50"></div>
                        </div>
                      </div>

                      {/* R - Redirect */}
                      <div className="group relative">
                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 md:p-8 border-2 border-emerald-200/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01]">
                          <div className="flex items-start gap-4 md:gap-6">
                            <div className="relative flex-shrink-0">
                              <div className="absolute inset-0 bg-emerald-600 rounded-2xl blur-md opacity-40 group-hover:opacity-60 transition-opacity"></div>
                              <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-black text-2xl md:text-3xl shadow-lg">
                                R
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-3">
                                <span className="text-xs font-bold tracking-wider text-emerald-700 uppercase">Step 3</span>
                                <div className="flex-1 h-px bg-gradient-to-r from-emerald-300 to-transparent"></div>
                              </div>
                              <h3 className="text-xl md:text-2xl font-bold text-emerald-900 mb-4">
                                REDIRECT → Shift from abstract to concrete
                              </h3>
                              <div className="space-y-3">
                                <div className="flex items-start gap-2">
                                  <span className="text-sm font-semibold text-emerald-800 whitespace-nowrap">What it is:</span>
                                  <p className="text-sm md:text-base text-slate-700 leading-relaxed">
                                    Ask: "What's one small thing I can do RIGHT NOW?" Not "Why did this happen?" — that's a rumination trap.
                                  </p>
                                </div>
                                <div className="flex items-start gap-2">
                                  <span className="text-sm font-semibold text-emerald-800 whitespace-nowrap">Why it matters:</span>
                                  <p className="text-sm md:text-base text-slate-700 leading-relaxed">
                                    RF-CBT from University of Exeter shows abstract thinking = brooding. Concrete thinking = problem-solving. This single shift accounts for 65% of rumination reduction in studies.
                                  </p>
                                </div>
                                <div className="mt-4 bg-white/60 rounded-lg p-4 border border-emerald-200/50">
                                  <p className="text-xs font-semibold text-emerald-700 mb-1 uppercase tracking-wide">Example</p>
                                  <p className="text-sm text-slate-600 italic">
                                    Instead of "Why do I always mess up?" → "I can text Sarah: 'Hey, was that comment about X? Want to clarify.'"
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Connector - Enhanced */}
                      <div className="flex justify-center items-center py-2">
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-0.5 h-6 bg-gradient-to-b from-emerald-400/50 via-blue-400/50 to-blue-500/50"></div>
                          <div className="w-2 h-2 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 shadow-sm"></div>
                          <div className="w-0.5 h-6 bg-gradient-to-b from-blue-500/50 via-blue-400/50 to-blue-400/50"></div>
                        </div>
                      </div>

                      {/* E - Ease */}
                      <div className="group relative">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 md:p-8 border-2 border-blue-200/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01]">
                          <div className="flex items-start gap-4 md:gap-6">
                            <div className="relative flex-shrink-0">
                              <div className="absolute inset-0 bg-blue-600 rounded-2xl blur-md opacity-40 group-hover:opacity-60 transition-opacity"></div>
                              <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-black text-2xl md:text-3xl shadow-lg">
                                E
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-3">
                                <span className="text-xs font-bold tracking-wider text-blue-700 uppercase">Step 4</span>
                                <div className="flex-1 h-px bg-gradient-to-r from-blue-300 to-transparent"></div>
                              </div>
                              <h3 className="text-xl md:text-2xl font-bold text-blue-900 mb-4">
                                EASE → Build your window of tolerance
                              </h3>
                              <div className="space-y-3">
                                <div className="flex items-start gap-2">
                                  <span className="text-sm font-semibold text-blue-800 whitespace-nowrap">What it is:</span>
                                  <p className="text-sm md:text-base text-slate-700 leading-relaxed">
                                    Daily practices that widen your nervous system's "green zone" — so you don't spiral as easily in the first place.
                                  </p>
                                </div>
                                <div className="flex items-start gap-2">
                                  <span className="text-sm font-semibold text-blue-800 whitespace-nowrap">Why it matters:</span>
                                  <p className="text-sm md:text-base text-slate-700 leading-relaxed">
                                    Polyvagal Theory (Dr. Dan Siegel) shows chronic overthinkers have narrow windows of tolerance. The solution isn't just stopping spirals — it's preventing them.
                                  </p>
                                </div>
                                <div className="mt-4 bg-white/60 rounded-lg p-4 border border-blue-200/50">
                                  <p className="text-xs font-semibold text-blue-700 mb-1 uppercase tracking-wide">Example</p>
                                  <p className="text-sm text-slate-600 italic">
                                    Morning walks, co-regulation (safe relationships), breathwork, bilateral stimulation, somatic tracking.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Step 0: Try It Now */}
                    <div className="mt-12 border-l-4 border-indigo-500 pl-6 md:pl-8 py-4">
                      <h3 className="text-2xl font-bold text-emerald-900 mb-4">
                        Step 0: Try It Now (Free)
                      </h3>
                      <p className="text-base text-emerald-800 leading-relaxed mb-6">
                        Before you buy anything, <strong>test the framework right now</strong>:
                      </p>

                      <ol className="space-y-4 text-emerald-800 mb-6 list-decimal list-inside">
                        <li className="text-base leading-relaxed">
                          <strong>FEEL:</strong> Think of something you're currently ruminating about. Notice the physical sensation — tight chest? Stomach knot? That's your cue.
                        </li>
                        <li className="text-base leading-relaxed">
                          <strong>INTERRUPT:</strong> Stand up right now. Run cold water over your wrists for 30 seconds OR do 10 jumping jacks. (Yes, really. Do it.)
                        </li>
                        <li className="text-base leading-relaxed">
                          <strong>REDIRECT:</strong> Ask yourself: "What's ONE concrete action I can take in the next 10 minutes?" Write it down.
                        </li>
                        <li className="text-base leading-relaxed">
                          <strong>EASE:</strong> Take 3 slow breaths. 4-count inhale. 8-count exhale. Feel your shoulders drop.
                        </li>
                      </ol>

                      <div className="border-t border-indigo-300/50 pt-4">
                        <p className="text-base text-emerald-800 leading-relaxed mb-2">
                          <strong>Notice anything shift?</strong> That's 90 seconds of F.I.R.E.
                        </p>
                        <p className="text-sm text-emerald-700">
                          The F.I.R.E. Kit gives you 40+ exercises like this — for every type of spiral, every time of day, every situation.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ========== COMPACT OFFER CARD ========== */}
                  <div id="offer-details" ref={fireKitBadgeRef} className="mb-16 max-w-2xl mx-auto">
                    {/* Transition Copy */}
                    <div className="text-center mb-8 space-y-4">
                      <p className="text-lg text-slate-700 leading-relaxed">
                        You've seen the research. You understand <em>why</em> your brain works this way.
                      </p>
                      <p className="text-2xl font-bold text-slate-900">
                        Here's the toolkit that translates it into action.
                      </p>
                    </div>

                    {/* Compact Offer Card */}
                    <div className="relative bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200 shadow-xl overflow-hidden">
                      {/* Scarcity Indicator (if applicable) */}
                      {!isSoldOut && (
                        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-center py-2 text-sm font-semibold">
                          <Flame className="inline h-4 w-4 mr-1" />
                          {spotsRemaining} spots left today
                        </div>
                      )}

                      <div className={`p-8 ${!isSoldOut ? 'pt-16' : ''}`}>
                        {/* Header */}
                        <div className="text-center mb-6">
                          <h3 className="text-2xl font-bold text-slate-900 mb-2">
                            The F.I.R.E. Kit
                          </h3>
                          <p className="text-sm text-slate-600">
                            Clinical protocols from University of Exeter & Manchester
                          </p>
                        </div>

                        {/* What's Included - Condensed */}
                        <div className="mb-6 space-y-2">
                          <p className="text-sm font-semibold text-slate-900 mb-3">What You Get:</p>
                          <div className="grid grid-cols-1 gap-2 text-sm text-slate-700">
                            <div className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                              <span>40+ RF-CBT exercises (Watkins' protocols)</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                              <span>MCT detached mindfulness practices (Wells' clinic)</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                              <span>Polyvagal nervous system regulation tools</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                              <span>Window of Tolerance mapping (Siegel's model)</span>
                            </div>
                          </div>
                        </div>

                        {/* Price & CTA */}
                        <div className="bg-white rounded-xl p-6 mb-4 border border-emerald-200">
                          <div className="flex items-baseline justify-center gap-2 mb-4">
                            <span className="text-5xl font-black text-slate-900">$27</span>
                            <span className="text-lg text-slate-500 line-through">$97</span>
                          </div>
                          <p className="text-center text-sm text-slate-600 mb-6">
                            Less than one therapy co-pay. Same clinical frameworks.
                          </p>

                          <ShopifyBuyButton
                            productId="10761797894447"
                            domain="t7vyee-kc.myshopify.com"
                            storefrontAccessToken="a3bc32a7b8116c3f806d7d16e91eadad"
                            buttonText="Get the F.I.R.E. Kit"
                            buttonColor="#16a34a"
                            buttonHoverColor="#15803d"
                            className="w-full"
                          />
                        </div>

                        {/* Trust Badges */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-slate-600">
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                            <span>30-day money-back</span>
                          </div>
                          <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-300" />
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                            <span>Instant download</span>
                          </div>
                          <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-300" />
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                            <span>50,000+ users</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Subtle Risk Reversal - Outside Card */}
                    <div className="mt-6 text-center">
                      <p className="text-sm text-slate-600 italic">
                        "This is what finally worked after 8 years of therapy and 3 a.m. spirals."
                        <br />
                        <span className="font-semibold">— Anna, Creator of F.I.R.E.</span>
                      </p>
                    </div>
                  </div>

                  {/* ========== FAQ SECTION ========== */}
                  <div className="mb-16 max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
                      Common Questions
                    </h2>

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
                          <span>Why $27? What's the catch?</span>
                          <span className="group-open:rotate-180 transition-transform">▼</span>
                        </summary>
                        <p className="mt-4 text-sm text-slate-700 leading-relaxed">
                          No catch. We want this accessible. One therapy co-pay costs $30-$50.
                          We charge $27 so price isn't the barrier. If it doesn't help, email us — full refund, no questions.
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

                  {/* ========== TESTIMONIALS ========== */}
                  <Testimonials />

                  {/* ========== SECTION 6: FURTHER RESOURCES (5% - Authority Building) ========== */}
                  <div className="mb-16 max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 mb-6">
                      Further Resources
                    </h2>

                    <div className="space-y-8">
                      <div>
                        <h3 className="text-xl font-bold text-emerald-900 mb-4">Essential Books for Your Profile:</h3>
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
                        <h3 className="text-xl font-bold text-emerald-900 mb-4">Key Research Papers:</h3>
                        <ul className="space-y-2 mb-6">
                          <li className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-slate-600 rounded-full flex-shrink-0 mt-2"></div>
                            <span className="text-base text-emerald-800">Treynor et al. (2003): "Rumination Reconsidered" — Defines reflection vs. brooding</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-slate-600 rounded-full flex-shrink-0 mt-2"></div>
                            <span className="text-base text-emerald-800">Watkins & Roberts (2020): "Reflecting on rumination" (Behaviour Research & Therapy)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-slate-600 rounded-full flex-shrink-0 mt-2"></div>
                            <span className="text-base text-emerald-800">Nature Reviews Psychology (2024): RNT as transdiagnostic process</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-slate-600 rounded-full flex-shrink-0 mt-2"></div>
                            <span className="text-base text-emerald-800">Wells (2011): Metacognitive therapy foundations</span>
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-emerald-900 mb-3">Clinical Resources:</h3>
                        <ul className="space-y-2">
                          <li className="text-base text-emerald-800">• University of Exeter Mood Disorders Centre (Watkins' RF-CBT research)</li>
                          <li className="text-base text-emerald-800">• University of Manchester Metacognitive Therapy clinic (Wells' protocols)</li>
                          <li className="text-base text-emerald-800">• Yale University (Nolen-Hoeksema's rumination research)</li>
                        </ul>
                      </div>

                      <div className="text-center pt-4">
                        <p className="text-base text-emerald-800">
                          <strong>Join 50,000+ women</strong> at DailyHush using these frameworks daily.
                        </p>
                      </div>
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
