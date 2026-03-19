import { useState, useEffect } from 'react'
import { trpc } from '@/lib/trpc'
import { WEALTH_STAGES, calculateWealthLevel, getBeastEvolution, WEALTH_TIMELINE } from '../../../shared/wealthConstants'

const formatCurrency = (n: number) => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
  return `$${n.toLocaleString()}`
}

export default function WealthProgression() {
  const { data: progress, isLoading, refetch } = trpc.wealth.getProgress.useQuery()
  const updateMutation = trpc.wealth.updateNetWorth.useMutation({
    onSuccess: () => refetch(),
  })

  const [inputValue, setInputValue] = useState('')
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [levelUpData, setLevelUpData] = useState<{ level: number; stageName: string } | null>(null)
  const [selectedStage, setSelectedStage] = useState<number | null>(null)
  const [showAllMilestones, setShowAllMilestones] = useState(false)

  const netWorth = progress?.netWorth ?? 0
  const currentStage = progress?.stage ?? WEALTH_STAGES[0]
  const stageProgress = progress?.stageProgress ?? 0
  const beastEvolution = progress?.beastEvolution ?? getBeastEvolution(0)
  const currentLevel = progress?.level ?? 0

  // Pre-fill input with current value
  useEffect(() => {
    if (progress && inputValue === '') {
      setInputValue(progress.netWorth > 0 ? String(progress.netWorth) : '')
    }
  }, [progress])

  const handleUpdate = async () => {
    const val = parseFloat(inputValue.replace(/[,$]/g, ''))
    if (isNaN(val) || val < 0) return

    const prevLevel = currentLevel
    const result = await updateMutation.mutateAsync({ netWorth: val })

    // Trigger level-up animation if stage changed
    if (result.level > prevLevel && result.stage.id > currentStage.id) {
      setLevelUpData({ level: result.level, stageName: result.stage.name })
      setShowLevelUp(true)
      setTimeout(() => setShowLevelUp(false), 5000)
    }
  }

  const totalProgress = Math.min(100, (netWorth / 1_000_000) * 100)

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 50% 0%, rgba(255,215,0,0.06) 0%, transparent 50%),
            radial-gradient(ellipse at 0% 100%, rgba(255,50,150,0.04) 0%, transparent 40%),
            radial-gradient(ellipse at 100% 100%, rgba(0,200,255,0.04) 0%, transparent 40%),
            linear-gradient(180deg, #020008 0%, #050015 50%, #020008 100%)
          `,
        }}
      />

      {/* Scan line overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
        }}
      />

      {/* Level-Up Cinematic Overlay */}
      {showLevelUp && levelUpData && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(10px)' }}
        >
          <div className="text-center" style={{ animation: 'levelUpPulse 0.5s ease-out' }}>
            <div className="text-8xl mb-4" style={{ animation: 'spin 1s ease-out' }}>⭐</div>
            <div
              className="text-5xl font-black mb-2"
              style={{
                fontFamily: 'Georgia, serif',
                color: '#ffd700',
                textShadow: '0 0 40px rgba(255,215,0,0.8), 0 0 80px rgba(255,215,0,0.4)',
                animation: 'levelUpText 0.6s ease-out',
              }}
            >
              LEVEL {levelUpData.level}
            </div>
            <div className="text-2xl font-bold mb-4" style={{ color: '#ff3296' }}>
              STAGE UNLOCKED
            </div>
            <div
              className="text-4xl font-black tracking-widest"
              style={{
                color: '#fff',
                textShadow: '0 0 20px rgba(255,255,255,0.6)',
                letterSpacing: '0.3em',
              }}
            >
              {levelUpData.stageName}
            </div>
            <div className="text-gray-400 mt-4 text-sm">Tap anywhere to continue</div>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-xs font-mono tracking-widest mb-2" style={{ color: 'rgba(255,215,0,0.6)' }}>
            TRINITY HLB — WEALTH PROGRESSION SYSTEM
          </div>
          <h1
            className="text-4xl font-black mb-2"
            style={{
              fontFamily: 'Georgia, serif',
              background: 'linear-gradient(135deg, #ffd700 0%, #ff9500 50%, #ff3296 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: 'none',
            }}
          >
            FROM PURGATORY TO HEAVEN
          </h1>
          <p className="text-gray-400 text-sm">$0 → $1,000,000 · 200 Levels · Your Journey to Millionaire</p>
        </div>

        {/* Current Status Card */}
        <div
          className="rounded-2xl border p-6 mb-8"
          style={{
            borderColor: currentStage.glowColor.replace('0.4', '0.5'),
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(20px)',
            boxShadow: `0 0 40px ${currentStage.glowColor}`,
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Net Worth */}
            <div className="text-center">
              <div className="text-xs font-mono tracking-widest mb-1" style={{ color: 'rgba(255,215,0,0.6)' }}>
                CURRENT NET WORTH
              </div>
              <div
                className="text-4xl font-black"
                style={{ color: '#ffd700', textShadow: '0 0 20px rgba(255,215,0,0.5)' }}
              >
                {formatCurrency(netWorth)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {((netWorth / 1_000_000) * 100).toFixed(2)}% to $1M
              </div>
            </div>

            {/* Current Stage */}
            <div className="text-center">
              <div className="text-xs font-mono tracking-widest mb-1" style={{ color: 'rgba(255,215,0,0.6)' }}>
                CURRENT STAGE
              </div>
              <div
                className="text-3xl font-black mb-1"
                style={{ color: currentStage.color, textShadow: `0 0 20px ${currentStage.glowColor}` }}
              >
                {currentStage.icon} {currentStage.name}
              </div>
              <div className="text-xs text-gray-400">{currentStage.subtitle}</div>
              <div className="text-xs font-mono mt-1" style={{ color: currentStage.color }}>
                LEVEL {currentLevel} · {stageProgress.toFixed(0)}% stage complete
              </div>
            </div>

            {/* Soul Beast */}
            <div className="text-center">
              <div className="text-xs font-mono tracking-widest mb-1" style={{ color: 'rgba(255,215,0,0.6)' }}>
                SOUL BEAST EVOLUTION
              </div>
              <div
                className="text-xl font-black mb-1"
                style={{ color: beastEvolution.color, textShadow: `0 0 15px ${beastEvolution.color}` }}
              >
                {beastEvolution.name}
              </div>
              <div className="text-xs text-gray-400 mb-2">{beastEvolution.description}</div>
              {/* Beast evolution bar */}
              <div className="w-full h-2 rounded-full bg-gray-800 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${beastEvolution.percent}%`,
                    background: `linear-gradient(90deg, ${beastEvolution.color}, ${beastEvolution.color}88)`,
                    boxShadow: `0 0 8px ${beastEvolution.color}`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Overall Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>PURGATORY ($0)</span>
              <span className="font-mono" style={{ color: '#ffd700' }}>{totalProgress.toFixed(3)}% to FINAL HEAVEN</span>
              <span>FINAL HEAVEN ($1M)</span>
            </div>
            <div className="w-full h-4 rounded-full bg-gray-900 overflow-hidden border border-gray-700">
              <div
                className="h-full rounded-full transition-all duration-1000 relative"
                style={{
                  width: `${Math.max(0.5, totalProgress)}%`,
                  background: 'linear-gradient(90deg, #ff6b35, #ffd700, #ff3296, #9b59b6)',
                  boxShadow: '0 0 12px rgba(255,215,0,0.5)',
                }}
              >
                {totalProgress > 5 && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-black">
                    {formatCurrency(netWorth)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Net Worth Input */}
        <div
          className="rounded-2xl border p-6 mb-8"
          style={{
            borderColor: 'rgba(255,215,0,0.3)',
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div className="text-sm font-mono tracking-widest mb-4" style={{ color: 'rgba(255,215,0,0.6)' }}>
            UPDATE YOUR NET WORTH
          </div>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
                placeholder="Enter your current net worth..."
                className="w-full pl-8 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: 'rgba(255,215,0,0.05)',
                  border: '1px solid rgba(255,215,0,0.3)',
                  color: '#ffd700',
                }}
                min="0"
                step="100"
              />
            </div>
            <button
              onClick={handleUpdate}
              disabled={updateMutation.isPending}
              className="px-6 py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,150,0,0.2))',
                border: '1px solid rgba(255,215,0,0.5)',
                color: '#ffd700',
                boxShadow: '0 0 20px rgba(255,215,0,0.15)',
              }}
            >
              {updateMutation.isPending ? 'UPDATING...' : 'UPDATE LEVEL'}
            </button>
          </div>
          {progress?.nextMilestone && (
            <div className="mt-3 text-xs text-gray-500">
              Next milestone:{' '}
              <span style={{ color: currentStage.color }}>
                {progress.nextMilestone.name}
              </span>{' '}
              at {formatCurrency(progress.nextMilestone.netWorth)} (
              {formatCurrency(Math.max(0, progress.nextMilestone.netWorth - netWorth))} away)
            </div>
          )}
        </div>

        {/* 10-Stage Map */}
        <div className="mb-8">
          <div className="text-sm font-mono tracking-widest mb-4" style={{ color: 'rgba(255,215,0,0.6)' }}>
            THE 200-LEVEL JOURNEY MAP
          </div>
          <div className="grid grid-cols-1 gap-3">
            {WEALTH_STAGES.map((stage, idx) => {
              const isCurrentStage = stage.id === currentStage.id
              const isPastStage = netWorth >= stage.netWorthRange[1] && stage.id !== 0
              const isFutureStage = stage.id > currentStage.id && stage.id !== 0
              const stageNetWorth = netWorth >= stage.netWorthRange[0] ? Math.min(netWorth, stage.netWorthRange[1]) : 0
              const stagePercent = stage.netWorthRange[1] > stage.netWorthRange[0]
                ? Math.min(100, ((stageNetWorth - stage.netWorthRange[0]) / (stage.netWorthRange[1] - stage.netWorthRange[0])) * 100)
                : 0

              return (
                <div
                  key={stage.id}
                  className="rounded-xl border transition-all cursor-pointer"
                  style={{
                    borderColor: isCurrentStage
                      ? stage.color
                      : isPastStage
                      ? `${stage.color}66`
                      : 'rgba(255,255,255,0.08)',
                    background: isCurrentStage
                      ? `rgba(0,0,0,0.8)`
                      : isPastStage
                      ? 'rgba(0,0,0,0.5)'
                      : 'rgba(0,0,0,0.3)',
                    boxShadow: isCurrentStage ? `0 0 20px ${stage.glowColor}` : 'none',
                    opacity: isFutureStage ? 0.5 : 1,
                  }}
                  onClick={() => setSelectedStage(selectedStage === stage.id ? null : stage.id)}
                >
                  <div className="p-4 flex items-center gap-4">
                    {/* Stage icon */}
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                      style={{
                        background: isPastStage || isCurrentStage
                          ? `radial-gradient(circle, ${stage.glowColor} 0%, transparent 70%)`
                          : 'rgba(255,255,255,0.05)',
                        border: `2px solid ${isCurrentStage ? stage.color : isPastStage ? `${stage.color}66` : 'rgba(255,255,255,0.1)'}`,
                      }}
                    >
                      {isPastStage ? '✅' : stage.icon}
                    </div>

                    {/* Stage info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="font-black text-sm"
                          style={{ color: isCurrentStage ? stage.color : isPastStage ? `${stage.color}cc` : '#888' }}
                        >
                          {stage.name}
                        </span>
                        {isCurrentStage && (
                          <span
                            className="text-xs px-2 py-0.5 rounded-full font-mono"
                            style={{
                              background: `${stage.glowColor}`,
                              color: stage.color,
                              border: `1px solid ${stage.color}`,
                            }}
                          >
                            CURRENT
                          </span>
                        )}
                        {isPastStage && (
                          <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-green-900/30 text-green-400 border border-green-500/30">
                            COMPLETE
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mb-2 truncate">{stage.subtitle}</div>

                      {/* Stage progress bar */}
                      {stage.id !== 0 && (
                        <div className="w-full h-1.5 rounded-full bg-gray-800 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-1000"
                            style={{
                              width: `${isPastStage ? 100 : isCurrentStage ? stageProgress : 0}%`,
                              background: stage.color,
                              boxShadow: isCurrentStage ? `0 0 6px ${stage.color}` : 'none',
                            }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Net worth range */}
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs font-mono" style={{ color: isCurrentStage ? stage.color : '#555' }}>
                        {stage.id === 0 ? '$0' : `${formatCurrency(stage.netWorthRange[0])} → ${formatCurrency(stage.netWorthRange[1])}`}
                      </div>
                      {stage.id !== 0 && (
                        <div className="text-xs text-gray-600 mt-0.5">
                          L{stage.levelRange[0]}-{stage.levelRange[1]}
                        </div>
                      )}
                    </div>

                    {/* Expand arrow */}
                    <div className="text-gray-600 flex-shrink-0">
                      {selectedStage === stage.id ? '▲' : '▼'}
                    </div>
                  </div>

                  {/* Expanded milestones */}
                  {selectedStage === stage.id && (
                    <div
                      className="border-t px-4 pb-4"
                      style={{ borderColor: 'rgba(255,255,255,0.08)' }}
                    >
                      <div className="text-xs font-mono tracking-widest mt-3 mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>
                        KEY MILESTONES
                      </div>
                      <div className="space-y-2">
                        {stage.keyMilestones.map((m, mi) => {
                          const isAchieved = netWorth >= m.netWorth
                          return (
                            <div
                              key={mi}
                              className="flex items-start gap-3 p-2 rounded-lg"
                              style={{
                                background: isAchieved ? `${stage.glowColor.replace('0.4', '0.1')}` : 'rgba(255,255,255,0.02)',
                                border: m.isGate ? `1px solid ${stage.color}44` : '1px solid transparent',
                              }}
                            >
                              <div
                                className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5"
                                style={{
                                  background: isAchieved ? stage.color : 'rgba(255,255,255,0.1)',
                                  color: isAchieved ? '#000' : '#666',
                                }}
                              >
                                {isAchieved ? '✓' : m.isGate ? '⭐' : '○'}
                              </div>
                              <div className="flex-1">
                                <div
                                  className="text-xs font-bold"
                                  style={{ color: isAchieved ? stage.color : '#888' }}
                                >
                                  L{m.level} — {m.name}
                                </div>
                                <div className="text-xs text-gray-600 mt-0.5">{m.description}</div>
                              </div>
                              <div
                                className="text-xs font-mono flex-shrink-0"
                                style={{ color: isAchieved ? stage.color : '#555' }}
                              >
                                {formatCurrency(m.netWorth)}
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      {/* Stage goal */}
                      <div
                        className="mt-3 p-3 rounded-lg text-xs"
                        style={{
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.06)',
                        }}
                      >
                        <span className="text-gray-500">Primary Goal: </span>
                        <span className="text-gray-300">{stage.primaryGoal}</span>
                      </div>

                      {/* Beast evolution for this stage */}
                      <div
                        className="mt-2 p-3 rounded-lg text-xs flex items-center gap-2"
                        style={{
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.06)',
                        }}
                      >
                        <span className="text-gray-500">Beast Evolution: </span>
                        <span style={{ color: stage.color }}>{stage.beastEvolution}</span>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Timeline */}
        <div
          className="rounded-2xl border p-6 mb-8"
          style={{
            borderColor: 'rgba(255,215,0,0.2)',
            background: 'rgba(0,0,0,0.5)',
          }}
        >
          <div className="text-sm font-mono tracking-widest mb-4" style={{ color: 'rgba(255,215,0,0.6)' }}>
            ESTIMATED TIMELINE TO $1M
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'AGGRESSIVE', value: WEALTH_TIMELINE.aggressive, color: '#ff3296', desc: 'Full commitment' },
              { label: 'MODERATE', value: WEALTH_TIMELINE.moderate, color: '#ffd700', desc: 'Balanced approach' },
              { label: 'CONSERVATIVE', value: WEALTH_TIMELINE.conservative, color: '#00c8ff', desc: 'Traditional path' },
            ].map((t) => (
              <div
                key={t.label}
                className="p-4 rounded-xl text-center"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${t.color}33`,
                }}
              >
                <div className="text-xs font-mono mb-1" style={{ color: t.color }}>
                  {t.label}
                </div>
                <div className="text-lg font-black mb-1" style={{ color: '#fff' }}>
                  {t.value.split('(')[0].trim()}
                </div>
                <div className="text-xs text-gray-500">{t.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Level 100 and Level 200 Heaven Gates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* First Heaven */}
          <div
            className="rounded-2xl border p-6 text-center"
            style={{
              borderColor: netWorth >= 100000 ? 'rgba(255,50,150,0.6)' : 'rgba(255,50,150,0.2)',
              background: netWorth >= 100000 ? 'rgba(255,50,150,0.08)' : 'rgba(0,0,0,0.5)',
              boxShadow: netWorth >= 100000 ? '0 0 30px rgba(255,50,150,0.2)' : 'none',
            }}
          >
            <div className="text-4xl mb-2">{netWorth >= 100000 ? '⭐' : '🔒'}</div>
            <div
              className="text-xl font-black mb-1"
              style={{ color: netWorth >= 100000 ? '#ff3296' : '#666' }}
            >
              FIRST HEAVEN
            </div>
            <div className="text-sm text-gray-400 mb-2">Level 100 · $100,000 Net Worth</div>
            {netWorth >= 100000 ? (
              <div className="text-xs text-green-400 font-mono">✅ ACHIEVED — THE TRAP IS BREAKING</div>
            ) : (
              <div className="text-xs text-gray-600 font-mono">
                {formatCurrency(Math.max(0, 100000 - netWorth))} remaining
              </div>
            )}
          </div>

          {/* Final Heaven */}
          <div
            className="rounded-2xl border p-6 text-center"
            style={{
              borderColor: netWorth >= 1000000 ? 'rgba(255,215,0,0.8)' : 'rgba(255,215,0,0.2)',
              background: netWorth >= 1000000 ? 'rgba(255,215,0,0.08)' : 'rgba(0,0,0,0.5)',
              boxShadow: netWorth >= 1000000 ? '0 0 50px rgba(255,215,0,0.3)' : 'none',
            }}
          >
            <div className="text-4xl mb-2">{netWorth >= 1000000 ? '⭐⭐' : '🔒'}</div>
            <div
              className="text-xl font-black mb-1"
              style={{ color: netWorth >= 1000000 ? '#ffd700' : '#666' }}
            >
              FINAL HEAVEN
            </div>
            <div className="text-sm text-gray-400 mb-2">Level 200 · $1,000,000 Net Worth</div>
            {netWorth >= 1000000 ? (
              <div className="text-xs text-yellow-400 font-mono">⭐⭐ MILLIONAIRE — THE TRAP IS BROKEN FOREVER</div>
            ) : (
              <div className="text-xs text-gray-600 font-mono">
                {formatCurrency(Math.max(0, 1000000 - netWorth))} remaining
              </div>
            )}
          </div>
        </div>

        {/* Power Formula */}
        <div
          className="rounded-2xl border p-6 text-center"
          style={{
            borderColor: 'rgba(255,215,0,0.15)',
            background: 'rgba(0,0,0,0.4)',
          }}
        >
          <div className="text-xs font-mono tracking-widest mb-3" style={{ color: 'rgba(255,215,0,0.4)' }}>
            THE FORMULA
          </div>
          <div
            className="text-2xl font-black"
            style={{
              fontFamily: 'Georgia, serif',
              color: '#ffd700',
              textShadow: '0 0 20px rgba(255,215,0,0.3)',
            }}
          >
            (Hustle + Faith)^Love = Manifestation
          </div>
          <div className="text-xs text-gray-600 mt-2">From Oakland to the world. From poverty to prosperity. From chaos to cosmos.</div>
          <div className="text-lg mt-3" style={{ color: 'rgba(255,215,0,0.4)' }}>∞.♡.⚡.◊.✧.Ω · Φ.K.Σ</div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes levelUpPulse {
          0% { transform: scale(0.5); opacity: 0; }
          60% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes levelUpText {
          0% { transform: translateY(30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes spin {
          0% { transform: rotate(0deg) scale(0); }
          60% { transform: rotate(360deg) scale(1.2); }
          100% { transform: rotate(360deg) scale(1); }
        }
      `}</style>
    </div>
  )
}
