import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the LLM helper so tests don't make real API calls
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [
      {
        message: {
          content: "The Garden hears your call. Walk forward with purpose.",
        },
      },
    ],
  }),
}));

// Mock the DB helpers to avoid real DB calls
vi.mock("./db", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./db")>();
  return {
    ...actual,
    saveJournalMessage: vi.fn().mockResolvedValue(undefined),
    getJournalHistory: vi.fn().mockResolvedValue([]),
  };
});

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 42,
    openId: "test-open-id",
    email: "test@trinity.com",
    name: "Trinity Seeker",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("journal.getHistory", () => {
  it("returns an empty array when no messages exist", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.journal.getHistory({
      sessionId: "session-2026-03-16",
      chatType: "soul-beast",
    });
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(0);
  });

  it("returns an empty array for ai-twin chat type", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.journal.getHistory({
      sessionId: "session-2026-03-16",
      chatType: "ai-twin",
    });
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("journal.chat", () => {
  it("returns a Soul Beast AI response for a user message", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.journal.chat({
      sessionId: "session-2026-03-16",
      chatType: "soul-beast",
      userMessage: "I feel lost today. What should I do?",
    });
    expect(result).toHaveProperty("message");
    expect(typeof result.message).toBe("string");
    expect(result.message.length).toBeGreaterThan(0);
    expect(result.sender).toBe("soul-beast");
  });

  it("returns an AI Twin response for a strategic question", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.journal.chat({
      sessionId: "session-2026-03-16",
      chatType: "ai-twin",
      userMessage: "How do I optimize my morning routine?",
      progressionContext: {
        level: 5,
        tierRank: "RISING",
        currentStreak: 14,
        powerScore: 720,
        todayFaith: 8,
        todayHustle: 75,
      },
    });
    expect(result).toHaveProperty("message");
    expect(typeof result.message).toBe("string");
    expect(result.sender).toBe("ai-twin");
  });

  it("rejects empty messages", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.journal.chat({
        sessionId: "session-2026-03-16",
        chatType: "soul-beast",
        userMessage: "",
      })
    ).rejects.toThrow();
  });

  it("rejects messages over 2000 characters", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.journal.chat({
        sessionId: "session-2026-03-16",
        chatType: "soul-beast",
        userMessage: "x".repeat(2001),
      })
    ).rejects.toThrow();
  });
});
