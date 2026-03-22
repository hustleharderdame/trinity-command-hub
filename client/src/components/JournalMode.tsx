import { useState, useRef, useEffect, useMemo } from 'react'
import { Send } from 'lucide-react'
import { trpc } from '@/lib/trpc'

interface Message {
  id: string
  sender: 'user' | 'soul-beast' | 'ai-twin'
  text: string
  timestamp: Date
}

// Chakra orb positions and colors
const CHAKRA_ORBS = [
  { id: 'root', color: '#ff0000', glow: 'rgba(255,0,0,0.6)', label: 'ROOT', x: '50%', y: '85%', size: 16 },
  { id: 'sacral', color: '#ff6600', glow: 'rgba(255,102,0,0.6)', label: 'SACRAL', x: '50%', y: '75%', size: 16 },
  { id: 'solar', color: '#ffff00', glow: 'rgba(255,255,0,0.6)', label: 'SOLAR', x: '50%', y: '65%', size: 18 },
  { id: 'heart', color: '#00ff00', glow: 'rgba(0,255,0,0.6)', label: 'HEART', x: '50%', y: '55%', size: 20 },
  { id: 'throat', color: '#00ccff', glow: 'rgba(0,204,255,0.6)', label: 'THROAT', x: '50%', y: '45%', size: 16 },
  { id: 'third-eye', color: '#6600ff', glow: 'rgba(102,0,255,0.6)', label: 'THIRD EYE', x: '50%', y: '35%', size: 18 },
  { id: 'crown', color: '#cc00ff', glow: 'rgba(204,0,255,0.6)', label: 'CROWN', x: '50%', y: '22%', size: 22 },
]

export default function JournalMode() {
  // Stable daily session ID
  const sessionId = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    return `session-${today}`
  }, [])

  const [localMessages, setLocalMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [activeChat, setActiveChat] = useState<'soul-beast' | 'ai-twin'>('soul-beast')
  const [isLoading, setIsLoading] = useState(false)
  const [activeChakra, setActiveChakra] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fetch user progression for AI context
  const { data: progression } = trpc.hsProgression.get.useQuery()
  const { data: todaySnapshot } = trpc.hsDaily.getToday.useQuery()
  const prog = (progression as any) ?? {}
  const snap = (todaySnapshot as any) ?? {}

  // Load persistent chat history from DB
  const { data: beastHistory } = trpc.journal.getHistory.useQuery(
    { sessionId, chatType: 'soul-beast' },
    { staleTime: 30_000 }
  )
  const { data: twinHistory } = trpc.journal.getHistory.useQuery(
    { sessionId, chatType: 'ai-twin' },
    { staleTime: 30_000 }
  )

  // Real AI chat mutation
  const chatMutation = trpc.journal.chat.useMutation()
  const utils = trpc.useUtils()

  // Build messages from DB history
  const dbMessages: Message[] = useMemo(() => {
    const source = activeChat === 'soul-beast' ? (beastHistory ?? []) : (twinHistory ?? [])
    return (source as any[]).map((m) => ({
      id: String(m.id),
      sender: m.sender as Message['sender'],
      text: m.text,
      timestamp: new Date(m.createdAt),
    }))
  }, [activeChat, beastHistory, twinHistory])

  // Merge DB + local optimistic messages
  const messages: Message[] = useMemo(() => {
    const dbIds = new Set(dbMessages.map((m) => m.id))
    const localOnly = localMessages.filter((m) => !dbIds.has(m.id))
    const merged = [...dbMessages, ...localOnly].sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
    )
    if (merged.length === 0) {
      return [{
        id: 'welcome',
        sender: activeChat,
        text: activeChat === 'soul-beast'
          ? 'Welcome to the Garden of Consciousness. I have been waiting for you. What weighs upon your spirit today?'
          : 'AI Twin online. Your progression data is loaded. What strategic challenge do you want to solve today?',
        timestamp: new Date(),
      }]
    }
    return merged
  }, [dbMessages, localMessages, activeChat])

  // Clear local optimistic messages when switching chats
  useEffect(() => {
    setLocalMessages([])
  }, [activeChat])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const sentText = inputValue.trim()
    setInputValue('')
    setIsLoading(true)

    // Optimistic: add user message immediately
    const optimisticUser: Message = {
      id: `opt-user-${Date.now()}`,
      sender: 'user',
      text: sentText,
      timestamp: new Date(),
    }
    setLocalMessages((prev) => [...prev, optimisticUser])

    try {
      const result = await chatMutation.mutateAsync({
        sessionId,
        chatType: activeChat,
        userMessage: sentText,
        progressionContext: {
          level: prog?.currentLevel,
          tierRank: prog?.tierRank,
          currentStreak: prog?.currentStreak,
          powerScore: prog?.powerScore ? Number(prog.powerScore) : undefined,
          todayFaith: snap?.faithScore ? Number(snap.faithScore) : undefined,
          todayHustle: snap?.hustleExecuted ? Number(snap.hustleExecuted) : undefined,
        },
      })

      // Optimistic: add AI response immediately
      const optimisticAI: Message = {
        id: `opt-ai-${Date.now()}`,
        sender: activeChat,
        text: result.message,
        timestamp: new Date(),
      }
      setLocalMessages((prev) => [...prev, optimisticAI])

      // Refresh DB history in background
      utils.journal.getHistory.invalidate({ sessionId, chatType: activeChat })
    } catch (err) {
      // On error, add a fallback message
      const errMsg: Message = {
        id: `err-${Date.now()}`,
        sender: activeChat,
        text: activeChat === 'soul-beast'
          ? 'The Garden stirs... but the connection falters. Try again, seeker.'
          : 'Connection interrupted. Retrying analysis...',
        timestamp: new Date(),
      }
      setLocalMessages((prev) => [...prev, errMsg])
    } finally {
      setIsLoading(false)
    }
  }

  const filteredMessages = messages.filter(
    (msg) => msg.sender === 'user' || msg.sender === activeChat
  )

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* ─── Garden Background ─── */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 50% 100%, rgba(0, 80, 0, 0.4) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 60%, rgba(20, 0, 60, 0.6) 0%, transparent 50%),
            radial-gradient(ellipse at 30% 30%, rgba(100, 0, 150, 0.15) 0%, transparent 40%),
            radial-gradient(ellipse at 70% 30%, rgba(0, 100, 150, 0.15) 0%, transparent 40%),
            linear-gradient(180deg, #020008 0%, #050015 30%, #030010 60%, #010008 100%)
          `,
        }}
      />

      {/* ─── Fog / Smoke Layers ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Ground fog */}
        <div
          className="absolute bottom-0 left-0 right-0 h-48"
          style={{
            background: 'linear-gradient(0deg, rgba(100, 200, 100, 0.08) 0%, transparent 100%)',
            animation: 'fogDrift 20s ease-in-out infinite alternate',
          }}
        />
        {/* Mid fog layer 1 */}
        <div
          className="absolute bottom-20 left-[-20%] w-[140%] h-40 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(ellipse, rgba(150, 100, 200, 0.3) 0%, transparent 70%)',
            animation: 'fogDrift 15s ease-in-out infinite alternate-reverse',
            filter: 'blur(30px)',
          }}
        />
        {/* Mid fog layer 2 */}
        <div
          className="absolute bottom-32 left-[-10%] w-[120%] h-32 rounded-full opacity-15"
          style={{
            background: 'radial-gradient(ellipse, rgba(50, 200, 150, 0.2) 0%, transparent 70%)',
            animation: 'fogDrift 25s ease-in-out infinite alternate',
            filter: 'blur(40px)',
          }}
        />
        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              left: `${Math.random() * 100}%`,
              bottom: `${10 + Math.random() * 60}%`,
              background: i % 3 === 0 ? 'rgba(0,255,150,0.6)' : i % 3 === 1 ? 'rgba(150,0,255,0.6)' : 'rgba(0,150,255,0.6)',
              animation: `floatParticle ${8 + Math.random() * 12}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 8}s`,
              boxShadow: `0 0 6px currentColor`,
            }}
          />
        ))}
      </div>

      {/* ─── Glowing Neon Tree ─── */}
      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 pointer-events-none" style={{ width: '300px', height: '70%' }}>
        {/* Tree trunk */}
        <div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
          style={{
            width: '12px',
            height: '55%',
            background: 'linear-gradient(180deg, rgba(0,255,100,0.6) 0%, rgba(0,150,50,0.4) 100%)',
            boxShadow: '0 0 15px rgba(0,255,100,0.4), 0 0 30px rgba(0,200,80,0.2)',
            borderRadius: '6px',
          }}
        />
        {/* Tree branches - left */}
        {[
          { bottom: '45%', width: '80px', rotate: '-40deg', left: '30%' },
          { bottom: '55%', width: '60px', rotate: '-50deg', left: '25%' },
          { bottom: '65%', width: '40px', rotate: '-45deg', left: '32%' },
        ].map((branch, i) => (
          <div
            key={`left-${i}`}
            className="absolute"
            style={{
              bottom: branch.bottom,
              left: branch.left,
              width: branch.width,
              height: '4px',
              background: 'linear-gradient(90deg, rgba(0,255,100,0.6), transparent)',
              boxShadow: '0 0 8px rgba(0,255,100,0.4)',
              transform: `rotate(${branch.rotate})`,
              transformOrigin: 'right center',
              borderRadius: '2px',
            }}
          />
        ))}
        {/* Tree branches - right */}
        {[
          { bottom: '45%', width: '80px', rotate: '40deg', right: '30%' },
          { bottom: '55%', width: '60px', rotate: '50deg', right: '25%' },
          { bottom: '65%', width: '40px', rotate: '45deg', right: '32%' },
        ].map((branch, i) => (
          <div
            key={`right-${i}`}
            className="absolute"
            style={{
              bottom: branch.bottom,
              right: branch.right,
              width: branch.width,
              height: '4px',
              background: 'linear-gradient(270deg, rgba(0,255,100,0.6), transparent)',
              boxShadow: '0 0 8px rgba(0,255,100,0.4)',
              transform: `rotate(${branch.rotate})`,
              transformOrigin: 'left center',
              borderRadius: '2px',
            }}
          />
        ))}
        {/* Tree canopy glow */}
        <div
          className="absolute left-1/2 transform -translate-x-1/2"
          style={{
            bottom: '55%',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(0,255,100,0.12) 0%, rgba(0,200,80,0.06) 50%, transparent 70%)',
            borderRadius: '50%',
            animation: 'treePulse 4s ease-in-out infinite',
          }}
        />
        {/* Leaf sparkles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`leaf-${i}`}
            className="absolute"
            style={{
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              background: 'rgba(0,255,150,0.8)',
              boxShadow: '0 0 8px rgba(0,255,150,0.8)',
              left: `${30 + Math.random() * 40}%`,
              bottom: `${45 + Math.random() * 30}%`,
              animation: `sparkle ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* ─── Chakra Orbs ─── */}
      <div className="absolute inset-0 pointer-events-none">
        {CHAKRA_ORBS.map((orb) => (
          <div
            key={orb.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer pointer-events-auto"
            style={{
              left: orb.x,
              top: orb.y,
              width: `${orb.size}px`,
              height: `${orb.size}px`,
            }}
            onClick={() => setActiveChakra(activeChakra === orb.id ? null : orb.id)}
          >
            <div
              className="w-full h-full rounded-full"
              style={{
                background: `radial-gradient(circle, ${orb.color} 0%, ${orb.glow} 50%, transparent 70%)`,
                boxShadow: `0 0 ${orb.size}px ${orb.color}, 0 0 ${orb.size * 2}px ${orb.glow}`,
                animation: `chakraPulse 3s ease-in-out infinite`,
                animationDelay: `${CHAKRA_ORBS.indexOf(orb) * 0.4}s`,
              }}
            />
            {/* Chakra label on hover */}
            {activeChakra === orb.id && (
              <div
                className="absolute left-1/2 transform -translate-x-1/2 -top-8 text-xs font-mono whitespace-nowrap px-2 py-1 rounded"
                style={{
                  color: orb.color,
                  background: 'rgba(0,0,0,0.8)',
                  border: `1px solid ${orb.color}`,
                  boxShadow: `0 0 10px ${orb.glow}`,
                }}
              >
                {orb.label}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ─── Main UI Layout ─── */}
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        {/* Left: Garden Visual (hidden on mobile, shown on desktop) */}
        <div className="hidden lg:flex lg:w-1/3 flex-col items-center justify-center p-6 relative">
          {/* Garden title */}
          <div className="text-center mb-8">
            <div
              className="text-xs font-mono tracking-widest mb-1"
              style={{ color: 'rgba(0,255,150,0.6)' }}
            >
              SPIRITUAL REALM
            </div>
            <h2
              className="text-2xl font-black"
              style={{
                fontFamily: 'Georgia, serif',
                color: '#00ff96',
                textShadow: '0 0 20px rgba(0,255,150,0.6)',
              }}
            >
              Garden of Consciousness
            </h2>
            <p className="text-xs text-gray-500 mt-1">Click chakra orbs to explore</p>
          </div>

          {/* Entity selector */}
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <button
              onClick={() => setActiveChat('soul-beast')}
              className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                activeChat === 'soul-beast'
                  ? 'border-pink-500/60 bg-pink-900/20'
                  : 'border-gray-700/40 bg-black/30 hover:border-gray-600/60'
              }`}
              style={activeChat === 'soul-beast' ? { boxShadow: '0 0 20px rgba(255,50,150,0.2)' } : {}}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                  style={{
                    background: 'radial-gradient(circle, rgba(255,50,150,0.3) 0%, transparent 70%)',
                    boxShadow: activeChat === 'soul-beast' ? '0 0 20px rgba(255,50,150,0.4)' : 'none',
                  }}
                >
                  🐉
                </div>
                <div>
                  <div className="font-bold text-sm" style={{ color: activeChat === 'soul-beast' ? '#ff3296' : '#888' }}>
                    SOUL BEAST
                  </div>
                  <div className="text-xs text-gray-500">Spiritual guide</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setActiveChat('ai-twin')}
              className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                activeChat === 'ai-twin'
                  ? 'border-cyan-500/60 bg-cyan-900/20'
                  : 'border-gray-700/40 bg-black/30 hover:border-gray-600/60'
              }`}
              style={activeChat === 'ai-twin' ? { boxShadow: '0 0 20px rgba(0,200,255,0.2)' } : {}}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                  style={{
                    background: 'radial-gradient(circle, rgba(0,200,255,0.3) 0%, transparent 70%)',
                    boxShadow: activeChat === 'ai-twin' ? '0 0 20px rgba(0,200,255,0.4)' : 'none',
                  }}
                >
                  🤖
                </div>
                <div>
                  <div className="font-bold text-sm" style={{ color: activeChat === 'ai-twin' ? '#00c8ff' : '#888' }}>
                    AI TWIN
                  </div>
                  <div className="text-xs text-gray-500">Strategic advisor</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Right: Chat Interface */}
        <div className="flex-1 flex flex-col p-4 lg:p-6 min-h-screen lg:min-h-0">
          {/* Mobile entity selector */}
          <div className="lg:hidden flex gap-2 mb-4">
            <button
              onClick={() => setActiveChat('soul-beast')}
              className={`flex-1 py-2 px-3 rounded-lg border text-sm font-mono transition-all ${
                activeChat === 'soul-beast'
                  ? 'border-pink-500/60 bg-pink-900/20 text-pink-400'
                  : 'border-gray-700/40 bg-black/30 text-gray-500'
              }`}
            >
              🐉 SOUL BEAST
            </button>
            <button
              onClick={() => setActiveChat('ai-twin')}
              className={`flex-1 py-2 px-3 rounded-lg border text-sm font-mono transition-all ${
                activeChat === 'ai-twin'
                  ? 'border-cyan-500/60 bg-cyan-900/20 text-cyan-400'
                  : 'border-gray-700/40 bg-black/30 text-gray-500'
              }`}
            >
              🤖 AI TWIN
            </button>
          </div>

          {/* Chat header with tabs */}
          <div
            className="rounded-xl border p-3 mb-4 flex items-center justify-between gap-3"
            style={{
              borderColor: activeChat === 'soul-beast' ? 'rgba(221,0,255,0.4)' : 'rgba(0,200,255,0.4)',
              background: 'linear-gradient(135deg, rgba(10,0,30,0.8), rgba(0,5,20,0.8))',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                style={{
                  background: activeChat === 'soul-beast'
                    ? 'radial-gradient(circle, rgba(221,0,255,0.3) 0%, transparent 70%)'
                    : 'radial-gradient(circle, rgba(0,200,255,0.3) 0%, transparent 70%)',
                  boxShadow: activeChat === 'soul-beast' ? '0 0 15px rgba(221,0,255,0.3)' : '0 0 15px rgba(0,200,255,0.3)',
                }}
              >
                {activeChat === 'soul-beast' ? '🐉' : '🤖'}
              </div>
              <div>
                <div
                  className="font-bold text-sm"
                  style={{ color: activeChat === 'soul-beast' ? '#dd00ff' : '#00c8ff', fontFamily: "'Cinzel Decorative', cursive" }}
                >
                  {activeChat === 'soul-beast' ? 'SOUL BEAST' : 'AI TWIN'}
                </div>
                <div className="text-xs text-gray-500" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                  {activeChat === 'soul-beast' ? 'Spiritual guide' : 'Strategic advisor'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: activeChat === 'soul-beast' ? '#dd00ff' : '#00c8ff' }}
              />
              <span className="text-xs text-gray-500">Online</span>
            </div>
          </div>

          {/* Messages */}
          <div
            className="flex-1 rounded-xl border p-4 overflow-y-auto space-y-4 mb-4"
            style={{
              borderColor: activeChat === 'soul-beast' ? 'rgba(255,50,150,0.2)' : 'rgba(0,200,255,0.2)',
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(10px)',
              minHeight: '300px',
              maxHeight: '50vh',
            }}
          >
            {filteredMessages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender !== 'user' && (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-1"
                    style={{
                      background: activeChat === 'soul-beast'
                        ? 'radial-gradient(circle, rgba(221,0,255,0.3) 0%, transparent 70%)'
                        : 'radial-gradient(circle, rgba(0,200,255,0.3) 0%, transparent 70%)',
                      boxShadow: activeChat === 'soul-beast' ? '0 0 10px rgba(221,0,255,0.2)' : '0 0 10px rgba(0,200,255,0.2)',
                    }}
                  >
                    {activeChat === 'soul-beast' ? '🐉' : '🤖'}
                  </div>
                )}
                <div
                  className="max-w-xs lg:max-w-md px-4 py-3 rounded-2xl text-sm leading-relaxed"
                  style={
                    message.sender === 'user'
                      ? {
                          background: 'rgba(0,229,160,0.08)',
                          border: '1px solid rgba(0,229,160,0.3)',
                          color: '#00e5a0',
                          borderRadius: '18px 18px 4px 18px',
                          fontFamily: "'Rajdhani', sans-serif",
                        }
                      : activeChat === 'soul-beast'
                      ? {
                          background: 'rgba(221,0,255,0.08)',
                          border: '1px solid rgba(221,0,255,0.3)',
                          color: '#dd00ff',
                          borderRadius: '4px 18px 18px 18px',
                          fontFamily: "'Rajdhani', sans-serif",
                          boxShadow: '0 0 15px rgba(221,0,255,0.1)',
                        }
                      : {
                          background: 'rgba(0,200,255,0.08)',
                          border: '1px solid rgba(0,200,255,0.3)',
                          color: '#00b4ff',
                          borderRadius: '4px 18px 18px 18px',
                          fontFamily: "'Rajdhani', sans-serif",
                          boxShadow: '0 0 15px rgba(0,200,255,0.1)',
                        }
                  }
                >
                  <p>{message.text}</p>
                  <p className="text-xs opacity-40 mt-1 text-right" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2 justify-start">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-1"
                  style={{
                    background: activeChat === 'soul-beast'
                      ? 'radial-gradient(circle, rgba(221,0,255,0.3) 0%, transparent 70%)'
                      : 'radial-gradient(circle, rgba(0,200,255,0.3) 0%, transparent 70%)',
                  }}
                >
                  {activeChat === 'soul-beast' ? '🐉' : '🤖'}
                </div>
                <div
                  className="px-4 py-3 rounded-2xl text-sm"
                  style={{
                    background: activeChat === 'soul-beast' ? 'rgba(221,0,255,0.08)' : 'rgba(0,200,255,0.08)',
                    border: `1px solid ${activeChat === 'soul-beast' ? 'rgba(221,0,255,0.3)' : 'rgba(0,200,255,0.3)'}`,
                    borderRadius: '4px 18px 18px 18px',
                    boxShadow: activeChat === 'soul-beast' ? '0 0 15px rgba(221,0,255,0.1)' : '0 0 15px rgba(0,200,255,0.1)',
                  }}
                >
                  <div className="flex gap-1 items-center">
                    <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: activeChat === 'soul-beast' ? '#dd00ff' : '#00b4ff', animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: activeChat === 'soul-beast' ? '#dd00ff' : '#00b4ff', animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: activeChat === 'soul-beast' ? '#dd00ff' : '#00b4ff', animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              placeholder={`Speak to your ${activeChat === 'soul-beast' ? 'Soul Beast' : 'AI Twin'}...`}
              className="flex-1 px-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={{
                background: 'rgba(0,0,0,0.6)',
                border: `1px solid ${activeChat === 'soul-beast' ? 'rgba(221,0,255,0.3)' : 'rgba(0,200,255,0.3)'}`,
                color: activeChat === 'soul-beast' ? '#dd00ff' : '#00b4ff',
                backdropFilter: 'blur(10px)',
                fontFamily: "'Rajdhani', sans-serif",
              }}
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="px-4 py-3 rounded-xl transition-all disabled:opacity-40"
              style={{
                background: activeChat === 'soul-beast' ? 'rgba(221,0,255,0.15)' : 'rgba(0,200,255,0.15)',
                border: `1px solid ${activeChat === 'soul-beast' ? 'rgba(221,0,255,0.5)' : 'rgba(0,200,255,0.5)'}`,
                color: activeChat === 'soul-beast' ? '#dd00ff' : '#00b4ff',
                boxShadow: activeChat === 'soul-beast' ? '0 0 15px rgba(221,0,255,0.2)' : '0 0 15px rgba(0,200,255,0.2)',
              }}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ─── CSS Animations ─── */}
      <style>{`
        @keyframes fogDrift {
          0% { transform: translateX(-5%) scaleX(1); opacity: 0.15; }
          50% { transform: translateX(5%) scaleX(1.05); opacity: 0.25; }
          100% { transform: translateX(-3%) scaleX(0.98); opacity: 0.15; }
        }
        @keyframes floatParticle {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 0.8; }
          100% { transform: translateY(-80px) translateX(20px); opacity: 0; }
        }
        @keyframes chakraPulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.4); opacity: 1; }
        }
        @keyframes treePulse {
          0%, 100% { opacity: 0.6; transform: translateX(-50%) scale(1); }
          50% { opacity: 1; transform: translateX(-50%) scale(1.1); }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
