import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

interface TacticalModeProps {
  progression?: any
  snapshot?: any
}

export default function TacticalMode({ progression, snapshot }: TacticalModeProps) {
  const [missions, setMissions] = useState([
    { id: 1, title: 'MISSION ALPHA', completed: false },
    { id: 2, title: 'MISSION BRAVO', completed: false },
    { id: 3, title: 'MISSION CHARLIE', completed: false },
  ])

  const prog = progression || {}
  const snap = snapshot || {}
  const userLevel = prog?.currentLevel || 1
  const dailyXP = snap?.dailyXP || 0
  const currentStreak = prog?.currentStreak || 0

  const toggleMission = (id: number) => {
    setMissions(missions.map(m => (m.id === id ? { ...m, completed: !m.completed } : m)))
  }

  return (
    <div
      className="min-h-screen bg-black p-3 sm:p-6 relative overflow-hidden"
      style={{ backgroundColor: '#0a0a0a' }}
    >
      {/* Grid background overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(0deg, transparent 24%, rgba(0, 255, 0, 0.05) 25%, rgba(0, 255, 0, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 0, 0.05) 75%, rgba(0, 255, 0, 0.05) 76%, transparent 77%, transparent),
              linear-gradient(90deg, transparent 24%, rgba(0, 255, 0, 0.05) 25%, rgba(0, 255, 0, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 0, 0.05) 75%, rgba(0, 255, 0, 0.05) 76%, transparent 77%, transparent)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Tactical frame border - hidden on mobile */}
      <div className="absolute inset-0 pointer-events-none hidden sm:block">
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-green-500/50" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-green-500/50" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-green-500/50" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-green-500/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8 border-b-2 border-green-500/30 pb-3 sm:pb-4">
          <h1
            className="text-2xl sm:text-3xl font-bold text-green-500 mb-2"
            style={{ fontFamily: 'Courier New, monospace', letterSpacing: '2px' }}
          >
            HUSTLE
          </h1>
          <p className="text-xs font-mono text-green-500/70 tracking-widest">LEGACY BOOK</p>
          <p className="text-xs font-mono text-green-500/50 mt-1">TACTICAL MODE</p>
        </div>

        {/* Status bars */}
        <div className="space-y-3 mb-6 sm:mb-8">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs font-mono text-green-500">LEVEL</span>
              <span className="text-xs font-mono text-green-500 font-bold">{userLevel}</span>
            </div>
            <div className="h-2 bg-black border border-green-500/30 overflow-hidden">
              <div
                className="h-full bg-green-500/70 transition-all duration-300"
                style={{ width: `${Math.min((userLevel / 100) * 100, 100)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs font-mono text-green-500">XP TODAY</span>
              <span className="text-xs font-mono text-green-500 font-bold">{dailyXP}/100</span>
            </div>
            <div className="h-2 bg-black border border-green-500/30 overflow-hidden">
              <div
                className="h-full bg-green-500/70 transition-all duration-300"
                style={{ width: `${dailyXP}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs font-mono text-green-500">STREAK</span>
              <span className="text-xs font-mono text-green-500 font-bold">{currentStreak} DAYS</span>
            </div>
            <div className="h-2 bg-black border border-green-500/30 overflow-hidden">
              <div
                className="h-full bg-green-500/70 transition-all duration-300"
                style={{ width: `${Math.min(currentStreak * 10, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Missions section */}
        <div className="mb-6 sm:mb-8 border-2 border-green-500/30 p-3 sm:p-4 bg-black/50">
          <h2 className="text-xs sm:text-sm font-mono font-bold text-green-500 mb-3 sm:mb-4 tracking-widest">
            ✓ MISSIONS
          </h2>

          <div className="space-y-2 sm:space-y-3">
            {missions.map(mission => (
              <div key={mission.id} className="flex items-center gap-2 sm:gap-3">
                <Checkbox
                  checked={mission.completed}
                  onCheckedChange={() => toggleMission(mission.id)}
                  className="border-green-500/50 w-5 h-5 sm:w-6 sm:h-6"
                />
                <span
                  className={`text-xs sm:text-sm font-mono transition-all ${
                    mission.completed ? 'text-green-500/40 line-through' : 'text-green-500'
                  }`}
                >
                  {mission.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Objectives section */}
        <div className="mb-6 sm:mb-8 border-2 border-green-500/30 p-3 sm:p-4 bg-black/50">
          <h2 className="text-xs sm:text-sm font-mono font-bold text-green-500 mb-2 sm:mb-4 tracking-widest">
            ▢ OBJECTIVES
          </h2>
          <p className="text-xs text-green-500/60 font-mono">Complete all missions for +60 XP</p>
        </div>

        {/* Tactics section */}
        <div className="mb-6 sm:mb-8 border-2 border-green-500/30 p-3 sm:p-4 bg-black/50">
          <h2 className="text-xs sm:text-sm font-mono font-bold text-green-500 mb-2 sm:mb-4 tracking-widest">
            ⚡ TACTICS
          </h2>
          <div className="space-y-2">
            <div className="h-1 bg-green-500/30 overflow-hidden">
              <div className="h-full bg-green-500 w-3/4" />
            </div>
            <div className="h-1 bg-green-500/30 overflow-hidden">
              <div className="h-full bg-green-500 w-1/2" />
            </div>
            <div className="h-1 bg-green-500/30 overflow-hidden">
              <div className="h-full bg-green-500 w-2/3" />
            </div>
          </div>
        </div>

        {/* Action button */}
        <Button
          className="w-full text-green-500 border border-green-500/50 hover:bg-green-500/20 font-mono text-xs sm:text-sm py-2 sm:py-3 rounded-none bg-black"
          style={{ color: '#00ff00' }}
        >
          ▶ NEW ENTRY
        </Button>
      </div>
    </div>
  )
}
