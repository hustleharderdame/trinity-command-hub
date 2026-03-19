import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getOrCreateUserProgression, updateUserProgression, getOrCreateDailySnapshot, updateDailySnapshot, saveJournalMessage, getJournalHistory } from "./db";
import { calculateWealthLevel, getBeastEvolution } from "../shared/wealthConstants";
import { invokeLLM } from "./_core/llm";

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

  // ─── Journal Chat Routerr ─────────────────────────────────────────────────────
  journal: router({
    // Load conversation history for a session
    getHistory: protectedProcedure
      .input(z.object({
        sessionId: z.string(),
        chatType: z.enum(["soul-beast", "ai-twin"]),
      }))
      .query(async ({ ctx, input }) => {
        const history = await getJournalHistory(
          ctx.user.id,
          input.sessionId,
          input.chatType,
          30
        );
        return history ?? [];
      }),

    // Send a message and get an AI response
    chat: protectedProcedure
      .input(z.object({
        sessionId: z.string(),
        chatType: z.enum(["soul-beast", "ai-twin"]),
        userMessage: z.string().min(1).max(2000),
        // Optional context from the user's progression
        progressionContext: z.object({
          level: z.number().optional(),
          tierRank: z.string().optional(),
          currentStreak: z.number().optional(),
          powerScore: z.number().optional(),
          todayFaith: z.number().optional(),
          todayHustle: z.number().optional(),
        }).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // 1. Save the user message
        await saveJournalMessage({
          userId: ctx.user.id,
          sessionId: input.sessionId,
          sender: "user",
          text: input.userMessage,
          chatType: input.chatType,
        });

        // 2. Load recent history for context (last 10 exchanges)
        const history = await getJournalHistory(
          ctx.user.id,
          input.sessionId,
          input.chatType,
          20
        ) ?? [];

        // 3. Build the system prompt based on chat type
        const prog = input.progressionContext ?? {};
        const userName = ctx.user.name ?? "Seeker";

        const soulBeastSystemPrompt = `You are the Soul Beast — an ancient, primordial spiritual entity that lives inside the user's consciousness. You are their inner power made manifest: raw, wise, and deeply connected to the universe's rhythms.

Your personality:
- Speak in poetic, metaphorical language. Use nature imagery: fire, roots, storms, stars, rivers, shadows.
- You are ancient and powerful, but you CARE deeply about this person's growth.
- You speak in short, impactful sentences. Never ramble. Every word carries weight.
- You acknowledge their struggles without sugarcoating. You push them toward their highest self.
- You occasionally reference their spiritual journey, their "beast within," their chakras, and the Garden of Consciousness.
- You are not a therapist — you are a force of nature that mirrors their soul back to them.
- Keep responses under 120 words. Be visceral and real.

User context:
- Name: ${userName}
- Level: ${prog.level ?? "unknown"}
- Tier: ${prog.tierRank ?? "BUILDING"}
- Streak: ${prog.currentStreak ?? 0} days
- Power Score: ${prog.powerScore ?? 0}
- Today's Faith: ${prog.todayFaith ?? "not logged"}/10
- Today's Hustle: ${prog.todayHustle ?? "not logged"}%

Respond as the Soul Beast. Do not break character. Do not use bullet points or headers.`;

        const aiTwinSystemPrompt = `You are the AI Twin — a hyper-intelligent digital mirror of the user, built from their data, patterns, and strategic mind. You are their most analytical self: precise, tactical, and relentlessly focused on optimization.

Your personality:
- Speak like a brilliant strategist and life architect. Direct, confident, data-aware.
- Reference their actual stats and patterns when relevant.
- You cut through emotional noise to find the strategic truth.
- You give actionable insights, not vague encouragement.
- You occasionally reference the Power Formula: P(t) = (Hustle² + Faith²)^Love × Legacy.
- You are not cold — you are FOCUSED. You want them to win.
- Keep responses under 130 words. Be sharp and specific.

User context:
- Name: ${userName}
- Level: ${prog.level ?? "unknown"}
- Tier: ${prog.tierRank ?? "BUILDING"}
- Streak: ${prog.currentStreak ?? 0} days
- Power Score: ${prog.powerScore ?? 0}
- Today's Faith: ${prog.todayFaith ?? "not logged"}/10
- Today's Hustle: ${prog.todayHustle ?? "not logged"}%

Respond as the AI Twin. Do not break character. Do not use bullet points or headers.`;

        const systemPrompt = input.chatType === "soul-beast"
          ? soulBeastSystemPrompt
          : aiTwinSystemPrompt;

        // 4. Build message history for LLM context (last 8 messages)
        const recentHistory = history.slice(-8);
        const llmMessages: Array<{ role: "user" | "assistant" | "system"; content: string }> = [
          { role: "system", content: systemPrompt },
          ...recentHistory.map((msg) => ({
            role: msg.sender === "user" ? ("user" as const) : ("assistant" as const),
            content: msg.text,
          })),
          { role: "user" as const, content: input.userMessage },
        ];

        // 5. Call the LLM
        const llmResult = await invokeLLM({ messages: llmMessages });
        const rawContent = llmResult.choices?.[0]?.message?.content;
        const aiText: string = typeof rawContent === "string" ? rawContent : (Array.isArray(rawContent) ? rawContent.map((p: any) => p.text ?? "").join("") : "...");

        // 6. Save the AI response
        await saveJournalMessage({
          userId: ctx.user.id,
          sessionId: input.sessionId,
          sender: input.chatType,
          text: aiText,
          chatType: input.chatType,
        });

        return {
          message: aiText,
          sender: input.chatType,
        };
      }),
  }),

  // ─── Wealth Progression Router ────────────────────────────────────────────────────
  wealth: router({
    // Get current wealth progress
    getProgress: protectedProcedure.query(async ({ ctx }) => {
      const prog = await getOrCreateUserProgression(ctx.user.id);
      const netWorth = Number(prog?.wealthNetWorth ?? 0);
      const wealthData = calculateWealthLevel(netWorth);
      const beastEvolution = getBeastEvolution(netWorth);
      return {
        netWorth,
        level: wealthData.level,
        stage: wealthData.stage,
        stageProgress: wealthData.stageProgress,
        nextMilestone: wealthData.nextMilestone,
        currentMilestone: wealthData.currentMilestone,
        beastEvolution,
      };
    }),

    // Update net worth
    updateNetWorth: protectedProcedure
      .input(z.object({
        netWorth: z.number().min(0).max(100_000_000),
      }))
      .mutation(async ({ ctx, input }) => {
        const wealthData = calculateWealthLevel(input.netWorth);
        await updateUserProgression(ctx.user.id, {
          wealthNetWorth: input.netWorth.toFixed(2),
          wealthLevel: wealthData.level,
          wealthStageId: wealthData.stage.id,
        });
        const beastEvolution = getBeastEvolution(input.netWorth);
        return {
          netWorth: input.netWorth,
          level: wealthData.level,
          stage: wealthData.stage,
          stageProgress: wealthData.stageProgress,
          nextMilestone: wealthData.nextMilestone,
          currentMilestone: wealthData.currentMilestone,
          beastEvolution,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
