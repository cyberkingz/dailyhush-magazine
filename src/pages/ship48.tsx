import { useEffect, useState } from 'react'
import { Timer, CheckCircle, Trophy, Share2, ArrowRight, Clock, Target, Flame, Calendar, Zap, FileText, Users } from 'lucide-react'
import { CheckoutButton } from '@/components/stripe/CheckoutButton'

interface SessionData {
  startTime: number
  tasks: string[]
  completedSessions: number
  lastActiveDate: string
}

export default function Ship48() {
  const [currentTask, setCurrentTask] = useState<string>('')
  const [completedTasks, setCompletedTasks] = useState<string[]>([])
  const [timeRemaining, setTimeRemaining] = useState(48 * 60 * 60) // 48 hours in seconds
  const [sessionStarted, setSessionStarted] = useState(false)
  const [showShareBadge, setShowShareBadge] = useState(false)
  const [streak, setStreak] = useState(0)
  const [totalSessions, setTotalSessions] = useState(0)

  // Load saved data on mount
  useEffect(() => {
    const savedData = localStorage.getItem('ship48_data')
    if (savedData) {
      const data: SessionData = JSON.parse(savedData)
      setTotalSessions(data.completedSessions)
      
      // Check for active session
      const now = Date.now()
      const sessionAge = now - data.startTime
      if (sessionAge < 48 * 60 * 60 * 1000 && sessionAge > 0) {
        setSessionStarted(true)
        setCompletedTasks(data.tasks)
        setTimeRemaining(48 * 60 * 60 - Math.floor(sessionAge / 1000))
      }
      
      // Calculate streak
      const today = new Date().toDateString()
      const lastActive = new Date(data.lastActiveDate).toDateString()
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()
      
      if (lastActive === today || lastActive === yesterday) {
        // Load streak from localStorage
        setStreak(parseInt(localStorage.getItem('ship48_streak') || '0'))
      }
    }
  }, [])

  // Timer countdown effect
  useEffect(() => {
    if (!sessionStarted) return
    
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(timer)
          completeSession()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [sessionStarted])

  // Save data whenever tasks change
  useEffect(() => {
    if (sessionStarted) {
      const data: SessionData = {
        startTime: Date.now() - (48 * 60 * 60 * 1000 - timeRemaining * 1000),
        tasks: completedTasks,
        completedSessions: totalSessions,
        lastActiveDate: new Date().toISOString()
      }
      localStorage.setItem('ship48_data', JSON.stringify(data))
    }
  }, [completedTasks, sessionStarted])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours}h ${mins}m ${secs}s`
  }

  const completeSession = () => {
    // RETENTION: Update streak and total sessions
    const newTotal = totalSessions + 1
    setTotalSessions(newTotal)
    
    const currentStreak = parseInt(localStorage.getItem('ship48_streak') || '0')
    const newStreak = currentStreak + 1
    setStreak(newStreak)
    
    localStorage.setItem('ship48_streak', newStreak.toString())
    
    const data: SessionData = {
      startTime: 0,
      tasks: [],
      completedSessions: newTotal,
      lastActiveDate: new Date().toISOString()
    }
    localStorage.setItem('ship48_data', JSON.stringify(data))
    
    // Reset for next session
    setSessionStarted(false)
    setCompletedTasks([])
    setTimeRemaining(48 * 60 * 60)
    setShowShareBadge(true) // Show completion badge
  }

  const addTask = () => {
    if (currentTask.trim()) {
      setCompletedTasks(prev => [...prev, currentTask.trim()])
      setCurrentTask('')
      
      // ACTIVATION: First task = dopamine hit
      if (completedTasks.length === 0) {
        setTimeout(() => {
          alert('🎉 First task complete! You\'re building momentum!')
        }, 100)
      }
      
      // Show share badge after 3+ tasks
      if (completedTasks.length >= 2) {
        setShowShareBadge(true)
      }
    }
  }

  const startSession = () => {
    setSessionStarted(true)
    setTimeRemaining(48 * 60 * 60)
    setCompletedTasks([])
    setShowShareBadge(false)
  }

  const progressPercentage = Math.min((completedTasks.length / 5) * 100, 100)

  const shareResults = () => {
    let text = ''
    if (timeRemaining <= 0) {
      // Session completed
      text = `✅ I just completed a 48-hour shipping challenge! Shipped ${completedTasks.length} meaningful tasks and stayed focused for 2 straight days. Who's joining the next sprint? 🚀 #Ship48Challenge`
    } else {
      // Mid-session progress
      text = `🔥 ${completedTasks.length} tasks down in my 48-hour shipping sprint! The focus and momentum is incredible. Try it yourself: dailyhush.com/ship48 #Ship48Challenge`
    }
    
    if (navigator.share) {
      navigator.share({ 
        text,
        url: 'https://dailyhush.com/ship48'
      })
    } else {
      navigator.clipboard.writeText(text + ' https://dailyhush.com/ship48')
      alert('Share text copied to clipboard!')
    }
  }

  const scheduleNextSession = () => {
    // RETENTION: Schedule reminder for next session
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          // Schedule reminder for tomorrow
          setTimeout(() => {
            new Notification('Ready for another 48-hour sprint?', {
              body: 'Your streak is waiting! Start your next shipping challenge.',
              icon: '/favicon.ico'
            })
          }, 24 * 60 * 60 * 1000) // 24 hours
        }
      })
    }
  }

  useEffect(() => {
    document.title = 'Ship48 — Your 48-Hour Shipping Challenge'
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="mx-auto max-w-4xl px-6 py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center gap-4 mb-6">
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full text-sm font-semibold text-indigo-600">
              <Clock className="w-4 h-4" />
              <span>48-Hour Challenge</span>
            </div>
            {totalSessions > 0 && (
              <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full text-sm font-semibold text-green-600">
                <Trophy className="w-4 h-4" />
                <span>{totalSessions} Sessions Completed</span>
              </div>
            )}
            {streak > 0 && (
              <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full text-sm font-semibold text-orange-600">
                <Flame className="w-4 h-4" />
                <span>{streak} Day Streak</span>
              </div>
            )}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Ship Something in
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
              {' '}48 Hours
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Turn your ideas into reality with time pressure and focus. Complete tasks, track progress, 
            and ship something meaningful before the timer runs out.
          </p>
        </div>

        {!sessionStarted ? (
          /* Pre-Start State */
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="text-center">
              <Target className="w-16 h-16 text-indigo-500 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Ship?</h2>
              <p className="text-gray-600 mb-8">
                Commit to 48 hours of focused execution. Your timer starts the moment you click below.
              </p>
              <button 
                onClick={startSession}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition inline-flex items-center gap-2"
              >
                Start 48-Hour Challenge <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          /* Active Session State */
          <>
            {/* ACTIVATION: Progress Bar + Timer */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Your Sprint Progress</h2>
                  <p className="text-gray-600">Keep the momentum going!</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-indigo-600">
                    {formatTime(timeRemaining)}
                  </div>
                  <div className="text-sm text-gray-500">Time remaining</div>
                </div>
              </div>
              
              {/* Visual Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              
              <div className="text-center text-sm text-gray-600">
                {completedTasks.length} tasks completed • {Math.round(progressPercentage)}% progress
              </div>
            </div>

            {/* Task Input */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Next Action</h3>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={currentTask}
                  onChange={(e) => setCurrentTask(e.target.value)}
                  placeholder="What's your next task? (Be specific: 'Write landing page copy')"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && addTask()}
                />
                <button
                  onClick={addTask}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                  disabled={!currentTask.trim()}
                >
                  Add Task
                </button>
              </div>
            </div>

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Completed Tasks ({completedTasks.length})
                </h3>
                <div className="space-y-3">
                  {completedTasks.map((task, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{task}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIRAL: Share Badge */}
            {showShareBadge && (
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl shadow-xl p-8 text-white text-center">
                <Trophy className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">You're Shipping! 🚀</h3>
                <p className="mb-6">Share your progress and inspire others to start their 48-hour challenge.</p>
                <button
                  onClick={shareResults}
                  className="bg-white text-indigo-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition inline-flex items-center gap-2"
                >
                  <Share2 className="w-5 h-5" />
                  Share My Progress
                </button>
              </div>
            )}
          </>
        )}

        {/* RETENTION: Next Steps & Session Completed */}
        {timeRemaining <= 0 && sessionStarted === false && completedTasks.length === 0 && (
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-xl p-8 text-white text-center mb-8">
            <Trophy className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">Sprint Complete! 🎉</h2>
            <p className="text-xl mb-6">You just proved that focus + time pressure = shipping magic</p>
            <div className="flex justify-center gap-4 mb-6">
              <button
                onClick={shareResults}
                className="bg-white text-green-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition inline-flex items-center gap-2"
              >
                <Share2 className="w-5 h-5" />
                Share Your Victory
              </button>
              <button
                onClick={() => {
                  startSession()
                  scheduleNextSession()
                }}
                className="bg-green-400 hover:bg-green-300 text-green-800 px-6 py-3 rounded-lg font-semibold transition inline-flex items-center gap-2"
              >
                <Timer className="w-5 h-5" />
                Start Next Sprint
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-8 mt-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {sessionStarted ? 'Planning Your Next Sprint?' : 'Why 48-Hour Sprints Work'}
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <Timer className="w-8 h-8 text-indigo-500 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Time Pressure Creates Focus</h4>
              <p className="text-sm text-gray-600">Limited time eliminates perfectionism and forces action</p>
            </div>
            <div className="text-center">
              <Target className="w-8 h-8 text-indigo-500 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Commitment Device</h4>
              <p className="text-sm text-gray-600">Public countdown creates accountability pressure</p>
            </div>
            <div className="text-center">
              <Flame className="w-8 h-8 text-indigo-500 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Streak Building</h4>
              <p className="text-sm text-gray-600">Regular sprints build shipping habits and momentum</p>
            </div>
          </div>
          
          {!sessionStarted && totalSessions > 0 && (
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-lg text-indigo-700 mb-4">
                <Calendar className="w-4 h-4" />
                <span>Ready for sprint #{totalSessions + 1}?</span>
              </div>
              <p className="text-gray-600">Your {streak > 0 ? `${streak}-day` : ''} streak is waiting!</p>
            </div>
          )}
        </div>

        {/* F.I.R.E. STARTER KIT CTA - Context-aware */}
        {(completedTasks.length >= 2 || totalSessions > 0) && (
          <div className="mt-12 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-2xl shadow-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-pink-600/20"></div>
            <div className="relative">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  <Zap className="w-4 h-4" />
                  <span>You're clearly ready to ship! 🚀</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Skip the Planning, Start Shipping
                </h2>
                
                <p className="text-xl text-orange-100 mb-6 max-w-2xl mx-auto">
                  The F.I.R.E. STARTER KIT gives you everything you need to launch in 48 hours.
                  No more endless planning - just a proven system that works.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-bold mb-2">Complete Notion System</h4>
                  <p className="text-orange-100 text-sm">9 pre-filled steps, templates, and frameworks ready to use</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Timer className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-bold mb-2">48-Hour Launch Plan</h4>
                  <p className="text-orange-100 text-sm">Proven timeline that eliminates overwhelm and forces action</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-bold mb-2">Turn Ideas Into Reality</h4>
                  <p className="text-orange-100 text-sm">Stop planning, start shipping. For entrepreneurs ready to act</p>
                </div>
              </div>

              <div className="text-center">
                <div className="bg-white rounded-2xl p-6 inline-block">
                  <CheckoutButton 
                    variant="cta" 
                    size="lg"
                    showPricing={true}
                    className="mb-4"
                  >
                    <Flame className="w-5 h-5" />
                    Get F.I.R.E. STARTER KIT Now
                  </CheckoutButton>
                  <p className="text-xs text-gray-500">
                    ⚡ Instant access • 🔒 30-day guarantee • 📧 Lifetime support
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced CTA for newsletter - Context-aware */}
        <div className="text-center mt-12 p-8 bg-gray-50 rounded-2xl">
          {completedTasks.length >= 3 ? (
            <>
              <h3 className="text-xl font-bold text-gray-900 mb-2">You're clearly a builder! 🔥</h3>
              <p className="text-gray-600 mb-4">
                Join 50,000+ focused creators getting weekly tips on productivity, shipping, and sustainable growth.
                Perfect for people who actually execute.
              </p>
            </>
          ) : (
            <>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Get Weekly Shipping Tips</h3>
              <p className="text-gray-600 mb-4">Join 50,000+ builders getting actionable productivity insights every week.</p>
            </>
          )}
          <a 
            href="/?utm_source=ship48&utm_medium=tripwire&utm_campaign=productivity"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition inline-flex items-center gap-2"
          >
            Subscribe to DailyHush <ArrowRight className="w-4 h-4" />
          </a>
          <p className="text-xs text-gray-500 mt-3">
            No spam. Real insights for people who ship. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </div>
  )
}