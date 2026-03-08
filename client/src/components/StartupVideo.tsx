import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'

interface StartupVideoProps {
  onComplete: () => void
}

export default function StartupVideo({ onComplete }: StartupVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [showSkip, setShowSkip] = useState(false)
  const [typewriterText, setTypewriterText] = useState('')
  const [videoEnded, setVideoEnded] = useState(false)

  const fullText = 'REALITY CHECK INITIATED...'

  // Typewriter effect
  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setTypewriterText(fullText.substring(0, index))
        index++
      } else {
        clearInterval(interval)
      }
    }, 80)

    return () => clearInterval(interval)
  }, [])

  // Show skip button after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowSkip(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  // Handle video end
  const handleVideoEnd = () => {
    setVideoEnded(true)
    // Auto-transition after 2 seconds
    setTimeout(() => {
      onComplete()
    }, 2000)
  }

  const handleSkip = () => {
    onComplete()
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center overflow-hidden">
      {/* Video background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        onEnded={handleVideoEnd}
        autoPlay
        muted
      >
        <source
          src="https://d2xsxph8kpxj0f.cloudfront.net/310519663135523910/Zyb3U9XY3iwn56Cnt4twok/grok_video_2026-02-04-22-23-15_27ae4889.mp4"
          type="video/mp4"
        />
      </video>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />

      {/* Typewriter text overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center">
          <h1
            className="text-4xl sm:text-6xl font-bold text-cyan-500 mb-8"
            style={{
              textShadow: '0 0 20px rgba(0, 255, 255, 0.8), 0 0 40px rgba(0, 255, 255, 0.4)',
              fontFamily: 'Courier New, monospace',
              letterSpacing: '3px',
              minHeight: '80px',
            }}
          >
            {typewriterText}
            {typewriterText !== fullText && (
              <span className="animate-pulse">_</span>
            )}
          </h1>

          {videoEnded && (
            <div className="animate-fade-in">
              <p className="text-pink-500 text-xl font-bold mb-4" style={{ textShadow: '0 0 10px rgba(255, 0, 255, 0.6)' }}>
                ENTERING STAGE 1...
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Skip button - appears after 3 seconds */}
      {showSkip && !videoEnded && (
        <Button
          onClick={handleSkip}
          className="absolute bottom-8 right-8 bg-cyan-500/20 border border-cyan-500/50 text-cyan-500 hover:bg-cyan-500/30 font-mono text-sm py-2 px-4 rounded transition-all z-20"
          style={{ boxShadow: '0 0 10px rgba(0, 255, 255, 0.3)' }}
        >
          SKIP ▶
        </Button>
      )}

      {/* Replay button - appears after video ends */}
      {videoEnded && (
        <Button
          onClick={() => {
            if (videoRef.current) {
              videoRef.current.currentTime = 0
              videoRef.current.play()
              setVideoEnded(false)
              setTypewriterText('')
            }
          }}
          className="absolute bottom-8 left-8 bg-pink-500/20 border border-pink-500/50 text-pink-500 hover:bg-pink-500/30 font-mono text-sm py-2 px-4 rounded transition-all z-20"
          style={{ boxShadow: '0 0 10px rgba(255, 0, 255, 0.3)' }}
        >
          ↻ REPLAY
        </Button>
      )}

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-in;
        }
      `}</style>
    </div>
  )
}
