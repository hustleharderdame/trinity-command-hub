import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface DailyLog {
  date: string
  missions: string[]
  xpGained: number
  pillarsGrown: string[]
}

interface WeeklySizzleReelProps {
  weeklyLogs: DailyLog[]
  onClose: () => void
}

export default function WeeklySizzleReel({ weeklyLogs, onClose }: WeeklySizzleReelProps) {
  const [currentFrame, setCurrentFrame] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  const totalXP = weeklyLogs.reduce((sum, log) => sum + log.xpGained, 0)
  const totalMissions = weeklyLogs.reduce((sum, log) => sum + log.missions.length, 0)
  const uniquePillars = Array.from(new Set(weeklyLogs.flatMap(log => log.pillarsGrown)))

  // Auto-advance frames
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setCurrentFrame(prev => (prev + 1) % 10)
    }, 1000)

    return () => clearInterval(interval)
  }, [isPlaying])

  // Stop after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPlaying(false)
    }, 10000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="glass-panel p-8 max-w-2xl w-full border-primary/30">
        <h2 className="font-orbitron text-3xl font-bold text-primary mb-8 text-center">WEEKLY SIZZLE REEL</h2>

        {/* Animated montage */}
        <div className="mb-8 h-64 bg-gradient-to-b from-primary/20 to-transparent rounded-lg flex items-center justify-center overflow-hidden relative">
          {/* Frame 1-3: Missions */}
          {currentFrame < 3 && (
            <div className="animate-in fade-in duration-500 text-center">
              <div className="text-6xl mb-4">🎯</div>
              <p className="text-2xl font-bold text-primary">{totalMissions} MISSIONS COMPLETED</p>
            </div>
          )}

          {/* Frame 4-6: XP Gained */}
          {currentFrame >= 3 && currentFrame < 6 && (
            <div className="animate-in fade-in duration-500 text-center">
              <div className="text-6xl mb-4">⚡</div>
              <p className="text-2xl font-bold text-soul-gold">{totalXP} XP EARNED</p>
            </div>
          )}

          {/* Frame 7-9: Pillars Grown */}
          {currentFrame >= 6 && currentFrame < 9 && (
            <div className="animate-in fade-in duration-500 text-center">
              <div className="text-6xl mb-4">📈</div>
              <p className="text-2xl font-bold text-primary">{uniquePillars.length} PILLARS GROWN</p>
              <p className="text-sm text-muted-foreground mt-2">{uniquePillars.join(', ')}</p>
            </div>
          )}

          {/* Frame 10: Victory */}
          {currentFrame >= 9 && (
            <div className="animate-in fade-in duration-500 text-center">
              <div className="text-6xl mb-4">🏆</div>
              <p className="text-2xl font-bold text-primary">ANOTHER WEEK CONQUERED</p>
            </div>
          )}

          {/* Progress indicator */}
          <div className="absolute bottom-4 left-4 right-4 h-1 bg-muted/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-soul-gold transition-all duration-1000"
              style={{ width: `${((currentFrame + 1) / 10) * 100}%` }}
            />
          </div>
        </div>

        {/* Stats breakdown */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="glass-panel p-4 text-center border-muted/20">
            <p className="text-muted-foreground text-sm mb-2">MISSIONS</p>
            <p className="text-3xl font-bold text-primary">{totalMissions}</p>
          </Card>
          <Card className="glass-panel p-4 text-center border-muted/20">
            <p className="text-muted-foreground text-sm mb-2">XP EARNED</p>
            <p className="text-3xl font-bold text-soul-gold">{totalXP}</p>
          </Card>
          <Card className="glass-panel p-4 text-center border-muted/20">
            <p className="text-muted-foreground text-sm mb-2">PILLARS</p>
            <p className="text-3xl font-bold text-primary">{uniquePillars.length}</p>
          </Card>
        </div>

        {/* Daily breakdown */}
        <div className="space-y-2 mb-8 max-h-40 overflow-y-auto">
          {weeklyLogs.map((log, idx) => (
            <div key={idx} className="text-sm text-muted-foreground flex justify-between items-center p-2 rounded bg-muted/10">
              <span>{log.date}</span>
              <span className="text-primary font-bold">{log.missions.length} missions • +{log.xpGained} XP</span>
            </div>
          ))}
        </div>

        {/* Close button */}
        <Button onClick={onClose} className="w-full bg-primary text-black hover:bg-primary/90 font-bold">
          CONTINUE TO NEXT WEEK
        </Button>
      </Card>
    </div>
  )
}
