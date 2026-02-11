import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  getTodayMetrics,
  saveDailyMetrics,
  getRecentMetrics,
  getOrCreateUserProgression,
  updateUserProgression,
  getOrCreateBudgetAllocation,
  updateBudgetAllocation,
  saveIntelligenceHistory,
} from "./db";
import {
  calculateTrinityMetrics,
  calculateStreakMultiplier,
  calculateDailyPoints,
  shouldUnlockGate,
  getIntelligenceTier,
  PillarValues,
  DailyInputs,
} from "./trinityEngine";

const pillarSchema = z.object({
  mind: z.number().min(0).max(10),
  body: z.number().min(0).max(10),
  soul: z.number().min(0).max(10),
  money: z.number().min(0).max(10),
  power: z.number().min(0).max(10),
  respect: z.number().min(0).max(10),
  consistency: z.number().min(0).max(10),
  happiness: z.number().min(0).max(10),
  recovery: z.number().min(0).max(10),
  impact: z.number().min(0).max(10),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Trinity metrics procedures
  trinity: router({
    /**
     * Get today's metrics for the current user
     */
    getTodayMetrics: protectedProcedure.query(async ({ ctx }) => {
      const today = new Date().toISOString().split("T")[0];
      const metrics = await getTodayMetrics(ctx.user.id, today);
      return metrics || null;
    }),

    /**
     * Save daily metrics and calculate intelligence
     */
    saveDailyMetrics: protectedProcedure
      .input(
        z.object({
          faithScore: z.number().min(0).max(10),
          hustlePercentage: z.number().min(0).max(100),
          loveScore: z.number().min(0).max(10),
          pillars: pillarSchema,
        })
      )
      .mutation(async ({ ctx, input }) => {
        const today = new Date().toISOString().split("T")[0];

        // Get recent metrics for trend analysis
        const recentMetrics = await getRecentMetrics(ctx.user.id, 30);
        const recentPowerScores = recentMetrics.map((m) => parseFloat(m.powerScore?.toString() || "0"));
        const recentFaithScores = recentMetrics.map((m) => parseFloat(m.faithScore?.toString() || "0"));

        // Get user progression for streak
        const progression = await getOrCreateUserProgression(ctx.user.id);
        const streakDays = progression?.currentStreak || 0;

        // Calculate Trinity metrics
        const dailyInputs: DailyInputs = {
          faithScore: input.faithScore,
          hustlePercentage: input.hustlePercentage,
          loveScore: input.loveScore,
          pillars: input.pillars as PillarValues,
        };

        const result = calculateTrinityMetrics(
          dailyInputs,
          streakDays,
          recentPowerScores,
          recentFaithScores
        );

        // Save metrics to database
        const metricsData = {
          userId: ctx.user.id,
          date: today,
          faithScore: input.faithScore,
          hustlePercentage: input.hustlePercentage,
          loveScore: input.loveScore,
          mindPillar: input.pillars.mind,
          bodyPillar: input.pillars.body,
          soulPillar: input.pillars.soul,
          moneyPillar: input.pillars.money,
          powerPillar: input.pillars.power,
          respectPillar: input.pillars.respect,
          consistencyPillar: input.pillars.consistency,
          happinessPillar: input.pillars.happiness,
          recoveryPillar: input.pillars.recovery,
          impactPillar: input.pillars.impact,
          mindIntelligence: result.intelligence.mindIntelligence,
          bodyIntelligence: result.intelligence.bodyIntelligence,
          soulIntelligence: result.intelligence.soulIntelligence,
          powerScore: result.power.powerScore,
          streakMultiplier: result.power.streakMultiplier,
          burnoutRisk: result.predictive.burnoutRisk,
          faithDecayRisk: result.predictive.faithDecayRisk,
          momentumStatus: result.predictive.momentumStatus,
        };

        await saveDailyMetrics(ctx.user.id, today, metricsData);

        // Save intelligence history
        await saveIntelligenceHistory(ctx.user.id, today, {
          mindIntelligence: result.intelligence.mindIntelligence,
          bodyIntelligence: result.intelligence.bodyIntelligence,
          soulIntelligence: result.intelligence.soulIntelligence,
          overallIntelligence: result.intelligence.overallIntelligence,
          burnoutRisk: result.predictive.burnoutRisk,
          faithDecayRisk: result.predictive.faithDecayRisk,
          momentumStatus: result.predictive.momentumStatus,
        });

        // Calculate points earned
        const pointsEarned = calculateDailyPoints(result.power);

        // Update progression
        if (progression) {
          const newTotalPoints = (progression.totalPoints || 0) + pointsEarned;
          const newIntelligenceTier = getIntelligenceTier(result.intelligence.overallIntelligence);
          const gateUnlocked = shouldUnlockGate(
            input.pillars,
            newTotalPoints,
            progression.currentLevel
          );

          let updates: any = {
            totalPoints: newTotalPoints,
            intelligenceTier: newIntelligenceTier,
          };

          if (gateUnlocked) {
            const unlockedGates = (progression.unlockedGates as any) || [];
            updates.unlockedGates = [...unlockedGates, progression.currentLevel];
            updates.currentLevel = progression.currentLevel + 1;
            updates.pointsToNextGate = 40 * (progression.currentLevel + 1);
            updates.totalPoints = 0; // Reset points for next level
          }

          await updateUserProgression(ctx.user.id, updates);
        }

        return {
          ...result,
          pointsEarned,
          gateUnlocked: shouldUnlockGate(
            input.pillars,
            (progression?.totalPoints || 0) + pointsEarned,
            progression?.currentLevel || 1
          ),
        };
      }),

    /**
     * Get user progression
     */
    getProgression: protectedProcedure.query(async ({ ctx }) => {
      const progression = await getOrCreateUserProgression(ctx.user.id);
      return progression || null;
    }),

    /**
     * Get recent intelligence history for charts
     */
    getIntelligenceHistory: protectedProcedure
      .input(z.object({ days: z.number().min(1).max(90).default(30) }))
      .query(async ({ ctx, input }) => {
        const recentMetrics = await getRecentMetrics(ctx.user.id, input.days);
        return recentMetrics.map((m) => ({
          date: m.date,
          mindIntelligence: parseFloat(m.mindIntelligence?.toString() || "0"),
          bodyIntelligence: parseFloat(m.bodyIntelligence?.toString() || "0"),
          soulIntelligence: parseFloat(m.soulIntelligence?.toString() || "0"),
          powerScore: parseFloat(m.powerScore?.toString() || "0"),
          burnoutRisk: parseFloat(m.burnoutRisk?.toString() || "0"),
          faithDecayRisk: parseFloat(m.faithDecayRisk?.toString() || "0"),
          momentumStatus: m.momentumStatus,
        }));
      }),
  }),

  // Budget allocation procedures
  budget: router({
    /**
     * Get today's budget allocation
     */
    getTodayBudget: protectedProcedure.query(async ({ ctx }) => {
      const today = new Date().toISOString().split("T")[0];
      const budget = await getOrCreateBudgetAllocation(ctx.user.id, today);
      return budget || null;
    }),

    /**
     * Update budget allocation
     */
    updateBudget: protectedProcedure
      .input(
        z.object({
          category1: z.number().min(0),
          category2: z.number().min(0),
          category3: z.number().min(0),
          category4: z.number().min(0),
          category5: z.number().min(0),
          category6: z.number().min(0),
          category7: z.number().min(0),
          category8: z.number().min(0),
          category9: z.number().min(0),
          category10: z.number().min(0),
          totalBudget: z.number().min(0),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const today = new Date().toISOString().split("T")[0];

        const totalAllocated =
          input.category1 +
          input.category2 +
          input.category3 +
          input.category4 +
          input.category5 +
          input.category6 +
          input.category7 +
          input.category8 +
          input.category9 +
          input.category10;

        const budget = await updateBudgetAllocation(ctx.user.id, today, {
          ...input,
          totalAllocated,
        });

        return budget || null;
      }),
  }),
});

export type AppRouter = typeof appRouter;
