import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, userProgression, hlModules } from "../drizzle/schema";
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
      set: updateSet as any,
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
 * Get or create user progression
 */
export async function getOrCreateUserProgression(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user progression: database not available");
    return null;
  }

  try {
    const existing = await db.select().from(userProgression).where(eq(userProgression.userId, userId)).limit(1);

    if (existing.length > 0) {
      return existing[0];
    }

    // Create new progression
    await db.insert(userProgression).values({
      userId: userId,
      currentStage: "Trap",
      currentLevel: 1,
      currentDegree: "0" as any,
      totalXP: 0,
      xpToNextLevel: 100,
      mindPillar: "50" as any,
      bodyPillar: "50" as any,
      spiritPillar: "50" as any,
      moneyPillar: "50" as any,
      powerPillar: "50" as any,
      respectPillar: "50" as any,
      powerScore: "0" as any,
      hustleScore: "0" as any,
      faithScore: "0" as any,
      loveScore: "0" as any,
      soulBeastEvolution: "egg",
      legacyFactor: "1" as any,
      depthScore: "0" as any,
      blessingProbability: "50" as any,
      currentZone: "Purgatory",
    } as any);

    const created = await db.select().from(userProgression).where(eq(userProgression.userId, userId)).limit(1);
    return created[0] || null;
  } catch (error) {
    console.error("[Database] Failed to get or create user progression:", error);
    return null;
  }
}

/**
 * Update user progression
 */
export async function updateUserProgression(userId: number, updates: Record<string, any>) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update user progression: database not available");
    return null;
  }

  try {
    await db.update(userProgression)
      .set(updates)
      .where(eq(userProgression.userId, userId));

    const updated = await db.select().from(userProgression).where(eq(userProgression.userId, userId)).limit(1);
    return updated[0] || null;
  } catch (error) {
    console.error("[Database] Failed to update user progression:", error);
    return null;
  }
}

/**
 * Get HL Modules for user
 */
export async function getHLModules(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get HL modules: database not available");
    return null;
  }

  try {
    const existing = await db.select().from(hlModules).where(eq(hlModules.userId, userId)).limit(1);

    if (existing.length > 0) {
      return existing[0];
    }

    // Create new modules
    await db.insert(hlModules).values({
      userId: userId,
      hl0_identity: "0" as any,
      hl1_clarity: "0" as any,
      hl1_habits: "0" as any,
      hl2_faith: "0" as any,
      hl2_meditation: "0" as any,
      hl3_sleep: "0" as any,
      hl3_nutrition: "0" as any,
      hl3_energy: "0" as any,
      hl4_income: "0" as any,
      hl4_expenses: "0" as any,
      hl4_savings: "0" as any,
      hl5_relationships: "0" as any,
      hl5_network: "0" as any,
      hl6_goals: "0" as any,
      hl6_momentum: "0" as any,
      hl7_space: "0" as any,
      hl8_skills: "0" as any,
      hl8_mastery: "0" as any,
      hl9_impact: "0" as any,
      hl10_awareness: "0" as any,
      hl10_regulation: "0" as any,
      hl11_alignment: "0" as any,
      hl12_flow: "0" as any,
      hl13_influence: "0" as any,
      hl14_vitality: "0" as any,
      hl15_persistence: "0" as any,
    } as any);

    const created = await db.select().from(hlModules).where(eq(hlModules.userId, userId)).limit(1);
    return created[0] || null;
  } catch (error) {
    console.error("[Database] Failed to get HL modules:", error);
    return null;
  }
}

/**
 * Update HL Modules
 */
export async function updateHLModules(userId: number, updates: Record<string, any>) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update HL modules: database not available");
    return null;
  }

  try {
    await db.update(hlModules)
      .set(updates)
      .where(eq(hlModules.userId, userId));

    const updated = await db.select().from(hlModules).where(eq(hlModules.userId, userId)).limit(1);
    return updated[0] || null;
  } catch (error) {
    console.error("[Database] Failed to update HL modules:", error);
    return null;
  }
}
