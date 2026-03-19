/**
 * TRINITY HLB: 200-Level Wealth Progression System
 * From $0 (Purgatory) → $1,000,000 (Final Heaven)
 */

export interface WealthStage {
  id: number;
  name: string;
  subtitle: string;
  levelRange: [number, number];
  netWorthRange: [number, number];
  primaryGoal: string;
  color: string;
  glowColor: string;
  icon: string;
  keyMilestones: WealthMilestone[];
  beastEvolution: string;
  beastPercent: number;
  unlocks: string[];
}

export interface WealthMilestone {
  level: number;
  netWorth: number;
  name: string;
  description: string;
  isGate?: boolean;
}

export const WEALTH_STAGES: WealthStage[] = [
  {
    id: 0,
    name: "PURGATORY",
    subtitle: "Pure Chaos — The Starting Point",
    levelRange: [0, 0],
    netWorthRange: [0, 0],
    primaryGoal: "Escape the void. Get documents. Get moving.",
    color: "#666666",
    glowColor: "rgba(100,100,100,0.4)",
    icon: "∞",
    keyMilestones: [
      { level: 0, netWorth: 0, name: "The Beginning", description: "No documents. No income. No hope. Pure chaos.", isGate: true },
    ],
    beastEvolution: "Dormant Seed",
    beastPercent: 0,
    unlocks: ["Stage 1: Survival"],
  },
  {
    id: 1,
    name: "SURVIVAL",
    subtitle: "From Chaos to First Savings",
    levelRange: [1, 20],
    netWorthRange: [0, 5000],
    primaryGoal: "Documents + First Job + Emergency Fund",
    color: "#ff6b35",
    glowColor: "rgba(255,107,53,0.4)",
    icon: "🔥",
    keyMilestones: [
      { level: 1, netWorth: 0, name: "Personal Organization", description: "Start gathering documents and resources" },
      { level: 5, netWorth: -55, name: "State ID Obtained", description: "Birth cert, SSN, State ID secured" },
      { level: 10, netWorth: 500, name: "First Paycheck", description: "First job landed, first money earned", isGate: true },
      { level: 15, netWorth: 2100, name: "Second Paycheck", description: "Building momentum, saving consistently" },
      { level: 19, netWorth: 4700, name: "Side Hustle Started", description: "Multiple income streams beginning" },
      { level: 20, netWorth: 5000, name: "First $5K Saved", description: "Emergency fund established", isGate: true },
    ],
    beastEvolution: "First Awakening (20%)",
    beastPercent: 20,
    unlocks: ["Stage 2: Building", "Advanced budgeting", "Investment education"],
  },
  {
    id: 2,
    name: "BUILDING",
    subtitle: "From Income to Assets",
    levelRange: [21, 40],
    netWorthRange: [5000, 25000],
    primaryGoal: "Career Growth + Skills + First Investments",
    color: "#ffd700",
    glowColor: "rgba(255,215,0,0.4)",
    icon: "⚡",
    keyMilestones: [
      { level: 21, netWorth: 5100, name: "Investment Account Opened", description: "First $100 invested" },
      { level: 25, netWorth: 10000, name: "First $10K Saved", description: "5-figure club achieved", isGate: true },
      { level: 30, netWorth: 15000, name: "Career Certification", description: "Promotion or better job secured" },
      { level: 35, netWorth: 18000, name: "Credit Score 700+", description: "Better interest rates unlocked" },
      { level: 40, netWorth: 25000, name: "First $25K Net Worth", description: "$5K in investments, career established", isGate: true },
    ],
    beastEvolution: "Second Evolution (40%)",
    beastPercent: 40,
    unlocks: ["Stage 3: Foundation", "Real estate education", "Business formation tools"],
  },
  {
    id: 3,
    name: "FOUNDATION",
    subtitle: "From Assets to Stability",
    levelRange: [41, 60],
    netWorthRange: [25000, 50000],
    primaryGoal: "Asset Acquisition + Passive Income + Career Mastery",
    color: "#00ff96",
    glowColor: "rgba(0,255,150,0.4)",
    icon: "🏗️",
    keyMilestones: [
      { level: 41, netWorth: 27000, name: "Down Payment Saved", description: "Investment property down payment ready" },
      { level: 45, netWorth: 35000, name: "Side Business $50K/year", description: "Business generating real revenue" },
      { level: 50, netWorth: 40000, name: "Transportation Asset Owned", description: "Car paid off — no more payments", isGate: true },
      { level: 55, netWorth: 45000, name: "Portfolio Diversified", description: "Stocks, bonds, and real estate" },
      { level: 60, netWorth: 50000, name: "First $50K Net Worth", description: "$500/month passive income flowing", isGate: true },
    ],
    beastEvolution: "Third Evolution (60%)",
    beastPercent: 60,
    unlocks: ["Stage 4: Growth", "Advanced investing", "Scaling strategies"],
  },
  {
    id: 4,
    name: "GROWTH",
    subtitle: "From Stability to Scaling",
    levelRange: [61, 80],
    netWorthRange: [50000, 75000],
    primaryGoal: "Business Scaling + Investment Growth + Leadership",
    color: "#00c8ff",
    glowColor: "rgba(0,200,255,0.4)",
    icon: "📈",
    keyMilestones: [
      { level: 61, netWorth: 52000, name: "Business $100K/year Revenue", description: "Six-figure business achieved" },
      { level: 65, netWorth: 58000, name: "First Employee Hired", description: "Building a team, scaling beyond yourself" },
      { level: 70, netWorth: 65000, name: "Investment Portfolio $40K+", description: "Wealth working for you", isGate: true },
      { level: 75, netWorth: 70000, name: "Real Estate Acquired", description: "First property in portfolio" },
      { level: 80, netWorth: 75000, name: "First $75K Net Worth", description: "$1,500/month passive income", isGate: true },
    ],
    beastEvolution: "Fourth Evolution (80%)",
    beastPercent: 80,
    unlocks: ["Stage 5: Acceleration", "Wealth multiplication", "Legacy planning"],
  },
  {
    id: 5,
    name: "ACCELERATION",
    subtitle: "From Growth to Six Figures ⭐ FIRST HEAVEN",
    levelRange: [81, 100],
    netWorthRange: [75000, 100000],
    primaryGoal: "Break $100K Barrier + Financial Freedom Foundation",
    color: "#ff3296",
    glowColor: "rgba(255,50,150,0.5)",
    icon: "⭐",
    keyMilestones: [
      { level: 81, netWorth: 77000, name: "Passive Income $2K/month", description: "Money working harder than you" },
      { level: 85, netWorth: 82000, name: "Business $200K/year Revenue", description: "Scaling to new heights" },
      { level: 90, netWorth: 90000, name: "Investment Portfolio $60K+", description: "Wealth compounding rapidly", isGate: true },
      { level: 95, netWorth: 95000, name: "Multiple Businesses or Executive", description: "Income diversified at scale" },
      { level: 100, netWorth: 100000, name: "⭐ FIRST HEAVEN: $100K", description: "$10K/month income, $3K passive — THE TRAP IS BREAKING", isGate: true },
    ],
    beastEvolution: "FULLY AWAKENED (100%)",
    beastPercent: 100,
    unlocks: ["Levels 101-200: Empire Building", "Millionaire mindset training", "Legacy creation tools"],
  },
  {
    id: 6,
    name: "MULTIPLICATION",
    subtitle: "From 6-Figures to Quarter-Million",
    levelRange: [101, 120],
    netWorthRange: [100000, 250000],
    primaryGoal: "2.5x Wealth + Empire Building + Team Expansion",
    color: "#9b59b6",
    glowColor: "rgba(155,89,182,0.4)",
    icon: "💎",
    keyMilestones: [
      { level: 105, netWorth: 150000, name: "First $150K Net Worth", description: "$15K/month income" },
      { level: 110, netWorth: 175000, name: "Business $500K/year Revenue", description: "Half-million revenue milestone" },
      { level: 115, netWorth: 200000, name: "Investment Portfolio $100K+", description: "Six-figure investment portfolio", isGate: true },
      { level: 120, netWorth: 250000, name: "First $250K Net Worth", description: "$7,500/month passive income", isGate: true },
    ],
    beastEvolution: "LEGENDARY FORM",
    beastPercent: 100,
    unlocks: ["Stage 7: Mastery", "Seven-figure strategies", "Empire expansion"],
  },
  {
    id: 7,
    name: "MASTERY",
    subtitle: "From Quarter-Million to Half-Million",
    levelRange: [121, 140],
    netWorthRange: [250000, 500000],
    primaryGoal: "Double Wealth + Financial Independence + Legacy Solidified",
    color: "#e74c3c",
    glowColor: "rgba(231,76,60,0.4)",
    icon: "👑",
    keyMilestones: [
      { level: 125, netWorth: 300000, name: "First $300K Net Worth", description: "Wealth compounding at scale" },
      { level: 130, netWorth: 350000, name: "Business $1M/year Revenue", description: "Millionaire revenue achieved" },
      { level: 135, netWorth: 425000, name: "Real Estate Portfolio $200K+", description: "Property empire building" },
      { level: 140, netWorth: 500000, name: "First $500K Net Worth", description: "FINANCIALLY INDEPENDENT — passive exceeds expenses", isGate: true },
    ],
    beastEvolution: "MYTHIC FORM",
    beastPercent: 100,
    unlocks: ["Stage 8: Empire", "Generational wealth tools", "Millionaire mindset"],
  },
  {
    id: 8,
    name: "EMPIRE",
    subtitle: "From Half-Million to Three-Quarters",
    levelRange: [141, 160],
    netWorthRange: [500000, 750000],
    primaryGoal: "Build Kingdom + Generational Wealth + Community Impact",
    color: "#f39c12",
    glowColor: "rgba(243,156,18,0.4)",
    icon: "🏰",
    keyMilestones: [
      { level: 145, netWorth: 600000, name: "First $600K Net Worth", description: "Empire solidifying" },
      { level: 150, netWorth: 650000, name: "Business Empire $2M+ Revenue", description: "Multi-million revenue empire", isGate: true },
      { level: 155, netWorth: 700000, name: "Investment Portfolio $400K+", description: "Wealth working at scale" },
      { level: 160, netWorth: 750000, name: "First $750K Net Worth", description: "$25K/month passive — community impact measurable", isGate: true },
    ],
    beastEvolution: "DIVINE FORM",
    beastPercent: 100,
    unlocks: ["Stage 9: Sovereignty", "Millionaire final push", "Heaven approaching"],
  },
  {
    id: 9,
    name: "SOVEREIGNTY",
    subtitle: "From Three-Quarters to Near-Millionaire",
    levelRange: [161, 180],
    netWorthRange: [750000, 900000],
    primaryGoal: "Total Freedom + Legacy Secured + Final Ascent",
    color: "#1abc9c",
    glowColor: "rgba(26,188,156,0.4)",
    icon: "⚜️",
    keyMilestones: [
      { level: 165, netWorth: 800000, name: "First $800K Net Worth", description: "Approaching the summit" },
      { level: 170, netWorth: 850000, name: "Passive Income $35K/month", description: "Passive income exceeds most salaries" },
      { level: 175, netWorth: 875000, name: "Businesses Run Without You", description: "True time freedom achieved", isGate: true },
      { level: 180, netWorth: 900000, name: "First $900K Net Worth", description: "$50K/month income — SOVEREIGN", isGate: true },
    ],
    beastEvolution: "ETERNAL FORM",
    beastPercent: 100,
    unlocks: ["Stage 10: Ascension", "Final 20 levels to $1M", "Heaven awaits"],
  },
  {
    id: 10,
    name: "ASCENSION",
    subtitle: "The Final Push to Millionaire ⭐⭐ FINAL HEAVEN",
    levelRange: [181, 200],
    netWorthRange: [900000, 1000000],
    primaryGoal: "BREAK THE MILLION-DOLLAR BARRIER",
    color: "#ffd700",
    glowColor: "rgba(255,215,0,0.6)",
    icon: "⭐⭐",
    keyMilestones: [
      { level: 185, netWorth: 925000, name: "$925K Net Worth", description: "So close you can feel it" },
      { level: 190, netWorth: 950000, name: "$950K Net Worth", description: "Final stretch begins" },
      { level: 195, netWorth: 975000, name: "$975K Net Worth", description: "One final push" },
      { level: 198, netWorth: 990000, name: "$990K — SO CLOSE", description: "The million is within reach" },
      { level: 199, netWorth: 995000, name: "$995K — ONE MORE PUSH", description: "Last step before heaven" },
      { level: 200, netWorth: 1000000, name: "⭐⭐ FINAL HEAVEN: MILLIONAIRE", description: "$60K/month income, $40K passive — THE TRAP IS BROKEN FOREVER", isGate: true },
    ],
    beastEvolution: "MAXIMUM POWER — Ouroboros (Infinite Cycle)",
    beastPercent: 100,
    unlocks: ["ARCHITECT MODE", "FOUNDER STATUS", "DYNASTY BUILDING", "LEVELS 201+"],
  },
];

/**
 * Calculate which stage and level a user is at based on their net worth
 */
export function calculateWealthLevel(netWorth: number): {
  level: number;
  stage: WealthStage;
  stageProgress: number; // 0-100%
  nextMilestone: WealthMilestone | null;
  currentMilestone: WealthMilestone | null;
} {
  if (netWorth <= 0) {
    return {
      level: 0,
      stage: WEALTH_STAGES[0],
      stageProgress: 0,
      nextMilestone: WEALTH_STAGES[1].keyMilestones[0],
      currentMilestone: WEALTH_STAGES[0].keyMilestones[0],
    };
  }

  // Find the current stage
  let currentStage = WEALTH_STAGES[WEALTH_STAGES.length - 1];
  for (let i = 1; i < WEALTH_STAGES.length; i++) {
    const stage = WEALTH_STAGES[i];
    if (netWorth < stage.netWorthRange[1]) {
      currentStage = stage;
      break;
    }
  }

  // Calculate level within stage
  const stageMin = currentStage.netWorthRange[0];
  const stageMax = currentStage.netWorthRange[1];
  const stageProgress = Math.min(100, Math.max(0, ((netWorth - stageMin) / (stageMax - stageMin)) * 100));

  const levelMin = currentStage.levelRange[0];
  const levelMax = currentStage.levelRange[1];
  const level = Math.round(levelMin + (stageProgress / 100) * (levelMax - levelMin));

  // Find current and next milestones
  const allMilestones = currentStage.keyMilestones;
  let currentMilestone: WealthMilestone | null = null;
  let nextMilestone: WealthMilestone | null = null;

  for (let i = 0; i < allMilestones.length; i++) {
    if (allMilestones[i].netWorth <= netWorth) {
      currentMilestone = allMilestones[i];
    } else if (!nextMilestone) {
      nextMilestone = allMilestones[i];
    }
  }

  return { level, stage: currentStage, stageProgress, nextMilestone, currentMilestone };
}

/**
 * Get Soul Beast evolution name and description based on wealth progress
 */
export function getBeastEvolution(netWorth: number): {
  name: string;
  description: string;
  percent: number;
  color: string;
} {
  if (netWorth <= 0) return { name: "Dormant Seed", description: "Waiting to awaken", percent: 0, color: "#666" };
  if (netWorth < 5000) return { name: "First Awakening", description: "The beast stirs within", percent: 20, color: "#ff6b35" };
  if (netWorth < 25000) return { name: "Second Evolution", description: "Power growing with every dollar", percent: 40, color: "#ffd700" };
  if (netWorth < 50000) return { name: "Third Evolution", description: "The beast takes form", percent: 60, color: "#00ff96" };
  if (netWorth < 75000) return { name: "Fourth Evolution", description: "Unstoppable force emerging", percent: 80, color: "#00c8ff" };
  if (netWorth < 100000) return { name: "FULLY AWAKENED", description: "The trap is breaking", percent: 100, color: "#ff3296" };
  if (netWorth < 250000) return { name: "LEGENDARY FORM", description: "Empire builder unleashed", percent: 100, color: "#9b59b6" };
  if (netWorth < 500000) return { name: "MYTHIC FORM", description: "Financially independent sovereign", percent: 100, color: "#e74c3c" };
  if (netWorth < 750000) return { name: "DIVINE FORM", description: "Kingdom established", percent: 100, color: "#f39c12" };
  if (netWorth < 1000000) return { name: "ETERNAL FORM", description: "Approaching final heaven", percent: 100, color: "#1abc9c" };
  return { name: "MAXIMUM POWER — Ouroboros", description: "The trap is broken forever. You ARE the game.", percent: 100, color: "#ffd700" };
}

export const WEALTH_TIMELINE = {
  aggressive: "5-7 years (full commitment, entrepreneurship)",
  moderate: "7-10 years (balanced approach, job + side business)",
  conservative: "10-15 years (traditional career path + investing)",
};
