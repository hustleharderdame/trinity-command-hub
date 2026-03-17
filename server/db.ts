import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  userProgression, 
  dailySnapshots,
  batteryCredits,
  spiritualAge,
  streakTracking,
  intelligenceEngine,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// HS.OS Database Helpers

export async function getOrCreateUserProgression(userId: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    let prog = await db.select().from(userProgression).where(eq(userProgression.userId, userId)).limit(1);
    
    if (prog.length === 0) {
      await db.insert(userProgression).values({
        userId,
        currentStage: "Trap",
        currentLevel: 1 as any,
        totalXP: 0 as any,
        xpToNextLevel: 100 as any,
        currentStreak: 0 as any,
        longestStreak: 0 as any,
        powerScore: "0" as any,
        tierRank: "RECOVERY",
        soulBeastEvolution: "egg",
      } as any);
      prog = await db.select().from(userProgression).where(eq(userProgression.userId, userId)).limit(1);
    }
    
    return prog[0] || null;
  } catch (error) {
    console.error("[Database] Failed to get or create user progression:", error);
    return null;
  }
}

export async function updateUserProgression(userId: number, data: any) {
  const db = await getDb();
  if (!db) return null;

  try {
    const updateData: any = {};
    
    if (data.currentStage !== undefined) updateData.currentStage = data.currentStage;
    if (data.currentLevel !== undefined) updateData.currentLevel = data.currentLevel;
    if (data.totalXP !== undefined) updateData.totalXP = data.totalXP;
    if (data.currentStreak !== undefined) updateData.currentStreak = data.currentStreak;
    if (data.powerScore !== undefined) updateData.powerScore = data.powerScore;
    if (data.tierRank !== undefined) updateData.tierRank = data.tierRank;
    if (data.soulBeastName !== undefined) updateData.soulBeastName = data.soulBeastName;
    if (data.soulBeastEvolution !== undefined) updateData.soulBeastEvolution = data.soulBeastEvolution;
    if (data.spiritualAge !== undefined) updateData.spiritualAge = data.spiritualAge;
    if (data.biologicalAge !== undefined) updateData.biologicalAge = data.biologicalAge;
    if (data.frictionScore !== undefined) updateData.frictionScore = data.frictionScore;
    if (data.lifeCycles !== undefined) updateData.lifeCycles = data.lifeCycles;
    if (data.burnoutRisk !== undefined) updateData.burnoutRisk = data.burnoutRisk;
    if (data.totalCredits !== undefined) updateData.totalCredits = data.totalCredits;
    if (data.currentZone !== undefined) updateData.currentZone = data.currentZone;

    updateData.updatedAt = new Date();

    await db.update(userProgression)
      .set(updateData)
      .where(eq(userProgression.userId, userId));

    const result = await db.select().from(userProgression).where(eq(userProgression.userId, userId)).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error("[Database] Failed to update user progression:", error);
    return null;
  }
}

export async function getOrCreateDailySnapshot(userId: number, dateKey: string) {
  const db = await getDb();
  if (!db) return null;

  try {
    let snapshot = await db.select().from(dailySnapshots)
      .where(eq(dailySnapshots.userId, userId) as any)
      .limit(1) as any;
    
    if (snapshot.length === 0) {
      await db.insert(dailySnapshots).values({
        userId,
        dateKey,
      });
      snapshot = await db.select().from(dailySnapshots)
        .where(eq(dailySnapshots.userId, userId) as any)
        .limit(1) as any;
    }
    
    return snapshot[0] || null;
  } catch (error) {
    console.error("[Database] Failed to get or create daily snapshot:", error);
    return null;
  }
}

export async function updateDailySnapshot(userId: number, dateKey: string, data: any) {
  const db = await getDb();
  if (!db) return null;

  try {
    const updateData: any = {};
    
    // Map all possible fields
    const fields = [
      'faithScore', 'writtenIntent', 'beastMessage', 'twinMessage',
      'hustleExecuted', 'obstacles', 'truthReflection',
      'enthusiasmScore', 'gratitude', 'worthIt', 'pmReport',
      'mindPillar', 'bodyPillar', 'soulPillar', 'moneyPillar', 'powerPillar',
      'respectPillar', 'consistencyPillar', 'happinessPillar', 'recoveryPillar', 'impactPillar',
      'powerScore', 'tierRank', 'creditsEarned', 'completedPillars', 'extraCredit',
      'shadowAvg', 'lightAvg', 'degree', 'heavenMultiplier'
    ];

    fields.forEach(field => {
      if (data[field] !== undefined) {
        updateData[field] = data[field];
      }
    });

    if (Object.keys(updateData).length > 0) {
      await (db.update(dailySnapshots)
        .set(updateData)
        .where(eq(dailySnapshots.userId, userId) as any) as any);
    }

    const result = await db.select().from(dailySnapshots)
      .where(eq(dailySnapshots.userId, userId) as any)
      .limit(1) as any;
    
    return result[0] || null;
  } catch (error) {
    console.error("[Database] Failed to update daily snapshot:", error);
    return null;
  }
}

export async function getOrCreateBatteryCredits(userId: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    let battery = await db.select().from(batteryCredits).where(eq(batteryCredits.userId, userId)).limit(1);
    
    if (battery.length === 0) {
      await db.insert(batteryCredits).values({
        userId,
        totalBattery: "0" as any,
        totalCredits: "0" as any,
        spentCredits: "0" as any,
        availableCredits: "0" as any,
      } as any);
      battery = await db.select().from(batteryCredits).where(eq(batteryCredits.userId, userId)).limit(1);
    }
    
    return battery[0] || null;
  } catch (error) {
    console.error("[Database] Failed to get or create battery credits:", error);
    return null;
  }
}

export async function getOrCreateSpiritualAge(userId: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    let spiritual = await db.select().from(spiritualAge).where(eq(spiritualAge.userId, userId)).limit(1);
    
    if (spiritual.length === 0) {
      await db.insert(spiritualAge).values({
        userId,
        spiritualAge: 0 as any,
        lifeCycles: 0,
        frictionScore: "1.0" as any,
      } as any);
      spiritual = await db.select().from(spiritualAge).where(eq(spiritualAge.userId, userId)).limit(1);
    }
    
    return spiritual[0] || null;
  } catch (error) {
    console.error("[Database] Failed to get or create spiritual age:", error);
    return null;
  }
}

export async function getOrCreateStreakTracking(userId: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    let streak = await db.select().from(streakTracking).where(eq(streakTracking.userId, userId)).limit(1);
    
    if (streak.length === 0) {
      await db.insert(streakTracking).values({
        userId,
        currentStreak: 0 as any,
        longestStreak: 0,
        totalDaysActive: 0,
      } as any);
      streak = await db.select().from(streakTracking).where(eq(streakTracking.userId, userId)).limit(1);
    }
    
    return streak[0] || null;
  } catch (error) {
    console.error("[Database] Failed to get or create streak tracking:", error);
    return null;
  }
}

//// ─── Journal Chat Helpers ───────────────────────────────────────────────────
export async function saveJournalMessage(data: {
  userId: number;
  sessionId: string;
  sender: "user" | "soul-beast" | "ai-twin";
  text: string;
  chatType: "soul-beast" | "ai-twin";
}) {
  const db = await getDb();
  if (!db) return;
  const { journalMessages } = await import("../drizzle/schema");
  await db.insert(journalMessages).values(data);
}
export async function getJournalHistory(
  userId: number,
  sessionId: string,
  chatType: "soul-beast" | "ai-twin",
  limit = 20
) {
  const db = await getDb();
  if (!db) return [];
  const { journalMessages } = await import("../drizzle/schema");
  const { eq, and, desc } = await import("drizzle-orm");
  const rows = await db
    .select()
    .from(journalMessages)
    .where(
      and(
        eq(journalMessages.userId, userId),
        eq(journalMessages.sessionId, sessionId),
        eq(journalMessages.chatType, chatType)
      )
    )
    .orderBy(desc(journalMessages.createdAt))
    .limit(limit);
  return rows.reverse();
}
