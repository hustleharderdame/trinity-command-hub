import { Card } from '@/components/ui/card'
import { Brain, Heart, Zap, DollarSign, Zap as Power, Users, Repeat, Smile, Wind, Target } from 'lucide-react'

interface PillarData {
  mind: number
  body: number
  soul: number
  money: number
  power: number
  respect: number
  consistency: number
  happiness: number
  recovery: number
  impact: number
}

interface PillarsDisplayProps {
  pillars: PillarData
  degree?: number
  shadowAvg?: number
  lightAvg?: number
}

const PILLAR_CONFIG = [
  { key: 'mind', label: 'Mind', icon: Brain, color: 'from-purple-500 to-blue-500', type: 'light' },
  { key: 'body', label: 'Body', icon: Heart, color: 'from-pink-500 to-red-500', type: 'shadow' },
  { key: 'soul', label: 'Soul', icon: Zap, color: 'from-cyan-500 to-blue-500', type: 'light' },
  { key: 'money', label: 'Money', icon: DollarSign, color: 'from-green-500 to-emerald-500', type: 'shadow' },
  { key: 'power', label: 'Power', icon: Power, color: 'from-orange-500 to-yellow-500', type: 'shadow' },
  { key: 'respect', label: 'Respect', icon: Users, color: 'from-pink-300 to-red-300', type: 'shadow' },
  { key: 'consistency', label: 'Consistency', icon: Repeat, color: 'from-orange-500 to-red-500', type: 'light' },
  { key: 'happiness', label: 'Happiness', icon: Smile, color: 'from-yellow-300 to-orange-300', type: 'light' },
  { key: 'recovery', label: 'Recovery', icon: Wind, color: 'from-blue-300 to-cyan-300', type: 'light' },
  { key: 'impact', label: 'Impact', icon: Target, color: 'from-purple-300 to-pink-300', type: 'light' },
]

export default function PillarsDisplay({ pillars, degree = 0, shadowAvg = 5, lightAvg = 5 }: PillarsDisplayProps) {
  // Coerce DECIMAL strings from database to numbers
  const shadow = Number(shadowAvg ?? 0)
  const light = Number(lightAvg ?? 0)
  const deg = Number(degree ?? 0)

  const shadowPillars = PILLAR_CONFIG.filter(p => p.type === 'shadow')
  const lightPillars = PILLAR_CONFIG.filter(p => p.type === 'light')

  const renderPillar = (config: typeof PILLAR_CONFIG[0]) => {
    const Icon = config.icon
    const value = Number(pillars[config.key as keyof PillarData]) || 0
    const percentage = (value / 10) * 100

    return (
      <div key={config.key} className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`bg-gradient-to-r ${config.color} p-2 rounded`}>
              <Icon className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-bold uppercase">{config.label}</span>
          </div>
          <span className="text-sm font-bold text-primary">{value.toFixed(1)}</span>
        </div>
        <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
          <div
            className={`bg-gradient-to-r ${config.color} h-full transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Alignment Indicator */}
      <Card className="glass-panel p-4 border-primary/20">
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Alignment Degree</h3>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Shadow Avg: {shadowAvg.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">Light Avg: {lightAvg.toFixed(1)}</span>
          </div>

          {/* Degree Slider */}
          <div className="relative h-8 bg-muted/30 rounded-full overflow-hidden flex items-center">
            {/* Shadow side (left) */}
            <div className="absolute left-0 top-0 h-full w-1/2 bg-gradient-to-r from-red-500/20 to-transparent" />
            {/* Light side (right) */}
            <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-blue-500/20 to-transparent" />
            
            {/* Indicator */}
            <div
              className="absolute h-6 w-1 bg-primary rounded transition-all duration-300"
              style={{ left: `${50 + (deg / 180) * 50}%`, transform: 'translateX(-50%)' }}
            />
            
            {/* Labels */}
            <div className="absolute left-2 text-xs text-muted-foreground font-bold">SHADOW</div>
            <div className="absolute right-2 text-xs text-muted-foreground font-bold">LIGHT</div>
          </div>

          <div className="text-center">
            <span className="text-lg font-bold text-primary">{deg.toFixed(1)}°</span>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.abs(deg) < 30 ? 'BALANCED' : deg > 0 ? 'LIGHT ALIGNED' : 'SHADOW ALIGNED'}
            </p>
          </div>
        </div>
      </Card>

      {/* Shadow Pillars */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-red-500/80 uppercase tracking-widest">⚡ SHADOW PILLARS</h3>
        <div className="grid grid-cols-2 gap-4">
          {shadowPillars.map(config => renderPillar(config))}
        </div>
      </div>

      {/* Light Pillars */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-blue-500/80 uppercase tracking-widest">✨ LIGHT PILLARS</h3>
        <div className="grid grid-cols-2 gap-4">
          {lightPillars.map(config => renderPillar(config))}
        </div>
      </div>

      {/* Statistics */}
      <Card className="glass-panel p-4 border-accent/20">
          <div className="grid grid-cols-2 gap-4 text-center">
        <div>
          <p className="text-xs text-muted-foreground">SHADOW AVERAGE</p>
          <p className="text-2xl font-bold text-red-500">{shadow.toFixed(1)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">LIGHT AVERAGE</p>
          <p className="text-2xl font-bold text-blue-500">{light.toFixed(1)}</p>
        </div>
      </div>
      </Card>
    </div>
  )
}
