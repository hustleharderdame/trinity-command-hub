import { useState } from 'react'
import { trpc } from '@/lib/trpc'

interface TacticalModeProps {
  progression?: any
  snapshot?: any
}

const PILLARS = [
  { key: 'mind', label: 'MIND', type: 'light', color: '#00c8ff' },
  { key: 'body', label: 'BODY', type: 'shadow', color: '#ff6b35' },
  { key: 'soul', label: 'SOUL', type: 'light', color: '#cc00ff' },
  { key: 'money', label: 'MONEY', type: 'shadow', color: '#00ff96' },
  { key: 'power', label: 'POWER', type: 'shadow', color: '#ff3296' },
  { key: 'respect', label: 'RESPECT', type: 'shadow', color: '#ffd700' },
  { key: 'consistency', label: 'CONSISTENCY', type: 'light', color: '#00c8ff' },
  { key: 'happiness', label: 'HAPPINESS', type: 'light', color: '#ffd700' },
  { key: 'recovery', label: 'RECOVERY', type: 'light', color: '#00ff96' },
  { key: 'impact', label: 'IMPACT', type: 'shadow', color: '#ff6b35' },
]

export default function TacticalMode({ progression, snapshot }: TacticalModeProps) {
  const [missions, setMissions] = useState([
    { id: 1, title: 'Complete morning ritual', completed: false, xp: 10 },
    { id: 2, title: 'Execute top priority task', completed: false, xp: 20 },
    { id: 3, title: 'Update pillar scores', completed: false, xp: 10 },
    { id: 4, title: 'Write PM report', completed: false, xp: 20 },
  ])
  const [pillars, setPillars] = useState<Record<string, number>>({
    mind: 0, body: 0, soul: 0, money: 0, power: 0,
    respect: 0, consistency: 0, happiness: 0, recovery: 0, impact: 0,
  })
  const [showPillars, setShowPillars] = useState(false)
  const [showDailyFlow, setShowDailyFlow] = useState(false)
  const [dailyFlowStep, setDailyFlowStep] = useState<'am' | 'midday' | 'pm'>('am')
  const [faithScore, setFaithScore] = useState(7)
  const [writtenIntent, setWrittenIntent] = useState('')
  const [hustlePercent, setHustlePercent] = useState(50)
  const [enthusiasmScore, setEnthusiasmScore] = useState(7)

  const prog = progression || {}
  const snap = snapshot || {}
  const userLevel = prog?.currentLevel || 1
  const totalXP = prog?.totalXP || 0
  const currentStreak = prog?.currentStreak || 0
  const tierRank = prog?.tierRank || 'BUILDING'
  const powerScore = Number(prog?.powerScore || 0)

  const amStartMutation = trpc.hsDaily.amStart.useMutation()
  const middayCheckMutation = trpc.hsDaily.middayCheck.useMutation()
  const pmEndMutation = trpc.hsDaily.pmEnd.useMutation()

  const toggleMission = (id: number) => {
    setMissions(missions.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m)))
  }

  const completedMissions = missions.filter((m) => m.completed).length
  const earnedXP = missions.filter((m) => m.completed).reduce((sum, m) => sum + m.xp, 0)

  const handleAMStart = async () => {
    try {
      await amStartMutation.mutateAsync({ faithScore, writtenIntent })
      setDailyFlowStep('midday')
    } catch (e) {
      setDailyFlowStep('midday')
    }
  }

  const handleMidday = async () => {
    try {
      await middayCheckMutation.mutateAsync({ hustleExecuted: hustlePercent })
      setDailyFlowStep('pm')
    } catch (e) {
      setDailyFlowStep('pm')
    }
  }

  const handlePMEnd = async () => {
    try {
      await pmEndMutation.mutateAsync({
        enthusiasmScore,
        pillars: {
          mind: pillars.mind, body: pillars.body, soul: pillars.soul,
          money: pillars.money, power: pillars.power, respect: pillars.respect,
          consistency: pillars.consistency, happiness: pillars.happiness,
          recovery: pillars.recovery, impact: pillars.impact,
        },
      })
    } catch (e) {}
    setShowDailyFlow(false)
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'GOD MODE': return '#ffd700'
      case 'ASCENDING': return '#00c8ff'
      case 'SOLID': return '#00ff96'
      case 'BUILDING': return '#ff6b35'
      default: return '#888'
    }
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #020a04 0%, #030c05 50%, #020804 100%)',
      }}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,0,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,0,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Corner brackets */}
      <div className="absolute inset-3 pointer-events-none hidden sm:block">
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-green-500/50" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-green-500/50" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-green-500/50" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-green-500/50" />
      </div>

      {/* Scan line */}
      <div
        className="absolute left-0 right-0 h-px opacity-20 pointer-events-none"
        style={{
          background: 'rgba(0,255,0,0.5)',
          animation: 'scanLine 4s linear infinite',
          top: '0',
        }}
      />

      {/* Content */}
      <div className="relative z-10 p-4 sm:p-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6 border-b border-green-500/30 pb-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-mono text-green-500/50 tracking-[0.3em] mb-1">EXECUTION TABLET</div>
              <h1
                className="text-2xl sm:text-3xl font-black text-green-400"
                style={{
                  fontFamily: 'Courier New, monospace',
                  letterSpacing: '3px',
                  textShadow: '0 0 15px rgba(0,255,0,0.4)',
                }}
              >
                TACTICAL MODE
              </h1>
            </div>
            <div
              className="text-right px-3 py-1 rounded border"
              style={{
                borderColor: `${getTierColor(tierRank)}60`,
                background: `${getTierColor(tierRank)}10`,
              }}
            >
              <div className="text-xs font-mono text-gray-500">TIER</div>
              <div className="text-sm font-bold" style={{ color: getTierColor(tierRank) }}>{tierRank}</div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'LEVEL', value: userLevel, color: '#00ff96' },
            { label: 'STREAK', value: `${currentStreak}d`, color: '#ff6b35' },
            { label: 'POWER', value: Math.round(powerScore), color: '#ffd700' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="border p-3 text-center"
              style={{
                borderColor: `${stat.color}30`,
                background: `${stat.color}05`,
              }}
            >
              <div className="text-xs font-mono text-gray-500 mb-1">{stat.label}</div>
              <div className="text-lg font-black font-mono" style={{ color: stat.color }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Daily Flow Button */}
        <button
          onClick={() => setShowDailyFlow(true)}
          className="w-full py-3 mb-6 font-mono font-bold text-sm border-2 transition-all hover:bg-green-500/10"
          style={{
            borderColor: 'rgba(0,255,0,0.5)',
            color: '#00ff00',
            textShadow: '0 0 10px rgba(0,255,0,0.5)',
            boxShadow: '0 0 15px rgba(0,255,0,0.1)',
          }}
        >
          ▶ DAILY FLOW RITUAL
        </button>

        {/* Missions */}
        <div
          className="border p-4 mb-4"
          style={{ borderColor: 'rgba(0,255,0,0.2)', background: 'rgba(0,255,0,0.03)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-mono font-bold text-green-500 tracking-widest">✓ MISSIONS</h2>
            <span className="text-xs font-mono text-green-500/50">{completedMissions}/{missions.length} · +{earnedXP} XP</span>
          </div>
          <div className="space-y-2">
            {missions.map((mission) => (
              <div
                key={mission.id}
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => toggleMission(mission.id)}
              >
                <div
                  className="w-4 h-4 border flex items-center justify-center flex-shrink-0 transition-all"
                  style={{
                    borderColor: mission.completed ? '#00ff00' : 'rgba(0,255,0,0.3)',
                    background: mission.completed ? 'rgba(0,255,0,0.2)' : 'transparent',
                  }}
                >
                  {mission.completed && <span className="text-green-400 text-xs">✓</span>}
                </div>
                <span
                  className="text-xs font-mono flex-1 transition-all"
                  style={{
                    color: mission.completed ? 'rgba(0,255,0,0.3)' : '#00cc00',
                    textDecoration: mission.completed ? 'line-through' : 'none',
                  }}
                >
                  {mission.title}
                </span>
                <span className="text-xs font-mono text-green-500/40">+{mission.xp}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pillars toggle */}
        <button
          onClick={() => setShowPillars(!showPillars)}
          className="w-full py-2 mb-2 font-mono text-xs border transition-all"
          style={{
            borderColor: 'rgba(0,255,0,0.2)',
            color: '#00cc00',
            background: showPillars ? 'rgba(0,255,0,0.05)' : 'transparent',
          }}
        >
          {showPillars ? '▼' : '▶'} 10 PILLARS TRACKER
        </button>

        {showPillars && (
          <div
            className="border p-4 mb-4"
            style={{ borderColor: 'rgba(0,255,0,0.2)', background: 'rgba(0,255,0,0.02)' }}
          >
            <div className="space-y-3">
              {PILLARS.map((pillar) => (
                <div key={pillar.key}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs font-mono"
                        style={{ color: pillar.color }}
                      >
                        {pillar.label}
                      </span>
                      <span className="text-xs text-gray-600">
                        [{pillar.type === 'light' ? 'LIGHT' : 'SHADOW'}]
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold" style={{ color: pillar.color }}>
                      {pillars[pillar.key]}/10
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={pillars[pillar.key]}
                    onChange={(e) => setPillars({ ...pillars, [pillar.key]: Number(e.target.value) })}
                    className="w-full h-1 appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(90deg, ${pillar.color} ${pillars[pillar.key] * 10}%, rgba(100,100,100,0.2) ${pillars[pillar.key] * 10}%)`,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Power formula display */}
        <div
          className="border p-3 text-center"
          style={{ borderColor: 'rgba(0,255,0,0.15)', background: 'rgba(0,0,0,0.5)' }}
        >
          <div className="text-xs font-mono text-gray-600 mb-1">POWER FORMULA</div>
          <div className="text-xs font-mono text-green-500/60">
            P(t) = (Hustle² + Faith²)^Love × Heaven × Legacy
          </div>
        </div>
      </div>

      {/* ─── Daily Flow Modal ─── */}
      {showDailyFlow && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(10px)' }}
        >
          <div
            className="w-full max-w-md border-2 p-6"
            style={{
              borderColor: 'rgba(0,255,0,0.5)',
              background: '#020a04',
              boxShadow: '0 0 50px rgba(0,255,0,0.2)',
            }}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-xs font-mono text-green-500/50 tracking-widest">
                  {dailyFlowStep === 'am' ? 'MORNING' : dailyFlowStep === 'midday' ? 'MIDDAY' : 'EVENING'}
                </div>
                <h3 className="text-lg font-bold font-mono text-green-400">
                  {dailyFlowStep === 'am' ? 'AM START' : dailyFlowStep === 'midday' ? 'MIDDAY CHECK' : 'PM END'}
                </h3>
              </div>
              <button onClick={() => setShowDailyFlow(false)} className="text-green-500/50 hover:text-green-400 text-xl">✕</button>
            </div>

            {/* Step tabs */}
            <div className="flex gap-2 mb-6">
              {(['am', 'midday', 'pm'] as const).map((step) => (
                <div
                  key={step}
                  className="flex-1 h-1 rounded-full transition-all"
                  style={{
                    background: step === dailyFlowStep ? '#00ff00' : step < dailyFlowStep ? 'rgba(0,255,0,0.4)' : 'rgba(0,255,0,0.1)',
                  }}
                />
              ))}
            </div>

            {/* AM START */}
            {dailyFlowStep === 'am' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-mono text-green-500/70 block mb-2">FAITH SCORE (1-10)</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range" min="1" max="10" value={faithScore}
                      onChange={(e) => setFaithScore(Number(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-lg font-bold font-mono text-green-400 w-8">{faithScore}</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-mono text-green-500/70 block mb-2">WRITTEN INTENT</label>
                  <textarea
                    value={writtenIntent}
                    onChange={(e) => setWrittenIntent(e.target.value)}
                    placeholder="What is your intention for today?"
                    className="w-full h-24 p-3 text-xs font-mono outline-none resize-none"
                    style={{
                      background: 'rgba(0,255,0,0.05)',
                      border: '1px solid rgba(0,255,0,0.2)',
                      color: '#00cc00',
                    }}
                  />
                </div>
                <button
                  onClick={handleAMStart}
                  className="w-full py-3 font-mono font-bold text-sm border-2 transition-all hover:bg-green-500/10"
                  style={{ borderColor: '#00ff00', color: '#00ff00' }}
                >
                  IGNITE THE DAY (+10 XP) →
                </button>
              </div>
            )}

            {/* MIDDAY CHECK */}
            {dailyFlowStep === 'midday' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-mono text-green-500/70 block mb-2">HUSTLE EXECUTION %</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range" min="0" max="100" value={hustlePercent}
                      onChange={(e) => setHustlePercent(Number(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-lg font-bold font-mono text-green-400 w-12">{hustlePercent}%</span>
                  </div>
                  <div className="h-2 bg-black border border-green-500/30 mt-2 overflow-hidden">
                    <div
                      className="h-full bg-green-500/70 transition-all"
                      style={{ width: `${hustlePercent}%` }}
                    />
                  </div>
                </div>
                <button
                  onClick={handleMidday}
                  className="w-full py-3 font-mono font-bold text-sm border-2 transition-all hover:bg-green-500/10"
                  style={{ borderColor: '#00ff00', color: '#00ff00' }}
                >
                  LOG MIDDAY CHECK →
                </button>
              </div>
            )}

            {/* PM END */}
            {dailyFlowStep === 'pm' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-mono text-green-500/70 block mb-2">ENTHUSIASM SCORE (1-10)</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range" min="1" max="10" value={enthusiasmScore}
                      onChange={(e) => setEnthusiasmScore(Number(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-lg font-bold font-mono text-green-400 w-8">{enthusiasmScore}</span>
                  </div>
                </div>
                <p className="text-xs font-mono text-green-500/50">
                  Update your pillar scores in the Pillars Tracker before submitting.
                </p>
                <button
                  onClick={handlePMEnd}
                  className="w-full py-3 font-mono font-bold text-sm border-2 transition-all hover:bg-green-500/10"
                  style={{ borderColor: '#00ff00', color: '#00ff00' }}
                >
                  COMPLETE DAY (+20 XP) →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes scanLine {
          0% { top: 0%; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  )
}
