import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface Stage1GamingModeProps {
  progression?: any
  snapshot?: any
}

export default function Stage1GamingMode({ progression, snapshot }: Stage1GamingModeProps) {
  const [activePanel, setActivePanel] = useState<'command' | 'wallet'>('command')

  const prog = progression || {}
  const snap = snapshot || {}
  const userLevel = prog?.currentLevel || 1
  const dailyXP = snap?.dailyXP || 0
  const currentStreak = prog?.currentStreak || 0

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Cyberpunk room background */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(135deg, #00ffff 0%, #ff00ff 50%, #00ffff 100%),
            radial-gradient(circle at 20% 50%, rgba(0, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255, 0, 255, 0.1) 0%, transparent 50%)
          `,
          backgroundSize: '400% 400%',
          animation: 'gradient 15s ease infinite',
        }}
      />

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(0deg, transparent 24%, rgba(0, 255, 255, 0.05) 25%, rgba(0, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, 0.05) 75%, rgba(0, 255, 255, 0.05) 76%, transparent 77%, transparent),
              linear-gradient(90deg, transparent 24%, rgba(0, 255, 255, 0.05) 25%, rgba(0, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, 0.05) 75%, rgba(0, 255, 255, 0.05) 76%, transparent 77%, transparent)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Neon glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row p-4 sm:p-6 gap-4 sm:gap-6">
        {/* Main holographic command center */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Neon header */}
          <div className="border-2 border-cyan-500/50 bg-black/50 backdrop-blur-sm p-4 sm:p-6 rounded-lg shadow-lg shadow-cyan-500/20">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl sm:text-4xl font-bold text-cyan-500 mb-2" style={{ textShadow: '0 0 10px rgba(0, 255, 255, 0.8)' }}>
                  STAGE 1
                </h1>
                <p className="text-xs sm:text-sm text-cyan-500/70 font-mono">COMMAND CENTER ONLINE</p>
              </div>
              <div className="text-right">
                <div className="text-2xl sm:text-3xl font-bold text-pink-500" style={{ textShadow: '0 0 10px rgba(255, 0, 255, 0.8)' }}>
                  LVL {userLevel}
                </div>
                <div className="text-xs text-pink-500/70 font-mono">POWER LEVEL</div>
              </div>
            </div>

            {/* Status bars */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-mono text-cyan-500">XP TODAY</span>
                  <span className="text-xs font-mono text-cyan-500 font-bold">{dailyXP}/100</span>
                </div>
                <div className="h-2 bg-black border border-cyan-500/30 overflow-hidden rounded">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all duration-300"
                    style={{ width: `${dailyXP}%`, boxShadow: '0 0 10px rgba(0, 255, 255, 0.6)' }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-mono text-pink-500">STREAK</span>
                  <span className="text-xs font-mono text-pink-500 font-bold">{currentStreak} DAYS</span>
                </div>
                <div className="h-2 bg-black border border-pink-500/30 overflow-hidden rounded">
                  <div
                    className="h-full bg-gradient-to-r from-pink-500 to-pink-400 transition-all duration-300"
                    style={{ width: `${Math.min(currentStreak * 10, 100)}%`, boxShadow: '0 0 10px rgba(255, 0, 255, 0.6)' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Holographic panels */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Missions panel */}
            <div className="border-2 border-cyan-500/30 bg-black/50 backdrop-blur-sm p-4 rounded-lg shadow-lg shadow-cyan-500/10">
              <h2 className="text-sm font-mono font-bold text-cyan-500 mb-3" style={{ textShadow: '0 0 5px rgba(0, 255, 255, 0.6)' }}>
                ◆ MISSIONS
              </h2>
              <div className="space-y-2">
                {['ALPHA', 'BRAVO', 'CHARLIE'].map((mission, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-cyan-500/70 hover:text-cyan-400 transition-colors cursor-pointer">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full" />
                    <span className="font-mono">MISSION {mission}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats panel */}
            <div className="border-2 border-pink-500/30 bg-black/50 backdrop-blur-sm p-4 rounded-lg shadow-lg shadow-pink-500/10">
              <h2 className="text-sm font-mono font-bold text-pink-500 mb-3" style={{ textShadow: '0 0 5px rgba(255, 0, 255, 0.6)' }}>
                ◆ STATS
              </h2>
              <div className="space-y-2 text-xs text-pink-500/70">
                <div className="flex justify-between">
                  <span>STRENGTH</span>
                  <span className="font-bold">{Math.floor(userLevel / 5)}</span>
                </div>
                <div className="flex justify-between">
                  <span>CLARITY</span>
                  <span className="font-bold">{Math.floor(currentStreak / 7)}</span>
                </div>
                <div className="flex justify-between">
                  <span>WISDOM</span>
                  <span className="font-bold">{Math.floor(prog?.totalXP / 500 || 0)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              className="bg-cyan-500/20 border border-cyan-500/50 text-cyan-500 hover:bg-cyan-500/30 font-mono text-xs sm:text-sm py-2 sm:py-3 rounded transition-all"
              style={{ boxShadow: '0 0 10px rgba(0, 255, 255, 0.3)' }}
            >
              ▶ START MISSION
            </Button>
            <Button
              className="bg-pink-500/20 border border-pink-500/50 text-pink-500 hover:bg-pink-500/30 font-mono text-xs sm:text-sm py-2 sm:py-3 rounded transition-all"
              style={{ boxShadow: '0 0 10px rgba(255, 0, 255, 0.3)' }}
            >
              ▶ CHECK IN
            </Button>
          </div>
        </div>

        {/* Side panel - Wallet/Character */}
        <div className="w-full lg:w-80 flex flex-col gap-4">
          {/* Wallet header */}
          <div className="border-2 border-magenta-500/50 bg-black/50 backdrop-blur-sm p-4 rounded-lg shadow-lg shadow-magenta-500/20">
            <h2 className="text-sm font-mono font-bold text-magenta-500 mb-3" style={{ textShadow: '0 0 5px rgba(255, 0, 255, 0.6)' }}>
              ◆ WALLET
            </h2>
            <div className="space-y-2 text-xs text-magenta-500/70">
              <div className="flex justify-between">
                <span>BALANCE</span>
                <span className="font-bold text-magenta-400">29,975 XP</span>
              </div>
              <div className="flex justify-between">
                <span>LEVEL</span>
                <span className="font-bold text-magenta-400">{userLevel}</span>
              </div>
              <div className="flex justify-between">
                <span>RANK</span>
                <span className="font-bold text-magenta-400">HUSTLER</span>
              </div>
            </div>
          </div>

          {/* Character card */}
          <div className="border-2 border-magenta-500/30 bg-black/50 backdrop-blur-sm p-4 rounded-lg shadow-lg shadow-magenta-500/10">
            <h2 className="text-sm font-mono font-bold text-magenta-500 mb-3" style={{ textShadow: '0 0 5px rgba(255, 0, 255, 0.6)' }}>
              ◆ CHARACTER
            </h2>
            <div className="space-y-2">
              <div className="w-full h-32 bg-gradient-to-br from-magenta-500/20 to-cyan-500/20 rounded border border-magenta-500/30 flex items-center justify-center">
                <span className="text-4xl">👤</span>
              </div>
              <div className="text-xs text-magenta-500/70 space-y-1">
                <div>NAME: HUSTLER</div>
                <div>LEVEL: {userLevel}</div>
                <div>STAGE: 1</div>
              </div>
            </div>
          </div>

          {/* Neon sign */}
          <div className="text-center py-4">
            <div
              className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-magenta-500 to-pink-500"
              style={{
                textShadow: '0 0 20px rgba(0, 255, 255, 0.6), 0 0 40px rgba(255, 0, 255, 0.4)',
                fontFamily: 'Arial, sans-serif',
                letterSpacing: '3px',
              }}
            >
              JUNK
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  )
}
