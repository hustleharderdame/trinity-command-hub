import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getOrCreateUserProgression, updateUserProgression, getHLModules, updateHLModules } from "./db";

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

  // HustleSystem Routers
  hs: router({
    // Get user progression
    getProgression: protectedProcedure.query(async ({ ctx }) => {
      const prog = await getOrCreateUserProgression(ctx.user.id);
      return prog || {};
    }),

    // Update user progression
    updateProgression: protectedProcedure
      .input(z.object({
        currentStage: z.string().optional(),
        currentLevel: z.number().optional(),
        currentDegree: z.number().optional(),
        totalXP: z.number().optional(),
        mindPillar: z.number().optional(),
        bodyPillar: z.number().optional(),
        spiritPillar: z.number().optional(),
        moneyPillar: z.number().optional(),
        powerPillar: z.number().optional(),
        respectPillar: z.number().optional(),
        powerScore: z.number().optional(),
        hustleScore: z.number().optional(),
        faithScore: z.number().optional(),
        loveScore: z.number().optional(),
        currentZone: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const result = await updateUserProgression(ctx.user.id, input);
        return result || {};
      }),

    // Get HL Modules
    getModules: protectedProcedure.query(async ({ ctx }) => {
      const modules = await getHLModules(ctx.user.id);
      return modules || {};
    }),

    // Update HL Modules
    updateModules: protectedProcedure
      .input(z.record(z.string(), z.number()))
      .mutation(async ({ ctx, input }) => {
        const result = await updateHLModules(ctx.user.id, input);
        return result || {};
      }),

    // Calculate Power Score
    calculatePower: protectedProcedure.query(async ({ ctx }) => {
      const progression = await getOrCreateUserProgression(ctx.user.id);
      if (!progression) return { powerScore: 0, components: { hustle: 0, faith: 0, love: 0, legacy: 1, blessing: 50 } };
      
      // Power(t) = (Hustle² + Faith²)^Love × LegacyFactor + BlessingProbability
      const hustle = parseFloat(progression.hustleScore?.toString() || "0");
      const faith = parseFloat(progression.faithScore?.toString() || "0");
      const love = parseFloat(progression.loveScore?.toString() || "0");
      const legacy = parseFloat(progression.legacyFactor?.toString() || "1");
      const blessing = parseFloat(progression.blessingProbability?.toString() || "50");

      const powerBase = Math.pow(Math.max(hustle * hustle + faith * faith, 0), Math.max(love / 10, 0.1));
      const powerScore = (powerBase * legacy) + (blessing / 100);

      return {
        powerScore: Math.round(powerScore * 100) / 100,
        components: { hustle, faith, love, legacy, blessing }
      };
    }),

    // Get Soul Beast
    getSoulBeast: protectedProcedure.query(async ({ ctx }) => {
      const progression = await getOrCreateUserProgression(ctx.user.id);
      if (!progression) return { name: "Unnamed Beast", level: 1, evolution: "egg" };
      return {
        name: progression.soulBeastName || "Unnamed Beast",
        level: progression.soulBeastLevel || 1,
        evolution: progression.soulBeastEvolution || "egg"
      };
    }),

    // Update Soul Beast
    updateSoulBeast: protectedProcedure
      .input(z.object({
        name: z.string().optional(),
        level: z.number().optional(),
        evolution: z.enum(["egg", "hatchling", "evolved", "ascended"]).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const result = await updateUserProgression(ctx.user.id, {
          soulBeastName: input.name,
          soulBeastLevel: input.level,
          soulBeastEvolution: input.evolution,
        });
        return result || {};
      }),

    // Get current zone
    getCurrentZone: protectedProcedure.query(async ({ ctx }) => {
      const progression = await getOrCreateUserProgression(ctx.user.id);
      if (!progression) return { zone: "Purgatory" };
      return { zone: progression.currentZone || "Purgatory" };
    }),

    // Switch zone
    switchZone: protectedProcedure
      .input(z.enum(["Purgatory", "Heaven", "Hell", "Faith Street"]))
      .mutation(async ({ ctx, input }) => {
        const result = await updateUserProgression(ctx.user.id, {
          currentZone: input,
        });
        return result || {};
      }),
  }),
});

export type AppRouter = typeof appRouter;
