import { useState } from 'react'
import TacticalMode from './TacticalMode'
import LegacyBook from './LegacyBook'

interface SplitScreenDashboardProps {
  progression?: any
  snapshot?: any
}

export default function SplitScreenDashboard({
  progression,
  snapshot,
}: SplitScreenDashboardProps) {
  const [activeTab, setActiveTab] = useState<'tactical' | 'legacy'>('tactical')

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Mobile tab selector */}
      <div className="flex gap-2 p-3 border-b border-primary/20 bg-black/50 sticky top-0 z-50">
        <button
          onClick={() => setActiveTab('tactical')}
          className={`flex-1 py-2 px-3 rounded font-mono text-xs sm:text-sm transition-all ${
            activeTab === 'tactical'
              ? 'bg-green-500/30 text-green-500 border border-green-500/50'
              : 'bg-muted/10 text-muted-foreground border border-muted/20'
          }`}
        >
          ⚙️ TACTICAL
        </button>
        <button
          onClick={() => setActiveTab('legacy')}
          className={`flex-1 py-2 px-3 rounded font-mono text-xs sm:text-sm transition-all ${
            activeTab === 'legacy'
              ? 'bg-amber-600/30 text-amber-600 border border-amber-600/50'
              : 'bg-muted/10 text-muted-foreground border border-muted/20'
          }`}
        >
          📖 LEGACY
        </button>
      </div>

      {/* Content container - stacked on mobile, side-by-side on desktop */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Tactical Mode */}
        <div
          className={`${
            activeTab === 'tactical' ? 'flex-1' : 'hidden lg:flex lg:flex-1'
          } border-b lg:border-b-0 lg:border-r border-primary/20 overflow-y-auto transition-all duration-300`}
        >
          <div className="w-full">
            <TacticalMode progression={progression} snapshot={snapshot} />
          </div>
        </div>

        {/* Legacy Book */}
        <div
          className={`${
            activeTab === 'legacy' ? 'flex-1' : 'hidden lg:flex lg:flex-1'
          } overflow-y-auto transition-all duration-300`}
        >
          <div className="w-full">
            <LegacyBook progression={progression} snapshot={snapshot} />
          </div>
        </div>
      </div>
    </div>
  )
}
