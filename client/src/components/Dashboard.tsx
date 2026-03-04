import { useState } from 'react'
import { Brain, Heart, Zap, TrendingUp, Gauge, Target } from "lucide-react"
import { trpc } from "@/lib/trpc"
import DailyFlowModal from './DailyFlowModal'
import PillarsDisplay from './PillarsDisplay'
import BatteryCreditsDisplay from './BatteryCreditsDisplay'
import SpiritualAgeDisplay from './SpiritualAgeDisplay'
import { Button } from '@/components/ui/button'

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState<"metrics" | "budget" | "progression" | "pillars" | "spiritual">("metrics")
  const [showDailyFlow, setShowDailyFlow] = useState(false)
  
  // Fetch user progression
  const { data: progression } = trpc.hsProgression.get.useQuery()
  
  // Fetch today's snapshot
  const { data: snapshot } = trpc.hsDaily.getToday.useQuery()

  // Type-safe progression data
  const prog = progression as any || {}
  const snap = snapshot as any || {}

  return (
    <div className="min-h-screen bg-black text-foreground overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-20" />
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-primary/20 backdrop-blur-md bg-black/40">
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="font-orbitron text-4xl font-black text-primary">TRINITY COMMAND HUB</h1>
                <p className="text-xs text-muted-foreground mt-1">HS.OS v13.0 • Consciousness Architecture</p>
              </div>
              <div className="flex gap-4">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">LEVEL</p>
                  <p className="font-orbitron text-3xl font-bold text-primary">{prog?.currentLevel || 1}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">XP</p>
                  <p className="font-orbitron text-3xl font-bold text-secondary">{prog?.totalXP || 0}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">POWER</p>
                  <p className="font-orbitron text-3xl font-bold text-accent">{Math.round(prog?.powerScore || 0)}</p>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 overflow-x-auto">
              {[
                { id: 'metrics', label: '📊 Intelligence Metrics' },
                { id: 'budget', label: '💰 Budget Allocation' },
                { id: 'progression', label: '🎯 Progression' },
                { id: 'pillars', label: '⚡ Pillars' },
                { id: 'spiritual', label: '✨ Spiritual Age' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`px-4 py-2 text-sm font-mono whitespace-nowrap border-b-2 transition-all ${
                    selectedTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Daily Flow Button */}
        <div className="container mx-auto px-4 py-4">
          <Button
            onClick={() => setShowDailyFlow(true)}
            className="bg-gradient-to-r from-primary to-secondary text-black hover:opacity-90 font-bold"
          >
            🚀 Daily Flow
          </Button>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 pb-20">
          {selectedTab === "metrics" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Mind Intelligence */}
              <div className="glass-panel p-6 hover:border-primary/60 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    MIND INTELLIGENCE
                  </h3>
                  <div className="text-2xl font-bold text-primary">
                    {snap?.mindPillar ? parseFloat(snap.mindPillar.toString()).toFixed(1) : "0"}
                  </div>
                </div>
                <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-primary to-secondary h-full transition-all duration-500"
                    style={{
                      width: `${Math.min((parseFloat(snap?.mindPillar?.toString() || "0") / 10) * 100, 100)}%`
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-3 font-mono">
                  Respect • Consistency • Focus
                </p>
              </div>

              {/* Body Intelligence */}
              <div className="glass-panel p-6 hover:border-secondary/60 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-secondary flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    BODY INTELLIGENCE
                  </h3>
                  <div className="text-2xl font-bold text-secondary">
                    {snap?.bodyPillar ? parseFloat(snap.bodyPillar.toString()).toFixed(1) : "0"}
                  </div>
                </div>
                <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-secondary to-accent h-full transition-all duration-500"
                    style={{
                      width: `${Math.min((parseFloat(snap?.bodyPillar?.toString() || "0") / 10) * 100, 100)}%`
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-3 font-mono">
                  Power • Recovery • Vitality
                </p>
              </div>

              {/* Soul Intelligence */}
              <div className="glass-panel p-6 hover:border-accent/60 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-accent flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    SOUL INTELLIGENCE
                  </h3>
                  <div className="text-2xl font-bold text-accent">
                    {snap?.soulPillar ? parseFloat(snap.soulPillar.toString()).toFixed(1) : "0"}
                  </div>
                </div>
                <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-accent to-primary h-full transition-all duration-500"
                    style={{
                      width: `${Math.min((parseFloat(snap?.soulPillar?.toString() || "0") / 10) * 100, 100)}%`
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-3 font-mono">
                  Happiness • Impact • Purpose
                </p>
              </div>
            </div>
          )}

          {selectedTab === "budget" && (
            <div className="glass-panel p-8">
              <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                <Gauge className="w-6 h-6" />
                BUDGET ALLOCATION SYSTEM
              </h2>
              <BatteryCreditsDisplay
                totalBattery={prog?.totalBattery || 0}
                totalCredits={prog?.totalCredits || 0}
                spentCredits={prog?.spentCredits || 0}
                availableCredits={prog?.availableCredits || 0}
                creditsEarned={snap?.creditsEarned || 0}
              />
            </div>
          )}

          {selectedTab === "progression" && (
            <div className="glass-panel p-8">
              <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                <Target className="w-6 h-6" />
                PROGRESSION TRACKER
              </h2>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-mono text-sm">LEVEL {prog?.currentLevel || 1} PROGRESS</span>
                    <span className="text-primary font-bold">{prog?.totalXP || 0}/{prog?.xpToNextLevel || 100}</span>
                  </div>
                  <div className="w-full bg-muted/30 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary to-secondary h-full transition-all duration-500"
                      style={{
                        width: `${Math.min(((prog?.totalXP || 0) / (prog?.xpToNextLevel || 100)) * 100, 100)}%`
                      }}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-panel p-4">
                    <div className="text-xs text-muted-foreground mb-1">LEVEL</div>
                    <div className="text-3xl font-bold text-secondary">{prog?.currentLevel || 1}</div>
                    <div className="text-xs text-secondary mt-2">current</div>
                  </div>
                  <div className="glass-panel p-4">
                    <div className="text-xs text-muted-foreground mb-1">TOTAL XP</div>
                    <div className="text-3xl font-bold text-primary">{prog?.totalXP || 0}</div>
                    <div className="text-xs text-primary mt-2">earned</div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-sm font-mono text-primary mb-3 uppercase tracking-wider">CURRENT STAGE</h3>
                  <div className="glass-panel px-4 py-2">
                    <span className="text-primary font-bold">{prog?.currentStage || "Trap"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === "pillars" && (
            <PillarsDisplay
              pillars={{
                mind: snap?.mindPillar || 0,
                body: snap?.bodyPillar || 0,
                soul: snap?.soulPillar || 0,
                money: snap?.moneyPillar || 0,
                power: snap?.powerPillar || 0,
                respect: snap?.respectPillar || 0,
                consistency: snap?.consistencyPillar || 0,
                happiness: snap?.happinessPillar || 0,
                recovery: snap?.recoveryPillar || 0,
                impact: snap?.impactPillar || 0,
              }}
              degree={snap?.degree || 0}
              shadowAvg={snap?.shadowAvg || 0}
              lightAvg={snap?.lightAvg || 0}
            />
          )}

          {selectedTab === "spiritual" && (
            <SpiritualAgeDisplay
              spiritualAge={prog?.spiritualAge || 0}
              biologicalAge={prog?.biologicalAge || 25}
              lifeCycles={prog?.lifeCycles || 0}
              frictionScore={prog?.frictionScore || 1.0}
              deltaFromBaseline={0}
            />
          )}
        </div>
      </div>

      {/* Daily Flow Modal */}
      <DailyFlowModal
        isOpen={showDailyFlow}
        onClose={() => setShowDailyFlow(false)}
        onSuccess={() => {
          setShowDailyFlow(false)
          // Refresh data
          window.location.reload()
        }}
      />
    </div>
  )
}
