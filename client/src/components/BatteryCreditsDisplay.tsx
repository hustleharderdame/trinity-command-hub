import { Card } from '@/components/ui/card'
import { Zap, Coins } from 'lucide-react'

interface BatteryCreditsDisplayProps {
  totalBattery?: number
  totalCredits?: number
  spentCredits?: number
  availableCredits?: number
  creditsEarned?: number
}

export default function BatteryCreditsDisplay({
  totalBattery = 0,
  totalCredits = 0,
  spentCredits = 0,
  availableCredits = 0,
  creditsEarned = 0,
}: BatteryCreditsDisplayProps) {
  const batteryPercentage = Math.min((totalBattery / 1000) * 100, 100)
  const creditsPercentage = Math.min((availableCredits / totalCredits) * 100, 100)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Battery Display */}
      <Card className="glass-panel p-6 border-secondary/20">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-secondary" />
              <h3 className="text-sm font-bold uppercase tracking-wider">BATTERY</h3>
            </div>
            <span className="text-2xl font-bold text-secondary">{totalBattery}</span>
          </div>

          {/* Battery Bar */}
          <div className="space-y-2">
            <div className="w-full bg-muted/30 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-secondary to-accent h-full transition-all duration-500"
                style={{ width: `${batteryPercentage}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground text-right">{batteryPercentage.toFixed(0)}% Charged</p>
          </div>

          {/* Battery Info */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-muted/20 rounded p-2">
              <p className="text-muted-foreground">Max Capacity</p>
              <p className="font-bold text-secondary">1000 SE</p>
            </div>
            <div className="bg-muted/20 rounded p-2">
              <p className="text-muted-foreground">Current</p>
              <p className="font-bold text-secondary">{totalBattery} SE</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Credits Display */}
      <Card className="glass-panel p-6 border-accent/20">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-accent" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Credits</h3>
            </div>
            <span className="text-2xl font-bold text-accent">{availableCredits}</span>
          </div>

          {/* Credits Bar */}
          <div className="space-y-2">
            <div className="w-full bg-muted/30 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-accent to-primary h-full transition-all duration-500"
                style={{ width: `${creditsPercentage}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground text-right">{creditsPercentage.toFixed(0)}% Available</p>
          </div>

          {/* Credits Info */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-muted/20 rounded p-2">
              <p className="text-muted-foreground">Total</p>
              <p className="font-bold text-accent">{totalCredits}</p>
            </div>
            <div className="bg-muted/20 rounded p-2">
              <p className="text-muted-foreground">Spent</p>
              <p className="font-bold text-accent">{spentCredits}</p>
            </div>
          </div>

          {/* Today's Earnings */}
          {creditsEarned > 0 && (
            <div className="bg-accent/10 border border-accent/30 rounded p-2 text-center">
              <p className="text-xs text-muted-foreground">Today's Earnings</p>
              <p className="text-lg font-bold text-accent">+{creditsEarned}</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
