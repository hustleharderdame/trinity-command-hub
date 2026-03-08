import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface TrapHouseHubProps {
  onNavigate: (screen: string) => void
  userLevel: number
  totalXP: number
  currentStreak: number
}

interface GraffitiElement {
  id: string
  label: string
  x: number
  y: number
  screen: string
  icon: string
  description: string
}

const GRAFFITI_ELEMENTS: GraffitiElement[] = [
  {
    id: 'tactical',
    label: 'EXECUTION TABLET',
    x: 20,
    y: 30,
    screen: 'execution_tablet',
    icon: '⚔️',
    description: 'Daily missions & morning ignition',
  },
  {
    id: 'journal',
    label: 'LEGACY TOME',
    x: 75,
    y: 25,
    screen: 'legacy_tome',
    icon: '📖',
    description: 'Nightly execution report & XP',
  },
  {
    id: 'command',
    label: 'TRINITY DASHBOARD',
    x: 50,
    y: 60,
    screen: 'trinity_dashboard',
    icon: '🎛️',
    description: 'Pillar tracking & wealth metrics',
  },
  {
    id: 'story',
    label: 'ASCENSION MAP',
    x: 25,
    y: 75,
    screen: 'ascension_map',
    icon: '🗺️',
    description: '200-level progression journey',
  },
]

export default function TrapHouseHub({ onNavigate, userLevel, totalXP, currentStreak }: TrapHouseHubProps) {
  const [hoveredElement, setHoveredElement] = useState<string | null>(null)
  const [selectedElement, setSelectedElement] = useState<GraffitiElement | null>(null)

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Looping Trap House background video */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1200 800%22><rect fill=%22%23001a00%22 width=%221200%22 height=%22800%22/><path d=%22M0 400 Q300 350 600 400 T1200 400%22 stroke=%22%2300ff00%22 stroke-width=%222%22 fill=%22none%22 opacity=%220.3%22/><circle cx=%22100%22 cy=%22200%22 r=%2250%22 fill=%22%23003300%22 opacity=%220.5%22/><circle cx=%221100%22 cy=%22600%22 r=%2280%22 fill=%22%23003300%22 opacity=%220.4%22/></svg>')] bg-cover opacity-20" />
      </div>

      {/* Header stats */}
      <div className="relative z-10 p-6 flex justify-between items-center border-b border-primary/20">
        <div className="flex gap-8">
          <div className="text-center">
            <p className="text-muted-foreground text-sm font-mono">LEVEL</p>
            <p className="text-3xl font-bold text-primary font-orbitron">{userLevel}</p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground text-sm font-mono">TOTAL XP</p>
            <p className="text-3xl font-bold text-soul-gold font-orbitron">{totalXP}</p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground text-sm font-mono">STREAK</p>
            <p className="text-3xl font-bold text-primary font-orbitron">{currentStreak}🔥</p>
          </div>
        </div>

        {/* Mansion status */}
        <div className="text-right">
          <p className="text-muted-foreground text-sm font-mono">CURRENT ESTATE</p>
          <p className="text-xl font-bold text-primary font-orbitron">
            {userLevel < 20 ? 'TRAP HOUSE' : userLevel < 50 ? 'APARTMENT' : userLevel < 100 ? 'HOUSE' : 'PENTHOUSE'}
          </p>
        </div>
      </div>

      {/* Graffiti wall with invisible button overlays */}
      <div className="relative z-10 flex-1 p-8">
        <div className="relative w-full h-full max-w-4xl mx-auto">
          {/* SVG Graffiti background */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Decorative graffiti lines */}
            <path d="M 10 10 Q 50 5 90 10" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-primary/30" />
            <path d="M 5 90 Q 50 95 95 90" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-primary/30" />
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.3" fill="none" className="text-primary/20" />
          </svg>

          {/* Invisible interactive buttons over graffiti elements */}
          {GRAFFITI_ELEMENTS.map(element => (
            <div
              key={element.id}
              className="absolute w-20 h-20 cursor-pointer transition-all duration-300"
              style={{
                left: `${element.x}%`,
                top: `${element.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              onMouseEnter={() => setHoveredElement(element.id)}
              onMouseLeave={() => setHoveredElement(null)}
              onClick={() => setSelectedElement(element)}
            >
              {/* Hover indicator */}
              {hoveredElement === element.id && (
                <div className="absolute inset-0 rounded-lg border-2 border-primary/50 animate-pulse" />
              )}

              {/* Icon display */}
              <div className="flex items-center justify-center h-full text-4xl">{element.icon}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Element detail panel */}
      {selectedElement && (
        <Card className="fixed bottom-8 left-8 right-8 max-w-md glass-panel p-6 border-primary/30 z-20 animate-in slide-in-from-bottom duration-300">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-2xl mb-2">{selectedElement.icon}</p>
              <h3 className="text-xl font-bold text-primary font-orbitron">{selectedElement.label}</h3>
              <p className="text-sm text-muted-foreground mt-1">{selectedElement.description}</p>
            </div>
            <button
              onClick={() => setSelectedElement(null)}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              ✕
            </button>
          </div>

          <Button
            onClick={() => {
              onNavigate(selectedElement.screen)
              setSelectedElement(null)
            }}
            className="w-full bg-primary text-black hover:bg-primary/90 font-bold"
          >
            ENTER {selectedElement.label}
          </Button>
        </Card>
      )}

      {/* Mansion upgrade notification */}
      {userLevel === 20 || userLevel === 50 || userLevel === 100 ? (
        <div className="fixed top-8 right-8 z-20 animate-in fade-in duration-500">
          <Card className="glass-panel p-4 border-soul-gold/50 bg-soul-gold/10">
            <p className="text-soul-gold font-bold font-orbitron">🏆 MANSION UPGRADED!</p>
            <p className="text-sm text-muted-foreground">
              {userLevel === 20 ? 'Welcome to the Apartment' : userLevel === 50 ? 'Welcome to the House' : 'Welcome to the Penthouse'}
            </p>
          </Card>
        </div>
      ) : null}
    </div>
  )
}
