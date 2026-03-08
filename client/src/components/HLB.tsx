import { useState } from 'react'
import TacticalMode from './TacticalMode'
import JournalMode from './JournalMode'
import ScrapbookMode from './ScrapbookMode'
import GamingMode from './GamingMode'
import { trpc } from '@/lib/trpc'

type Mode = 'tactical' | 'journal' | 'scrapbook' | 'gaming'

interface HLBProps {
  userIdentity?: any
}

const MODES = [
  { id: 'tactical', label: 'Tactical', emoji: '📊' },
  { id: 'journal', label: 'Journal', emoji: '📔' },
  { id: 'scrapbook', label: 'Scrapbook', emoji: '📸' },
  { id: 'gaming', label: 'Gaming', emoji: '🎮' },
]

export default function HLB({ userIdentity }: HLBProps) {
  const [activeMode, setActiveMode] = useState<Mode>('tactical')

  // Fetch data
  const { data: progression } = trpc.hsProgression.get.useQuery()
  const { data: snapshot } = trpc.hsDaily.getToday.useQuery()

  const prog = progression as any || {}
  const snap = snapshot as any || {}

  return (
    <div className="min-h-screen bg-black text-foreground overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-20" />
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-primary/20 backdrop-blur-md bg-black/40 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="font-orbitron text-3xl font-black text-primary">TRINITY HLB</h1>
                <p className="text-xs text-muted-foreground">v13.0 • Unified Empire</p>
              </div>
              <div className="flex gap-6 text-right">
                <div>
                  <p className="text-xs text-muted-foreground">LEVEL</p>
                  <p className="font-orbitron text-2xl font-bold text-primary">{prog?.currentLevel || 1}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">POWER</p>
                  <p className="font-orbitron text-2xl font-bold text-secondary">{Math.round(prog?.powerScore || 0)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">STAGE</p>
                  <p className="font-orbitron text-2xl font-bold text-accent">{prog?.currentStage || 'Trap'}</p>
                </div>
              </div>
            </div>

            {/* Mode Tabs */}
            <div className="flex gap-1 border-b border-muted/20">
              {MODES.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setActiveMode(mode.id as Mode)}
                  className={`px-6 py-3 font-mono text-sm transition-all border-b-2 ${
                    activeMode === mode.id
                      ? 'border-primary text-primary bg-primary/10'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span className="mr-2">{mode.emoji}</span>
                  {mode.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="container mx-auto px-4 py-8">
          {activeMode === 'tactical' && (
            <TacticalMode progression={progression} snapshot={snapshot} />
          )}
          {activeMode === 'journal' && <JournalMode />}
          {activeMode === 'scrapbook' && <ScrapbookMode />}
          {activeMode === 'gaming' && <GamingMode progression={progression} />}
        </main>
      </div>
    </div>
  )
}
