import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import DailyFlowModal from './DailyFlowModal'
import PillarsDisplay from './PillarsDisplay'
import { Zap, Target, TrendingUp } from 'lucide-react'

interface TacticalModeProps {
  progression?: any
  snapshot?: any
}

const STAGES = [
  { name: 'Trap', level: '1-25', emoji: '🪤', color: 'from-red-600 to-red-800' },
  { name: 'Suburbs', level: '26-50', emoji: '🏘️', color: 'from-orange-600 to-orange-800' },
  { name: 'Penthouse', level: '51-75', emoji: '🏢', color: 'from-yellow-600 to-yellow-800' },
  { name: 'Mansion', level: '76-100', emoji: '🏰', color: 'from-green-600 to-green-800' },
  { name: 'Fort', level: '101-115', emoji: '🏯', color: 'from-cyan-600 to-cyan-800' },
  { name: 'Keep', level: '116-130', emoji: '🗼', color: 'from-blue-600 to-blue-800' },
  { name: 'Castle', level: '131-150', emoji: '🏛️', color: 'from-purple-600 to-purple-800' },
  { name: 'Kingdom', level: '151-200', emoji: '👑', color: 'from-pink-600 to-pink-800' },
]

export default function TacticalMode({ progression, snapshot }: TacticalModeProps) {
  const [showDailyFlow, setShowDailyFlow] = useState(false)
  const [selectedStage, setSelectedStage] = useState(0)

  const prog = progression || {}
  const snap = snapshot || {}

  const currentStageIndex = STAGES.findIndex(s => s.name === (prog?.currentStage || 'Trap'))
  const stage = STAGES[currentStageIndex >= 0 ? currentStageIndex : 0]

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="glass-panel p-4 border-primary/20">
          <p className="text-xs text-muted-foreground">LEVEL</p>
          <p className="text-3xl font-bold text-primary">{prog?.currentLevel || 1}</p>
        </Card>
        <Card className="glass-panel p-4 border-secondary/20">
          <p className="text-xs text-muted-foreground">POWER SCORE</p>
          <p className="text-3xl font-bold text-secondary">{Math.round(prog?.powerScore || 0)}</p>
        </Card>
        <Card className="glass-panel p-4 border-accent/20">
          <p className="text-xs text-muted-foreground">XP EARNED</p>
          <p className="text-3xl font-bold text-accent">{prog?.totalXP || 0}</p>
        </Card>
        <Card className="glass-panel p-4 border-primary/20">
          <p className="text-xs text-muted-foreground">TIER</p>
          <p className="text-2xl font-bold text-primary">
            {prog?.powerScore >= 900 ? 'GOD' : prog?.powerScore >= 600 ? 'ASC' : prog?.powerScore >= 300 ? 'SLD' : 'BLD'}
          </p>
        </Card>
      </div>

      {/* Current Stage */}
      <Card className={`glass-panel p-6 border-primary/30 bg-gradient-to-r ${stage.color} bg-opacity-10`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase">CURRENT STAGE</p>
            <h2 className="text-4xl font-orbitron font-bold text-primary mt-2">{stage.emoji} {stage.name}</h2>
            <p className="text-sm text-muted-foreground mt-1">Levels {stage.level}</p>
          </div>
          <div className="text-6xl">{stage.emoji}</div>
        </div>
      </Card>

      {/* Stage Progression */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-primary uppercase">STAGE PROGRESSION</h3>
        <div className="grid grid-cols-4 gap-2">
          {STAGES.map((s, idx) => (
            <div
              key={s.name}
              onClick={() => setSelectedStage(idx)}
              className={`glass-panel p-3 cursor-pointer transition-all text-center ${
                idx === currentStageIndex
                  ? 'border-primary/60 bg-primary/10'
                  : 'border-muted/20 hover:border-primary/30'
              }`}
            >
              <div className="text-2xl mb-1">{s.emoji}</div>
              <p className="text-xs font-bold">{s.name}</p>
              <p className="text-xs text-muted-foreground">{s.level}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Flow Button */}
      <Button
        onClick={() => setShowDailyFlow(true)}
        className="w-full bg-gradient-to-r from-primary to-secondary text-black hover:opacity-90 font-bold py-6 text-lg"
      >
        🚀 DAILY FLOW
      </Button>

      {/* 10 Pillars */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-primary uppercase">10 PILLARS</h3>
        <PillarsDisplay
          pillars={{
            mind: Number(snap?.mindPillar ?? 0),
            body: Number(snap?.bodyPillar ?? 0),
            soul: Number(snap?.soulPillar ?? 0),
            money: Number(snap?.moneyPillar ?? 0),
            power: Number(snap?.powerPillar ?? 0),
            respect: Number(snap?.respectPillar ?? 0),
            consistency: Number(snap?.consistencyPillar ?? 0),
            happiness: Number(snap?.happinessPillar ?? 0),
            recovery: Number(snap?.recoveryPillar ?? 0),
            impact: Number(snap?.impactPillar ?? 0),
          }}
          degree={Number(snap?.degree ?? 0)}
          shadowAvg={Number(snap?.shadowAvg ?? 0)}
          lightAvg={Number(snap?.lightAvg ?? 0)}
        />
      </div>

      {/* Power Formula */}
      <Card className="glass-panel p-4 border-muted/20">
        <p className="text-xs font-bold text-muted-foreground uppercase">POWER FORMULA</p>
        <div className="font-mono text-sm mt-3 text-primary">
          <p>Power = ((Hustle² + Faith²)^Love) × Multipliers</p>
          <p className="text-xs text-muted-foreground mt-2">
            Multipliers: TimeFactor × Consistency × Happiness × Recovery × Impact
          </p>
        </div>
      </Card>

      {/* Daily Flow Modal */}
      <DailyFlowModal
        isOpen={showDailyFlow}
        onClose={() => setShowDailyFlow(false)}
        onSuccess={() => {
          setShowDailyFlow(false)
          window.location.reload()
        }}
      />
    </div>
  )
}
