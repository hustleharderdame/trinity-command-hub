import { useState, useEffect } from "react"
import { Brain, Heart, Zap, TrendingUp, Gauge, Target } from "lucide-react"
import { trpc } from "@/lib/trpc"

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState<"metrics" | "budget" | "progression">("metrics")
  
  // Fetch user progression
  const { data: progression } = trpc.hs.getProgression.useQuery()
  
  // Fetch modules
  const { data: modules } = trpc.hs.getModules.useQuery()

  // Type-safe progression data
  const prog = progression as any || {}
  const mods = modules as any || {}

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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold neon-glow">TRINITY COMMAND HUB</h1>
                <p className="text-secondary text-sm mt-2 font-mono">v13.0 • Consciousness Architecture</p>
              </div>
              
              {/* Quick stats */}
              <div className="flex gap-6">
                <div className="glass-panel p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{prog?.currentLevel || 1}</div>
                  <div className="text-xs text-muted-foreground mt-1">LEVEL</div>
                </div>
                <div className="glass-panel p-4 text-center">
                  <div className="text-2xl font-bold text-secondary">{prog?.totalXP || 0}</div>
                  <div className="text-xs text-muted-foreground mt-1">XP</div>
                </div>
                <div className="glass-panel p-4 text-center">
                  <div className="text-2xl font-bold text-accent">{prog?.powerScore || 0}</div>
                  <div className="text-xs text-muted-foreground mt-1">POWER</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation tabs */}
        <div className="border-b border-primary/20 backdrop-blur-md bg-black/40 sticky top-0 z-20">
          <div className="container mx-auto px-4">
            <div className="flex gap-8">
              {(["metrics", "budget", "progression"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`py-4 px-2 border-b-2 transition-all font-mono text-sm uppercase tracking-wider ${
                    selectedTab === tab
                      ? "border-primary text-primary neon-glow"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab === "metrics" && "Intelligence Metrics"}
                  {tab === "budget" && "Budget Allocation"}
                  {tab === "progression" && "Progression Tracker"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="container mx-auto px-4 py-8">
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
                    {mods?.hl1_clarity ? parseFloat(mods.hl1_clarity.toString()).toFixed(1) : "0"}
                  </div>
                </div>
                <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-primary to-secondary h-full transition-all duration-500"
                    style={{
                      width: `${Math.min((parseFloat(mods?.hl1_clarity?.toString() || "0") / 100) * 100, 100)}%`
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
                    {mods?.hl3_energy ? parseFloat(mods.hl3_energy.toString()).toFixed(1) : "0"}
                  </div>
                </div>
                <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-secondary to-accent h-full transition-all duration-500"
                    style={{
                      width: `${Math.min((parseFloat(mods?.hl3_energy?.toString() || "0") / 100) * 100, 100)}%`
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
                    {mods?.hl2_faith ? parseFloat(mods.hl2_faith.toString()).toFixed(1) : "0"}
                  </div>
                </div>
                <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-accent to-primary h-full transition-all duration-500"
                    style={{
                      width: `${Math.min((parseFloat(mods?.hl2_faith?.toString() || "0") / 100) * 100, 100)}%`
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
              <p className="text-muted-foreground">Budget allocation interface coming soon...</p>
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
                  <div className="glass-panel-cyan p-4">
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
        </div>
      </div>
    </div>
  )
}
