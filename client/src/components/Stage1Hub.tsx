import { useState } from 'react'
import Stage1GamingMode from './Stage1GamingMode'
import TacticalMode from './TacticalMode'
import LegacyBook from './LegacyBook'

interface Stage1HubProps {
  progression?: any
  snapshot?: any
}

export default function Stage1Hub({ progression, snapshot }: Stage1HubProps) {
  const [activeMode, setActiveMode] = useState<'gaming' | 'tactical' | 'legacy'>('gaming')

  return (
    <div className="min-h-screen bg-black">
      {/* Mode selector - visible on mobile */}
      <div className="lg:hidden flex gap-2 p-3 border-b border-cyan-500/20 bg-black/50 sticky top-0 z-50 overflow-x-auto">
        <button
          onClick={() => setActiveMode('gaming')}
          className={`flex-shrink-0 py-2 px-3 rounded font-mono text-xs transition-all ${
            activeMode === 'gaming'
              ? 'bg-cyan-500/30 text-cyan-500 border border-cyan-500/50'
              : 'bg-muted/10 text-muted-foreground border border-muted/20'
          }`}
        >
          🎮 GAMING
        </button>
        <button
          onClick={() => setActiveMode('tactical')}
          className={`flex-shrink-0 py-2 px-3 rounded font-mono text-xs transition-all ${
            activeMode === 'tactical'
              ? 'bg-green-500/30 text-green-500 border border-green-500/50'
              : 'bg-muted/10 text-muted-foreground border border-muted/20'
          }`}
        >
          ⚙️ TACTICAL
        </button>
        <button
          onClick={() => setActiveMode('legacy')}
          className={`flex-shrink-0 py-2 px-3 rounded font-mono text-xs transition-all ${
            activeMode === 'legacy'
              ? 'bg-amber-600/30 text-amber-600 border border-amber-600/50'
              : 'bg-muted/10 text-muted-foreground border border-muted/20'
          }`}
        >
          📖 LEGACY
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Gaming Mode - Main view */}
        <div
          className={`${
            activeMode === 'gaming' ? 'flex-1' : 'hidden lg:flex lg:flex-1'
          } transition-all duration-300`}
        >
          <div className="w-full">
            <Stage1GamingMode progression={progression} snapshot={snapshot} />
          </div>
        </div>

        {/* Tactical Mode */}
        <div
          className={`${
            activeMode === 'tactical' ? 'flex-1' : 'hidden lg:flex lg:flex-1'
          } border-l border-green-500/20 transition-all duration-300 overflow-y-auto`}
        >
          <div className="w-full">
            <TacticalMode progression={progression} snapshot={snapshot} />
          </div>
        </div>

        {/* Legacy Book */}
        <div
          className={`${
            activeMode === 'legacy' ? 'flex-1' : 'hidden lg:flex lg:flex-1'
          } border-l border-amber-600/20 transition-all duration-300 overflow-y-auto`}
        >
          <div className="w-full">
            <LegacyBook progression={progression} snapshot={snapshot} />
          </div>
        </div>
      </div>
    </div>
  )
}
