import { Card } from '@/components/ui/card'
import { Sparkles } from 'lucide-react'

interface SpiritualAgeDisplayProps {
  spiritualAge?: number
  biologicalAge?: number
  lifeCycles?: number
  frictionScore?: number
  deltaFromBaseline?: number
}

export default function SpiritualAgeDisplay({
  spiritualAge = 0,
  biologicalAge = 25,
  lifeCycles = 0,
  frictionScore = 1.0,
  deltaFromBaseline = 0,
}: SpiritualAgeDisplayProps) {
  const statusColor = deltaFromBaseline > 5 ? 'text-green-500' : deltaFromBaseline < -5 ? 'text-red-500' : 'text-yellow-500'
  const statusBg = deltaFromBaseline > 5 ? 'bg-green-500/10' : deltaFromBaseline < -5 ? 'bg-red-500/10' : 'bg-yellow-500/10'
  const statusBorder = deltaFromBaseline > 5 ? 'border-green-500/30' : deltaFromBaseline < -5 ? 'border-red-500/30' : 'border-yellow-500/30'

  return (
    <div className="space-y-4">
      {/* Main Spiritual Age Card */}
      <Card className={`glass-panel p-6 border-primary/20 ${statusBg} ${statusBorder}`}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Spiritual Age</h3>
            </div>
            <span className={`text-3xl font-bold ${statusColor}`}>{spiritualAge}</span>
          </div>

          {/* Age Comparison */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/20 rounded p-3">
              <p className="text-xs text-muted-foreground">Biological Age</p>
              <p className="text-2xl font-bold text-foreground">{biologicalAge}</p>
            </div>
            <div className="bg-muted/20 rounded p-3">
              <p className="text-xs text-muted-foreground">Delta</p>
              <p className={`text-2xl font-bold ${statusColor}`}>
                {deltaFromBaseline > 0 ? '+' : ''}{deltaFromBaseline}
              </p>
            </div>
          </div>

          {/* Status Message */}
          <div className="text-center py-2 border-t border-muted/30">
            <p className={`text-sm font-bold ${statusColor}`}>
              {deltaFromBaseline > 5
                ? '🚀 ACCELERATED GROWTH'
                : deltaFromBaseline < -5
                ? '⚠️ BEHIND BASELINE'
                : '⚖️ ON TRACK'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.abs(deltaFromBaseline)} years {deltaFromBaseline > 0 ? 'ahead' : 'behind'} of standard humanity
            </p>
          </div>
        </div>
      </Card>

      {/* Life Cycles & Friction */}
      <div className="grid grid-cols-2 gap-4">
        {/* Life Cycles */}
        <Card className="glass-panel p-4 border-secondary/20">
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase text-secondary">Life Cycles</h4>
            <div className="text-center">
              <p className="text-3xl font-bold text-secondary">{lifeCycles}</p>
              <p className="text-xs text-muted-foreground mt-2">Developmental Progressions</p>
            </div>

            {/* Cycle Visualization */}
            <div className="flex gap-1 justify-center mt-3">
              {Array.from({ length: Math.min(lifeCycles, 5) }).map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full bg-gradient-to-r from-secondary to-accent"
                />
              ))}
              {lifeCycles > 5 && (
                <span className="text-xs text-muted-foreground ml-1">+{lifeCycles - 5}</span>
              )}
            </div>
          </div>
        </Card>

        {/* Friction Score */}
        <Card className="glass-panel p-4 border-accent/20">
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase text-accent">Friction Score</h4>
            <div className="text-center">
              <p className="text-3xl font-bold text-accent">{frictionScore.toFixed(2)}x</p>
              <p className="text-xs text-muted-foreground mt-2">Growth Multiplier</p>
            </div>

            {/* Friction Bar */}
            <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden mt-3">
              <div
                className="bg-gradient-to-r from-accent to-primary h-full"
                style={{ width: `${Math.min((frictionScore / 2) * 100, 100)}%` }}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Wisdom Calculation Info */}
      <Card className="glass-panel p-4 border-muted/20">
        <div className="space-y-2 text-xs">
          <h4 className="font-bold uppercase text-muted-foreground">Calculation</h4>
          <p className="text-muted-foreground">
            Spiritual Age = Base Maturity + (Wisdom Milestones × Friction Score) + Life Cycle Bonus
          </p>
          <div className="bg-muted/20 rounded p-2 mt-2 font-mono text-xs">
            <p>{spiritualAge} = 18 + ({lifeCycles} × {frictionScore.toFixed(2)}) + bonus</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
