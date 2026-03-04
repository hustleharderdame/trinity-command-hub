import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { trpc } from '@/lib/trpc'
import { toast } from 'sonner'

type FlowStage = 'am' | 'midday' | 'pm' | null

interface DailyFlowModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function DailyFlowModal({ isOpen, onClose, onSuccess }: DailyFlowModalProps) {
  const [stage, setStage] = useState<FlowStage>(null)
  const [loading, setLoading] = useState(false)

  // AM START state
  const [faithScore, setFaithScore] = useState(5)
  const [writtenIntent, setWrittenIntent] = useState('')
  const [beastMessage, setBeastMessage] = useState('')
  const [twinMessage, setTwinMessage] = useState('')

  // MIDDAY CHECK state
  const [hustleExecuted, setHustleExecuted] = useState(50)
  const [obstacles, setObstacles] = useState('')
  const [truthReflection, setTruthReflection] = useState('')

  // PM END state
  const [enthusiasmScore, setEnthusiasmScore] = useState(5)
  const [gratitude, setGratitude] = useState('')
  const [worthIt, setWorthIt] = useState<'yes' | 'no' | 'partial'>('yes')
  const [pmReport, setPmReport] = useState('')

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

  // tRPC mutations
  const amStartMutation = trpc.hsDaily.amStart.useMutation()
  const middayMutation = trpc.hsDaily.middayCheck.useMutation()
  const pmEndMutation = trpc.hsDaily.pmEnd.useMutation()

  const handleAmStart = async () => {
    setLoading(true)
    try {
      await amStartMutation.mutateAsync({
        faithScore,
        writtenIntent,
        beastMessage,
        twinMessage,
      })
      toast.success('AM START completed! 🌅')
      setStage(null)
      onSuccess?.()
    } catch (error: any) {
      toast.error(error.message || 'Failed to save AM START')
    } finally {
      setLoading(false)
    }
  }

  const handleMiddayCheck = async () => {
    setLoading(true)
    try {
      await middayMutation.mutateAsync({
        hustleExecuted,
        obstacles: obstacles.split(',').map(o => o.trim()).filter(Boolean),
        truthReflection,
      })
      toast.success('MIDDAY CHECK completed! 🌤️')
      setStage(null)
      onSuccess?.()
    } catch (error: any) {
      toast.error(error.message || 'Failed to save MIDDAY CHECK')
    } finally {
      setLoading(false)
    }
  }

  const handlePmEnd = async () => {
    setLoading(true)
    try {
      await pmEndMutation.mutateAsync({
        enthusiasmScore,
        gratitude,
        worthIt,
        pmReport,
        pillars,
      })
      toast.success('PM END completed! 🌙')
      setStage(null)
      onSuccess?.()
    } catch (error: any) {
      toast.error(error.message || 'Failed to save PM END')
    } finally {
      setLoading(false)
    }
  }

  const handlePillarChange = (key: keyof typeof pillars, value: number) => {
    setPillars(prev => ({ ...prev, [key]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl bg-black/90 border-primary/30">
        {!stage ? (
          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-primary font-orbitron">DAILY FLOW</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-3 gap-4">
              <Button
                onClick={() => setStage('am')}
                className="bg-primary/20 hover:bg-primary/40 text-primary"
              >
                🌅 AM START
              </Button>
              <Button
                onClick={() => setStage('midday')}
                className="bg-secondary/20 hover:bg-secondary/40 text-secondary"
              >
                🌤️ MIDDAY CHECK
              </Button>
              <Button
                onClick={() => setStage('pm')}
                className="bg-accent/20 hover:bg-accent/40 text-accent"
              >
                🌙 PM END
              </Button>
            </div>
          </div>
        ) : stage === 'am' ? (
          <div className="space-y-6">
            <DialogHeader>
              <DialogTitle className="text-primary font-orbitron">🌅 AM START</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Faith Score: {faithScore}</label>
                <Slider
                  value={[faithScore]}
                  onValueChange={([v]) => setFaithScore(v)}
                  min={1}
                  max={10}
                  step={0.5}
                  className="mt-2"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground">Written Intent</label>
                <textarea
                  value={writtenIntent}
                  onChange={(e) => setWrittenIntent(e.target.value)}
                  className="w-full bg-muted/30 border border-primary/20 rounded p-2 text-sm mt-2"
                  rows={3}
                  placeholder="What is your intention for today?"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground">Beast Message</label>
                <input
                  type="text"
                  value={beastMessage}
                  onChange={(e) => setBeastMessage(e.target.value)}
                  className="w-full bg-muted/30 border border-primary/20 rounded p-2 text-sm mt-2"
                  placeholder="Beast's warning or action call..."
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground">Twin Message</label>
                <input
                  type="text"
                  value={twinMessage}
                  onChange={(e) => setTwinMessage(e.target.value)}
                  className="w-full bg-muted/30 border border-primary/20 rounded p-2 text-sm mt-2"
                  placeholder="Twin's clarity or strategy..."
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => setStage(null)} variant="outline">
                Back
              </Button>
              <Button
                onClick={handleAmStart}
                disabled={loading}
                className="bg-primary text-black hover:bg-primary/90"
              >
                {loading ? 'Saving...' : 'Complete AM START'}
              </Button>
            </div>
          </div>
        ) : stage === 'midday' ? (
          <div className="space-y-6">
            <DialogHeader>
              <DialogTitle className="text-secondary font-orbitron">🌤️ MIDDAY CHECK</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Hustle Executed: {hustleExecuted}%</label>
                <Slider
                  value={[hustleExecuted]}
                  onValueChange={([v]) => setHustleExecuted(v)}
                  min={0}
                  max={100}
                  step={5}
                  className="mt-2"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground">Obstacles (comma-separated)</label>
                <input
                  type="text"
                  value={obstacles}
                  onChange={(e) => setObstacles(e.target.value)}
                  className="w-full bg-muted/30 border border-secondary/20 rounded p-2 text-sm mt-2"
                  placeholder="List obstacles you encountered..."
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground">Truth Reflection</label>
                <textarea
                  value={truthReflection}
                  onChange={(e) => setTruthReflection(e.target.value)}
                  className="w-full bg-muted/30 border border-secondary/20 rounded p-2 text-sm mt-2"
                  rows={3}
                  placeholder="What truth are you discovering?"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => setStage(null)} variant="outline">
                Back
              </Button>
              <Button
                onClick={handleMiddayCheck}
                disabled={loading}
                className="bg-secondary text-black hover:bg-secondary/90"
              >
                {loading ? 'Saving...' : 'Complete MIDDAY CHECK'}
              </Button>
            </div>
          </div>
        ) : stage === 'pm' ? (
          <div className="space-y-6 max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-accent font-orbitron">🌙 PM END</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Enthusiasm Score: {enthusiasmScore}</label>
                <Slider
                  value={[enthusiasmScore]}
                  onValueChange={([v]) => setEnthusiasmScore(v)}
                  min={1}
                  max={10}
                  step={0.5}
                  className="mt-2"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground">Gratitude</label>
                <textarea
                  value={gratitude}
                  onChange={(e) => setGratitude(e.target.value)}
                  className="w-full bg-muted/30 border border-accent/20 rounded p-2 text-sm mt-2"
                  rows={2}
                  placeholder="What are you grateful for?"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground">Was it worth it?</label>
                <div className="flex gap-2 mt-2">
                  {(['yes', 'no', 'partial'] as const).map((option) => (
                    <Button
                      key={option}
                      onClick={() => setWorthIt(option)}
                      variant={worthIt === option ? 'default' : 'outline'}
                      className="flex-1"
                    >
                      {option.toUpperCase()}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground">PM Report</label>
                <textarea
                  value={pmReport}
                  onChange={(e) => setPmReport(e.target.value)}
                  className="w-full bg-muted/30 border border-accent/20 rounded p-2 text-sm mt-2"
                  rows={3}
                  placeholder="Summary of your day..."
                />
              </div>

              <div className="space-y-3 border-t border-muted/30 pt-4">
                <h4 className="text-sm font-bold text-accent">10 PILLARS</h4>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(pillars).map(([key, value]) => (
                    <div key={key}>
                      <label className="text-xs text-muted-foreground capitalize">{key}: {value}</label>
                      <Slider
                        value={[value]}
                        onValueChange={([v]) => handlePillarChange(key as keyof typeof pillars, v)}
                        min={0}
                        max={10}
                        step={0.5}
                        className="mt-1"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => setStage(null)} variant="outline">
                Back
              </Button>
              <Button
                onClick={handlePmEnd}
                disabled={loading}
                className="bg-accent text-black hover:bg-accent/90"
              >
                {loading ? 'Saving...' : 'Complete PM END'}
              </Button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
