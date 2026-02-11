import { useState } from "react"
import { trpc } from "@/lib/trpc"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

interface DailyMetricsFormProps {
  onSuccess?: () => void
}

export default function DailyMetricsForm({ onSuccess }: DailyMetricsFormProps) {
  const [faithScore, setFaithScore] = useState(5)
  const [hustlePercentage, setHustlePercentage] = useState(50)
  const [loveScore, setLoveScore] = useState(5)
  
  const [pillars, setPillars] = useState({
    mind: 5,
    body: 5,
    soul: 5,
    money: 5,
    power: 5,
    respect: 5,
    consistency: 5,
    happiness: 5,
    recovery: 5,
    impact: 5,
  })

  const saveMutation = trpc.hs.updateModules.useMutation({
    onSuccess: (data: any) => {
      toast.success("Daily metrics saved! 🚀")
      onSuccess?.()
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to save metrics")
    },
  })

  const handlePillarChange = (key: keyof typeof pillars, value: number) => {
    setPillars(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await saveMutation.mutateAsync({
      hl2_faith: faithScore,
      hl1_clarity: hustlePercentage,
      hl2_meditation: loveScore,
      hl3_energy: pillars.body,
      hl1_habits: pillars.consistency,
      hl6_momentum: pillars.power,
      hl5_relationships: pillars.respect,
      hl3_sleep: pillars.recovery,
      hl9_impact: pillars.impact,
      hl12_flow: pillars.happiness,
    } as any)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Core Metrics */}
      <div className="glass-panel p-6">
        <h3 className="text-lg font-bold text-primary mb-6">CORE METRICS</h3>
        
        <div className="space-y-4">
          {/* Faith Score */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-mono text-foreground">FAITH SCORE</label>
              <span className="text-primary font-bold">{faithScore}/10</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={faithScore}
              onChange={(e) => setFaithScore(Number(e.target.value))}
              className="slider-neon w-full"
            />
          </div>

          {/* Hustle Percentage */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-mono text-foreground">HUSTLE PERCENTAGE</label>
              <span className="text-secondary font-bold">{hustlePercentage}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={hustlePercentage}
              onChange={(e) => setHustlePercentage(Number(e.target.value))}
              className="slider-neon w-full"
            />
          </div>

          {/* Love Score */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-mono text-foreground">LOVE SCORE</label>
              <span className="text-accent font-bold">{loveScore}/10</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={loveScore}
              onChange={(e) => setLoveScore(Number(e.target.value))}
              className="slider-neon w-full"
            />
          </div>
        </div>
      </div>

      {/* Pillar Metrics */}
      <div className="glass-panel p-6">
        <h3 className="text-lg font-bold text-primary mb-6">PILLAR RATINGS</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(pillars).map(([key, value]) => (
            <div key={key}>
              <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider block mb-2">
                {key}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={value}
                  onChange={(e) => handlePillarChange(key as keyof typeof pillars, Number(e.target.value))}
                  className="slider-neon flex-1"
                />
                <span className="text-primary font-bold text-sm w-6 text-right">{value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={saveMutation.isPending}
          className="btn-neon flex-1"
        >
          {saveMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              CALCULATING...
            </>
          ) : (
            "SAVE & CALCULATE"
          )}
        </Button>
      </div>
    </form>
  )
}
