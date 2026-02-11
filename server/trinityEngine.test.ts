import { describe, it, expect } from "vitest";
import {
  calculateTrinityMetrics,
  calculateStreakMultiplier,
  calculateDailyPoints,
  shouldUnlockGate,
  getIntelligenceTier,
  DailyInputs,
  PillarValues,
} from "./trinityEngine";

describe("TrinityEngine v13.0", () => {
  const basePillars: PillarValues = {
    mind: 5,
    body: 5,
    soul: 5,
    money: 5,
    power: 5,
    respect: 5,
    consistency: 5,
    happiness: 5,
    recovery: 5,
    impact: 5,
  };

  const baseInputs: DailyInputs = {
    faithScore: 5,
    hustlePercentage: 50,
    loveScore: 5,
    pillars: basePillars,
  };

  describe("calculateTrinityMetrics", () => {
    it("should calculate metrics with balanced pillars", () => {
      const result = calculateTrinityMetrics(baseInputs, 0);

      expect(result.intelligence.mindIntelligence).toBeGreaterThan(0);
      expect(result.intelligence.bodyIntelligence).toBeGreaterThan(0);
      expect(result.intelligence.soulIntelligence).toBeGreaterThan(0);
      expect(result.intelligence.overallIntelligence).toBeGreaterThan(0);
      expect(result.power.powerScore).toBeGreaterThan(0);
    });

    it("should return values within expected ranges", () => {
      const result = calculateTrinityMetrics(baseInputs, 0);

      expect(result.intelligence.mindIntelligence).toBeLessThanOrEqual(100);
      expect(result.intelligence.bodyIntelligence).toBeLessThanOrEqual(100);
      expect(result.intelligence.soulIntelligence).toBeLessThanOrEqual(100);
      expect(result.predictive.burnoutRisk).toBeLessThanOrEqual(100);
      expect(result.predictive.faithDecayRisk).toBeLessThanOrEqual(100);
    });

    it("should increase power score with higher input values", () => {
      const lowInputs: DailyInputs = {
        ...baseInputs,
        faithScore: 2,
        hustlePercentage: 20,
        loveScore: 2,
      };

      const highInputs: DailyInputs = {
        ...baseInputs,
        faithScore: 9,
        hustlePercentage: 90,
        loveScore: 9,
      };

      const lowResult = calculateTrinityMetrics(lowInputs, 0);
      const highResult = calculateTrinityMetrics(highInputs, 0);

      expect(highResult.power.powerScore).toBeGreaterThan(lowResult.power.powerScore);
    });

    it("should detect high burnout risk with low recovery", () => {
      const lowRecoveryPillars: PillarValues = {
        ...basePillars,
        recovery: 2,
        power: 9,
      };

      const inputs: DailyInputs = {
        ...baseInputs,
        pillars: lowRecoveryPillars,
      };

      const result = calculateTrinityMetrics(inputs, 0);
      expect(result.predictive.burnoutRisk).toBeGreaterThan(30);
    });

    it("should detect faith decay risk with low soul", () => {
      const lowSoulPillars: PillarValues = {
        ...basePillars,
        soul: 2,
        happiness: 2,
      };

      const inputs: DailyInputs = {
        ...baseInputs,
        pillars: lowSoulPillars,
      };

      const result = calculateTrinityMetrics(inputs, 0);
      expect(result.predictive.faithDecayRisk).toBeGreaterThan(30);
    });
  });

  describe("calculateStreakMultiplier", () => {
    it("should return 1 for zero streak", () => {
      expect(calculateStreakMultiplier(0)).toBe(1);
    });

    it("should increase with longer streaks", () => {
      const mult10 = calculateStreakMultiplier(10);
      const mult30 = calculateStreakMultiplier(30);
      const mult60 = calculateStreakMultiplier(60);

      expect(mult30).toBeGreaterThan(mult10);
      expect(mult60).toBeGreaterThan(mult30);
    });

    it("should cap at 3x multiplier", () => {
      const mult = calculateStreakMultiplier(1000);
      expect(mult).toBeLessThanOrEqual(3);
    });
  });

  describe("calculateDailyPoints", () => {
    it("should award points based on power score", () => {
      const result = calculateTrinityMetrics(baseInputs, 0);
      const points = calculateDailyPoints(result.power);

      expect(points).toBeGreaterThanOrEqual(0);
      expect(points).toBeLessThanOrEqual(50);
    });

    it("should award more points for higher power scores", () => {
      const lowInputs: DailyInputs = {
        ...baseInputs,
        faithScore: 2,
        hustlePercentage: 20,
      };

      const highInputs: DailyInputs = {
        ...baseInputs,
        faithScore: 9,
        hustlePercentage: 90,
      };

      const lowResult = calculateTrinityMetrics(lowInputs, 0);
      const highResult = calculateTrinityMetrics(highInputs, 0);

      const lowPoints = calculateDailyPoints(lowResult.power);
      const highPoints = calculateDailyPoints(highResult.power);

      expect(highPoints).toBeGreaterThanOrEqual(lowPoints);
    });
  });

  describe("shouldUnlockGate", () => {
    it("should not unlock gate with insufficient pillars", () => {
      const lowPillars: PillarValues = {
        ...basePillars,
        mind: 3,
        body: 3,
        soul: 3,
      };

      const shouldUnlock = shouldUnlockGate(lowPillars, 50, 1);
      expect(shouldUnlock).toBe(false);
    });

    it("should not unlock gate with insufficient points", () => {
      const shouldUnlock = shouldUnlockGate(basePillars, 20, 1);
      expect(shouldUnlock).toBe(false);
    });

    it("should unlock gate with 6+ high pillars and sufficient points", () => {
      const highPillars: PillarValues = {
        mind: 6,
        body: 6,
        soul: 6,
        money: 6,
        power: 6,
        respect: 6,
        consistency: 3,
        happiness: 3,
        recovery: 3,
        impact: 3,
      };

      const shouldUnlock = shouldUnlockGate(highPillars, 50, 1);
      expect(shouldUnlock).toBe(true);
    });

    it("should scale points requirement with level", () => {
      const highPillars: PillarValues = {
        mind: 6,
        body: 6,
        soul: 6,
        money: 6,
        power: 6,
        respect: 6,
        consistency: 3,
        happiness: 3,
        recovery: 3,
        impact: 3,
      };

      const level1 = shouldUnlockGate(highPillars, 50, 1);
      const level2 = shouldUnlockGate(highPillars, 50, 2);
      const level3 = shouldUnlockGate(highPillars, 100, 3);

      expect(level1).toBe(true);
      expect(level2).toBe(false);
      expect(level3).toBe(true);
    });
  });

  describe("getIntelligenceTier", () => {
    it("should return novice for low scores", () => {
      expect(getIntelligenceTier(10)).toBe("novice");
    });

    it("should return apprentice for scores 20-40", () => {
      expect(getIntelligenceTier(30)).toBe("apprentice");
    });

    it("should return adept for scores 40-60", () => {
      expect(getIntelligenceTier(50)).toBe("adept");
    });

    it("should return master for scores 60-80", () => {
      expect(getIntelligenceTier(70)).toBe("master");
    });

    it("should return oracle for scores 80+", () => {
      expect(getIntelligenceTier(90)).toBe("oracle");
    });
  });
});
