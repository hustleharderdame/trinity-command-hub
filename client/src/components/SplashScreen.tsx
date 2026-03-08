import { useEffect, useState } from 'react'

interface SplashScreenProps {
  onComplete: () => void
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(onComplete, 500)
          return 100
        }
        return prev + Math.random() * 30
      })
    }, 300)

    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black overflow-hidden z-50">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-black to-black" />

      {/* Content */}
      <div className="relative z-10 text-center">
        <h1 className="font-orbitron text-6xl font-black text-soul-gold mb-2" style={{ textShadow: '0 0 50px rgba(255,215,0,0.5)' }}>
          TRINITY
        </h1>
        <h1 className="font-orbitron text-6xl font-black text-soul-gold -mt-8" style={{ textShadow: '0 0 50px rgba(255,215,0,0.5)' }}>
          HLB
        </h1>

        <p className="font-orbitron text-xl text-primary mt-12">v13.0 | UNIFIED EMPIRE</p>
        <p className="text-sm text-muted-foreground mt-2">Phoenix Edition | 4 Modes | Drive Sync</p>

        {/* Loading Bar */}
        <div className="w-48 h-1 bg-muted/30 rounded-full mx-auto mt-16 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-soul-gold transition-all duration-300"
            style={{ width: `${Math.min(progress, 100)}%`, boxShadow: '0 0 10px var(--primary)' }}
          />
        </div>

        <p className="font-mono text-xs text-muted-foreground mt-6">INITIALIZING TRINITY ENGINE...</p>
      </div>
    </div>
  )
}
