import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, dailyMetrics, userProgression, budgetAllocation, intelligenceHistory } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
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

/**
 * Get or create user progression record
 */
export async function getOrCreateUserProgression(userId: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    const existing = await db
      .select()
      .from(userProgression)
      .where(eq(userProgression.userId, userId))
      .limit(1);

    if (existing.length > 0) {
      return existing[0];
    }

    // Create new progression record
    await db.insert(userProgression).values({
      userId,
      currentLevel: 1,
      totalPoints: 0,
      pointsToNextGate: 40,
      currentStreak: 0,
      longestStreak: 0,
      totalCredits: 0 as any,
      spentCredits: 0 as any,
      unlockedGates: [] as any,
      intelligenceTier: 'novice',
    });

    const result = await db
      .select()
      .from(userProgression)
      .where(eq(userProgression.userId, userId))
      .limit(1);

    return result[0] || null;
  } catch (error) {
    console.error("[Database] Failed to get or create user progression:", error);
    return null;
  }
}

/**
 * Get today's metrics for user
 */
export async function getTodayMetrics(userId: number, date: string) {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db
      .select()
      .from(dailyMetrics)
      .where(and(eq(dailyMetrics.userId, userId), eq(dailyMetrics.date, date)))
      .limit(1);

    return result[0] || null;
  } catch (error) {
    console.error("[Database] Failed to get today metrics:", error);
    return null;
  }
}

/**
 * Save or update daily metrics
 */
export async function saveDailyMetrics(userId: number, date: string, metrics: any) {
  const db = await getDb();
  if (!db) return null;

  try {
    const existing = await getTodayMetrics(userId, date);

    if (existing) {
      await db
        .update(dailyMetrics)
        .set({ ...metrics, updatedAt: new Date() })
        .where(and(eq(dailyMetrics.userId, userId), eq(dailyMetrics.date, date)));
    } else {
      await db.insert(dailyMetrics).values({
        userId,
        date,
        ...metrics,
      });
    }

    return getTodayMetrics(userId, date);
  } catch (error) {
    console.error("[Database] Failed to save daily metrics:", error);
    return null;
  }
}

/**
 * Get recent metrics for trend analysis (last N days)
 */
export async function getRecentMetrics(userId: number, days: number = 30) {
  const db = await getDb();
  if (!db) return [];

  try {
    const result = await db
      .select()
      .from(dailyMetrics)
      .where(eq(dailyMetrics.userId, userId))
      .orderBy(desc(dailyMetrics.date))
      .limit(days);

    return result;
  } catch (error) {
    console.error("[Database] Failed to get recent metrics:", error);
    return [];
  }
}

/**
 * Save intelligence history for tracking trends
 */
export async function saveIntelligenceHistory(userId: number, date: string, history: any) {
  const db = await getDb();
  if (!db) return null;

  try {
    await db.insert(intelligenceHistory).values({
      userId,
      date,
      ...history,
    });

    return true;
  } catch (error) {
    console.error("[Database] Failed to save intelligence history:", error);
    return false;
  }
}

/**
 * Update user progression
 */
export async function updateUserProgression(userId: number, updates: any) {
  const db = await getDb();
  if (!db) return null;

  try {
    await db
      .update(userProgression)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(userProgression.userId, userId));

    return getOrCreateUserProgression(userId);
  } catch (error) {
    console.error("[Database] Failed to update user progression:", error);
    return null;
  }
}

/**
 * Get or create budget allocation for today
 */
export async function getOrCreateBudgetAllocation(userId: number, date: string) {
  const db = await getDb();
  if (!db) return null;

  try {
    const existing = await db
      .select()
      .from(budgetAllocation)
      .where(and(eq(budgetAllocation.userId, userId), eq(budgetAllocation.date, date)))
      .limit(1);

    if (existing.length > 0) {
      return existing[0];
    }

    // Create new budget allocation
    await db.insert(budgetAllocation).values({
      userId,
      date,
      category1: 0 as any,
      category2: 0 as any,
      category3: 0 as any,
      category4: 0 as any,
      category5: 0 as any,
      category6: 0 as any,
      category7: 0 as any,
      category8: 0 as any,
      category9: 0 as any,
      category10: 0 as any,
      totalBudget: 0 as any,
      totalAllocated: 0 as any,
    });

    const result = await db
      .select()
      .from(budgetAllocation)
      .where(and(eq(budgetAllocation.userId, userId), eq(budgetAllocation.date, date)))
      .limit(1);

    return result[0] || null;
  } catch (error) {
    console.error("[Database] Failed to get or create budget allocation:", error);
    return null;
  }
}

/**
 * Update budget allocation
 */
export async function updateBudgetAllocation(userId: number, date: string, allocation: any) {
  const db = await getDb();
  if (!db) return null;

  try {
    const existing = await db
      .select()
      .from(budgetAllocation)
      .where(and(eq(budgetAllocation.userId, userId), eq(budgetAllocation.date, date)))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(budgetAllocation)
        .set({ ...allocation, updatedAt: new Date() })
        .where(and(eq(budgetAllocation.userId, userId), eq(budgetAllocation.date, date)));
    } else {
      await db.insert(budgetAllocation).values({
        userId,
        date,
        ...allocation,
      });
    }

    return getOrCreateBudgetAllocation(userId, date);
  } catch (error) {
    console.error("[Database] Failed to update budget allocation:", error);
    return null;
  }
}
