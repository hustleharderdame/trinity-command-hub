import { createContext, useContext, useMemo } from 'react'

export type LightingMode = 'beast' | 'zen' | 'danger'

interface LightingTheme {
  mode: LightingMode
  primaryColor: string
  accentColor: string
  shadowIntensity: string
  animationSpeed: string
  glitchIntensity: number
  description: string
}

interface DynamicLightingContextType {
  theme: LightingTheme
  setMode: (mode: LightingMode) => void
  getModeFromScore: (mindScore: number, bodyScore: number, soulScore: number) => LightingMode
}

const LIGHTING_THEMES: Record<LightingMode, LightingTheme> = {
  beast: {
    mode: 'beast',
    primaryColor: '#ff3333', // Neon red
    accentColor: '#ff9900', // Orange
    shadowIntensity: 'drop-shadow(0 0 20px rgba(255, 51, 51, 0.8))',
    animationSpeed: 'fast',
    glitchIntensity: 0,
    description: 'BEAST MODE - High action, aggressive energy',
  },
  zen: {
    mode: 'zen',
    primaryColor: '#00f3ff', // Phoenix blue
    accentColor: '#ffd700', // Soul gold
    shadowIntensity: 'drop-shadow(0 0 10px rgba(0, 243, 255, 0.4))',
    animationSpeed: 'normal',
    glitchIntensity: 0,
    description: 'ZEN MODE - Balanced, flowing energy',
  },
  danger: {
    mode: 'danger',
    primaryColor: '#666666', // Desaturated
    accentColor: '#999999', // Gray
    shadowIntensity: 'drop-shadow(0 0 5px rgba(100, 100, 100, 0.3))',
    animationSpeed: 'slow',
    glitchIntensity: 0.3,
    description: 'DANGER ZONE - System failing, critical action needed',
  },
}

const DynamicLightingContext = createContext<DynamicLightingContextType | undefined>(undefined)

export function DynamicLightingProvider({ children }: { children: React.ReactNode }) {
  const getModeFromScore = (mindScore: number, bodyScore: number, soulScore: number): LightingMode => {
    const avgScore = (mindScore + bodyScore + soulScore) / 3

    // Danger Zone: All scores below 4
    if (mindScore < 4 && bodyScore < 4 && soulScore < 4) {
      return 'danger'
    }

    // Beast Mode: High action (one pillar high, balance low)
    if ((mindScore > 7 || bodyScore > 7 || soulScore > 7) && Math.abs(mindScore - bodyScore) > 3) {
      return 'beast'
    }

    // Zen Mode: Balanced
    if (avgScore > 5 && Math.abs(mindScore - bodyScore) < 2 && Math.abs(bodyScore - soulScore) < 2) {
      return 'zen'
    }

    // Default to beast if high action, zen if balanced, danger if low
    return avgScore < 4 ? 'danger' : avgScore > 6 ? 'beast' : 'zen'
  }

  const theme = useMemo(() => LIGHTING_THEMES.zen, [])

  return (
    <DynamicLightingContext.Provider value={{ theme, setMode: () => {}, getModeFromScore }}>
      {children}
    </DynamicLightingContext.Provider>
  )
}

export function useDynamicLighting() {
  const context = useContext(DynamicLightingContext)
  if (!context) {
    throw new Error('useDynamicLighting must be used within DynamicLightingProvider')
  }
  return context
}
