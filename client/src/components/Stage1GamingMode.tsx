import { useState, useEffect } from 'react'
import { trpc } from '@/lib/trpc'

interface Stage1GamingModeProps {
  progression?: any
  snapshot?: any
}

interface StoryNode {
  id: string
  chapter: number
  title: string
  subtitle: string
  description: string
  type: 'origin' | 'challenge' | 'revelation' | 'boss' | 'milestone'
  xpReward: number
  unlocked: boolean
  completed: boolean
  choices?: Choice[]
  freeAnswer?: boolean
  position: { x: number; y: number }
}

interface Choice {
  id: string
  text: string
  consequence: string
  xp: number
}

interface CutsceneState {
  node: StoryNode
  phase: 'intro' | 'choice' | 'answer' | 'reward'
  selectedChoice?: Choice
  freeText: string
  xpEarned: number
}

const STORY_NODES: StoryNode[] = [
  {
    id: 'ch1-origin',
    chapter: 1,
    title: 'THE AWAKENING',
    subtitle: 'Chapter 1 · Origin',
    description: 'You stand at the crossroads of your destiny. The Trap House looms behind you — the place that forged you. Ahead lies the unknown. The journey of a thousand miles begins with a single step.',
    type: 'origin',
    xpReward: 20,
    unlocked: true,
    completed: false,
    freeAnswer: true,
    choices: [
      { id: 'c1a', text: 'Step forward with purpose', consequence: 'Your conviction radiates outward. The path illuminates.', xp: 20 },
      { id: 'c1b', text: 'Look back one last time', consequence: 'You honor your roots. Strength flows from knowing where you came from.', xp: 15 },
      { id: 'c1c', text: 'Write your own declaration', consequence: 'Your words echo through the realm. The universe takes note.', xp: 25 },
    ],
    position: { x: 10, y: 80 },
  },
  {
    id: 'ch1-grind',
    chapter: 1,
    title: 'THE GRIND',
    subtitle: 'Chapter 1 · Challenge',
    description: 'Three days without sleep. The hustle is real. Your body screams for rest but your mind knows the window is closing. What separates the legends from the forgotten?',
    type: 'challenge',
    xpReward: 20,
    unlocked: false,
    completed: false,
    choices: [
      { id: 'c2a', text: 'Push through — sleep is for the weak', consequence: 'Respect. But remember: recovery is part of the grind.', xp: 20 },
      { id: 'c2b', text: 'Strategic rest and return stronger', consequence: 'Wisdom. The marathon runner paces themselves.', xp: 20 },
      { id: 'c2c', text: 'Delegate and multiply your effort', consequence: 'Leadership unlocked. You think like a CEO.', xp: 25 },
    ],
    position: { x: 30, y: 60 },
  },
  {
    id: 'ch1-revelation',
    chapter: 1,
    title: 'THE MIRROR',
    subtitle: 'Chapter 1 · Revelation',
    description: 'The Soul Beast appears in your reflection. It has taken the form of your deepest fear. To advance, you must name it. What truth have you been avoiding?',
    type: 'revelation',
    xpReward: 30,
    unlocked: false,
    completed: false,
    freeAnswer: true,
    choices: [
      { id: 'c3a', text: 'I fear I am not enough', consequence: 'The beast bows. Naming the fear dissolves its power.', xp: 30 },
      { id: 'c3b', text: 'I fear losing everything I built', consequence: 'The beast transforms. Attachment is the root of fear.', xp: 25 },
      { id: 'c3c', text: 'Write your truth', consequence: 'The mirror shatters. Your truth is your weapon.', xp: 35 },
    ],
    position: { x: 50, y: 40 },
  },
  {
    id: 'ch1-boss',
    chapter: 1,
    title: 'THE FIRST TEST',
    subtitle: 'Chapter 1 · Boss',
    description: 'The Doubt Demon materializes. It wears the faces of everyone who said you would fail. It speaks in the voice of your worst moments. This is the final gate of Stage 1.',
    type: 'boss',
    xpReward: 50,
    unlocked: false,
    completed: false,
    choices: [
      { id: 'c4a', text: 'Charge with everything you have', consequence: 'CRITICAL HIT! Your conviction shatters the demon.', xp: 50 },
      { id: 'c4b', text: 'Speak your achievements aloud', consequence: 'The demon shrinks with each truth you speak.', xp: 45 },
      { id: 'c4c', text: 'Laugh at it — you have been through worse', consequence: 'LEGENDARY! Laughter is the ultimate weapon against doubt.', xp: 60 },
    ],
    position: { x: 70, y: 25 },
  },
  {
    id: 'ch1-milestone',
    chapter: 1,
    title: 'STAGE 1 COMPLETE',
    subtitle: 'Chapter 1 · Milestone',
    description: 'The Trap House fades behind you. You have survived the first crucible. The Apartment awaits. You are no longer who you were when you started. The legacy begins.',
    type: 'milestone',
    xpReward: 100,
    unlocked: false,
    completed: false,
    choices: [
      { id: 'c5a', text: 'Accept the upgrade', consequence: 'LEVEL UP! The Apartment unlocks. New missions await.', xp: 100 },
      { id: 'c5b', text: 'Reflect on the journey', consequence: 'Wisdom +10. You carry the lessons forward.', xp: 80 },
    ],
    position: { x: 88, y: 15 },
  },
]

const NODE_COLORS = {
  origin: { border: '#ffd700', glow: 'rgba(255,215,0,0.5)', bg: 'rgba(255,215,0,0.1)', icon: '⭐' },
  challenge: { border: '#ff6b35', glow: 'rgba(255,107,53,0.5)', bg: 'rgba(255,107,53,0.1)', icon: '⚔️' },
  revelation: { border: '#cc00ff', glow: 'rgba(204,0,255,0.5)', bg: 'rgba(204,0,255,0.1)', icon: '🔮' },
  boss: { border: '#ff0000', glow: 'rgba(255,0,0,0.5)', bg: 'rgba(255,0,0,0.1)', icon: '💀' },
  milestone: { border: '#00ffff', glow: 'rgba(0,255,255,0.5)', bg: 'rgba(0,255,255,0.1)', icon: '🏆' },
}

export default function Stage1GamingMode({ progression, snapshot }: Stage1GamingModeProps) {
  const prog = progression || {}
  const userLevel = prog?.currentLevel || 1
  const totalXP = prog?.totalXP || 0
  const currentStreak = prog?.currentStreak || 0

  const [nodes, setNodes] = useState<StoryNode[]>(() => {
    // Load completion state from localStorage
    const saved = localStorage.getItem('hlb-story-nodes')
    if (saved) {
      try {
        const savedState = JSON.parse(saved)
        return STORY_NODES.map((node, i) => ({
          ...node,
          completed: savedState[node.id]?.completed || false,
          unlocked: i === 0 || savedState[STORY_NODES[i - 1]?.id]?.completed || false,
        }))
      } catch {
        return STORY_NODES
      }
    }
    return STORY_NODES
  })

  const [cutscene, setCutscene] = useState<CutsceneState | null>(null)
  const [earnedXP, setEarnedXP] = useState(0)
  const [showXPBurst, setShowXPBurst] = useState(false)
  const [typewriterText, setTypewriterText] = useState('')
  const [typewriterDone, setTypewriterDone] = useState(false)

  const pmEndMutation = trpc.hsDaily.pmEnd.useMutation()

  // Typewriter effect for cutscene description
  useEffect(() => {
    if (!cutscene || cutscene.phase !== 'intro') return
    const text = cutscene.node.description
    setTypewriterText('')
    setTypewriterDone(false)
    let i = 0
    const interval = setInterval(() => {
      if (i < text.length) {
        setTypewriterText(text.slice(0, i + 1))
        i++
      } else {
        setTypewriterDone(true)
        clearInterval(interval)
      }
    }, 25)
    return () => clearInterval(interval)
  }, [cutscene?.node.id, cutscene?.phase])

  const openNode = (node: StoryNode) => {
    if (!node.unlocked) return
    setCutscene({
      node,
      phase: 'intro',
      freeText: '',
      xpEarned: 0,
    })
  }

  const handleChoice = (choice: Choice) => {
    if (!cutscene) return
    setCutscene({ ...cutscene, phase: 'reward', selectedChoice: choice, xpEarned: choice.xp })
    completeNode(cutscene.node, choice.xp)
  }

  const handleFreeAnswer = () => {
    if (!cutscene || !cutscene.freeText.trim()) return
    const xp = cutscene.node.xpReward + 5 // Bonus XP for free answer
    setCutscene({ ...cutscene, phase: 'reward', xpEarned: xp })
    completeNode(cutscene.node, xp)
  }

  const completeNode = (node: StoryNode, xp: number) => {
    // Update nodes state
    setNodes((prev) => {
      const updated = prev.map((n, i) => {
        if (n.id === node.id) return { ...n, completed: true }
        // Unlock next node
        if (i > 0 && prev[i - 1].id === node.id) return { ...n, unlocked: true }
        return n
      })
      // Save to localStorage
      const savedState: Record<string, { completed: boolean }> = {}
      updated.forEach((n) => { savedState[n.id] = { completed: n.completed } })
      localStorage.setItem('hlb-story-nodes', JSON.stringify(savedState))
      return updated
    })

    // Show XP burst
    setEarnedXP(xp)
    setShowXPBurst(true)
    setTimeout(() => setShowXPBurst(false), 2000)
  }

  const closeCutscene = () => {
    setCutscene(null)
  }

  const completedCount = nodes.filter((n) => n.completed).length
  const totalXPEarnable = nodes.reduce((sum, n) => sum + n.xpReward, 0)

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* ─── Background: Dark cyberpunk room ─── */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 50% 0%, rgba(0, 100, 200, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 20% 80%, rgba(255, 50, 0, 0.08) 0%, transparent 40%),
            radial-gradient(ellipse at 80% 80%, rgba(0, 200, 100, 0.06) 0%, transparent 40%),
            linear-gradient(180deg, #020508 0%, #030a10 40%, #020608 100%)
          `,
        }}
      />

      {/* Scan lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,200,255,0.1) 2px, rgba(0,200,255,0.1) 4px)',
        }}
      />

      {/* XP Burst animation */}
      {showXPBurst && (
        <div
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
          style={{ animation: 'xpBurst 2s ease-out forwards' }}
        >
          <div
            className="text-4xl font-black text-center"
            style={{
              color: '#ffd700',
              textShadow: '0 0 30px rgba(255,215,0,0.8)',
              fontFamily: 'Impact, sans-serif',
            }}
          >
            +{earnedXP} XP
          </div>
        </div>
      )}

      {/* ─── Header ─── */}
      <div className="relative z-10 border-b border-cyan-900/40 bg-black/60 backdrop-blur-sm px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-cyan-600/70 tracking-widest">CHAPTER MAP</div>
            <h1
              className="text-xl font-black"
              style={{ color: '#00c8ff', textShadow: '0 0 15px rgba(0,200,255,0.5)' }}
            >
              THE HUSTLE CHRONICLES
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs font-mono text-gray-500">PROGRESS</div>
              <div className="text-sm font-bold text-cyan-400">{completedCount}/{nodes.length} NODES</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-mono text-gray-500">LEVEL</div>
              <div className="text-sm font-bold text-yellow-400">LVL {userLevel}</div>
            </div>
            <div className="text-right hidden sm:block">
              <div className="text-xs font-mono text-gray-500">STREAK</div>
              <div className="text-sm font-bold text-orange-400">🔥 {currentStreak}d</div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Chapter Map ─── */}
      <div className="relative z-10 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          {/* Chapter label */}
          <div className="text-center mb-6">
            <span
              className="text-xs font-mono px-4 py-1 rounded-full border"
              style={{
                color: '#ffd700',
                borderColor: 'rgba(255,215,0,0.3)',
                background: 'rgba(255,215,0,0.05)',
              }}
            >
              STAGE 1 · THE TRAP HOUSE ERA
            </span>
          </div>

          {/* Map container */}
          <div className="relative" style={{ height: '400px', minHeight: '300px' }}>
            {/* Connection lines between nodes */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
              {nodes.map((node, i) => {
                if (i === 0) return null
                const prev = nodes[i - 1]
                const x1 = `${prev.position.x}%`
                const y1 = `${prev.position.y}%`
                const x2 = `${node.position.x}%`
                const y2 = `${node.position.y}%`
                return (
                  <line
                    key={`line-${node.id}`}
                    x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke={node.unlocked ? 'rgba(0,200,255,0.4)' : 'rgba(100,100,100,0.2)'}
                    strokeWidth="2"
                    strokeDasharray={node.completed ? 'none' : '8,4'}
                  />
                )
              })}
            </svg>

            {/* Story nodes */}
            {nodes.map((node) => {
              const colors = NODE_COLORS[node.type]
              return (
                <div
                  key={node.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${node.position.x}%`,
                    top: `${node.position.y}%`,
                    zIndex: 2,
                  }}
                >
                  <button
                    onClick={() => openNode(node)}
                    disabled={!node.unlocked}
                    className="relative group transition-all duration-300"
                    style={{
                      transform: node.unlocked && !node.completed ? 'scale(1)' : 'scale(0.9)',
                    }}
                  >
                    {/* Node circle */}
                    <div
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-xl sm:text-2xl border-2 transition-all duration-300"
                      style={{
                        borderColor: node.completed ? '#ffd700' : node.unlocked ? colors.border : 'rgba(100,100,100,0.3)',
                        background: node.completed
                          ? 'rgba(255,215,0,0.15)'
                          : node.unlocked
                          ? colors.bg
                          : 'rgba(20,20,20,0.8)',
                        boxShadow: node.unlocked
                          ? `0 0 20px ${node.completed ? 'rgba(255,215,0,0.4)' : colors.glow}`
                          : 'none',
                        animation: node.unlocked && !node.completed ? 'nodePulse 2s ease-in-out infinite' : 'none',
                      }}
                    >
                      {node.completed ? '✅' : node.unlocked ? colors.icon : '🔒'}
                    </div>

                    {/* Node label */}
                    <div
                      className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 text-center whitespace-nowrap"
                    >
                      <div
                        className="text-xs font-bold"
                        style={{
                          color: node.completed ? '#ffd700' : node.unlocked ? colors.border : '#444',
                          textShadow: node.unlocked ? `0 0 8px ${colors.glow}` : 'none',
                        }}
                      >
                        {node.title}
                      </div>
                      <div className="text-xs text-gray-600">{node.subtitle}</div>
                    </div>

                    {/* XP badge */}
                    {node.unlocked && !node.completed && (
                      <div
                        className="absolute -top-2 -right-2 text-xs font-bold px-1.5 py-0.5 rounded-full"
                        style={{
                          background: 'rgba(255,215,0,0.2)',
                          border: '1px solid rgba(255,215,0,0.5)',
                          color: '#ffd700',
                        }}
                      >
                        +{node.xpReward}
                      </div>
                    )}
                  </button>
                </div>
              )
            })}
          </div>

          {/* Progress bar */}
          <div className="mt-8">
            <div className="flex justify-between text-xs font-mono text-gray-500 mb-2">
              <span>CHAPTER 1 PROGRESS</span>
              <span>{Math.round((completedCount / nodes.length) * 100)}%</span>
            </div>
            <div className="h-2 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(completedCount / nodes.length) * 100}%`,
                  background: 'linear-gradient(90deg, #00c8ff, #ffd700)',
                  boxShadow: '0 0 10px rgba(0,200,255,0.5)',
                }}
              />
            </div>
          </div>

          {/* Node cards below map on mobile */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {nodes.map((node) => {
              const colors = NODE_COLORS[node.type]
              return (
                <button
                  key={`card-${node.id}`}
                  onClick={() => openNode(node)}
                  disabled={!node.unlocked}
                  className="text-left p-3 rounded-xl border transition-all"
                  style={{
                    borderColor: node.completed ? 'rgba(255,215,0,0.4)' : node.unlocked ? `${colors.border}40` : 'rgba(50,50,50,0.5)',
                    background: node.completed ? 'rgba(255,215,0,0.05)' : node.unlocked ? colors.bg : 'rgba(10,10,10,0.5)',
                    opacity: node.unlocked ? 1 : 0.4,
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{node.completed ? '✅' : node.unlocked ? colors.icon : '🔒'}</span>
                    <div>
                      <div className="text-xs font-bold" style={{ color: node.completed ? '#ffd700' : node.unlocked ? colors.border : '#555' }}>
                        {node.title}
                      </div>
                      <div className="text-xs text-gray-600">{node.subtitle}</div>
                    </div>
                    {!node.completed && node.unlocked && (
                      <div className="ml-auto text-xs font-bold text-yellow-500">+{node.xpReward}</div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ─── Cutscene Modal ─── */}
      {cutscene && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)' }}
        >
          <div
            className="w-full max-w-2xl rounded-2xl border overflow-hidden"
            style={{
              borderColor: NODE_COLORS[cutscene.node.type].border,
              background: `linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(10,10,20,0.98) 100%)`,
              boxShadow: `0 0 60px ${NODE_COLORS[cutscene.node.type].glow}`,
            }}
          >
            {/* Cutscene header */}
            <div
              className="px-6 py-4 border-b"
              style={{ borderColor: `${NODE_COLORS[cutscene.node.type].border}40` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono text-gray-500 mb-0.5">{cutscene.node.subtitle}</div>
                  <h2
                    className="text-xl font-black"
                    style={{
                      color: NODE_COLORS[cutscene.node.type].border,
                      textShadow: `0 0 15px ${NODE_COLORS[cutscene.node.type].glow}`,
                    }}
                  >
                    {NODE_COLORS[cutscene.node.type].icon} {cutscene.node.title}
                  </h2>
                </div>
                <button
                  onClick={closeCutscene}
                  className="text-gray-600 hover:text-gray-400 text-xl transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Cutscene body */}
            <div className="p-6">
              {/* PHASE: INTRO */}
              {cutscene.phase === 'intro' && (
                <div>
                  {/* Narrative text with typewriter */}
                  <div
                    className="text-base leading-relaxed mb-6 min-h-[80px]"
                    style={{ color: '#c0c0d0', fontFamily: 'Georgia, serif' }}
                  >
                    {typewriterText}
                    {!typewriterDone && (
                      <span
                        className="inline-block w-0.5 h-4 ml-0.5 align-middle animate-pulse"
                        style={{ background: NODE_COLORS[cutscene.node.type].border }}
                      />
                    )}
                  </div>

                  {typewriterDone && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => setCutscene({ ...cutscene, phase: 'choice' })}
                        className="flex-1 py-3 rounded-xl font-bold transition-all"
                        style={{
                          background: NODE_COLORS[cutscene.node.type].bg,
                          border: `1px solid ${NODE_COLORS[cutscene.node.type].border}`,
                          color: NODE_COLORS[cutscene.node.type].border,
                          boxShadow: `0 0 15px ${NODE_COLORS[cutscene.node.type].glow}`,
                        }}
                      >
                        MAKE YOUR CHOICE →
                      </button>
                      {cutscene.node.freeAnswer && (
                        <button
                          onClick={() => setCutscene({ ...cutscene, phase: 'answer' })}
                          className="py-3 px-4 rounded-xl font-bold transition-all border border-gray-600 text-gray-400 hover:border-gray-400"
                        >
                          WRITE YOUR OWN
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* PHASE: CHOICE */}
              {cutscene.phase === 'choice' && (
                <div>
                  <div className="text-sm text-gray-400 mb-4 font-mono">CHOOSE YOUR PATH:</div>
                  <div className="space-y-3">
                    {cutscene.node.choices?.map((choice) => (
                      <button
                        key={choice.id}
                        onClick={() => handleChoice(choice)}
                        className="w-full text-left p-4 rounded-xl border transition-all hover:scale-[1.02]"
                        style={{
                          borderColor: `${NODE_COLORS[cutscene.node.type].border}50`,
                          background: NODE_COLORS[cutscene.node.type].bg,
                        }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-bold text-sm mb-1" style={{ color: NODE_COLORS[cutscene.node.type].border }}>
                              {choice.text}
                            </div>
                          </div>
                          <div
                            className="text-xs font-bold flex-shrink-0 px-2 py-1 rounded"
                            style={{
                              background: 'rgba(255,215,0,0.1)',
                              border: '1px solid rgba(255,215,0,0.3)',
                              color: '#ffd700',
                            }}
                          >
                            +{choice.xp} XP
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* PHASE: FREE ANSWER */}
              {cutscene.phase === 'answer' && (
                <div>
                  <div className="text-sm text-gray-400 mb-4 font-mono">SPEAK YOUR TRUTH:</div>
                  <textarea
                    value={cutscene.freeText}
                    onChange={(e) => setCutscene({ ...cutscene, freeText: e.target.value })}
                    placeholder="Write your answer here... Your words shape your destiny."
                    className="w-full h-32 p-4 rounded-xl text-sm outline-none resize-none mb-4"
                    style={{
                      background: 'rgba(0,0,0,0.6)',
                      border: `1px solid ${NODE_COLORS[cutscene.node.type].border}50`,
                      color: '#c0c0d0',
                      fontFamily: 'Georgia, serif',
                    }}
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={handleFreeAnswer}
                      disabled={!cutscene.freeText.trim()}
                      className="flex-1 py-3 rounded-xl font-bold transition-all disabled:opacity-40"
                      style={{
                        background: NODE_COLORS[cutscene.node.type].bg,
                        border: `1px solid ${NODE_COLORS[cutscene.node.type].border}`,
                        color: NODE_COLORS[cutscene.node.type].border,
                        boxShadow: `0 0 15px ${NODE_COLORS[cutscene.node.type].glow}`,
                      }}
                    >
                      SUBMIT (+{cutscene.node.xpReward + 5} XP) →
                    </button>
                    <button
                      onClick={() => setCutscene({ ...cutscene, phase: 'choice' })}
                      className="py-3 px-4 rounded-xl border border-gray-600 text-gray-400 hover:border-gray-400 transition-all"
                    >
                      BACK
                    </button>
                  </div>
                </div>
              )}

              {/* PHASE: REWARD */}
              {cutscene.phase === 'reward' && (
                <div className="text-center py-4">
                  {/* XP earned */}
                  <div
                    className="text-5xl font-black mb-2"
                    style={{
                      color: '#ffd700',
                      textShadow: '0 0 30px rgba(255,215,0,0.8)',
                      fontFamily: 'Impact, sans-serif',
                      animation: 'xpBurst 0.5s ease-out',
                    }}
                  >
                    +{cutscene.xpEarned} XP
                  </div>

                  {/* Consequence text */}
                  {cutscene.selectedChoice && (
                    <div
                      className="text-base leading-relaxed mb-6 italic"
                      style={{ color: '#c0c0d0', fontFamily: 'Georgia, serif' }}
                    >
                      "{cutscene.selectedChoice.consequence}"
                    </div>
                  )}
                  {cutscene.phase === 'reward' && !cutscene.selectedChoice && (
                    <div
                      className="text-base leading-relaxed mb-6 italic"
                      style={{ color: '#c0c0d0', fontFamily: 'Georgia, serif' }}
                    >
                      "Your truth has been recorded in the Book of Legacy. The universe takes note."
                    </div>
                  )}

                  {/* Node completed badge */}
                  <div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                    style={{
                      background: 'rgba(255,215,0,0.1)',
                      border: '1px solid rgba(255,215,0,0.4)',
                    }}
                  >
                    <span>✅</span>
                    <span className="text-sm font-bold text-yellow-400">{cutscene.node.title} COMPLETE</span>
                  </div>

                  <button
                    onClick={closeCutscene}
                    className="w-full py-3 rounded-xl font-bold transition-all"
                    style={{
                      background: 'rgba(255,215,0,0.15)',
                      border: '1px solid rgba(255,215,0,0.5)',
                      color: '#ffd700',
                      boxShadow: '0 0 20px rgba(255,215,0,0.3)',
                    }}
                  >
                    CONTINUE THE JOURNEY →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes nodePulse {
          0%, 100% { box-shadow: 0 0 20px var(--glow-color, rgba(0,200,255,0.4)); }
          50% { box-shadow: 0 0 35px var(--glow-color, rgba(0,200,255,0.6)); }
        }
        @keyframes xpBurst {
          0% { transform: scale(0.5) translateY(20px); opacity: 0; }
          50% { transform: scale(1.2) translateY(-10px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
