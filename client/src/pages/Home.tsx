import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/_core/hooks/useAuth'
import { Loader2 } from 'lucide-react'
import { getLoginUrl } from '@/const'
import Stage1Hub from '@/components/Stage1Hub'
import { trpc } from '@/lib/trpc'

// ─── V15 SPLASH SCREEN ───────────────────────────────────────────────────────
function SplashScreen({ onEnter }: { onEnter: () => void }) {
  const [fading, setFading] = useState(false)
  const [powerScore] = useState(() => Math.floor(Math.random() * 300) + 100)

  const handleEnter = () => {
    setFading(true)
    setTimeout(onEnter, 1200)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at center, #080018 0%, #000 100%)',
        opacity: fading ? 0 : 1,
        transition: 'opacity 1.2s ease',
      }}
    >
      {/* Starfield */}
      <StarField />

      {/* Animated ring */}
      <div className="relative mb-8" style={{ width: 280, height: 280 }}>
        <svg
          viewBox="0 0 280 280"
          style={{
            width: '100%',
            height: '100%',
            filter: 'drop-shadow(0 0 25px rgba(0,229,160,0.6))',
          }}
        >
          {/* Outer rotating ring */}
          <circle
            cx="140" cy="140" r="130"
            fill="none"
            stroke="rgba(0,229,160,0.15)"
            strokeWidth="1"
          />
          <circle
            cx="140" cy="140" r="120"
            fill="none"
            stroke="rgba(0,229,160,0.3)"
            strokeWidth="0.5"
            strokeDasharray="20 8"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 140 140"
              to="360 140 140"
              dur="20s"
              repeatCount="indefinite"
            />
          </circle>
          {/* Inner ring */}
          <circle
            cx="140" cy="140" r="100"
            fill="none"
            stroke="rgba(221,0,255,0.2)"
            strokeWidth="1"
            strokeDasharray="5 15"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="360 140 140"
              to="0 140 140"
              dur="12s"
              repeatCount="indefinite"
            />
          </circle>
          {/* Trinity triangle */}
          <polygon
            points="140,50 220,190 60,190"
            fill="none"
            stroke="rgba(0,229,160,0.4)"
            strokeWidth="1.5"
          />
          {/* Center orb */}
          <circle
            cx="140" cy="140" r="40"
            fill="radial-gradient(circle, rgba(0,229,160,0.3) 0%, transparent 70%)"
          />
          <circle cx="140" cy="140" r="40" fill="rgba(0,229,160,0.08)">
            <animate attributeName="r" values="38;42;38" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" />
          </circle>
          {/* HS symbol */}
          <text
            x="140" y="148"
            textAnchor="middle"
            fill="#00e5a0"
            fontSize="22"
            fontFamily="'Cinzel Decorative', cursive"
            fontWeight="700"
          >
            HS
          </text>
        </svg>
      </div>

      {/* Title */}
      <div
        className="text-center mb-3"
        style={{
          fontFamily: "'Cinzel Decorative', cursive",
          fontSize: 'clamp(1.8em, 4vw, 3em)',
          letterSpacing: '6px',
          background: 'linear-gradient(90deg, #00e5a0, #ffd600, #dd00ff, #00e5a0)',
          backgroundSize: '300%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          animation: 'gradShift 4s infinite',
        }}
      >
        TRINITY HLB
      </div>
      <div
        style={{
          fontFamily: "'Share Tech Mono', monospace",
          color: '#ffd600',
          fontSize: '1em',
          letterSpacing: '4px',
          marginBottom: '6px',
        }}
      >
        v15 — DIVINE POWER EDITION
      </div>
      <div
        style={{
          fontFamily: "'Share Tech Mono', monospace",
          color: '#00e5a0',
          fontSize: '0.85em',
          marginBottom: '36px',
          opacity: 0.8,
        }}
      >
        POWER SCORE: {powerScore.toLocaleString()}
      </div>

      {/* Enter button */}
      <button
        onClick={handleEnter}
        style={{
          padding: '16px 48px',
          background: 'linear-gradient(135deg, #ff3d00, #dd00ff)',
          border: 'none',
          borderRadius: '50px',
          color: '#fff',
          fontFamily: "'Cinzel Decorative', cursive",
          fontSize: '0.9em',
          letterSpacing: '3px',
          cursor: 'pointer',
          boxShadow: '0 0 30px rgba(221,0,255,0.3)',
          transition: 'all 0.3s',
        }}
        onMouseEnter={e => {
          (e.target as HTMLButtonElement).style.transform = 'scale(1.05)'
          ;(e.target as HTMLButtonElement).style.boxShadow = '0 0 50px rgba(221,0,255,0.5)'
        }}
        onMouseLeave={e => {
          (e.target as HTMLButtonElement).style.transform = 'scale(1)'
          ;(e.target as HTMLButtonElement).style.boxShadow = '0 0 30px rgba(221,0,255,0.3)'
        }}
      >
        ENTER THE SYSTEM
      </button>

      <style>{`
        @keyframes gradShift {
          0%, 100% { background-position: 0% }
          50% { background-position: 100% }
        }
      `}</style>
    </div>
  )
}

// ─── STAR FIELD ──────────────────────────────────────────────────────────────
function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.3,
      speed: Math.random() * 0.3 + 0.05,
      opacity: Math.random() * 0.7 + 0.3,
    }))

    let animId: number
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const s of stars) {
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${s.opacity})`
        ctx.fill()
        s.y += s.speed
        if (s.y > canvas.height) {
          s.y = 0
          s.x = Math.random() * canvas.width
        }
      }
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    />
  )
}

// ─── LOGIN SCREEN ─────────────────────────────────────────────────────────────
function LoginScreen() {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at center, #0a0020 0%, #000 100%)' }}
    >
      <StarField />
      <div
        style={{
          maxWidth: 480,
          width: '90%',
          background: 'rgba(10,0,30,0.95)',
          border: '1px solid rgba(0,229,160,0.3)',
          borderRadius: 20,
          padding: 40,
          textAlign: 'center',
          boxShadow: '0 0 80px rgba(0,229,160,0.15), inset 0 0 40px rgba(0,0,0,0.5)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          style={{
            fontFamily: "'Cinzel Decorative', cursive",
            fontSize: '1.3em',
            color: '#00e5a0',
            letterSpacing: 4,
            marginBottom: 8,
          }}
        >
          TRINITY HLB
        </div>
        <div
          style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: '0.9em',
            marginBottom: 28,
            fontFamily: "'Share Tech Mono', monospace",
          }}
        >
          v15 — DIVINE POWER EDITION
        </div>
        <div
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            color: '#ffd600',
            fontSize: '0.85em',
            marginBottom: 28,
            padding: '12px',
            border: '1px solid rgba(255,214,0,0.2)',
            borderRadius: 8,
            background: 'rgba(255,214,0,0.05)',
          }}
        >
          HUSTLE × LEGACY × BEAST = POWER
        </div>
        <a
          href={getLoginUrl()}
          style={{
            display: 'block',
            width: '100%',
            padding: '16px',
            background: 'linear-gradient(135deg, #00e5a0, #0077ff)',
            border: 'none',
            borderRadius: 12,
            color: '#000',
            fontFamily: "'Cinzel Decorative', cursive",
            fontSize: '0.9em',
            fontWeight: 700,
            letterSpacing: 2,
            cursor: 'pointer',
            textDecoration: 'none',
            transition: 'all 0.3s',
          }}
        >
          ENTER THE SYSTEM
        </a>
      </div>
    </div>
  )
}

// ─── MAIN HOME ────────────────────────────────────────────────────────────────
export default function Home() {
  const { user, loading, isAuthenticated } = useAuth()
  const [splashDone, setSplashDone] = useState(() => {
    return localStorage.getItem('v15-splash-done') === 'true'
  })

  const { data: progression } = trpc.hsProgression.get.useQuery(undefined, {
    enabled: isAuthenticated && splashDone,
  })
  const { data: snapshot } = trpc.hsDaily.getToday.useQuery(undefined, {
    enabled: isAuthenticated && splashDone,
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#000005' }}>
        <Loader2 className="animate-spin" size={48} style={{ color: '#00e5a0' }} />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginScreen />
  }

  if (!splashDone) {
    return (
      <SplashScreen
        onEnter={() => {
          localStorage.setItem('v15-splash-done', 'true')
          setSplashDone(true)
        }}
      />
    )
  }

  return <Stage1Hub progression={progression} snapshot={snapshot} />
}
