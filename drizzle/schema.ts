import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Daily metrics tracking for Trinity dimensions (Mind, Body, Soul)
 * Stores intelligence scores and pillar values for each day
 */
export const dailyMetrics = mysqlTable("daily_metrics", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD format
  
  // Daily input values
  faithScore: decimal("faithScore", { precision: 3, scale: 1 }).default("0"), // 0-10
  hustlePercentage: decimal("hustlePercentage", { precision: 5, scale: 2 }).default("0"), // 0-100
  loveScore: decimal("loveScore", { precision: 3, scale: 1 }).default("0"), // 0-10
  
  // Pillar values (0-10 scale with 0.5 increments)
  mindPillar: decimal("mindPillar", { precision: 3, scale: 1 }).default("5"),
  bodyPillar: decimal("bodyPillar", { precision: 3, scale: 1 }).default("5"),
  soulPillar: decimal("soulPillar", { precision: 3, scale: 1 }).default("5"),
  moneyPillar: decimal("moneyPillar", { precision: 3, scale: 1 }).default("5"),
  powerPillar: decimal("powerPillar", { precision: 3, scale: 1 }).default("5"),
  respectPillar: decimal("respectPillar", { precision: 3, scale: 1 }).default("5"),
  consistencyPillar: decimal("consistencyPillar", { precision: 3, scale: 1 }).default("5"),
  happinessPillar: decimal("happinessPillar", { precision: 3, scale: 1 }).default("5"),
  recoveryPillar: decimal("recoveryPillar", { precision: 3, scale: 1 }).default("5"),
  impactPillar: decimal("impactPillar", { precision: 3, scale: 1 }).default("5"),
  
  // Calculated intelligence metrics
  mindIntelligence: decimal("mindIntelligence", { precision: 5, scale: 2 }).default("0"),
  bodyIntelligence: decimal("bodyIntelligence", { precision: 5, scale: 2 }).default("0"),
  soulIntelligence: decimal("soulIntelligence", { precision: 5, scale: 2 }).default("0"),
  
  // Power calculation
  powerScore: decimal("powerScore", { precision: 8, scale: 2 }).default("0"),
  streakMultiplier: decimal("streakMultiplier", { precision: 5, scale: 2 }).default("1"),
  
  // Predictive intelligence
  burnoutRisk: decimal("burnoutRisk", { precision: 5, scale: 2 }).default("0"), // 0-100 percentage
  faithDecayRisk: decimal("faithDecayRisk", { precision: 5, scale: 2 }).default("0"), // 0-100 percentage
  momentumStatus: varchar("momentumStatus", { length: 20 }).default("neutral"), // rising, stable, declining, neutral
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DailyMetrics = typeof dailyMetrics.$inferSelect;
export type InsertDailyMetrics = typeof dailyMetrics.$inferInsert;

/**
 * User progression and level tracking
 * Tracks overall progress, levels, points, and gate unlocks
 */
export const userProgression = mysqlTable("user_progression", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  
  // Level and points system
  currentLevel: int("currentLevel").default(1).notNull(),
  totalPoints: int("totalPoints").default(0).notNull(),
  pointsToNextGate: int("pointsToNextGate").default(40).notNull(), // Points needed to unlock next gate
  
  // Streak tracking
  currentStreak: int("currentStreak").default(0).notNull(),
  longestStreak: int("longestStreak").default(0).notNull(),
  lastActiveDate: varchar("lastActiveDate", { length: 10 }), // YYYY-MM-DD
  
  // Credit economy
  totalCredits: decimal("totalCredits", { precision: 10, scale: 2 }).default("0"),
  spentCredits: decimal("spentCredits", { precision: 10, scale: 2 }).default("0"),
  
  // Gate unlock tracking (which gates have been passed)
  unlockedGates: json("unlockedGates").$type<number[]>().default([]),
  
  // Overall intelligence tier
  intelligenceTier: varchar("intelligenceTier", { length: 20 }).default("novice"), // novice, apprentice, adept, master, oracle
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserProgression = typeof userProgression.$inferSelect;
export type InsertUserProgression = typeof userProgression.$inferInsert;

/**
 * Budget allocation tracking
 * Stores how user allocates their energy/credits across 10 categories
 */
export const budgetAllocation = mysqlTable("budget_allocation", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD
  
  // 10 budget categories with allocation amounts
  category1: decimal("category1", { precision: 10, scale: 2 }).default("0"), // Mind Development
  category2: decimal("category2", { precision: 10, scale: 2 }).default("0"), // Body Training
  category3: decimal("category3", { precision: 10, scale: 2 }).default("0"), // Soul Work
  category4: decimal("category4", { precision: 10, scale: 2 }).default("0"), // Financial Growth
  category5: decimal("category5", { precision: 10, scale: 2 }).default("0"), // Power Building
  category6: decimal("category6", { precision: 10, scale: 2 }).default("0"), // Respect Cultivation
  category7: decimal("category7", { precision: 10, scale: 2 }).default("0"), // Consistency Practice
  category8: decimal("category8", { precision: 10, scale: 2 }).default("0"), // Happiness Pursuit
  category9: decimal("category9", { precision: 10, scale: 2 }).default("0"), // Recovery & Rest
  category10: decimal("category10", { precision: 10, scale: 2 }).default("0"), // Impact Creation
  
  // Total budget available and allocated
  totalBudget: decimal("totalBudget", { precision: 10, scale: 2 }).default("0"),
  totalAllocated: decimal("totalAllocated", { precision: 10, scale: 2 }).default("0"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BudgetAllocation = typeof budgetAllocation.$inferSelect;
export type InsertBudgetAllocation = typeof budgetAllocation.$inferInsert;

/**
 * Intelligence history tracking
 * Stores historical intelligence scores for trend analysis
 */
export const intelligenceHistory = mysqlTable("intelligence_history", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD
  
  // Historical intelligence values
  mindIntelligence: decimal("mindIntelligence", { precision: 5, scale: 2 }).default("0"),
  bodyIntelligence: decimal("bodyIntelligence", { precision: 5, scale: 2 }).default("0"),
  soulIntelligence: decimal("soulIntelligence", { precision: 5, scale: 2 }).default("0"),
  overallIntelligence: decimal("overallIntelligence", { precision: 5, scale: 2 }).default("0"),
  
  // Predictive metrics
  burnoutRisk: decimal("burnoutRisk", { precision: 5, scale: 2 }).default("0"),
  faithDecayRisk: decimal("faithDecayRisk", { precision: 5, scale: 2 }).default("0"),
  momentumStatus: varchar("momentumStatus", { length: 20 }).default("neutral"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type IntelligenceHistory = typeof intelligenceHistory.$inferSelect;
export type InsertIntelligenceHistory = typeof intelligenceHistory.$inferInsert;
