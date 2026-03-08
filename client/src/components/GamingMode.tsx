import { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Zap, Trophy, Flame } from 'lucide-react'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt?: string
}

interface GamingModeProps {
  progression?: any
}

const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-day', title: 'First Day', description: 'Complete your first daily flow', icon: '🌅' },
  { id: 'week-streak', title: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '🔥' },
  { id: 'power-100', title: 'Rising Power', description: 'Reach 100 power score', icon: '⚡' },
  { id: 'all-pillars', title: 'Balanced Soul', description: 'Get all 10 pillars above 5', icon: '⚖️' },
  { id: 'level-10', title: 'Ascendant', description: 'Reach level 10', icon: '👑' },
  { id: 'mansion', title: 'Estate Owner', description: 'Reach Mansion stage', icon: '🏰' },
  { id: 'god-mode', title: 'GOD MODE', description: 'Achieve 900+ power score', icon: '🌟' },
  { id: 'kingdom', title: 'Emperor', description: 'Reach Kingdom stage', icon: '👑' },
]

export default function GamingMode({ progression }: GamingModeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([])
  const [soulBeastState, setSoulBeastState] = useState<'egg' | 'hatchling' | 'beast' | 'phoenix'>('egg')

  const prog = progression || {}

  // Determine Soul Beast state based on progression
  useEffect(() => {
    const level = prog?.currentLevel || 1
    if (level >= 150) setSoulBeastState('phoenix')
    else if (level >= 100) setSoulBeastState('beast')
    else if (level >= 50) setSoulBeastState('hatchling')
    else setSoulBeastState('egg')
  }, [prog?.currentLevel])

  // Initialize 3D canvas
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Draw Soul Beast based on state
    ctx.fillStyle = '#050505'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    ctx.fillStyle = '#00F3FF'
    ctx.strokeStyle = '#ffd700'
    ctx.lineWidth = 2

    switch (soulBeastState) {
      case 'egg':
        // Draw egg
        ctx.beginPath()
        ctx.ellipse(centerX, centerY, 40, 60, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        ctx.fillStyle = '#ffd700'
        ctx.font = '30px Arial'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('🥚', centerX, centerY)
        break

      case 'hatchling':
        // Draw hatchling
        ctx.beginPath()
        ctx.arc(centerX, centerY, 35, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        // Eyes
        ctx.fillStyle = '#050505'
        ctx.beginPath()
        ctx.arc(centerX - 15, centerY - 10, 5, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(centerX + 15, centerY - 10, 5, 0, Math.PI * 2)
        ctx.fill()
        break

      case 'beast':
        // Draw beast
        ctx.beginPath()
        ctx.moveTo(centerX, centerY - 50)
        ctx.lineTo(centerX + 40, centerY + 20)
        ctx.lineTo(centerX, centerY + 40)
        ctx.lineTo(centerX - 40, centerY + 20)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
        // Horns
        ctx.strokeStyle = '#ffd700'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(centerX - 20, centerY - 50)
        ctx.lineTo(centerX - 30, centerY - 70)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(centerX + 20, centerY - 50)
        ctx.lineTo(centerX + 30, centerY - 70)
        ctx.stroke()
        break

      case 'phoenix':
        // Draw phoenix
        ctx.fillStyle = '#ff6600'
        ctx.beginPath()
        ctx.arc(centerX, centerY, 45, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = '#ffd700'
        ctx.lineWidth = 3
        ctx.stroke()
        // Wings
        ctx.fillStyle = '#ff9900'
        ctx.beginPath()
        ctx.ellipse(centerX - 50, centerY, 30, 50, -0.3, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.ellipse(centerX + 50, centerY, 30, 50, 0.3, 0, Math.PI * 2)
        ctx.fill()
        break
    }
  }, [soulBeastState])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Zap className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-primary">GAMING & EVOLUTION</h2>
        </div>
      </div>

      {/* Soul Beast Visualization */}
      <Card className="glass-panel p-6 border-secondary/30">
        <h3 className="text-lg font-bold text-secondary mb-4">SOUL BEAST EVOLUTION</h3>
        <canvas
          ref={canvasRef}
          className="w-full bg-gradient-to-b from-black/50 to-black/20 rounded-lg mb-4"
          style={{ height: '300px' }}
        />
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Current State</p>
          <p className="text-2xl font-bold text-secondary capitalize">{soulBeastState}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Level {prog?.currentLevel || 1} • {prog?.currentStage || 'Trap'}
          </p>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="glass-panel p-4 border-primary/20">
          <p className="text-xs text-muted-foreground">POWER SCORE</p>
          <p className="text-3xl font-bold text-primary">{Math.round(prog?.powerScore || 0)}</p>
        </Card>
        <Card className="glass-panel p-4 border-secondary/20">
          <p className="text-xs text-muted-foreground">CURRENT STREAK</p>
          <p className="text-3xl font-bold text-secondary">{prog?.currentStreak || 0}</p>
        </Card>
        <Card className="glass-panel p-4 border-accent/20">
          <p className="text-xs text-muted-foreground">LONGEST STREAK</p>
          <p className="text-3xl font-bold text-accent">{prog?.longestStreak || 0}</p>
        </Card>
      </div>

      {/* Achievements */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-bold text-primary uppercase">ACHIEVEMENTS</h3>
          <span className="text-xs text-muted-foreground">({unlockedAchievements.length}/{ACHIEVEMENTS.length})</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {ACHIEVEMENTS.map((achievement) => {
            const isUnlocked = unlockedAchievements.includes(achievement.id)
            return (
              <Card
                key={achievement.id}
                className={`glass-panel p-4 text-center transition-all ${
                  isUnlocked
                    ? 'border-primary/60 bg-primary/10'
                    : 'border-muted/20 opacity-50 grayscale'
                }`}
              >
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <p className="text-xs font-bold">{achievement.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
                {isUnlocked && (
                  <p className="text-xs text-primary mt-2 font-bold">✓ UNLOCKED</p>
                )}
              </Card>
            )
          })}
        </div>
      </div>

      {/* Leaderboard */}
      <Card className="glass-panel p-6 border-accent/20">
        <div className="flex items-center gap-2 mb-4">
          <Flame className="w-5 h-5 text-accent" />
          <h3 className="text-lg font-bold text-accent">LEADERBOARD</h3>
        </div>

        <div className="space-y-2">
          {[
            { rank: 1, name: 'You', power: Math.round(prog?.powerScore || 0), stage: prog?.currentStage || 'Trap' },
            { rank: 2, name: 'Phoenix', power: 850, stage: 'Kingdom' },
            { rank: 3, name: 'Beast', power: 750, stage: 'Castle' },
            { rank: 4, name: 'Warrior', power: 650, stage: 'Keep' },
            { rank: 5, name: 'Seeker', power: 550, stage: 'Fort' },
          ].map((entry) => (
            <div
              key={entry.rank}
              className={`flex items-center justify-between p-3 rounded-lg ${
                entry.rank === 1
                  ? 'bg-primary/20 border border-primary/30'
                  : 'bg-muted/20 border border-muted/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-primary">#{entry.rank}</span>
                <div>
                  <p className="text-sm font-bold">{entry.name}</p>
                  <p className="text-xs text-muted-foreground">{entry.stage}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-secondary">{entry.power}</p>
                <p className="text-xs text-muted-foreground">power</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
