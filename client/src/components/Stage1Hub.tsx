import { useState } from 'react'
import Stage1GamingMode from './Stage1GamingMode'
import TacticalMode from './TacticalMode'
import LegacyBook from './LegacyBook'
import JournalMode from './JournalMode'
import ScrapbookMode from './ScrapbookMode'
import WealthProgression from './WealthProgression'

interface Stage1HubProps {
  progression?: any
  snapshot?: any
}

type Mode = 'traphouse' | 'gaming' | 'tactical' | 'journal' | 'scrapbook' | 'wealth'

export default function Stage1Hub({ progression, snapshot }: Stage1HubProps) {
  const [activeMode, setActiveMode] = useState<Mode>('traphouse')

  const prog = progression || {}
  const userLevel = prog?.currentLevel || 1
  const totalXP = prog?.totalXP || 0
  const currentStreak = prog?.currentStreak || 0
  const tierRank = prog?.tierRank || 'BUILDING'

  // Mansion based on level
  const getMansion = (level: number) => {
    if (level >= 100) return { name: 'PENTHOUSE', emoji: '🏙️' }
    if (level >= 50) return { name: 'HOUSE', emoji: '🏠' }
    if (level >= 20) return { name: 'APARTMENT', emoji: '🏢' }
    return { name: 'TRAP HOUSE', emoji: '🏚️' }
  }
  const mansion = getMansion(userLevel)

  const modes = [
    { id: 'traphouse' as Mode, label: 'TRAP HOUSE', emoji: '🏚️', color: 'amber' },
    { id: 'gaming' as Mode, label: 'GAMING', emoji: '🎮', color: 'cyan' },
    { id: 'tactical' as Mode, label: 'TACTICAL', emoji: '⚙️', color: 'green' },
    { id: 'journal' as Mode, label: 'GARDEN', emoji: '🌿', color: 'purple' },
    { id: 'scrapbook' as Mode, label: 'SCRAPBOOK', emoji: '📸', color: 'pink' },
    { id: 'wealth' as Mode, label: 'WEALTH', emoji: '💎', color: 'gold' },
  ]

  const colorMap: Record<string, string> = {
    amber: 'bg-amber-500/20 text-amber-400 border-amber-500/50',
    cyan: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50',
    green: 'bg-green-500/20 text-green-400 border-green-500/50',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
    pink: 'bg-pink-500/20 text-pink-400 border-pink-500/50',
    gold: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-sm border-b border-amber-900/40">
        <div className="flex items-center gap-1 p-2 overflow-x-auto">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 py-2 px-3 rounded font-mono text-xs transition-all border ${
                activeMode === mode.id
                  ? colorMap[mode.color]
                  : 'bg-transparent text-gray-500 border-gray-700/50 hover:text-gray-300'
              }`}
            >
              <span>{mode.emoji}</span>
              <span className="hidden sm:inline">{mode.label}</span>
            </button>
          ))}

          {/* Status bar on the right */}
          <div className="ml-auto flex items-center gap-3 flex-shrink-0 pl-2">
            <div className="text-xs font-mono text-amber-400/70 hidden md:block">
              LVL <span className="text-amber-400 font-bold">{userLevel}</span>
            </div>
            <div className="text-xs font-mono text-yellow-400/70 hidden md:block">
              {totalXP.toLocaleString()} XP
            </div>
            <div className="text-xs font-mono text-orange-400/70 hidden lg:block">
              🔥 {currentStreak}d
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[calc(100vh-48px)]">
        {activeMode === 'traphouse' && (
          <TrapHouseHub progression={progression} snapshot={snapshot} onNavigate={setActiveMode} />
        )}
        {activeMode === 'gaming' && (
          <Stage1GamingMode progression={progression} snapshot={snapshot} />
        )}
        {activeMode === 'tactical' && (
          <TacticalMode progression={progression} snapshot={snapshot} />
        )}
        {activeMode === 'journal' && (
          <JournalModeWrapper />
        )}
        {activeMode === 'scrapbook' && (
          <ScrapbookModeWrapper />
        )}
        {activeMode === 'wealth' && (
          <WealthProgression />
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// TRAP HOUSE HUB - Main landing hub with dark room aesthetic
// ─────────────────────────────────────────────────────────────────────────────
function TrapHouseHub({ progression, snapshot, onNavigate }: { progression: any; snapshot: any; onNavigate: (mode: Mode) => void }) {
  const prog = progression || {}
  const userLevel = prog?.currentLevel || 1
  const totalXP = prog?.totalXP || 0
  const currentStreak = prog?.currentStreak || 0
  const tierRank = prog?.tierRank || 'BUILDING'
  const soulBeastEvolution = prog?.soulBeastEvolution || 'egg'

  const soulBeastData = {
    egg: { name: 'DORMANT BEAST', emoji: '🥚', color: '#888', glow: 'rgba(136,136,136,0.4)', desc: 'Awaiting awakening...' },
    hatchling: { name: 'RISING BEAST', emoji: '🐣', color: '#ffd700', glow: 'rgba(255,215,0,0.4)', desc: 'The beast stirs within' },
    evolved: { name: 'SOUL BEAST', emoji: '🐉', color: '#ff6b35', glow: 'rgba(255,107,53,0.5)', desc: 'Power fully awakened' },
    ascended: { name: 'PHOENIX BEAST', emoji: '🦅', color: '#00ffff', glow: 'rgba(0,255,255,0.5)', desc: 'Transcendence achieved' },
  }

  const beast = soulBeastData[soulBeastEvolution as keyof typeof soulBeastData] || soulBeastData.egg

  const getMansion = (level: number) => {
    if (level >= 100) return { name: 'PENTHOUSE', emoji: '🏙️', color: '#00ffff' }
    if (level >= 50) return { name: 'HOUSE', emoji: '🏠', color: '#ffd700' }
    if (level >= 20) return { name: 'APARTMENT', emoji: '🏢', color: '#ff6b35' }
    return { name: 'TRAP HOUSE', emoji: '🏚️', color: '#cc8844' }
  }
  const mansion = getMansion(userLevel)

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Dark wooden room background */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 50% 0%, rgba(180, 100, 30, 0.15) 0%, transparent 60%),
            radial-gradient(ellipse at 20% 50%, rgba(255, 140, 0, 0.08) 0%, transparent 40%),
            radial-gradient(ellipse at 80% 50%, rgba(255, 80, 0, 0.06) 0%, transparent 40%),
            linear-gradient(180deg, #0a0604 0%, #120a04 30%, #0d0804 60%, #080503 100%)
          `,
        }}
      />

      {/* Wood grain texture overlay */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            90deg,
            transparent,
            transparent 2px,
            rgba(139, 90, 43, 0.3) 2px,
            rgba(139, 90, 43, 0.3) 3px
          )`,
        }}
      />

      {/* Graffiti wall texture */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Graffiti text elements */}
        <div className="absolute top-16 left-4 opacity-10 transform -rotate-3" style={{ fontFamily: 'Impact, Arial Black, sans-serif', fontSize: '4rem', color: '#ff4400', WebkitTextStroke: '2px #ff4400' }}>
          HUSTLE
        </div>
        <div className="absolute top-32 right-8 opacity-8 transform rotate-2" style={{ fontFamily: 'Impact, Arial Black, sans-serif', fontSize: '2.5rem', color: '#00ffff', WebkitTextStroke: '1px #00ffff' }}>
          LEGACY
        </div>
        <div className="absolute bottom-40 left-8 opacity-8 transform -rotate-1" style={{ fontFamily: 'Impact, Arial Black, sans-serif', fontSize: '3rem', color: '#ffd700', WebkitTextStroke: '2px #ffd700' }}>
          GRIND
        </div>
        <div className="absolute bottom-20 right-12 opacity-6 transform rotate-3" style={{ fontFamily: 'Impact, Arial Black, sans-serif', fontSize: '2rem', color: '#ff00ff', WebkitTextStroke: '1px #ff00ff' }}>
          ASCEND
        </div>
        {/* Spray paint circles */}
        <div className="absolute top-1/4 left-1/3 w-32 h-32 rounded-full opacity-5" style={{ background: 'radial-gradient(circle, #ff4400 0%, transparent 70%)' }} />
        <div className="absolute top-2/3 right-1/4 w-24 h-24 rounded-full opacity-5" style={{ background: 'radial-gradient(circle, #00ffff 0%, transparent 70%)' }} />
      </div>

      {/* Dramatic light shaft from top */}
      <div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 w-64 opacity-20 pointer-events-none"
        style={{
          height: '70%',
          background: 'linear-gradient(180deg, rgba(255, 200, 100, 0.6) 0%, rgba(255, 150, 50, 0.2) 50%, transparent 100%)',
          clipPath: 'polygon(30% 0%, 70% 0%, 90% 100%, 10% 100%)',
        }}
      />

      {/* Laptop glow effect on the floor */}
      <div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-32 opacity-30 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 100%, rgba(0, 200, 255, 0.4) 0%, transparent 70%)',
        }}
      />

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Title Header */}
        <div className="text-center pt-8 pb-4 px-4">
          <div className="inline-block mb-2">
            <span
              className="text-xs font-mono tracking-[0.4em] uppercase"
              style={{ color: '#cc8844', textShadow: '0 0 10px rgba(204, 136, 68, 0.6)' }}
            >
              CERTIFIED
            </span>
          </div>
          <h1
            className="text-4xl sm:text-6xl font-black uppercase tracking-wider mb-1"
            style={{
              fontFamily: 'Impact, Arial Black, sans-serif',
              color: '#ff6b35',
              textShadow: '0 0 20px rgba(255, 107, 53, 0.8), 0 0 40px rgba(255, 107, 53, 0.4), 2px 2px 0 #000',
              WebkitTextStroke: '1px rgba(255, 200, 100, 0.3)',
            }}
          >
            HUSTLE
          </h1>
          <div
            className="text-lg sm:text-2xl font-bold tracking-[0.3em] uppercase"
            style={{
              color: '#ffd700',
              textShadow: '0 0 15px rgba(255, 215, 0, 0.6)',
              fontFamily: 'Georgia, serif',
            }}
          >
            LEGACY BOOK
          </div>
          <div className="text-xs font-mono mt-1" style={{ color: '#666' }}>
            v13.0 — {mansion.name}
          </div>
        </div>

        {/* Main grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 max-w-6xl mx-auto w-full">
          {/* Left: Soul Beast Card */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            {/* Soul Beast Card */}
            <div
              className="relative rounded-xl overflow-hidden border-2 p-5 flex flex-col items-center"
              style={{
                borderColor: beast.color,
                background: `linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(20,10,5,0.95) 100%)`,
                boxShadow: `0 0 30px ${beast.glow}, inset 0 0 30px rgba(0,0,0,0.5)`,
              }}
            >
              {/* Card header */}
              <div className="w-full flex justify-between items-center mb-3">
                <span className="text-xs font-mono" style={{ color: beast.color }}>SOUL BEAST</span>
                <span className="text-xs font-mono text-gray-500">LVL {userLevel}</span>
              </div>

              {/* Beast visual */}
              <div
                className="w-28 h-28 rounded-full flex items-center justify-center mb-3 relative"
                style={{
                  background: `radial-gradient(circle, ${beast.glow} 0%, rgba(0,0,0,0.8) 70%)`,
                  boxShadow: `0 0 40px ${beast.glow}`,
                }}
              >
                <span className="text-6xl" style={{ filter: `drop-shadow(0 0 15px ${beast.color})` }}>
                  {beast.emoji}
                </span>
                {/* Orbit ring */}
                <div
                  className="absolute inset-0 rounded-full border opacity-40"
                  style={{
                    borderColor: beast.color,
                    animation: 'spin 8s linear infinite',
                    borderStyle: 'dashed',
                  }}
                />
              </div>

              {/* Beast name */}
              <div
                className="text-lg font-black tracking-wider mb-1"
                style={{ color: beast.color, textShadow: `0 0 10px ${beast.glow}` }}
              >
                {beast.name}
              </div>
              <div className="text-xs text-gray-400 italic mb-4">{beast.desc}</div>

              {/* Stats */}
              <div className="w-full space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span style={{ color: beast.color }}>POWER</span>
                  <span className="text-gray-300">{Math.min(totalXP, 9999).toLocaleString()} XP</span>
                </div>
                <div className="h-1.5 bg-black/50 rounded-full overflow-hidden border border-gray-700">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min((totalXP % 500) / 5, 100)}%`,
                      background: `linear-gradient(90deg, ${beast.color}, ${beast.glow})`,
                      boxShadow: `0 0 8px ${beast.glow}`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-gray-500">STREAK</span>
                  <span className="text-orange-400">🔥 {currentStreak} days</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-gray-500">TIER</span>
                  <span style={{ color: beast.color }}>{tierRank}</span>
                </div>
              </div>
            </div>

            {/* Mansion Portal */}
            <div
              className="relative rounded-xl overflow-hidden border p-4 cursor-pointer hover:scale-[1.02] transition-transform"
              style={{
                borderColor: mansion.color,
                background: 'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(15,10,5,0.95) 100%)',
                boxShadow: `0 0 20px rgba(204,136,68,0.2)`,
              }}
              onClick={() => onNavigate('gaming')}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-14 h-14 rounded-lg flex items-center justify-center text-3xl flex-shrink-0"
                  style={{
                    background: `radial-gradient(circle, rgba(204,136,68,0.2) 0%, transparent 70%)`,
                    boxShadow: `0 0 20px rgba(204,136,68,0.3)`,
                  }}
                >
                  {mansion.emoji}
                </div>
                <div>
                  <div className="text-xs font-mono text-gray-500 mb-0.5">CURRENT STAGE</div>
                  <div className="font-black text-base" style={{ color: mansion.color }}>
                    {mansion.name}
                  </div>
                  <div className="text-xs text-gray-500">Level {userLevel} · Enter Portal →</div>
                </div>
              </div>
            </div>
          </div>

          {/* Center: Navigation Portals */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* Ancient Book / Legacy Tome */}
            <div
              className="relative rounded-xl overflow-hidden border p-5 cursor-pointer hover:scale-[1.01] transition-transform group"
              style={{
                borderColor: 'rgba(180, 130, 60, 0.5)',
                background: 'linear-gradient(135deg, rgba(20, 12, 4, 0.95) 0%, rgba(30, 18, 6, 0.95) 100%)',
                boxShadow: '0 0 30px rgba(180, 130, 60, 0.15)',
              }}
              onClick={() => onNavigate('tactical')}
            >
              <div className="flex items-start gap-4">
                <div className="text-5xl flex-shrink-0" style={{ filter: 'drop-shadow(0 0 10px rgba(180,130,60,0.6))' }}>
                  📜
                </div>
                <div className="flex-1">
                  <div className="text-xs font-mono text-amber-600/70 mb-1 tracking-widest">TACTICAL COMMAND</div>
                  <div className="text-xl font-black text-amber-400 mb-1" style={{ fontFamily: 'Georgia, serif' }}>
                    THE EXECUTION TABLET
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Daily missions, pillar tracking, power score calculations, and life structure management.
                  </p>
                  <div className="mt-3 flex gap-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded border border-amber-600/30 text-amber-600/70">
                      10 PILLARS
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded border border-amber-600/30 text-amber-600/70">
                      DAILY FLOW
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded border border-amber-600/30 text-amber-600/70">
                      POWER SCORE
                    </span>
                  </div>
                </div>
                <div className="text-amber-600/50 group-hover:text-amber-400 transition-colors text-xl">→</div>
              </div>
            </div>

            {/* Gaming Mode Portal */}
            <div
              className="relative rounded-xl overflow-hidden border p-5 cursor-pointer hover:scale-[1.01] transition-transform group"
              style={{
                borderColor: 'rgba(0, 200, 255, 0.4)',
                background: 'linear-gradient(135deg, rgba(0, 10, 20, 0.95) 0%, rgba(0, 15, 30, 0.95) 100%)',
                boxShadow: '0 0 30px rgba(0, 200, 255, 0.1)',
              }}
              onClick={() => onNavigate('gaming')}
            >
              <div className="flex items-start gap-4">
                <div className="text-5xl flex-shrink-0" style={{ filter: 'drop-shadow(0 0 10px rgba(0,200,255,0.6))' }}>
                  🎮
                </div>
                <div className="flex-1">
                  <div className="text-xs font-mono text-cyan-600/70 mb-1 tracking-widest">CHAPTER MAP</div>
                  <div className="text-xl font-black text-cyan-400 mb-1">
                    THE HUSTLE CHRONICLES
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Story-driven chapter map with cutscenes, choice events, XP rewards, and narrative progression.
                  </p>
                  <div className="mt-3 flex gap-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded border border-cyan-600/30 text-cyan-600/70">
                      CUTSCENES
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded border border-cyan-600/30 text-cyan-600/70">
                      +20 XP EVENTS
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded border border-cyan-600/30 text-cyan-600/70">
                      STORY NODES
                    </span>
                  </div>
                </div>
                <div className="text-cyan-600/50 group-hover:text-cyan-400 transition-colors text-xl">→</div>
              </div>
            </div>

            {/* Garden of Consciousness */}
            <div
              className="relative rounded-xl overflow-hidden border p-5 cursor-pointer hover:scale-[1.01] transition-transform group"
              style={{
                borderColor: 'rgba(150, 50, 200, 0.4)',
                background: 'linear-gradient(135deg, rgba(10, 0, 20, 0.95) 0%, rgba(15, 0, 30, 0.95) 100%)',
                boxShadow: '0 0 30px rgba(150, 50, 200, 0.1)',
              }}
              onClick={() => onNavigate('journal')}
            >
              <div className="flex items-start gap-4">
                <div className="text-5xl flex-shrink-0" style={{ filter: 'drop-shadow(0 0 10px rgba(150,50,200,0.6))' }}>
                  🌳
                </div>
                <div className="flex-1">
                  <div className="text-xs font-mono text-purple-600/70 mb-1 tracking-widest">SPIRITUAL REALM</div>
                  <div className="text-xl font-black text-purple-400 mb-1" style={{ fontFamily: 'Georgia, serif' }}>
                    GARDEN OF CONSCIOUSNESS
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Commune with your Soul Beast and AI Twin. Chakra orbs, fog, and the glowing tree of wisdom.
                  </p>
                  <div className="mt-3 flex gap-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded border border-purple-600/30 text-purple-600/70">
                      SOUL BEAST
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded border border-purple-600/30 text-purple-600/70">
                      AI TWIN
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded border border-purple-600/30 text-purple-600/70">
                      CHAKRA ORBS
                    </span>
                  </div>
                </div>
                <div className="text-purple-600/50 group-hover:text-purple-400 transition-colors text-xl">→</div>
              </div>
            </div>

            {/* Scrapbook */}
            <div
              className="relative rounded-xl overflow-hidden border p-5 cursor-pointer hover:scale-[1.01] transition-transform group"
              style={{
                borderColor: 'rgba(220, 50, 120, 0.4)',
                background: 'linear-gradient(135deg, rgba(20, 0, 10, 0.95) 0%, rgba(25, 0, 15, 0.95) 100%)',
                boxShadow: '0 0 30px rgba(220, 50, 120, 0.1)',
              }}
              onClick={() => onNavigate('scrapbook')}
            >
              <div className="flex items-start gap-4">
                <div className="text-5xl flex-shrink-0" style={{ filter: 'drop-shadow(0 0 10px rgba(220,50,120,0.6))' }}>
                  📸
                </div>
                <div className="flex-1">
                  <div className="text-xs font-mono text-pink-600/70 mb-1 tracking-widest">MEMORY VAULT</div>
                  <div className="text-xl font-black text-pink-400 mb-1">
                    THE LEGACY SCRAPBOOK
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Transform your memories into styled HLB pages with decorative borders, captions, and layouts.
                  </p>
                  <div className="mt-3 flex gap-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded border border-pink-600/30 text-pink-600/70">
                      MEMORIES
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded border border-pink-600/30 text-pink-600/70">
                      IMPORTANT
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded border border-pink-600/30 text-pink-600/70">
                      FINANCES
                    </span>
                  </div>
                </div>
                <div className="text-pink-600/50 group-hover:text-pink-400 transition-colors text-xl">→</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom status strip */}
        <div className="border-t border-amber-900/30 bg-black/50 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-amber-600/60">HS.OS v13.0</span>
            <span className="text-xs font-mono text-gray-600">TRINITY COMMAND HUB</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-gray-600">STAGE 1</span>
            <span className="text-xs font-mono" style={{ color: '#ff6b35' }}>● ONLINE</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

// Wrappers for full-screen modes
function JournalModeWrapper() {
  return (
    <div className="min-h-screen">
      <JournalMode />
    </div>
  )
}

function ScrapbookModeWrapper() {
  return (
    <div className="min-h-screen p-4 sm:p-6 bg-black">
      <ScrapbookMode />
    </div>
  )
}
