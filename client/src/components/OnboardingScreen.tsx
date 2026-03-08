import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface OnboardingScreenProps {
  onComplete: (identity: UserIdentity) => void
}

export interface UserIdentity {
  name: string
  email: string
  path: 'warrior' | 'scholar' | 'creator' | 'healer'
  avatar: string
}

const PATHS = [
  {
    id: 'warrior',
    name: 'Warrior',
    emoji: '⚔️',
    description: 'Focus on Power, Consistency, Respect',
    color: 'from-red-600 to-orange-600',
    focus: ['Power', 'Consistency', 'Respect'],
  },
  {
    id: 'scholar',
    name: 'Scholar',
    emoji: '📚',
    description: 'Focus on Mind, Impact, Recovery',
    color: 'from-blue-600 to-purple-600',
    focus: ['Mind', 'Impact', 'Recovery'],
  },
  {
    id: 'creator',
    name: 'Creator',
    emoji: '🎨',
    description: 'Focus on Soul, Happiness, Power',
    color: 'from-pink-600 to-rose-600',
    focus: ['Soul', 'Happiness', 'Power'],
  },
  {
    id: 'healer',
    name: 'Healer',
    emoji: '💚',
    description: 'Focus on Body, Recovery, Respect',
    color: 'from-green-600 to-emerald-600',
    focus: ['Body', 'Recovery', 'Respect'],
  },
]

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [step, setStep] = useState<'path' | 'identity'>('path')
  const [selectedPath, setSelectedPath] = useState<string | null>(null)
  const [identity, setIdentity] = useState<Partial<UserIdentity>>({
    name: '',
    email: '',
    avatar: '🧬',
  })

  const handlePathSelect = (pathId: string) => {
    setSelectedPath(pathId)
    setIdentity(prev => ({ ...prev, path: pathId as any }))
    setStep('identity')
  }

  const handleIdentityChange = (field: string, value: string) => {
    setIdentity(prev => ({ ...prev, [field]: value }))
  }

  const handleComplete = () => {
    if (identity.name && identity.email && identity.path) {
      onComplete(identity as UserIdentity)
    }
  }

  const selectedPathData = PATHS.find(p => p.id === selectedPath)

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 overflow-y-auto">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-soul-gold/10 via-black to-black pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-sm tracking-widest mb-4 text-soul-gold">∞.♡.⚡.◊.Φ.K.Σ</div>
          <h1 className="font-orbitron text-5xl font-black text-primary mb-4">STAGE 0: GROUND ZERO</h1>
          <p className="text-muted-foreground">Awaken your consciousness. Choose your path.</p>
        </div>

        {step === 'path' ? (
          // Path Selection
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PATHS.map(path => (
              <Card
                key={path.id}
                onClick={() => handlePathSelect(path.id)}
                className={`glass-panel p-6 cursor-pointer transition-all border-2 ${
                  selectedPath === path.id
                    ? 'border-primary bg-primary/10'
                    : 'border-muted/20 hover:border-primary/50'
                }`}
              >
                <div className="text-5xl mb-4">{path.emoji}</div>
                <h3 className="font-orbitron text-2xl font-bold text-primary mb-2">{path.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{path.description}</p>
                <div className="flex flex-wrap gap-2">
                  {path.focus.map(pillar => (
                    <span key={pillar} className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full">
                      {pillar}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          // Identity Setup
          <Card className="glass-panel p-8 border-primary/30">
            <h2 className="font-orbitron text-2xl font-bold text-primary mb-6">
              {selectedPathData?.emoji} {selectedPathData?.name} Identity
            </h2>

            <div className="space-y-6">
              {/* Avatar Selection */}
              <div>
                <label className="block text-sm font-bold text-primary mb-3">Choose Your Avatar</label>
                <div className="grid grid-cols-8 gap-2">
                  {['🧬', '🔥', '⚡', '💎', '🌙', '☀️', '🦅', '🐉', '🌊', '🌿', '🎯', '🎨'].map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => handleIdentityChange('avatar', emoji)}
                      className={`text-3xl p-3 rounded-lg transition-all ${
                        identity.avatar === emoji
                          ? 'bg-primary/30 border-2 border-primary'
                          : 'bg-muted/20 border border-muted/30 hover:border-primary/50'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name Input */}
              <div>
                <label className="block text-sm font-bold text-primary mb-2">Your Name</label>
                <input
                  type="text"
                  value={identity.name || ''}
                  onChange={(e) => handleIdentityChange('name', e.target.value)}
                  className="w-full bg-muted/30 border border-primary/20 rounded-lg p-3 text-foreground focus:outline-none focus:border-primary/60"
                  placeholder="Enter your name..."
                />
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-bold text-primary mb-2">Your Email</label>
                <input
                  type="email"
                  value={identity.email || ''}
                  onChange={(e) => handleIdentityChange('email', e.target.value)}
                  className="w-full bg-muted/30 border border-primary/20 rounded-lg p-3 text-foreground focus:outline-none focus:border-primary/60"
                  placeholder="Enter your email..."
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-6">
                <Button
                  onClick={() => setStep('path')}
                  variant="outline"
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleComplete}
                  disabled={!identity.name || !identity.email}
                  className="flex-1 bg-primary text-black hover:bg-primary/90 font-bold"
                >
                  Begin Journey
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
