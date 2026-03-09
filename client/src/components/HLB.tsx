import { useState } from 'react'
import TacticalMode from './TacticalMode'
import JournalMode from './JournalMode'
import ScrapbookMode from './ScrapbookMode'
import Stage1GamingMode from './Stage1GamingMode'
import { trpc } from '@/lib/trpc'

type Mode = 'tactical' | 'journal' | 'scrapbook' | 'gaming'

interface HLBProps {
  userIdentity?: any
}

const MODES = [
  { id: 'tactical', label: 'TACTICAL', emoji: '⚙️', color: '#00ff96', glow: 'rgba(0,255,150,0.4)' },
  { id: 'journal', label: 'GARDEN', emoji: '🌿', color: '#cc00ff', glow: 'rgba(204,0,255,0.4)' },
  { id: 'scrapbook', label: 'SCRAPBOOK', emoji: '📸', color: '#ff6b9d', glow: 'rgba(255,107,157,0.4)' },
  { id: 'gaming', label: 'GAMING', emoji: '🎮', color: '#00c8ff', glow: 'rgba(0,200,255,0.4)' },
]

export default function HLB({ userIdentity }: HLBProps) {
  const [activeMode, setActiveMode] = useState<Mode>('tactical')

  // Fetch data
  const { data: progression } = trpc.hsProgression.get.useQuery()
  const { data: snapshot } = trpc.hsDaily.getToday.useQuery()

  const prog = progression as any || {}
  const snap = snapshot as any || {}

  const activeConfig = MODES.find((m) => m.id === activeMode)!

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute inset-0 transition-all duration-700"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${activeConfig.glow.replace('0.4', '0.06')} 0%, transparent 60%)`,
          }}
        />
      </div>

      {/* Header */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          borderColor: `${activeConfig.color}30`,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-xs font-mono tracking-[0.4em] mb-0.5" style={{ color: `${activeConfig.color}70` }}>
                HUSTLE LEGACY BOOK
              </div>
              <h1
                className="text-xl font-black"
                style={{
                  fontFamily: 'Impact, Arial Black, sans-serif',
                  color: activeConfig.color,
                  textShadow: `0 0 15px ${activeConfig.glow}`,
                  letterSpacing: '3px',
                }}
              >
                TRINITY v13.0
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs font-mono text-gray-600">LEVEL</div>
                <div className="text-lg font-black font-mono" style={{ color: activeConfig.color }}>
                  {prog?.currentLevel || 1}
                </div>
              </div>
              <div className="text-right hidden sm:block">
                <div className="text-xs font-mono text-gray-600">POWER</div>
                <div className="text-lg font-black font-mono text-yellow-400">
                  {Math.round(prog?.powerScore || 0)}
                </div>
              </div>
              <div className="text-right hidden md:block">
                <div className="text-xs font-mono text-gray-600">STREAK</div>
                <div className="text-lg font-black font-mono text-orange-400">
                  🔥 {prog?.currentStreak || 0}d
                </div>
              </div>
            </div>
          </div>

          {/* Mode tabs */}
          <div className="flex gap-1 overflow-x-auto">
            {MODES.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setActiveMode(mode.id as Mode)}
                className="flex-shrink-0 flex items-center gap-1.5 py-1.5 px-3 font-mono text-xs transition-all border-b-2"
                style={{
                  borderBottomColor: activeMode === mode.id ? mode.color : 'transparent',
                  color: activeMode === mode.id ? mode.color : '#555',
                  background: activeMode === mode.id ? `${mode.color}10` : 'transparent',
                  textShadow: activeMode === mode.id ? `0 0 8px ${mode.glow}` : 'none',
                }}
              >
                <span>{mode.emoji}</span>
                <span>{mode.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10">
        {activeMode === 'tactical' && (
          <TacticalMode progression={progression} snapshot={snapshot} />
        )}
        {activeMode === 'journal' && <JournalMode />}
        {activeMode === 'scrapbook' && <ScrapbookMode />}
        {activeMode === 'gaming' && (
          <Stage1GamingMode progression={progression} snapshot={snapshot} />
        )}
      </main>
    </div>
  )
}
