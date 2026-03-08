/**
 * Gamification Engine
 * Handles XP rewards, leveling math, and mansion upgrades
 */

export interface GamificationState {
  totalXP: number
  currentLevel: number
  mansionStatus: 'trap_house' | 'apartment' | 'house' | 'penthouse'
  currentStreak: number
  dailyXP: number
}

export const GamificationEngine = {
  // XP Reward System
  rewards: {
    MORNING_IGNITION: 10,
    TACTICAL_MISSION: 20, // Per mission, max 60/day
    PILLAR_UPDATE: 10,
    NIGHTLY_REPORT: 20,
    MAX_DAILY_XP: 100,
  },

  // Calculate current level from total XP
  calculateLevel(totalXP: number): number {
    return Math.floor(totalXP / 500) + 1
  },

  // Get mansion status based on level
  getMansionStatus(level: number): GamificationState['mansionStatus'] {
    if (level >= 100) return 'penthouse'
    if (level >= 50) return 'house'
    if (level >= 20) return 'apartment'
    return 'trap_house'
  },

  // Add XP for an action
  addXP(
    currentState: GamificationState,
    action: 'morning' | 'mission' | 'pillars' | 'report',
    missionCount: number = 1
  ): { newState: GamificationState; xpGained: number; leveledUp: boolean } {
    let xpGained = 0

    switch (action) {
      case 'morning':
        xpGained = this.rewards.MORNING_IGNITION
        break
      case 'mission':
        xpGained = Math.min(this.rewards.TACTICAL_MISSION * missionCount, 60)
        break
      case 'pillars':
        xpGained = this.rewards.PILLAR_UPDATE
        break
      case 'report':
        xpGained = this.rewards.NIGHTLY_REPORT
        break
    }

    // Cap daily XP at 100
    const newDailyXP = Math.min(currentState.dailyXP + xpGained, this.rewards.MAX_DAILY_XP)
    const actualXPGained = newDailyXP - currentState.dailyXP

    const newTotalXP = currentState.totalXP + actualXPGained
    const newLevel = this.calculateLevel(newTotalXP)
    const leveledUp = newLevel > currentState.currentLevel

    return {
      newState: {
        totalXP: newTotalXP,
        currentLevel: newLevel,
        mansionStatus: this.getMansionStatus(newLevel),
        currentStreak: currentState.currentStreak,
        dailyXP: newDailyXP,
      },
      xpGained: actualXPGained,
      leveledUp,
    }
  },

  // Reset daily XP counter
  resetDailyXP(state: GamificationState): GamificationState {
    return {
      ...state,
      dailyXP: 0,
    }
  },

  // Update streak
  updateStreak(state: GamificationState, completedDailyRitual: boolean): GamificationState {
    return {
      ...state,
      currentStreak: completedDailyRitual ? state.currentStreak + 1 : 0,
    }
  },

  // Get progress to next level
  getProgressToNextLevel(totalXP: number): { current: number; needed: number; percentage: number } {
    const currentLevel = this.calculateLevel(totalXP)
    const xpForCurrentLevel = (currentLevel - 1) * 500
    const xpForNextLevel = currentLevel * 500

    const current = totalXP - xpForCurrentLevel
    const needed = xpForNextLevel - xpForCurrentLevel
    const percentage = (current / needed) * 100

    return { current, needed, percentage }
  },

  // Get mansion upgrade milestone
  getMansionMilestone(level: number): { nextLevel: number; nextMansion: string; xpNeeded: number } {
    if (level < 20) {
      return { nextLevel: 20, nextMansion: 'Apartment', xpNeeded: 20 * 500 }
    }
    if (level < 50) {
      return { nextLevel: 50, nextMansion: 'House', xpNeeded: 50 * 500 }
    }
    if (level < 100) {
      return { nextLevel: 100, nextMansion: 'Penthouse', xpNeeded: 100 * 500 }
    }
    return { nextLevel: 200, nextMansion: 'Crown Achievement', xpNeeded: 200 * 500 }
  },

  // Check if user achieved a milestone
  checkMilestones(previousLevel: number, newLevel: number): string[] {
    const milestones: string[] = []

    if (previousLevel < 20 && newLevel >= 20) {
      milestones.push('APARTMENT_UNLOCKED')
    }
    if (previousLevel < 50 && newLevel >= 50) {
      milestones.push('HOUSE_UNLOCKED')
    }
    if (previousLevel < 100 && newLevel >= 100) {
      milestones.push('PENTHOUSE_UNLOCKED')
    }
    if (newLevel % 10 === 0) {
      milestones.push(`LEVEL_${newLevel}_MILESTONE`)
    }

    return milestones
  },
}

// Initialize default state
export function createInitialState(): GamificationState {
  return {
    totalXP: 0,
    currentLevel: 1,
    mansionStatus: 'trap_house',
    currentStreak: 0,
    dailyXP: 0,
  }
}
