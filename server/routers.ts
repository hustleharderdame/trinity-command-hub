import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getOrCreateUserProgression, updateUserProgression, getOrCreateDailySnapshot, updateDailySnapshot } from "./db";

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // HS.OS Daily Flow Routers
  hsDaily: router({
    // Get today's daily snapshot
    getToday: protectedProcedure.query(async ({ ctx }) => {
      const today = new Date().toISOString().split('T')[0];
      return await getOrCreateDailySnapshot(ctx.user.id, today);
    }),

    // AM START - Initialize day
    amStart: protectedProcedure
      .input(z.object({
        faithScore: z.number().min(1).max(10),
        writtenIntent: z.string().optional(),
        beastMessage: z.string().optional(),
        twinMessage: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const today = new Date().toISOString().split('T')[0];
        return await updateDailySnapshot(ctx.user.id, today, {
          faithScore: input.faithScore,
          writtenIntent: input.writtenIntent,
          beastMessage: input.beastMessage,
          twinMessage: input.twinMessage,
        });
      }),

    // MIDDAY CHECK
    middayCheck: protectedProcedure
      .input(z.object({
        hustleExecuted: z.number().min(0).max(100),
        obstacles: z.array(z.string()).optional(),
        truthReflection: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const today = new Date().toISOString().split('T')[0];
        return await updateDailySnapshot(ctx.user.id, today, {
          hustleExecuted: input.hustleExecuted,
          obstacles: input.obstacles,
          truthReflection: input.truthReflection,
        });
      }),

    // PM END - Complete day and calculate power
    pmEnd: protectedProcedure
      .input(z.object({
        enthusiasmScore: z.number().min(1).max(10),
        gratitude: z.string().optional(),
        worthIt: z.enum(["yes", "no", "partial"]).optional(),
        pmReport: z.string().optional(),
        pillars: z.object({
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
        }),
      }))
      .mutation(async ({ ctx, input }) => {
        const today = new Date().toISOString().split('T')[0];
        
        // Get current snapshot
        const snapshot = await getOrCreateDailySnapshot(ctx.user.id, today);
        if (!snapshot) return null;

        // Calculate power score
        const hustle = (snapshot.hustleExecuted || 0) / 100;
        const faith = (snapshot.faithScore || 5) / 10;
        const love = input.enthusiasmScore / 10;
        
        const shadowAvg = (input.pillars.body + input.pillars.money + input.pillars.power + input.pillars.respect) / 4;
        const lightAvg = (input.pillars.mind + input.pillars.soul + input.pillars.happiness + input.pillars.recovery) / 4;
        const degree = Math.max(-90, Math.min(90, ((shadowAvg - lightAvg) / 10) * 90));
        const heavenMultiplier = 1 + (1 - Math.abs(degree) / 90) * 0.5;
        
        const powerBase = Math.pow(hustle * hustle + faith * faith, love);
        const powerScore = (powerBase * heavenMultiplier) * 1000;
        
        // Determine tier
        let tierRank = "RECOVERY";
        if (powerScore >= 900) tierRank = "GOD MODE";
        else if (powerScore >= 600) tierRank = "ASCENDING";
        else if (powerScore >= 300) tierRank = "SOLID";
        else if (powerScore >= 100) tierRank = "BUILDING";
        
        // Calculate credits
        const completedPillars = Object.values(input.pillars).filter(p => p > 6).length;
        const extraCredit = Math.max(0, completedPillars - 6) * 5;
        const creditsEarned = 6 + extraCredit;

        // Update snapshot
        const updated = await updateDailySnapshot(ctx.user.id, today, {
          enthusiasmScore: input.enthusiasmScore,
          gratitude: input.gratitude,
          worthIt: input.worthIt,
          pmReport: input.pmReport,
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
          powerScore: Math.round(powerScore * 100) / 100,
          tierRank,
          creditsEarned,
          completedPillars,
          extraCredit,
          shadowAvg: Math.round(shadowAvg * 100) / 100,
          lightAvg: Math.round(lightAvg * 100) / 100,
          degree: Math.round(degree * 100) / 100,
          heavenMultiplier: Math.round(heavenMultiplier * 100) / 100,
        });

        // Update user progression
        await updateUserProgression(ctx.user.id, {
          powerScore: Math.round(powerScore * 100) / 100,
          tierRank,
          totalCredits: (snapshot.userId ? 0 : 0) + creditsEarned,
          burnoutRisk: faith < 0.3 && love < 0.3 ? "HIGH" : "LOW",
        });

        return updated;
      }),
  }),

  // HS.OS Progression Routers
  hsProgression: router({
    // Get user progression
    get: protectedProcedure.query(async ({ ctx }) => {
      const prog = await getOrCreateUserProgression(ctx.user.id);
      return prog || {};
    }),

    // Update progression
    update: protectedProcedure
      .input(z.object({
        currentStage: z.string().optional(),
        currentLevel: z.number().optional(),
        totalXP: z.number().optional(),
        currentStreak: z.number().optional(),
        soulBeastName: z.string().optional(),
        soulBeastEvolution: z.enum(["egg", "hatchling", "evolved", "ascended"]).optional(),
        spiritualAge: z.number().optional(),
        biologicalAge: z.number().optional(),
        frictionScore: z.number().optional(),
        lifeCycles: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const result = await updateUserProgression(ctx.user.id, input as any);
        return result || {};
      }),

    // Calculate spiritual age
    calculateSpiritualAge: protectedProcedure
      .input(z.object({
        biologicalAge: z.number(),
        baseMaturity: z.number(),
        wisdomMilestones: z.number(),
        frictionScore: z.number(),
      }))
      .query(({ input }) => {
        const spiritualAge = input.baseMaturity + (input.wisdomMilestones * input.frictionScore);
        const deltaFromBaseline = spiritualAge - input.biologicalAge;
        const statusColor = deltaFromBaseline > 5 ? "green" : deltaFromBaseline < -5 ? "red" : "yellow";
        
        return {
          spiritualAge: Math.round(spiritualAge),
          biologicalAge: input.biologicalAge,
          deltaFromBaseline,
          statusColor,
          lifeCyclesAhead: Math.round(deltaFromBaseline / 2),
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
