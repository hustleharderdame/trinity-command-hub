/**
 * HUSTLE SYSTEM v16.1 — UNABRIDGED MASTER FILE
 * Anchor: HS.NLM.16.1.SOVEREIGN
 * Core Formula: (Hustle + Faith) ^ Love = Manifestation
 */

// ─── MISSION ARCHITECTURE: 200 LEVELS ───

export const MISSION_1_ASCENT = {
  name: 'The Ascent',
  levels: '1–100',
  goal: '$100,000 cash saved + Mind/Body/Soul mastery',
  stages: [
    {
      id: 'traphouse',
      name: 'TrapHouse',
      levels: '1–25',
      description: 'Survival & Ignition. Secure identity, basic tracking, first money moves.',
      unlockXP: 0,
      unlockedAt: 'start',
    },
    {
      id: 'apartment',
      name: 'Apartment',
      levels: '26–50',
      description: 'Discipline & Structure. Environment reset, consistent routines, skill building.',
      unlockXP: 2500,
      unlockedAt: 'level_26',
    },
    {
      id: 'first_home',
      name: 'First Home',
      levels: '51–75',
      description: 'Vision & Stability. Purpose definition, healing patterns, early wealth systems.',
      unlockXP: 6250,
      unlockedAt: 'level_51',
    },
    {
      id: 'dream_home',
      name: 'Dream Home',
      levels: '76–100',
      description: 'Integration & Breakthrough. Full MBS balance, $100K milestone, legacy foundation.',
      unlockXP: 10000,
      unlockedAt: 'level_76',
    },
  ],
}

export const MISSION_2_LEGENDARY = {
  name: 'Legendary Mode',
  levels: '101–200',
  goal: '$1,000,000 net worth + Money/Power/Respect mastery',
  stages: [
    {
      id: 'castle',
      name: 'Castle',
      levels: '101–150',
      description: 'Scaling & Automation. Business systems, partnerships, IP protection.',
      unlockXP: 25000,
      unlockedAt: 'level_101',
    },
    {
      id: 'kingdom',
      name: 'Kingdom',
      levels: '151–200',
      description: 'Impact & Legacy. Global reach, giving back, generational wealth.',
      unlockXP: 50000,
      unlockedAt: 'level_151',
    },
    {
      id: 'transcendence',
      name: 'Transcendence',
      levels: '200+',
      description: 'Eternal balance. Full integration of MBS + MPR.',
      unlockXP: 100000,
      unlockedAt: 'level_200',
    },
  ],
}

// ─── CONSCIOUSNESS KERNEL RULES ───

export const KERNEL_RULES = {
  balancingScale: {
    left: 'Mind',
    center: 'Soul',
    right: 'Body',
    description: 'Self-Love marks pull the scale. Red = Body (self-betrayal), Green = Mind (highest-self).',
  },
  selfLoveMarks: {
    red: 'Absence of self-love, going against highest self',
    green: 'Honoring highest self, alignment with values',
    effect: 'Red marks pull scale right (Body), Green marks pull scale left (Mind)',
  },
  kernelEvaluation: {
    inputs: ['intention', 'action', 'self_love_alignment'],
    outputs: ['xp', 'harmony', 'marks', 'mutations', 'manifestation_ready'],
    process: 'Kernel processes every input and decides if a win manifests',
  },
  mutations: {
    darkAura: 'Triggered by extreme imbalance toward Body (red marks)',
    celestialGlow: 'Triggered by sustained Mind/Soul balance (green marks)',
    recovery: 'Forced Recovery Mode if imbalance exceeds threshold',
  },
}

// ─── DAILY FLOW: HUSTLE STREET → FAITH STREET ───

export const DAILY_FLOW = [
  {
    step: 1,
    name: 'Hustle Street',
    action: 'Take action (journal, mission, money log, tactical move)',
    interface: 'Hustle Street UI',
  },
  {
    step: 2,
    name: 'Kernel Evaluation',
    action: 'Processes intention + action + self-love alignment',
    interface: 'Background (Consciousness Kernel)',
  },
  {
    step: 3,
    name: 'Faith Street Pickup',
    action: 'If approved, notification: "Your manifestation has arrived on Faith Street"',
    interface: 'Faith Street UI',
  },
  {
    step: 4,
    name: 'Reflection',
    action: 'Log gratitude and faith statement in Journal',
    interface: 'Journal / Scrapbook',
  },
]

// ─── MODULE MAPPING ───

export const MODULE_MAPPING = {
  purgatory: 'Awakening & scale (Levels 1–5 onboarding)',
  hustleStreet: 'Tactical execution, missions, money logs',
  faithStreet: 'Manifestation pickup, gratitude, reflection',
  journal: 'Soul Journal with Twin/Beast dual response',
  scrapbook: 'Ideals dump, family dossier, legacy entries',
  tactical: 'HL4 Financial Firewall, daily decalogue',
  dashboard: 'Clean SaaS bento view (command center)',
}

// ─── STAGE PROGRESSION CRITERIA ───

export const STAGE_PROGRESSION = {
  criteria: ['Spiritual Age', 'Completed Milestones', 'Sustained Harmony'],
  note: 'Progress is NOT tied to calendar time, but to earned achievements and balance.',
  traphouse_to_apartment: {
    required: 'Level 25 + $5K saved + Min 50 Spiritual Age',
    xpNeeded: 2500,
  },
  apartment_to_first_home: {
    required: 'Level 50 + $25K saved + Min 100 Spiritual Age + 3-day harmony streak',
    xpNeeded: 6250,
  },
  first_home_to_dream_home: {
    required: 'Level 75 + $75K saved + Min 150 Spiritual Age + 7-day harmony streak',
    xpNeeded: 10000,
  },
  dream_home_to_castle: {
    required: 'Level 100 + $100K saved + Min 200 Spiritual Age + Balanced MBS',
    xpNeeded: 25000,
  },
  castle_to_kingdom: {
    required: 'Level 150 + $500K net worth + Min 300 Spiritual Age + Balanced MPR',
    xpNeeded: 50000,
  },
  kingdom_to_transcendence: {
    required: 'Level 200 + $1M net worth + Min 400 Spiritual Age + Full MBS+MPR integration',
    xpNeeded: 100000,
  },
}

// ─── KERNEL FORMULAS ───

export function calculateHarmony(
  mindBalance: number,
  bodyBalance: number,
  soulBalance: number,
  greenMarks: number,
  redMarks: number
): number {
  const balanceScore = (mindBalance + bodyBalance + soulBalance) / 3
  const markScore = (greenMarks - redMarks * 2) / Math.max(greenMarks + redMarks, 1)
  return Math.round((balanceScore * 0.6 + markScore * 0.4) * 100) / 100
}

export function calculateMutation(
  harmony: number,
  greenMarks: number,
  redMarks: number
): 'celestial_glow' | 'dark_aura' | 'neutral' {
  if (harmony > 75 && greenMarks > redMarks * 3) return 'celestial_glow'
  if (harmony < 25 && redMarks > greenMarks * 3) return 'dark_aura'
  return 'neutral'
}

export function calculateSpiritualAge(
  xp: number,
  completedMilestones: number,
  harmonyDays: number
): number {
  return Math.floor(xp / 1000) + completedMilestones * 5 + harmonyDays
}

export function shouldManifest(
  intention: string,
  actionCompletion: number,
  selfLoveAlignment: number
): boolean {
  const intentionScore = intention.length > 20 ? 1 : 0.5
  const actionScore = actionCompletion / 100
  const alignmentScore = selfLoveAlignment / 10
  const manifestProbability = (intentionScore + actionScore + alignmentScore) / 3
  return manifestProbability > 0.6
}

// ─── FAITH STREET PICKUP REWARDS ───

export const FAITH_STREET_REWARDS = {
  onPickup: {
    xp: 'Variable based on action quality',
    harmonyPoints: '+10 to +50',
    mark: 'Green Mark (self-love alignment)',
    insight: 'Personalized reflection from Twin/Beast',
  },
  gratitudeLog: 'User logs what manifested and why they believe it arrived',
  faithLockIn: 'Commitment to continue aligned actions',
}

// ─── SELF-LOVE SCALE RULES ───

export const SELF_LOVE_SCALE = {
  redMarkTriggers: [
    'Breaking commitments to self',
    'Ignoring intuition',
    'Choosing comfort over growth',
    'Disrespecting your body/mind/soul',
    'Betraying your values',
  ],
  greenMarkTriggers: [
    'Honoring commitments',
    'Following intuition',
    'Choosing growth over comfort',
    'Respecting your body/mind/soul',
    'Living your values',
  ],
  extremeImbalanceWarning: 'If scale tips beyond ±70%, Recovery Mode is triggered',
}

// ─── PURGATORY ONBOARDING (LEVELS 1–5) ───

export const PURGATORY_ONBOARDING = {
  levels: '1–5',
  description: 'Awakening & scale calibration',
  steps: [
    { level: 1, task: 'Name your Soul Beast', reward: '100 XP' },
    { level: 2, task: 'Set your first money goal', reward: '200 XP' },
    { level: 3, task: 'Log your first journal entry', reward: '300 XP' },
    { level: 4, task: 'Complete your first mission', reward: '400 XP' },
    { level: 5, task: 'Receive your first manifestation', reward: '500 XP + Green Mark' },
  ],
}

export const HUSTLE_SYSTEM_V16 = {
  version: '16.1',
  anchor: 'HS.NLM.16.1.SOVEREIGN',
  coreFormula: '(Hustle + Faith) ^ Love = Manifestation',
  missions: [MISSION_1_ASCENT, MISSION_2_LEGENDARY],
  kernelRules: KERNEL_RULES,
  dailyFlow: DAILY_FLOW,
  moduleMapping: MODULE_MAPPING,
  stageProgression: STAGE_PROGRESSION,
  purgatory: PURGATORY_ONBOARDING,
}
