import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface LegacyBookProps {
  progression?: any
  snapshot?: any
}

export default function LegacyBook({ progression, snapshot }: LegacyBookProps) {
  const [entries, setEntries] = useState([
    'Entry, Loaded. Preparing for next adventure.',
    'Your courage earned. Enemies defeated. Upgraded line experience.',
    'I will spend the boosts!',
  ])

  const prog = progression || {}
  const snap = snapshot || {}
  const userLevel = prog?.currentLevel || 1
  const totalXP = prog?.totalXP || 0
  const currentStreak = prog?.currentStreak || 0

  return (
    <div
      className="min-h-screen p-3 sm:p-8 relative overflow-hidden"
      style={{
        backgroundColor: '#f5e6d3',
        backgroundImage: `
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 2px,
            rgba(139, 90, 43, 0.05) 2px,
            rgba(139, 90, 43, 0.05) 4px
          ),
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(139, 90, 43, 0.05) 2px,
            rgba(139, 90, 43, 0.05) 4px
          )
        `,
      }}
    >
      {/* Leather binding effect - hidden on mobile */}
      <div className="absolute left-0 top-0 bottom-0 w-6 sm:w-12 bg-gradient-to-r from-amber-900 to-amber-700 opacity-30 hidden sm:block" />
      <div className="absolute right-0 top-0 bottom-0 w-6 sm:w-12 bg-gradient-to-l from-amber-900 to-amber-700 opacity-30 hidden sm:block" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md mx-auto sm:ml-auto sm:mr-12">
        {/* Header */}
        <div className="mb-6 sm:mb-8 text-center border-b-2 border-amber-900/30 pb-3 sm:pb-4">
          <h1
            className="text-2xl sm:text-4xl font-bold text-amber-900 mb-2"
            style={{ fontFamily: 'Georgia, serif', letterSpacing: '1px' }}
          >
            HUSTLE
          </h1>
          <p className="text-xs sm:text-sm text-amber-900/70" style={{ fontFamily: 'Georgia, serif' }}>
            LEGACY BOOK
          </p>
          <p className="text-xs text-amber-900/50 mt-2" style={{ fontFamily: 'Georgia, serif' }}>
            GAMING MODE
          </p>
        </div>

        {/* Feather quill illustration */}
        <div className="text-4xl sm:text-6xl mb-6 sm:mb-8 text-center opacity-30">🪶</div>

        {/* Entries */}
        <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
          {entries.map((entry, idx) => (
            <div key={idx} className="border-l-2 border-amber-900/30 pl-3 sm:pl-4">
              <p
                className="text-xs sm:text-sm text-amber-900 leading-relaxed"
                style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
              >
                {entry}
              </p>
            </div>
          ))}
        </div>

        {/* Stats section */}
        <div className="mb-6 sm:mb-8 border-2 border-amber-900/30 p-3 sm:p-4 bg-amber-50/30">
          <h2 className="text-xs sm:text-sm font-bold text-amber-900 mb-3 sm:mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            ✦ STAT BONUSES
          </h2>

          <div className="space-y-2">
            <p className="text-xs text-amber-900" style={{ fontFamily: 'Georgia, serif' }}>
              +{Math.floor(userLevel / 5)} <span className="font-bold">STRENGTH</span>
            </p>
            <p className="text-xs text-amber-900" style={{ fontFamily: 'Georgia, serif' }}>
              +{Math.floor(currentStreak / 7)} <span className="font-bold">CLARITY</span>
            </p>
            <p className="text-xs text-amber-900" style={{ fontFamily: 'Georgia, serif' }}>
              +{Math.floor(totalXP / 500)} <span className="font-bold">WISDOM</span>
            </p>
          </div>
        </div>

        {/* Sword illustration */}
        <div className="text-3 sm:text-4xl mb-6 sm:mb-8 text-center opacity-40">⚔️</div>

        {/* XP display */}
        <div className="mb-6 sm:mb-8 border-2 border-amber-900/30 p-3 sm:p-4 bg-amber-50/30 text-center">
          <p className="text-xs text-amber-900/70 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            TOTAL XP EARNED
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-amber-900" style={{ fontFamily: 'Georgia, serif' }}>
            {totalXP}
          </p>
        </div>

        {/* Compass illustration */}
        <div className="text-3xl sm:text-4xl mb-6 sm:mb-8 text-center opacity-40">🧭</div>

        {/* Action button */}
        <Button
          className="w-full text-amber-900 border-2 border-amber-900/50 hover:bg-amber-100 font-serif text-xs sm:text-sm py-2 sm:py-3 rounded-none bg-amber-50/50"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          ✎ WRITE ENTRY
        </Button>
      </div>
    </div>
  )
}
