import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface AscensionMapProps {
  userLevel: number
  totalXP: number
  onBack: () => void
}

interface LevelMilestone {
  level: number
  title: string
  mansion: string
  description: string
  xpRequired: number
  icon: string
}

const MILESTONES: LevelMilestone[] = [
  { level: 1, title: 'Ground Zero', mansion: 'Trap House', description: 'The beginning of your journey', xpRequired: 0, icon: '🌱' },
  { level: 10, title: 'First Victory', mansion: 'Trap House', description: 'Consistency established', xpRequired: 5000, icon: '⚡' },
  { level: 20, title: 'Apartment Era', mansion: 'Apartment', description: 'Upgrade unlocked', xpRequired: 10000, icon: '🏠' },
  { level: 30, title: 'Momentum Builder', mansion: 'Apartment', description: 'Unstoppable force', xpRequired: 15000, icon: '🚀' },
  { level: 50, title: 'House Master', mansion: 'House', description: 'Major milestone reached', xpRequired: 25000, icon: '🏡' },
  { level: 75, title: 'Ascended Being', mansion: 'House', description: 'Transcending limitations', xpRequired: 37500, icon: '👑' },
  { level: 100, title: 'Penthouse King', mansion: 'Penthouse', description: 'Crown achievement', xpRequired: 50000, icon: '🏆' },
  { level: 150, title: 'Legendary Status', mansion: 'Penthouse', description: 'Immortal legacy', xpRequired: 75000, icon: '⭐' },
  { level: 200, title: 'Eternal Empire', mansion: 'Penthouse', description: 'The ultimate destination', xpRequired: 100000, icon: '👸' },
]

export default function AscensionMap({ userLevel, totalXP, onBack }: AscensionMapProps) {
  const currentMilestoneIndex = MILESTONES.findIndex(m => m.level <= userLevel)
  const nextMilestone = MILESTONES[currentMilestoneIndex + 1]

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-primary/5 to-black p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-orbitron font-bold text-primary mb-2">ASCENSION MAP</h1>
          <p className="text-muted-foreground text-lg">Your 200-Level Journey to Immortal Legacy</p>
        </div>

        {/* Current status */}
        <Card className="glass-panel p-8 mb-12 border-primary/30">
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center">
              <p className="text-muted-foreground text-sm font-mono mb-2">CURRENT LEVEL</p>
              <p className="text-5xl font-bold text-primary font-orbitron">{userLevel}</p>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground text-sm font-mono mb-2">TOTAL XP</p>
              <p className="text-5xl font-bold text-soul-gold font-orbitron">{totalXP}</p>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground text-sm font-mono mb-2">PROGRESS</p>
              <p className="text-5xl font-bold text-primary font-orbitron">{Math.round((userLevel / 200) * 100)}%</p>
            </div>
          </div>
        </Card>

        {/* Progression timeline */}
        <div className="space-y-4 mb-12">
          {MILESTONES.map((milestone, idx) => {
            const isReached = userLevel >= milestone.level
            const isCurrent = idx === currentMilestoneIndex

            return (
              <Card
                key={milestone.level}
                className={`glass-panel p-6 border transition-all duration-300 ${
                  isCurrent
                    ? 'border-primary/50 bg-primary/10'
                    : isReached
                      ? 'border-soul-gold/30 bg-soul-gold/5'
                      : 'border-muted/20 opacity-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="text-4xl">{milestone.icon}</div>
                    <div>
                      <h3 className="text-xl font-bold text-primary font-orbitron">{milestone.title}</h3>
                      <p className="text-sm text-muted-foreground">{milestone.mansion}</p>
                      <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary font-orbitron">Level {milestone.level}</p>
                    <p className="text-sm text-muted-foreground">{milestone.xpRequired.toLocaleString()} XP</p>
                    {isReached && <p className="text-xs text-soul-gold font-bold mt-2">✓ ACHIEVED</p>}
                  </div>
                </div>

                {/* Progress bar for current milestone */}
                {isCurrent && nextMilestone && (
                  <div className="mt-4 pt-4 border-t border-primary/20">
                    <p className="text-xs text-muted-foreground mb-2">
                      {Math.round(((userLevel - milestone.level) / (nextMilestone.level - milestone.level)) * 100)}% to next milestone
                    </p>
                    <div className="w-full h-2 bg-muted/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-soul-gold transition-all duration-500"
                        style={{
                          width: `${((userLevel - milestone.level) / (nextMilestone.level - milestone.level)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </Card>
            )
          })}
        </div>

        {/* Next milestone info */}
        {nextMilestone && (
          <Card className="glass-panel p-8 mb-12 border-primary/30 bg-primary/10">
            <h3 className="text-2xl font-bold text-primary font-orbitron mb-4">NEXT MILESTONE</h3>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-muted-foreground text-sm mb-2">TARGET</p>
                <p className="text-3xl font-bold text-primary font-orbitron">{nextMilestone.title}</p>
                <p className="text-sm text-muted-foreground mt-2">Level {nextMilestone.level}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm mb-2">XP NEEDED</p>
                <p className="text-3xl font-bold text-soul-gold font-orbitron">
                  {(nextMilestone.xpRequired - totalXP).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {Math.ceil((nextMilestone.xpRequired - totalXP) / 100)} days at 100 XP/day
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Back button */}
        <Button onClick={onBack} variant="outline" className="w-full">
          Return to Trap House
        </Button>
      </div>
    </div>
  )
}
