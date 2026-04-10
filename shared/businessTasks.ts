/**
 * BUSINESS MASTERY TRACKER
 * Real-world tasks with mandatory MBS/MPR + 4 optional mastery levels
 * Each task represents a skill to master in business & life
 */

export type TaskCategory = 'sales' | 'product' | 'team' | 'finance' | 'marketing' | 'personal'

export interface MasteryChallenge {
  level: 1 | 2 | 3 | 4
  title: string
  description: string
  requirement: string
}

export interface BusinessTask {
  id: string
  name: string
  description: string
  category: TaskCategory
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  xpReward: number
  masteryRewards: {
    level1: number // XP for mastery 1
    level2: number
    level3: number
    level4: number
  }
  masteryChallenge: MasteryChallenge[]
  mandatoryMBS: {
    mind: string // What aspect of Mind is evaluated
    body: string
    soul: string
  }
  mandatoryMPR: {
    money: string
    power: string
    respect: string
  }
}

// ─── SALES & CLOSING ───

export const CLOSE_DEAL: BusinessTask = {
  id: 'close-deal',
  name: 'Close a Deal',
  description: 'Negotiate and close a business deal or sale',
  category: 'sales',
  difficulty: 'advanced',
  xpReward: 500,
  masteryRewards: { level1: 100, level2: 250, level3: 400, level4: 600 },
  masteryChallenge: [
    {
      level: 1,
      title: 'Baseline Close',
      description: 'Complete the deal with 70%+ average MBS/MPR',
      requirement: 'Mind ≥7, Body ≥7, Soul ≥7, Money ≥7, Power ≥7, Respect ≥7',
    },
    {
      level: 2,
      title: 'Strategic Close',
      description: 'Close with 80%+ MBS/MPR + document negotiation strategy',
      requirement: 'All MBS/MPR ≥8 + upload strategy document',
    },
    {
      level: 3,
      title: 'Teach the Close',
      description: 'Close the deal + teach someone else your technique',
      requirement: 'Complete + log evidence of teaching',
    },
    {
      level: 4,
      title: 'Master Closer',
      description: 'Close 2x faster than your baseline + 90%+ MBS/MPR',
      requirement: 'Time ≤ half of previous close + all MBS/MPR ≥9',
    },
  ],
  mandatoryMBS: {
    mind: 'Strategic clarity in negotiation',
    body: 'Energy and presence during close',
    soul: 'Integrity and win-win alignment',
  },
  mandatoryMPR: {
    money: 'Deal value / revenue impact',
    power: 'Influence used to close',
    respect: 'Trust built with counterparty',
  },
}

export const PITCH_PRODUCT: BusinessTask = {
  id: 'pitch-product',
  name: 'Pitch Your Product',
  description: 'Deliver a compelling pitch to investors, customers, or partners',
  category: 'sales',
  difficulty: 'intermediate',
  xpReward: 300,
  masteryRewards: { level1: 75, level2: 150, level3: 250, level4: 400 },
  masteryChallenge: [
    {
      level: 1,
      title: 'First Pitch',
      description: 'Deliver pitch with 70%+ MBS/MPR',
      requirement: 'All MBS/MPR ≥7',
    },
    {
      level: 2,
      title: 'Refined Pitch',
      description: 'Deliver with 80%+ MBS/MPR + record video',
      requirement: 'All MBS/MPR ≥8 + video evidence',
    },
    {
      level: 3,
      title: 'Teach Pitching',
      description: 'Pitch + coach someone else on pitching',
      requirement: 'Complete + coaching log',
    },
    {
      level: 4,
      title: 'Pitch Master',
      description: 'Deliver 3 pitches in one week, all 85%+ MBS/MPR',
      requirement: '3 pitches logged + all ≥8.5 average',
    },
  ],
  mandatoryMBS: {
    mind: 'Clear articulation of value prop',
    body: 'Confident delivery and presence',
    soul: 'Authentic belief in product',
  },
  mandatoryMPR: {
    money: 'Funding or revenue potential',
    power: 'Influence and persuasion used',
    respect: 'Credibility demonstrated',
  },
}

// ─── PRODUCT & LAUNCH ───

export const BUILD_FEATURE: BusinessTask = {
  id: 'build-feature',
  name: 'Build a Product Feature',
  description: 'Design, develop, and ship a new feature or product component',
  category: 'product',
  difficulty: 'advanced',
  xpReward: 600,
  masteryRewards: { level1: 120, level2: 300, level3: 500, level4: 800 },
  masteryChallenge: [
    {
      level: 1,
      title: 'Feature Complete',
      description: 'Ship feature with 70%+ MBS/MPR',
      requirement: 'All MBS/MPR ≥7',
    },
    {
      level: 2,
      title: 'Optimized Build',
      description: 'Ship with 80%+ MBS/MPR + performance metrics',
      requirement: 'All MBS/MPR ≥8 + upload metrics',
    },
    {
      level: 3,
      title: 'Teach Building',
      description: 'Build + document process for team to replicate',
      requirement: 'Complete + process documentation',
    },
    {
      level: 4,
      title: 'Build Master',
      description: 'Build 3 features in sprint with 85%+ MBS/MPR each',
      requirement: '3 features + all ≥8.5 average',
    },
  ],
  mandatoryMBS: {
    mind: 'Technical clarity and architecture',
    body: 'Execution speed and stamina',
    soul: 'Quality and craftsmanship',
  },
  mandatoryMPR: {
    money: 'Revenue impact of feature',
    power: 'Technical leadership shown',
    respect: 'Code quality and reliability',
  },
}

export const LAUNCH_PRODUCT: BusinessTask = {
  id: 'launch-product',
  name: 'Launch a Product',
  description: 'Take a product from concept to market launch',
  category: 'product',
  difficulty: 'expert',
  xpReward: 1000,
  masteryRewards: { level1: 200, level2: 500, level3: 800, level4: 1200 },
  masteryChallenge: [
    {
      level: 1,
      title: 'Launch Complete',
      description: 'Launch with 70%+ MBS/MPR',
      requirement: 'All MBS/MPR ≥7',
    },
    {
      level: 2,
      title: 'Smooth Launch',
      description: 'Launch with 80%+ MBS/MPR + zero critical bugs',
      requirement: 'All MBS/MPR ≥8 + bug log',
    },
    {
      level: 3,
      title: 'Teach Launching',
      description: 'Launch + create launch playbook for future launches',
      requirement: 'Complete + playbook documentation',
    },
    {
      level: 4,
      title: 'Launch Master',
      description: 'Launch with 90%+ MBS/MPR + 10x expected traction',
      requirement: 'All MBS/MPR ≥9 + traction metrics',
    },
  ],
  mandatoryMBS: {
    mind: 'Strategic go-to-market planning',
    body: 'Execution under pressure',
    soul: 'Vision and purpose clarity',
  },
  mandatoryMPR: {
    money: 'Revenue or funding from launch',
    power: 'Market influence and positioning',
    respect: 'Brand credibility established',
  },
}

// ─── TEAM & LEADERSHIP ───

export const HIRE_TEAM_MEMBER: BusinessTask = {
  id: 'hire-team',
  name: 'Hire a Team Member',
  description: 'Recruit, interview, and hire a new team member',
  category: 'team',
  difficulty: 'intermediate',
  xpReward: 400,
  masteryRewards: { level1: 100, level2: 200, level3: 350, level4: 550 },
  masteryChallenge: [
    {
      level: 1,
      title: 'First Hire',
      description: 'Hire with 70%+ MBS/MPR',
      requirement: 'All MBS/MPR ≥7',
    },
    {
      level: 2,
      title: 'Strategic Hire',
      description: 'Hire with 80%+ MBS/MPR + culture fit assessment',
      requirement: 'All MBS/MPR ≥8 + assessment doc',
    },
    {
      level: 3,
      title: 'Teach Hiring',
      description: 'Hire + mentor someone else on hiring process',
      requirement: 'Complete + mentoring log',
    },
    {
      level: 4,
      title: 'Hiring Master',
      description: 'Hire 3 team members in quarter, all high performers',
      requirement: '3 hires + performance reviews ≥8/10',
    },
  ],
  mandatoryMBS: {
    mind: 'Clear role definition and requirements',
    body: 'Energy in interviews and onboarding',
    soul: 'Cultural alignment and values fit',
  },
  mandatoryMPR: {
    money: 'Salary and ROI of hire',
    power: 'Team leverage and capability',
    respect: 'Candidate respect for role',
  },
}

export const CONDUCT_1ON1: BusinessTask = {
  id: 'conduct-1on1',
  name: 'Conduct 1-on-1 with Team Member',
  description: 'Have a meaningful 1-on-1 conversation with a direct report',
  category: 'team',
  difficulty: 'beginner',
  xpReward: 150,
  masteryRewards: { level1: 30, level2: 75, level3: 125, level4: 200 },
  masteryChallenge: [
    {
      level: 1,
      title: 'First 1-on-1',
      description: 'Conduct with 70%+ MBS/MPR',
      requirement: 'All MBS/MPR ≥7',
    },
    {
      level: 2,
      title: 'Deep 1-on-1',
      description: 'Conduct with 80%+ MBS/MPR + action items documented',
      requirement: 'All MBS/MPR ≥8 + action items log',
    },
    {
      level: 3,
      title: 'Teach 1-on-1s',
      description: 'Conduct + train manager on 1-on-1 best practices',
      requirement: 'Complete + training notes',
    },
    {
      level: 4,
      title: '1-on-1 Master',
      description: 'Conduct 4 weekly 1-on-1s with 85%+ MBS/MPR each',
      requirement: '4 1-on-1s + all ≥8.5 average',
    },
  ],
  mandatoryMBS: {
    mind: 'Active listening and clarity',
    body: 'Presence and energy',
    soul: 'Genuine care for person',
  },
  mandatoryMPR: {
    money: 'Performance and productivity impact',
    power: 'Leadership influence',
    respect: 'Trust and psychological safety',
  },
}

// ─── FINANCE & OPERATIONS ───

export const AUDIT_FINANCES: BusinessTask = {
  id: 'audit-finances',
  name: 'Audit Company Finances',
  description: 'Review and audit financial records, cash flow, and metrics',
  category: 'finance',
  difficulty: 'intermediate',
  xpReward: 350,
  masteryRewards: { level1: 70, level2: 175, level3: 300, level4: 450 },
  masteryChallenge: [
    {
      level: 1,
      title: 'First Audit',
      description: 'Audit with 70%+ MBS/MPR',
      requirement: 'All MBS/MPR ≥7',
    },
    {
      level: 2,
      title: 'Detailed Audit',
      description: 'Audit with 80%+ MBS/MPR + full report',
      requirement: 'All MBS/MPR ≥8 + audit report',
    },
    {
      level: 3,
      title: 'Teach Auditing',
      description: 'Audit + teach finance team your process',
      requirement: 'Complete + process documentation',
    },
    {
      level: 4,
      title: 'Audit Master',
      description: 'Audit monthly with 85%+ MBS/MPR + identify 3+ improvements',
      requirement: 'Monthly audits + improvement log',
    },
  ],
  mandatoryMBS: {
    mind: 'Financial analysis and clarity',
    body: 'Attention to detail',
    soul: 'Integrity in numbers',
  },
  mandatoryMPR: {
    money: 'Cash flow insights and optimization',
    power: 'Financial control and visibility',
    respect: 'Accuracy and reliability',
  },
}

export const SCALE_REVENUE: BusinessTask = {
  id: 'scale-revenue',
  name: 'Scale Revenue',
  description: 'Implement systems to increase revenue by 2x or more',
  category: 'finance',
  difficulty: 'expert',
  xpReward: 1200,
  masteryRewards: { level1: 250, level2: 600, level3: 1000, level4: 1500 },
  masteryChallenge: [
    {
      level: 1,
      title: 'Revenue Growth',
      description: 'Achieve 2x revenue growth with 70%+ MBS/MPR',
      requirement: 'All MBS/MPR ≥7 + revenue proof',
    },
    {
      level: 2,
      title: 'Sustainable Scale',
      description: 'Achieve 2x growth with 80%+ MBS/MPR + systems documented',
      requirement: 'All MBS/MPR ≥8 + systems doc',
    },
    {
      level: 3,
      title: 'Teach Scaling',
      description: 'Scale + create scaling playbook for team',
      requirement: 'Complete + playbook documentation',
    },
    {
      level: 4,
      title: 'Scaling Master',
      description: 'Achieve 3x revenue growth with 90%+ MBS/MPR',
      requirement: 'All MBS/MPR ≥9 + 3x growth proof',
    },
  ],
  mandatoryMBS: {
    mind: 'Strategic growth planning',
    body: 'Execution stamina and speed',
    soul: 'Sustainable business ethics',
  },
  mandatoryMPR: {
    money: 'Revenue growth achieved',
    power: 'Market expansion and influence',
    respect: 'Customer trust and retention',
  },
}

// ─── MARKETING & BRAND ───

export const CREATE_CAMPAIGN: BusinessTask = {
  id: 'create-campaign',
  name: 'Create Marketing Campaign',
  description: 'Design and launch a marketing or brand campaign',
  category: 'marketing',
  difficulty: 'intermediate',
  xpReward: 400,
  masteryRewards: { level1: 80, level2: 200, level3: 350, level4: 550 },
  masteryChallenge: [
    {
      level: 1,
      title: 'Campaign Launch',
      description: 'Launch with 70%+ MBS/MPR',
      requirement: 'All MBS/MPR ≥7',
    },
    {
      level: 2,
      title: 'Optimized Campaign',
      description: 'Launch with 80%+ MBS/MPR + performance metrics',
      requirement: 'All MBS/MPR ≥8 + metrics',
    },
    {
      level: 3,
      title: 'Teach Campaigns',
      description: 'Create + train team on campaign process',
      requirement: 'Complete + training doc',
    },
    {
      level: 4,
      title: 'Campaign Master',
      description: 'Create 3 campaigns with 85%+ MBS/MPR each + 2x ROI',
      requirement: '3 campaigns + all ≥8.5 + ROI proof',
    },
  ],
  mandatoryMBS: {
    mind: 'Creative strategy and messaging',
    body: 'Execution and production',
    soul: 'Authentic brand voice',
  },
  mandatoryMPR: {
    money: 'Campaign ROI and revenue',
    power: 'Market reach and awareness',
    respect: 'Brand credibility and trust',
  },
}

// ─── PERSONAL MASTERY ───

export const DAILY_RITUAL: BusinessTask = {
  id: 'daily-ritual',
  name: 'Complete Daily Ritual',
  description: 'Execute your morning/evening ritual with full presence',
  category: 'personal',
  difficulty: 'beginner',
  xpReward: 100,
  masteryRewards: { level1: 20, level2: 50, level3: 100, level4: 150 },
  masteryChallenge: [
    {
      level: 1,
      title: 'Ritual Complete',
      description: 'Complete with 70%+ MBS/MPR',
      requirement: 'All MBS/MPR ≥7',
    },
    {
      level: 2,
      title: 'Deep Ritual',
      description: 'Complete with 80%+ MBS/MPR + journal entry',
      requirement: 'All MBS/MPR ≥8 + journal',
    },
    {
      level: 3,
      title: 'Teach Ritual',
      description: 'Complete + share ritual with someone else',
      requirement: 'Complete + share log',
    },
    {
      level: 4,
      title: 'Ritual Master',
      description: 'Complete 7 consecutive days with 85%+ MBS/MPR each',
      requirement: '7-day streak + all ≥8.5',
    },
  ],
  mandatoryMBS: {
    mind: 'Mental clarity and focus',
    body: 'Physical presence and energy',
    soul: 'Spiritual alignment',
  },
  mandatoryMPR: {
    money: 'Productivity and time value',
    power: 'Personal power and presence',
    respect: 'Self-respect and discipline',
  },
}

// ─── ALL TASKS ───

export const ALL_BUSINESS_TASKS: BusinessTask[] = [
  CLOSE_DEAL,
  PITCH_PRODUCT,
  BUILD_FEATURE,
  LAUNCH_PRODUCT,
  HIRE_TEAM_MEMBER,
  CONDUCT_1ON1,
  AUDIT_FINANCES,
  SCALE_REVENUE,
  CREATE_CAMPAIGN,
  DAILY_RITUAL,
]

export const TASKS_BY_CATEGORY = {
  sales: [CLOSE_DEAL, PITCH_PRODUCT],
  product: [BUILD_FEATURE, LAUNCH_PRODUCT],
  team: [HIRE_TEAM_MEMBER, CONDUCT_1ON1],
  finance: [AUDIT_FINANCES, SCALE_REVENUE],
  marketing: [CREATE_CAMPAIGN],
  personal: [DAILY_RITUAL],
}
