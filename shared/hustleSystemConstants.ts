/**
 * HustleSystem Master Index Constants
 * Mathematical kernels, Trinity formulas, and consciousness architecture
 */

// ─── Core Variables ───
export const PHI = 1.618033988749895 // Golden Ratio - Consciousness Architecture constant
export const SIGNATURE_PRIME = '∞.♡.⚡.◊' // Mark of realized system

// ─── MBS (Mind, Body, Soul) - Internal Engine ───
export const MBS_CREDITS = {
  MIND: { max: 20, label: 'Clarity, Focus, Mind OS' },
  BODY: { max: 15, label: 'Physical temple, energy, habits' },
  SOUL: { max: 15, label: 'Presence, gratitude, divine alignment' },
}

// ─── MPR (Money, Power, Respect) - External Engine ───
export const MPR_CREDITS = {
  MONEY: { max: 20, label: 'Gross revenue and capital flow' },
  POWER: { max: 15, label: 'Influence, momentum, system control' },
  RESPECT: { max: 15, label: 'Reputation, boundaries, social loyalty' },
}

export const DAILY_CREDIT_CAP = 100
export const PERFECT_DAY_BONUS = 10

// ─── Blessing Probability Formula ───
// Blessing% = min(95, (F/10)^2 × L × (1 + (Streak × 0.1)))
export function calculateBlessingProbability(
  faith: number,
  love: number,
  streak: number
): number {
  const baseFormula = Math.pow(faith / 10, 2) * love * (1 + streak * 0.1)
  return Math.min(95, baseFormula)
}

// ─── Progressive Scaffolding: 5 Stages of Autonomy ───
export const AUTONOMY_STAGES = [
  {
    level: 1,
    name: 'I DO',
    systemControl: 95,
    voice: 'Soul Beast',
    description: 'Direct, commanding. Binary tracking: execution or failure.',
  },
  {
    level: 2,
    name: 'WE DO',
    systemControl: 70,
    voice: 'Beast + Twin',
    description: 'Collaborative. System suggests 2–3 options for user confirmation.',
  },
  {
    level: 3,
    name: 'YOU DO',
    systemControl: 40,
    voice: 'Queen Gem',
    description: 'Neutral/Data-driven. System reminds while user initiates action.',
  },
  {
    level: 4,
    name: 'YOU FLY',
    systemControl: 20,
    voice: 'AI Twin',
    description: 'Advisory mode; user self-manages with feedback.',
  },
  {
    level: 5,
    name: 'YOU SOAR',
    systemControl: 5,
    voice: 'Phoenix',
    description: 'Sovereign mode; the system acts as a silent safety net.',
  },
]

// ─── Hustle Age & Financial Milestones ───
export const FINANCIAL_MILESTONES = [
  {
    hlvl: '0–100',
    name: 'Infant Hustler',
    milestone: '$100K Gross',
    description: '1K gross per level. Proving revenue generation.',
  },
  {
    hlvl: '101–200',
    name: 'Optimized Hustler',
    milestone: '$100K Net',
    description: 'Efficiency, margins, and tax control.',
  },
  {
    hlvl: '201–300',
    name: 'Capital Former',
    milestone: '$100K Saved',
    description: 'Wealth accumulation and discipline.',
  },
  {
    hlvl: '301–600',
    name: 'Millionaire',
    milestone: '$1M Net Worth',
    description: 'Wealth Multiplication.',
  },
  {
    hlvl: '601+',
    name: 'Soul Architect',
    milestone: 'Generational Wealth',
    description: 'Legacy Building and Impact.',
  },
]

// ─── MindDNA Strands ───
export const MINDDNA_STRANDS = {
  HUSTLE: { label: 'HUSTLE STRAND', description: 'Drive, Discipline, Persistence' },
  FAITH: { label: 'FAITH STRAND', description: 'Belief, Vision, Trust' },
  LOVE: { label: 'LOVE STRAND', description: 'Empathy, Creativity, Unity' },
}

// ─── Thought Cell Nucleotides ───
export interface ThoughtCell {
  id: string
  emotion: {
    frequencySignature: string // What it feels like
    intensity: number // 1-10
  }
  idea: {
    cognitiveMeaning: string // What it means
    clarity: number // 1-10
  }
  action: {
    behavioralOutput: string // What it does
    completion: number // 0-100%
  }
  timestamp: Date
  strands: ('HUSTLE' | 'FAITH' | 'LOVE')[] // Which strands this cell activates
}

// Expression Level = avg(Resonance) where Resonance = (Emotion.len + Idea.len + Action.len) / 3
export function calculateExpressionLevel(cells: ThoughtCell[]): number {
  if (cells.length === 0) return 0
  const resonances = cells.map((cell) => {
    const emotionLen = cell.emotion.frequencySignature.length
    const ideaLen = cell.idea.cognitiveMeaning.length
    const actionLen = cell.action.behavioralOutput.length
    return (emotionLen + ideaLen + actionLen) / 3
  })
  return resonances.reduce((a, b) => a + b, 0) / resonances.length
}

// ─── Behavioral Governance: Energetic Justice Modes ───
export const ENERGETIC_JUSTICE_MODES = {
  IDEALIZATION: {
    trigger: 'High Love + High Faith',
    response: 'NPCs and situations show admiration; opportunities multiply.',
    emoji: '✨',
  },
  DISCIPLINE: {
    trigger: 'Low Love + Reckless Ego',
    response: 'Path tightens; delays, hard lessons, and setbacks occur to build mastery.',
    emoji: '⚖️',
  },
  REFLECTION: {
    trigger: 'Inconsistent Energy',
    response: 'Story slows; mirrors appear in dialogue to prompt re-centering.',
    emoji: '💭',
  },
  RECONCILIATION: {
    trigger: 'Acknowledgement of Error',
    response: 'System grants "Grace Bonuses" and energy boosts for transparency.',
    emoji: '❤️',
  },
}

// ─── Disrespect Response Framework ───
export const DISRESPECT_RESPONSES = [
  {
    level: 1,
    name: 'Light Check',
    action: 'Subtle AI mirrors ("Ayo, you good?")',
    energyDrain: { love: -1, faith: -1 },
  },
  {
    level: 2,
    name: 'Heavy Check',
    action: 'Narrative shift; darker music, delayed rewards. "Every time you lose your peace, the world takes a tax."',
    energyDrain: { love: -3, faith: -2 },
  },
  {
    level: 3,
    name: 'Divine Discipline (Mirror Lock)',
    action: 'User locked into a symbolic event (setback/car breakdown) until alignment is restored.',
    energyDrain: { love: -5, faith: -5 },
  },
]

// ─── RPG World Layers ───
export const RPG_WORLD_LAYERS = [
  {
    name: 'TrapHouse',
    distance: '0 mi',
    description: 'Chaos, starting state. Minimal local clarity.',
    clarity: 0.1,
  },
  {
    name: 'The Street',
    distance: '1–250 mi',
    description: 'The connective road; represents Effort + Momentum and navigation.',
    clarity: 0.3,
  },
  {
    name: 'Apartments',
    distance: '250–500 mi',
    description: 'Stability begins to form; fog partially clears with alignment.',
    clarity: 0.5,
  },
  {
    name: 'Penthouse',
    distance: '500–800 mi',
    description: 'High responsibility, success, and sustained alignment.',
    clarity: 0.75,
  },
  {
    name: 'Mansion',
    distance: '1000 mi',
    description: 'Mastery, legacy, and ultimate integration.',
    clarity: 0.95,
  },
]

// ─── 6-Day Weekly Ritual ───
export const WEEKLY_RITUAL = [
  {
    day: 'Sunday',
    name: 'Divine Planning',
    focus: 'Review progress, set the Divine To-Do List, and organize inventory.',
  },
  {
    day: 'Monday',
    name: 'Foundation & Documents',
    focus: 'Focus on identity records, birth certificates, and survival systems.',
  },
  {
    day: 'Tuesday',
    name: 'Building & Creating',
    focus: 'Skill acquisition, resume work, and creative execution.',
  },
  {
    day: 'Wednesday',
    name: 'Family & Relationships',
    focus: 'Needs assessment for family; cultivating support networks.',
  },
  {
    day: 'Thursday',
    name: 'Resources & Systems',
    focus: 'Benefits applications (SNAP/social services) and system checks.',
  },
  {
    day: 'Friday',
    name: 'Completion & Momentum',
    focus: 'Finishing critical tasks and submitting all applications.',
  },
  {
    day: 'Saturday',
    name: 'Sabbath Rest',
    focus: 'Absolute rest. No productivity. Prepare the spirit for the new cycle.',
  },
]

// Divine To-Do List Hierarchy
export const DIVINE_TODO_HIERARCHY = ['Survival', 'Support', 'Growth']

// ─── The 16 Hustle Logs (HL0–HL15+) ───
export const HUSTLE_LOGS = {
  HL0: { name: 'Profile', description: 'Identity Kernel, System ID, Versioning, and Master Metrics.' },
  HL1: { name: 'Body & Lifestyle', description: 'TTDs, Energy levels, Mood, Nutrition, and Hygiene checklists.' },
  HL2: { name: 'Money & American Basics', description: 'Secure IDs, Vital records, Income sources, and Bank databases.' },
  HL4: { name: 'Mind OS', description: 'Budgeting, Knowledge Bank, Personal life code, and Thought Detox logs.' },
  HL6: { name: 'Mission/Business', description: 'LLC Management and AI Entrepreneur Team logs.' },
  HL7: { name: 'Family/Relationships', description: 'Family Dossier, Loyalty Tiers, and Relationship Mapping.' },
  HL9: { name: 'Legacy/Freestyle', description: 'Unabridged logs, Time capsules, and Inheritance planning.' },
  HL11: { name: 'Spaceship Systems', description: 'Technical monitoring of Reactor, Fuel, Shields, and Cockpit Mode.' },
}

// ─── The 9 Interfaces ───
export const NINE_INTERFACES = [
  {
    id: 1,
    name: 'Closed Tome',
    description: 'Landing screen for identity setup, archetype selection, and cinematic entry.',
  },
  {
    id: 2,
    name: 'Open Codex',
    description: 'Primary daily journal featuring a "Soul Temperature" slider and consciousness note fields.',
  },
  {
    id: 3,
    name: 'Tactical Mode',
    description: 'Fast task logging with "Context Switchers" (Phone/Computer/Planning) and domain tags.',
  },
  {
    id: 4,
    name: 'Gaming Journal',
    description: 'RPG progression view with XP bars, pillar circles, and achievement unlocks.',
  },
  {
    id: 5,
    name: 'SIGMA Dashboard',
    description: '3D visualization of the 4D coordinates (H^2/F^2/L/T) and Trinity Engine status.',
  },
  {
    id: 6,
    name: 'Stage Journey',
    description: 'A 25-stage visual progression tree mapping the 200-level journey.',
  },
  {
    id: 7,
    name: 'Cockpit Flame',
    description: 'Driving-optimized interface with large touch targets, shift timers, and income/gas logging.',
  },
  {
    id: 8,
    name: 'Framework Map',
    description: 'Interactive module diagram showing engine connections and formula references.',
  },
  {
    id: 9,
    name: 'Tech Inspiration',
    description: 'Development roadmap containing AI Council notes and future architecture snippets.',
  },
]
