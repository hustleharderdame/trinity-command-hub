import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'

interface Choice {
  id: string
  text: string
  consequence?: string
}

interface Cutscene {
  id: string
  title: string
  description: string
  imageUrl?: string
  choices: Choice[]
  allowFreeAnswer?: boolean
}

const CUTSCENES: Cutscene[] = [
  {
    id: 'intro-1',
    title: 'The Call',
    description: 'You wake up in your room. The walls are closing in. Your phone buzzes with a message from an unknown number: "Your time has come. Will you answer the call?"',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
    choices: [
      {
        id: 'choice-1a',
        text: 'Answer the call immediately',
        consequence: 'You feel a surge of energy. Your journey begins.',
      },
      {
        id: 'choice-1b',
        text: 'Ignore it and go back to sleep',
        consequence: 'The message repeats. Louder. You cannot ignore it.',
      },
      {
        id: 'choice-1c',
        text: 'Write your own response',
        consequence: 'Your words echo into the void.',
      },
    ],
    allowFreeAnswer: true,
  },
  {
    id: 'intro-2',
    title: 'The Choice',
    description: 'Three paths lay before you. Each one leads to a different destiny. Which will you choose?',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    choices: [
      {
        id: 'choice-2a',
        text: 'The Path of Power - Strength and dominance',
        consequence: 'You feel the weight of ambition on your shoulders.',
      },
      {
        id: 'choice-2b',
        text: 'The Path of Wisdom - Knowledge and understanding',
        consequence: 'Your mind expands with infinite possibilities.',
      },
      {
        id: 'choice-2c',
        text: 'The Path of Soul - Connection and purpose',
        consequence: 'Your heart resonates with something greater.',
      },
    ],
    allowFreeAnswer: false,
  },
]

interface GamingModeProps {
  progression?: any
}

export default function GamingMode({ progression }: GamingModeProps) {
  const [currentCutsceneIndex, setCurrentCutsceneIndex] = useState(0)
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null)
  const [freeAnswer, setFreeAnswer] = useState('')
  const [showConsequence, setShowConsequence] = useState(false)
  const [completedCutscenes, setCompletedCutscenes] = useState<string[]>([])

  const currentCutscene = CUTSCENES[currentCutsceneIndex]

  const handleChoiceSelect = (choiceId: string) => {
    setSelectedChoice(choiceId)
    setShowConsequence(true)
  }

  const handleFreeAnswer = () => {
    if (freeAnswer.trim()) {
      setShowConsequence(true)
    }
  }

  const handleContinue = () => {
    setCompletedCutscenes([...completedCutscenes, currentCutscene.id])
    if (currentCutsceneIndex < CUTSCENES.length - 1) {
      setCurrentCutsceneIndex(currentCutsceneIndex + 1)
      setSelectedChoice(null)
      setFreeAnswer('')
      setShowConsequence(false)
    } else {
      // All cutscenes completed
      setCurrentCutsceneIndex(0)
    }
  }

  const choice = currentCutscene.choices.find((c) => c.id === selectedChoice)
  const consequence = choice?.consequence || ''

  return (
    <div className="space-y-6">
      {/* Cutscene Container */}
      <Card className="glass-panel p-6 sm:p-8 border-cyan-500/30 overflow-hidden">
        {/* Background image */}
        {currentCutscene.imageUrl && (
          <div
            className="absolute inset-0 z-0 opacity-20"
            style={{
              backgroundImage: `url(${currentCutscene.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        )}

        {/* Content overlay */}
        <div className="relative z-10">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1
              className="text-3xl sm:text-4xl font-bold mb-2"
              style={{
                color: '#00ffff',
                textShadow: '0 0 20px rgba(0, 255, 255, 0.8)',
                fontFamily: 'Courier New, monospace',
              }}
            >
              {currentCutscene.title}
            </h1>
            <div className="h-1 w-16 bg-gradient-to-r from-cyan-500 to-pink-500 mx-auto" />
          </div>

          {/* Cutscene description */}
          <div className="bg-black/80 border border-cyan-500/30 rounded-lg p-4 sm:p-6 mb-6 backdrop-blur-sm">
            <p className="text-base sm:text-lg leading-relaxed text-gray-100">
              {currentCutscene.description}
            </p>
          </div>

          {/* Choices section */}
          <div className="space-y-3">
            {!showConsequence ? (
              <>
                {/* Multiple choice options */}
                <div className="space-y-2">
                  {currentCutscene.choices.map((choice) => (
                    <Button
                      key={choice.id}
                      onClick={() => handleChoiceSelect(choice.id)}
                      className="w-full text-left h-auto p-3 sm:p-4 bg-black border border-cyan-500/30 hover:border-cyan-500 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all rounded-lg justify-start text-sm sm:text-base"
                    >
                      <span className="text-pink-500 mr-3">▶</span>
                      {choice.text}
                    </Button>
                  ))}
                </div>

                {/* Free answer option */}
                {currentCutscene.allowFreeAnswer && (
                  <div className="mt-4 pt-4 border-t border-cyan-500/30">
                    <p className="text-cyan-400 mb-2 text-xs sm:text-sm font-mono">
                      Or write your own response:
                    </p>
                    <Textarea
                      value={freeAnswer}
                      onChange={(e) => setFreeAnswer(e.target.value)}
                      placeholder="Enter your response..."
                      className="bg-black/80 border border-cyan-500/30 text-cyan-400 placeholder-cyan-600/50 rounded-lg mb-2 text-sm"
                      rows={3}
                    />
                    <Button
                      onClick={handleFreeAnswer}
                      disabled={!freeAnswer.trim()}
                      className="w-full bg-pink-600/20 border border-pink-500/50 text-pink-400 hover:bg-pink-600/40 hover:border-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                    >
                      SUBMIT RESPONSE
                    </Button>
                  </div>
                )}
              </>
            ) : (
              /* Consequence display */
              <div className="bg-pink-900/20 border border-pink-500/50 rounded-lg p-4 sm:p-6 backdrop-blur-sm">
                <p className="text-pink-300 text-base sm:text-lg mb-4 font-mono">
                  {consequence}
                </p>

                {freeAnswer && (
                  <div className="mb-4 p-3 bg-black/50 border border-cyan-500/30 rounded">
                    <p className="text-cyan-400 text-xs font-mono mb-2">Your words:</p>
                    <p className="text-gray-300 italic text-sm">"{freeAnswer}"</p>
                  </div>
                )}

                <Button
                  onClick={handleContinue}
                  className="w-full bg-cyan-600/20 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-600/40 hover:border-cyan-500 transition-all py-2 font-bold text-sm"
                >
                  CONTINUE ▶
                </Button>
              </div>
            )}
          </div>

          {/* Progress indicator */}
          <div className="flex justify-center items-center gap-2 mt-6">
            {CUTSCENES.map((cutscene, index) => (
              <div
                key={cutscene.id}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === currentCutsceneIndex
                    ? 'bg-cyan-500 w-4'
                    : completedCutscenes.includes(cutscene.id)
                      ? 'bg-pink-500'
                      : 'bg-gray-600'
                }`}
              />
            ))}
          </div>

          {/* XP reward display */}
          {showConsequence && (
            <div
              className="text-center mt-4 text-pink-500 font-bold text-lg animate-pulse text-sm sm:text-base"
              style={{ textShadow: '0 0 10px rgba(255, 0, 255, 0.6)' }}
            >
              +20 XP
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
