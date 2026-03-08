import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface CinematicOnboardingProps {
  onComplete: (answers: Record<string, string>) => void
}

const COLD_OPEN_QUESTIONS = [
  "Reality check initiated. Why are you here?",
  "What's the one thing you're running from?",
  "What's the one thing you're running toward?",
  "How much pain are you willing to endure?",
  "What does victory look like to you?",
]

export default function CinematicOnboarding({ onComplete }: CinematicOnboardingProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [userInput, setUserInput] = useState('')
  const [showCrack, setShowCrack] = useState(false)

  // Typewriter effect
  useEffect(() => {
    if (!isTyping) return

    const question = COLD_OPEN_QUESTIONS[currentQuestion]
    let index = 0

    const interval = setInterval(() => {
      if (index < question.length) {
        setDisplayedText(question.slice(0, index + 1))
        // Haptic feedback on keystroke
        if (navigator.vibrate) {
          navigator.vibrate(10)
        }
        index++
      } else {
        setIsTyping(false)
        clearInterval(interval)
      }
    }, 50)

    return () => clearInterval(interval)
  }, [currentQuestion, isTyping])

  const handleSubmitAnswer = () => {
    if (!userInput.trim()) return

    // Haptic feedback on submission
    if (navigator.vibrate) {
      navigator.vibrate([50, 30, 50])
    }

    const newAnswers = {
      ...answers,
      [currentQuestion]: userInput,
    }
    setAnswers(newAnswers)

    if (currentQuestion < COLD_OPEN_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setDisplayedText('')
      setUserInput('')
      setIsTyping(true)
    } else {
      // Final submission - show crack effect
      setShowCrack(true)
      setTimeout(() => {
        onComplete(newAnswers)
      }, 1500)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isTyping) {
      handleSubmitAnswer()
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-black to-black" />

      {/* Crack effect on completion */}
      {showCrack && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 bg-primary/20 animate-pulse" />
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 1000">
            <path
              d="M 500 100 Q 450 200 500 300 T 400 500 T 500 700 T 600 900"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              className="text-primary animate-pulse"
              style={{ filter: 'drop-shadow(0 0 10px currentColor)' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-primary font-orbitron text-2xl animate-pulse">UPLOADING IDENTITY INDEX...</p>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="relative z-10 max-w-2xl w-full">
        {/* Question counter */}
        <div className="text-right mb-8 text-muted-foreground text-sm font-mono">
          [{currentQuestion + 1}/{COLD_OPEN_QUESTIONS.length}]
        </div>

        {/* Blinking cursor and typewriter text */}
        <div className="mb-8 min-h-24 flex items-start">
          <div className="text-3xl font-orbitron text-primary leading-relaxed">
            {displayedText}
            {isTyping && <span className="animate-pulse">▌</span>}
          </div>
        </div>

        {/* Input area - only show when typing is complete */}
        {!isTyping && (
          <Card className="glass-panel p-6 border-primary/30 animate-in fade-in duration-500">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Your answer..."
              className="w-full bg-transparent border-b border-primary/50 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary pb-2 font-mono"
              autoFocus
            />

            {/* Submit button */}
            <div className="mt-6 flex gap-4">
              {currentQuestion > 0 && (
                <Button
                  onClick={() => {
                    setCurrentQuestion(currentQuestion - 1)
                    setUserInput(answers[currentQuestion - 1] || '')
                    setDisplayedText('')
                    setIsTyping(true)
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Back
                </Button>
              )}
              <Button
                onClick={handleSubmitAnswer}
                disabled={!userInput.trim()}
                className="flex-1 bg-primary text-black hover:bg-primary/90 font-bold"
              >
                {currentQuestion === COLD_OPEN_QUESTIONS.length - 1 ? 'INITIATE' : 'NEXT'}
              </Button>
            </div>
          </Card>
        )}

        {/* Progress bar */}
        <div className="mt-8 w-full h-1 bg-muted/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-soul-gold transition-all duration-500"
            style={{ width: `${((currentQuestion + 1) / COLD_OPEN_QUESTIONS.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
