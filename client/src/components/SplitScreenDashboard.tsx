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
  const [activeTab, setActiveTab] = useState<'both' | 'tactical' | 'legacy'>('both')

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Mobile tab selector */}
      <div className="lg:hidden flex gap-2 p-4 border-b border-primary/20">
        <button
          onClick={() => setActiveTab('tactical')}
          className={`flex-1 py-2 px-4 rounded font-mono text-sm transition-all ${
            activeTab === 'tactical' || activeTab === 'both'
              ? 'bg-primary/20 text-primary border border-primary/50'
              : 'bg-muted/10 text-muted-foreground'
          }`}
        >
          TACTICAL
        </button>
        <button
          onClick={() => setActiveTab('legacy')}
          className={`flex-1 py-2 px-4 rounded font-mono text-sm transition-all ${
            activeTab === 'legacy' || activeTab === 'both'
              ? 'bg-soul-gold/20 text-soul-gold border border-soul-gold/50'
              : 'bg-muted/10 text-muted-foreground'
          }`}
        >
          LEGACY
        </button>
      </div>

      {/* Split screen container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Tactical Mode - Left side */}
        <div
          className={`${
            activeTab === 'both' ? 'w-1/2' : activeTab === 'tactical' ? 'w-full' : 'hidden lg:w-1/2'
          } border-r border-primary/20 overflow-y-auto transition-all duration-300`}
        >
          <TacticalMode progression={progression} snapshot={snapshot} />
        </div>

        {/* Legacy Book - Right side */}
        <div
          className={`${
            activeTab === 'both' ? 'w-1/2' : activeTab === 'legacy' ? 'w-full' : 'hidden lg:w-1/2'
          } overflow-y-auto transition-all duration-300`}
        >
          <LegacyBook progression={progression} snapshot={snapshot} />
        </div>
      </div>
    </div>
  )
}
