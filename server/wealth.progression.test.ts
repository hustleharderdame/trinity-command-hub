import { describe, it, expect } from 'vitest'
import {
  calculateWealthLevel,
  getBeastEvolution,
  WEALTH_STAGES,
} from '../shared/wealthConstants'

// ─── calculateWealthLevel ────────────────────────────────────────────────────

describe('calculateWealthLevel', () => {
  it('returns level 0 and Purgatory stage for $0 net worth', () => {
    const result = calculateWealthLevel(0)
    expect(result.level).toBe(0)
    expect(result.stage.name).toBe('PURGATORY')
    expect(result.stageProgress).toBe(0)
  })

  it('returns level 0 and Purgatory stage for negative net worth', () => {
    const result = calculateWealthLevel(-500)
    expect(result.level).toBe(0)
    expect(result.stage.name).toBe('PURGATORY')
  })

  it('returns SURVIVAL stage for $2,500 net worth', () => {
    const result = calculateWealthLevel(2500)
    expect(result.stage.name).toBe('SURVIVAL')
    expect(result.level).toBeGreaterThanOrEqual(1)
    expect(result.level).toBeLessThanOrEqual(20)
    expect(result.stageProgress).toBeGreaterThan(0)
    expect(result.stageProgress).toBeLessThan(100)
  })

  it('returns BUILDING stage for $15,000 net worth', () => {
    const result = calculateWealthLevel(15000)
    expect(result.stage.name).toBe('BUILDING')
    expect(result.level).toBeGreaterThanOrEqual(21)
    expect(result.level).toBeLessThanOrEqual(40)
  })

  it('returns ACCELERATION stage for $90,000 net worth', () => {
    const result = calculateWealthLevel(90000)
    expect(result.stage.name).toBe('ACCELERATION')
  })

  it('returns ASCENSION stage for $950,000 net worth', () => {
    const result = calculateWealthLevel(950000)
    expect(result.stage.name).toBe('ASCENSION')
  })

  it('returns level 200 and ASCENSION for exactly $1,000,000', () => {
    const result = calculateWealthLevel(1_000_000)
    expect(result.stage.name).toBe('ASCENSION')
    expect(result.level).toBe(200)
    expect(result.stageProgress).toBe(100)
  })

  it('provides a nextMilestone when below the final milestone', () => {
    const result = calculateWealthLevel(1000)
    expect(result.nextMilestone).not.toBeNull()
    expect(result.nextMilestone!.netWorth).toBeGreaterThan(1000)
  })

  it('provides a currentMilestone once first milestone is passed', () => {
    const result = calculateWealthLevel(600)
    expect(result.currentMilestone).not.toBeNull()
  })
})

// ─── getBeastEvolution ───────────────────────────────────────────────────────

describe('getBeastEvolution', () => {
  it('returns Dormant Seed at $0', () => {
    const result = getBeastEvolution(0)
    expect(result.name).toBe('Dormant Seed')
    expect(result.percent).toBe(0)
  })

  it('returns First Awakening below $5,000', () => {
    const result = getBeastEvolution(2000)
    expect(result.name).toBe('First Awakening')
    expect(result.percent).toBe(20)
  })

  it('returns FULLY AWAKENED just below $100,000', () => {
    const result = getBeastEvolution(99999)
    expect(result.name).toBe('FULLY AWAKENED')
    expect(result.percent).toBe(100)
  })

  it('returns LEGENDARY FORM at exactly $100,000 (empire stage begins)', () => {
    const result = getBeastEvolution(100000)
    expect(result.name).toBe('LEGENDARY FORM')
    expect(result.percent).toBe(100)
  })

  it('returns MAXIMUM POWER at $1,000,000', () => {
    const result = getBeastEvolution(1_000_000)
    expect(result.name).toContain('MAXIMUM POWER')
    expect(result.percent).toBe(100)
  })

  it('returns a color string for every evolution tier', () => {
    const netWorths = [0, 1000, 10000, 30000, 60000, 100000, 200000, 400000, 600000, 850000, 1000000]
    for (const nw of netWorths) {
      const result = getBeastEvolution(nw)
      expect(result.color).toMatch(/^#[0-9a-fA-F]{3,6}$/)
    }
  })
})

// ─── WEALTH_STAGES structure ─────────────────────────────────────────────────

describe('WEALTH_STAGES', () => {
  it('has exactly 11 stages (0 Purgatory + 10 progression stages)', () => {
    expect(WEALTH_STAGES.length).toBe(11)
  })

  it('starts with Purgatory at stage id 0', () => {
    expect(WEALTH_STAGES[0].id).toBe(0)
    expect(WEALTH_STAGES[0].name).toBe('PURGATORY')
  })

  it('ends with ASCENSION at stage id 10 targeting $1M', () => {
    const last = WEALTH_STAGES[WEALTH_STAGES.length - 1]
    expect(last.id).toBe(10)
    expect(last.name).toBe('ASCENSION')
    expect(last.netWorthRange[1]).toBe(1_000_000)
  })

  it('has continuous level ranges with no gaps', () => {
    for (let i = 1; i < WEALTH_STAGES.length - 1; i++) {
      const curr = WEALTH_STAGES[i]
      const next = WEALTH_STAGES[i + 1]
      expect(next.levelRange[0]).toBe(curr.levelRange[1] + 1)
    }
  })

  it('every stage has at least one key milestone', () => {
    for (const stage of WEALTH_STAGES) {
      expect(stage.keyMilestones.length).toBeGreaterThanOrEqual(1)
    }
  })

  it('every stage has a non-empty primaryGoal', () => {
    for (const stage of WEALTH_STAGES) {
      expect(stage.primaryGoal.length).toBeGreaterThan(0)
    }
  })
})
