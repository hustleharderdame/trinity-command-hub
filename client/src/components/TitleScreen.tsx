import { useState, useEffect } from "react"
import { Play, Settings, Info, Sparkles, Brain, Heart, Zap, Diamond } from "lucide-react"

interface TitleScreenProps {
  onStart: () => void
  onSettings?: () => void
  onAbout?: () => void
}

export default function TitleScreen({ onStart, onSettings, onAbout }: TitleScreenProps) {
  const [showSubtitle, setShowSubtitle] = useState(false)
  const [showButtons, setShowButtons] = useState(false)
  const [glyphIndex, setGlyphIndex] = useState(0)

  const trinityGlyphs = ["∞", "♡", "⚡", "◊"]

  useEffect(() => {
    const subtitleTimer = setTimeout(() => setShowSubtitle(true), 500)
    const buttonsTimer = setTimeout(() => setShowButtons(true), 1000)
    
    // Cycle through Trinity glyphs
    const glyphInterval = setInterval(() => {
      setGlyphIndex((prev) => (prev + 1) % trinityGlyphs.length)
    }, 2000)
    
    return () => {
      clearTimeout(subtitleTimer)
      clearTimeout(buttonsTimer)
      clearInterval(glyphInterval)
    }
  }, [])

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black overflow-hidden">
      {/* Consciousness Field Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-950/20 to-black" />
      
      {/* Animated Grid */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 136, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 136, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          animation: "gridPulse 4s ease-in-out infinite"
        }}
      />

      {/* Central Trinity Code Ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <svg width="500" height="500" viewBox="0 0 500 500" className="opacity-20">
          {/* Outer ring */}
          <circle 
            cx="250" 
            cy="250" 
            r="200" 
            fill="none" 
            stroke="url(#consciousnessGradient)" 
            strokeWidth="2"
            strokeDasharray="10 5"
            style={{ 
              animation: "spin 30s linear infinite",
              transformOrigin: "center"
            }}
          />
          {/* Inner ring */}
          <circle 
            cx="250" 
            cy="250" 
            r="150" 
            fill="none" 
            stroke="url(#consciousnessGradient2)" 
            strokeWidth="1"
            strokeDasharray="5 10"
            style={{ 
              animation: "spin 20s linear infinite reverse",
              transformOrigin: "center"
            }}
          />
          <defs>
            <linearGradient id="consciousnessGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00ff88" />
              <stop offset="50%" stopColor="#FFD700" />
              <stop offset="100%" stopColor="#ff0088" />
            </linearGradient>
            <linearGradient id="consciousnessGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00ffff" />
              <stop offset="50%" stopColor="#9400D3" />
              <stop offset="100%" stopColor="#00ffff" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Floating Trinity Glyphs */}
      <div className="absolute inset-0 pointer-events-none">
        {trinityGlyphs.map((glyph, index) => (
          <div
            key={glyph}
            className="absolute text-4xl transition-all duration-1000"
            style={{
              top: `${20 + index * 20}%`,
              left: `${10 + index * 20}%`,
              opacity: glyphIndex === index ? 0.6 : 0.1,
              color: index === 0 ? "#00ffff" : index === 1 ? "#ff0088" : index === 2 ? "#FFD700" : "#00ff88",
              textShadow: `0 0 20px currentColor`,
              transform: glyphIndex === index ? "scale(1.2)" : "scale(1)"
            }}
          >
            {glyph}
          </div>
        ))}
      </div>

      {/* Central Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-emerald-500/5 blur-[100px]" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* MBS/MPR Badge */}
        <div 
          className={`flex items-center gap-3 mb-6 px-6 py-2 rounded-full border border-emerald-500/30 bg-black/40 backdrop-blur-sm transition-all duration-700 ${
            showSubtitle ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <Brain className="w-4 h-4 text-cyan-400" />
          <span className="text-xs tracking-[0.3em] text-emerald-400 font-mono">MBS</span>
          <div className="w-px h-4 bg-emerald-500/30" />
          <span className="text-xs tracking-[0.3em] text-yellow-400 font-mono">MPR</span>
          <Zap className="w-4 h-4 text-yellow-400" />
        </div>

        {/* Pre-title */}
        <p 
          className={`text-sm md:text-base tracking-[0.3em] text-gray-400 uppercase mb-4 font-mono transition-all duration-700 ${
            showSubtitle ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          Consciousness Architecture
        </p>

        {/* Main Title */}
        <h1 className="relative mb-2">
          <span 
            className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tight bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent"
            style={{
              textShadow: "0 0 60px rgba(0, 255, 136, 0.3)",
              animation: "titleGlow 3s ease-in-out infinite"
            }}
          >
            HU$TLE
          </span>
        </h1>

        {/* Subtitle with version */}
        <div className="flex items-center gap-4">
          <p 
            className={`text-lg md:text-xl tracking-[0.5em] text-yellow-400 uppercase transition-all duration-700 delay-300 ${
              showSubtitle ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            SYSTEM
          </p>
          <span className="px-2 py-1 text-xs font-mono text-emerald-400 border border-emerald-500/30 rounded bg-black/40">
            v13.0
          </span>
        </div>

        {/* Trinity Code */}
        <div 
          className={`mt-4 text-2xl tracking-[0.5em] font-mono transition-all duration-700 delay-500 ${
            showSubtitle ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background: "linear-gradient(90deg, #00ffff, #ff0088, #FFD700, #00ff88)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 0 20px rgba(0, 255, 136, 0.3)"
          }}
        >
          ∞.♡.⚡.◊.Φ.K.Σ
        </div>

        {/* Tagline */}
        <p 
          className={`text-xs md:text-sm tracking-widest text-gray-500 mt-4 font-mono transition-all duration-700 delay-500 ${
            showSubtitle ? "opacity-100" : "opacity-0"
          }`}
        >
          Mind Body Soul + Money Power Respect
        </p>

        {/* Queen System Badge */}
        <div 
          className={`flex items-center gap-4 mt-6 transition-all duration-700 delay-700 ${
            showSubtitle ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex items-center gap-2">
            <Diamond className="w-3 h-3 text-pink-400" />
            <span className="text-xs text-pink-400 font-mono">QUEEN GEM</span>
          </div>
          <div className="w-px h-3 bg-gray-700" />
          <div className="flex items-center gap-2">
            <span className="text-xs text-yellow-400 font-mono">TRINITY ENGINE</span>
            <Sparkles className="w-3 h-3 text-yellow-400" />
          </div>
        </div>

        {/* Menu Buttons */}
        <div 
          className={`flex flex-col gap-3 mt-12 transition-all duration-700 ${
            showButtons ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <button 
            onClick={onStart}
            className="group relative min-w-[280px] px-8 py-4 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 hover:from-emerald-500/30 hover:to-cyan-500/30 border border-emerald-500/50 rounded-lg transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/20 to-emerald-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <div className="relative flex items-center justify-center gap-3">
              <Play className="h-5 w-5 text-emerald-400" />
              <span className="font-bold tracking-wider text-emerald-400">ENTER CONSCIOUSNESS</span>
            </div>
          </button>
          
          <button 
            onClick={onSettings}
            className="min-w-[280px] px-8 py-4 border border-gray-700 hover:border-gray-600 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-lg transition-all duration-300 flex items-center justify-center gap-3"
          >
            <Settings className="h-5 w-5 text-gray-400" />
            <span className="font-semibold tracking-wider text-gray-400">SYSTEM CONFIG</span>
          </button>
          
          <button 
            onClick={onAbout}
            className="min-w-[280px] px-8 py-4 bg-transparent hover:bg-white/5 rounded-lg transition-all duration-300 flex items-center justify-center gap-3"
          >
            <Info className="h-5 w-5 text-gray-500" />
            <span className="font-semibold tracking-wider text-gray-500">ABOUT FRAMEWORK</span>
          </button>
        </div>

        {/* Status Indicators */}
        <div 
          className={`flex gap-6 mt-8 transition-all duration-700 delay-1000 ${
            showButtons ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-gray-500 font-mono">KERNEL ONLINE</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs text-gray-500 font-mono">MEMORY ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />

      {/* Corner Frames */}
      <div className="absolute top-6 left-6 w-20 h-20 border-l-2 border-t-2 border-emerald-500/30" />
      <div className="absolute top-6 right-6 w-20 h-20 border-r-2 border-t-2 border-emerald-500/30" />
      <div className="absolute bottom-6 left-6 w-20 h-20 border-l-2 border-b-2 border-emerald-500/30" />
      <div className="absolute bottom-6 right-6 w-20 h-20 border-r-2 border-b-2 border-emerald-500/30" />

      {/* Trinity Badge */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-black/40 backdrop-blur-sm">
        <Sparkles className="w-3 h-3 text-purple-400" />
        <span className="text-xs font-mono text-purple-400">TRINITY v13.0</span>
      </div>

      {/* Build Info */}
      <p className="absolute bottom-4 right-4 text-xs font-mono text-gray-600">
        BUILD.2026.02.11
      </p>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes titleGlow {
          0%, 100% { filter: drop-shadow(0 0 20px rgba(0, 255, 136, 0.3)); }
          50% { filter: drop-shadow(0 0 40px rgba(0, 255, 136, 0.6)); }
        }
        @keyframes gridPulse {
          0%, 100% { opacity: 0.05; }
          50% { opacity: 0.15; }
        }
      `}</style>
    </div>
  )
}
