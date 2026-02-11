/**
 * TrinityEngine v13.0 - Core Intelligence Calculation System
 * Processes Mind, Body, and Soul metrics with predictive algorithms
 */

export interface PillarValues {
  mind: number;
  body: number;
  soul: number;
  money: number;
  power: number;
  respect: number;
  consistency: number;
  happiness: number;
  recovery: number;
  impact: number;
}

export interface DailyInputs {
  faithScore: number; // 0-10
  hustlePercentage: number; // 0-100
  loveScore: number; // 0-10
  pillars: PillarValues;
}

export interface IntelligenceMetrics {
  mindIntelligence: number;
  bodyIntelligence: number;
  soulIntelligence: number;
  overallIntelligence: number;
}

export interface PredictiveMetrics {
  burnoutRisk: number; // 0-100 percentage
  faithDecayRisk: number; // 0-100 percentage
  momentumStatus: 'rising' | 'stable' | 'declining' | 'neutral';
}

export interface PowerCalculation {
  powerScore: number;
  streakMultiplier: number;
  baseScore: number;
  multipliedScore: number;
}

/**
 * Calculate Mind Intelligence Score
 * Based on Mind, Respect, and Consistency pillars
 * Formula: (Mind * 0.4 + Respect * 0.3 + Consistency * 0.3) * 10
 */
function calculateMindIntelligence(pillars: PillarValues): number {
  const score = (pillars.mind * 0.4 + pillars.respect * 0.3 + pillars.consistency * 0.3) * 10;
  return Math.min(Math.max(score, 0), 100);
}

/**
 * Calculate Body Intelligence Score
 * Based on Body, Power, and Recovery pillars
 * Formula: (Body * 0.4 + Power * 0.3 + Recovery * 0.3) * 10
 */
function calculateBodyIntelligence(pillars: PillarValues): number {
  const score = (pillars.body * 0.4 + pillars.power * 0.3 + pillars.recovery * 0.3) * 10;
  return Math.min(Math.max(score, 0), 100);
}

/**
 * Calculate Soul Intelligence Score
 * Based on Soul, Happiness, and Impact pillars
 * Formula: (Soul * 0.4 + Happiness * 0.3 + Impact * 0.3) * 10
 */
function calculateSoulIntelligence(pillars: PillarValues): number {
  const score = (pillars.soul * 0.4 + pillars.happiness * 0.3 + pillars.impact * 0.3) * 10;
  return Math.min(Math.max(score, 0), 100);
}

/**
 * Calculate Overall Intelligence
 * Average of Mind, Body, and Soul with Money as multiplier
 */
function calculateOverallIntelligence(
  mind: number,
  body: number,
  soul: number,
  moneyPillar: number
): number {
  const average = (mind + body + soul) / 3;
  const moneyMultiplier = 0.8 + (moneyPillar / 10) * 0.4; // 0.8 to 1.2 range
  return average * moneyMultiplier;
}

/**
 * Calculate Power Score
 * Base score from pillars + faith/hustle/love inputs + streak multiplier
 */
function calculatePowerScore(inputs: DailyInputs, streakMultiplier: number): PowerCalculation {
  // Base score from all 10 pillars (each 0-10, so max 100)
  const pillarSum =
    inputs.pillars.mind +
    inputs.pillars.body +
    inputs.pillars.soul +
    inputs.pillars.money +
    inputs.pillars.power +
    inputs.pillars.respect +
    inputs.pillars.consistency +
    inputs.pillars.happiness +
    inputs.pillars.recovery +
    inputs.pillars.impact;

  const baseScore = pillarSum * 10; // 0-1000 scale

  // Apply daily input multipliers
  const faithMultiplier = 1 + (inputs.faithScore / 10) * 0.3; // 1.0 to 1.3
  const hustleMultiplier = 1 + (inputs.hustlePercentage / 100) * 0.4; // 1.0 to 1.4
  const loveMultiplier = 1 + (inputs.loveScore / 10) * 0.2; // 1.0 to 1.2

  const adjustedScore = baseScore * faithMultiplier * hustleMultiplier * loveMultiplier;

  // Apply streak multiplier
  const multipliedScore = adjustedScore * streakMultiplier;

  return {
    powerScore: Math.round(multipliedScore * 100) / 100,
    streakMultiplier,
    baseScore: Math.round(baseScore * 100) / 100,
    multipliedScore: Math.round(adjustedScore * 100) / 100,
  };
}

/**
 * Calculate Burnout Risk
 * Predicts burnout 7 days in advance
 * High power scores without recovery = high burnout risk
 */
function calculateBurnoutRisk(
  pillars: PillarValues,
  recentPowerScores: number[]
): number {
  // Recovery pillar is inverse - lower recovery = higher burnout risk
  const recoveryFactor = (10 - pillars.recovery) * 5; // 0-50 points

  // High power without recovery = burnout
  const powerWithoutRecovery = pillars.power * (10 - pillars.recovery) / 100 * 30; // 0-30 points

  // Consistency strain - high consistency without breaks
  const consistencyStrain = pillars.consistency * (10 - pillars.happiness) / 100 * 20; // 0-20 points

  // Recent trend analysis
  let trendFactor = 0;
  if (recentPowerScores.length >= 3) {
    const recent = recentPowerScores.slice(-3);
    const trend = recent[2] - recent[0];
    if (trend > 500) trendFactor = 20; // Rapidly increasing = burnout risk
    else if (trend > 200) trendFactor = 10;
  }

  const totalRisk = recoveryFactor + powerWithoutRecovery + consistencyStrain + trendFactor;
  return Math.min(Math.max(totalRisk, 0), 100);
}

/**
 * Calculate Faith Decay Risk
 * Detects when motivation/faith is declining
 */
function calculateFaithDecayRisk(
  pillars: PillarValues,
  recentFaithScores: number[]
): number {
  // Low soul pillar = faith decay risk
  const soulFactor = (10 - pillars.soul) * 5; // 0-50 points

  // Low happiness = motivation loss
  const happinessFactor = (10 - pillars.happiness) * 4; // 0-40 points

  // Faith trend analysis
  let trendFactor = 0;
  if (recentFaithScores.length >= 5) {
    const recent = recentFaithScores.slice(-5);
    const avgRecent = recent.reduce((a, b) => a + b, 0) / recent.length;
    const avgOlder = recentFaithScores.slice(-10, -5).reduce((a, b) => a + b, 0) / 5;
    const decline = avgOlder - avgRecent;
    if (decline > 2) trendFactor = 30;
    else if (decline > 1) trendFactor = 15;
  }

  const totalRisk = soulFactor + happinessFactor + trendFactor;
  return Math.min(Math.max(totalRisk, 0), 100);
}

/**
 * Calculate Momentum Status
 * Determines if user should push or rest
 */
function calculateMomentumStatus(
  pillars: PillarValues,
  recentPowerScores: number[]
): 'rising' | 'stable' | 'declining' | 'neutral' {
  if (recentPowerScores.length < 3) return 'neutral';

  const recent = recentPowerScores.slice(-3);
  const trend = recent[2] - recent[0];
  const volatility = Math.max(...recent) - Math.min(...recent);

  // Momentum analysis
  if (trend > 300 && volatility < 200) return 'rising';
  if (trend < -300 && volatility < 200) return 'declining';
  if (Math.abs(trend) < 100 && volatility < 150) return 'stable';

  return 'neutral';
}

/**
 * Calculate Streak Multiplier
 * Rewards consistency with exponential growth
 * Formula: 1 + (streak / 100) ^ 1.2
 */
export function calculateStreakMultiplier(streakDays: number): number {
  if (streakDays === 0) return 1;
  const multiplier = 1 + Math.pow(streakDays / 100, 1.2);
  return Math.min(multiplier, 3); // Cap at 3x
}

/**
 * Main Trinity Engine calculation
 * Processes all metrics and returns comprehensive intelligence data
 */
export function calculateTrinityMetrics(
  inputs: DailyInputs,
  streakDays: number,
  recentPowerScores: number[] = [],
  recentFaithScores: number[] = []
): {
  intelligence: IntelligenceMetrics;
  power: PowerCalculation;
  predictive: PredictiveMetrics;
} {
  // Calculate intelligence metrics
  const mindIntelligence = calculateMindIntelligence(inputs.pillars);
  const bodyIntelligence = calculateBodyIntelligence(inputs.pillars);
  const soulIntelligence = calculateSoulIntelligence(inputs.pillars);
  const overallIntelligence = calculateOverallIntelligence(
    mindIntelligence,
    bodyIntelligence,
    soulIntelligence,
    inputs.pillars.money
  );

  // Calculate power score
  const streakMultiplier = calculateStreakMultiplier(streakDays);
  const power = calculatePowerScore(inputs, streakMultiplier);

  // Calculate predictive metrics
  const burnoutRisk = calculateBurnoutRisk(inputs.pillars, recentPowerScores);
  const faithDecayRisk = calculateFaithDecayRisk(inputs.pillars, recentFaithScores);
  const momentumStatus = calculateMomentumStatus(inputs.pillars, recentPowerScores);

  return {
    intelligence: {
      mindIntelligence: Math.round(mindIntelligence * 100) / 100,
      bodyIntelligence: Math.round(bodyIntelligence * 100) / 100,
      soulIntelligence: Math.round(soulIntelligence * 100) / 100,
      overallIntelligence: Math.round(overallIntelligence * 100) / 100,
    },
    power,
    predictive: {
      burnoutRisk: Math.round(burnoutRisk * 100) / 100,
      faithDecayRisk: Math.round(faithDecayRisk * 100) / 100,
      momentumStatus,
    },
  };
}

/**
 * Determine Intelligence Tier based on overall score
 */
export function getIntelligenceTier(overallIntelligence: number): string {
  if (overallIntelligence >= 80) return 'oracle';
  if (overallIntelligence >= 60) return 'master';
  if (overallIntelligence >= 40) return 'adept';
  if (overallIntelligence >= 20) return 'apprentice';
  return 'novice';
}

/**
 * Calculate points earned from daily metrics
 * Used for progression system
 */
export function calculateDailyPoints(power: PowerCalculation): number {
  // Points scale: every 100 power = 1 point, capped at 50 points per day
  const points = Math.floor(power.powerScore / 100);
  return Math.min(points, 50);
}

/**
 * Determine if gate should unlock
 * Gates unlock when: 6 pillars >= level 5 AND total points >= 40
 */
export function shouldUnlockGate(
  pillars: PillarValues,
  totalPoints: number,
  currentLevel: number
): boolean {
  const pillarArray = Object.values(pillars);
  const highPillars = pillarArray.filter((p) => p >= 5).length;

  const requiredPoints = 40 * currentLevel; // Points scale with level
  return highPillars >= 6 && totalPoints >= requiredPoints;
}
