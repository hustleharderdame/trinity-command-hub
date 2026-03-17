import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, json, boolean, date } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
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
 * User progression tracking (HS.OS v13)
 */
export const userProgression = mysqlTable("user_progression", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  currentStage: varchar("currentStage", { length: 50 }).default("Trap"),
  currentLevel: int("currentLevel").default(1),
  currentDegree: decimal("currentDegree", { precision: 5, scale: 2 }).default("0"),
  totalXP: int("totalXP").default(0),
  xpToNextLevel: int("xpToNextLevel").default(100),
  currentStreak: int("currentStreak").default(0),
  longestStreak: int("longestStreak").default(0),
  totalBattery: decimal("totalBattery", { precision: 10, scale: 2 }).default("0"),
  totalCredits: decimal("totalCredits", { precision: 10, scale: 2 }).default("0"),
  spentCredits: decimal("spentCredits", { precision: 10, scale: 2 }).default("0"),
  powerScore: decimal("powerScore", { precision: 10, scale: 2 }).default("0"),
  tierRank: varchar("tierRank", { length: 50 }).default("RECOVERY"),
  soulBeastName: varchar("soulBeastName", { length: 100 }),
  soulBeastLevel: int("soulBeastLevel").default(1),
  soulBeastEvolution: mysqlEnum("soulBeastEvolution", ["egg", "hatchling", "evolved", "ascended"]).default("egg"),
  spiritualAge: int("spiritualAge").default(0),
  biologicalAge: int("biologicalAge"),
  frictionScore: decimal("frictionScore", { precision: 3, scale: 2 }).default("1.0"),
  lifeCycles: int("lifeCycles").default(0),
  burnoutRisk: mysqlEnum("burnoutRisk", ["LOW", "MODERATE", "HIGH"]).default("LOW"),
  faithDecayStatus: mysqlEnum("faithDecayStatus", ["STABLE", "DECLINING", "DECAYING"]).default("STABLE"),
  momentumStatus: mysqlEnum("momentumStatus", ["STRONG", "BUILDING", "UNSTABLE"]).default("BUILDING"),
  currentZone: varchar("currentZone", { length: 50 }).default("Purgatory"),
  lastActiveDate: date("lastActiveDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserProgression = typeof userProgression.$inferSelect;
export type InsertUserProgression = typeof userProgression.$inferInsert;

/**
 * Daily snapshots (HS.OS Daily Flow)
 */
export const dailySnapshots = mysqlTable("daily_snapshots", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  dateKey: varchar("dateKey", { length: 10 }).notNull(),
  
  // AM START
  faithScore: decimal("faithScore", { precision: 3, scale: 1 }),
  writtenIntent: text("writtenIntent"),
  beastMessage: text("beastMessage"),
  twinMessage: text("twinMessage"),
  
  // MIDDAY CHECK
  hustleExecuted: decimal("hustleExecuted", { precision: 5, scale: 1 }),
  obstacles: json("obstacles"),
  truthReflection: text("truthReflection"),
  
  // PM END
  enthusiasmScore: decimal("enthusiasmScore", { precision: 3, scale: 1 }),
  gratitude: text("gratitude"),
  worthIt: mysqlEnum("worthIt", ["yes", "no", "partial"]),
  pmReport: text("pmReport"),
  
  // Pillars (0-10)
  mindPillar: decimal("mindPillar", { precision: 3, scale: 1 }).default("0"),
  bodyPillar: decimal("bodyPillar", { precision: 3, scale: 1 }).default("0"),
  soulPillar: decimal("soulPillar", { precision: 3, scale: 1 }).default("0"),
  moneyPillar: decimal("moneyPillar", { precision: 3, scale: 1 }).default("0"),
  powerPillar: decimal("powerPillar", { precision: 3, scale: 1 }).default("0"),
  respectPillar: decimal("respectPillar", { precision: 3, scale: 1 }).default("0"),
  consistencyPillar: decimal("consistencyPillar", { precision: 3, scale: 1 }).default("0"),
  happinessPillar: decimal("happinessPillar", { precision: 3, scale: 1 }).default("0"),
  recoveryPillar: decimal("recoveryPillar", { precision: 3, scale: 1 }).default("0"),
  impactPillar: decimal("impactPillar", { precision: 3, scale: 1 }).default("0"),
  
  // Calculations
  powerScore: decimal("powerScore", { precision: 10, scale: 2 }).default("0"),
  tierRank: varchar("tierRank", { length: 50 }).default("RECOVERY"),
  creditsEarned: decimal("creditsEarned", { precision: 5, scale: 2 }).default("0"),
  completedPillars: int("completedPillars").default(0),
  extraCredit: decimal("extraCredit", { precision: 5, scale: 2 }).default("0"),
  shadowAvg: decimal("shadowAvg", { precision: 5, scale: 2 }).default("0"),
  lightAvg: decimal("lightAvg", { precision: 5, scale: 2 }).default("0"),
  degree: decimal("degree", { precision: 5, scale: 2 }).default("0"),
  heavenMultiplier: decimal("heavenMultiplier", { precision: 5, scale: 2 }).default("1"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DailySnapshot = typeof dailySnapshots.$inferSelect;
export type InsertDailySnapshot = typeof dailySnapshots.$inferInsert;

/**
 * Intelligence Engine outputs
 */
export const intelligenceEngine = mysqlTable("intelligence_engine", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  dateKey: varchar("dateKey", { length: 10 }).notNull(),
  
  // Burnout Risk (7-day analysis)
  burnoutRisk: mysqlEnum("burnoutRisk", ["LOW", "MODERATE", "HIGH"]).default("LOW"),
  burnoutScore: decimal("burnoutScore", { precision: 5, scale: 2 }).default("0"),
  
  // Faith Decay (10-day analysis)
  faithDecayStatus: mysqlEnum("faithDecayStatus", ["STABLE", "DECLINING", "DECAYING"]).default("STABLE"),
  faithDecayPercent: decimal("faithDecayPercent", { precision: 5, scale: 2 }).default("0"),
  
  // Momentum (30-day analysis)
  momentumStatus: mysqlEnum("momentumStatus", ["STRONG", "BUILDING", "UNSTABLE"]).default("BUILDING"),
  momentumRatio: decimal("momentumRatio", { precision: 5, scale: 2 }).default("0"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type IntelligenceEngine = typeof intelligenceEngine.$inferSelect;
export type InsertIntelligenceEngine = typeof intelligenceEngine.$inferInsert;

/**
 * Battery & Credits tracking
 */
export const batteryCredits = mysqlTable("battery_credits", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  totalBattery: decimal("totalBattery", { precision: 10, scale: 2 }).default("0"),
  totalCredits: decimal("totalCredits", { precision: 10, scale: 2 }).default("0"),
  spentCredits: decimal("spentCredits", { precision: 10, scale: 2 }).default("0"),
  availableCredits: decimal("availableCredits", { precision: 10, scale: 2 }).default("0"),
  
  // Budget allocation per pillar
  mindBudget: decimal("mindBudget", { precision: 5, scale: 2 }).default("0"),
  bodyBudget: decimal("bodyBudget", { precision: 5, scale: 2 }).default("0"),
  soulBudget: decimal("soulBudget", { precision: 5, scale: 2 }).default("0"),
  moneyBudget: decimal("moneyBudget", { precision: 5, scale: 2 }).default("0"),
  powerBudget: decimal("powerBudget", { precision: 5, scale: 2 }).default("0"),
  respectBudget: decimal("respectBudget", { precision: 5, scale: 2 }).default("0"),
  consistencyBudget: decimal("consistencyBudget", { precision: 5, scale: 2 }).default("0"),
  happinessBudget: decimal("happinessBudget", { precision: 5, scale: 2 }).default("0"),
  recoveryBudget: decimal("recoveryBudget", { precision: 5, scale: 2 }).default("0"),
  impactBudget: decimal("impactBudget", { precision: 5, scale: 2 }).default("0"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BatteryCredits = typeof batteryCredits.$inferSelect;
export type InsertBatteryCredits = typeof batteryCredits.$inferInsert;

/**
 * Spiritual Age & Life Cycles
 */
export const spiritualAge = mysqlTable("spiritual_age", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  biologicalAge: int("biologicalAge"),
  spiritualAge: int("spiritualAge").default(0),
  lifeCycles: int("lifeCycles").default(0),
  frictionScore: decimal("frictionScore", { precision: 3, scale: 2 }).default("1.0"),
  
  // Components
  baseMaturityScore: decimal("baseMaturityScore", { precision: 5, scale: 2 }).default("0"),
  wisdomMilestoneScore: decimal("wisdomMilestoneScore", { precision: 5, scale: 2 }).default("0"),
  lifeCycleBonus: decimal("lifeCycleBonus", { precision: 5, scale: 2 }).default("0"),
  
  // Status
  statusColor: mysqlEnum("statusColor", ["green", "yellow", "red"]).default("yellow"),
  deltaFromBaseline: int("deltaFromBaseline").default(0),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SpiritualAge = typeof spiritualAge.$inferSelect;
export type InsertSpiritualAge = typeof spiritualAge.$inferInsert;

/**
 * Zone history tracking
 */
export const zoneHistory = mysqlTable("zone_history", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  zoneName: varchar("zoneName", { length: 50 }).notNull(),
  enteredAt: timestamp("enteredAt").defaultNow().notNull(),
  exitedAt: timestamp("exitedAt"),
  
  // Zone-specific data
  purgatory_alignmentCheck: boolean("purgatory_alignmentCheck"),
  heaven_powerMultiplier: decimal("heaven_powerMultiplier", { precision: 5, scale: 2 }),
  hell_penalty: decimal("hell_penalty", { precision: 5, scale: 2 }),
  faithStreet_blessingCollected: text("faithStreet_blessingCollected"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ZoneHistory = typeof zoneHistory.$inferSelect;
export type InsertZoneHistory = typeof zoneHistory.$inferInsert;

/**
 * Streak tracking
 */
export const streakTracking = mysqlTable("streak_tracking", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  currentStreak: int("currentStreak").default(0),
  longestStreak: int("longestStreak").default(0),
  lastActiveDate: date("lastActiveDate"),
  streakStartDate: date("streakStartDate"),
  totalDaysActive: int("totalDaysActive").default(0),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type StreakTracking = typeof streakTracking.$inferSelect;
export type InsertStreakTracking = typeof streakTracking.$inferInsert;

/**
 * Historical data export logs
 */
export const historicalExport = mysqlTable("historical_export", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  exportType: mysqlEnum("exportType", ["daily", "cumulative", "full"]).notNull(),
  dateRange: varchar("dateRange", { length: 100 }),
  exportData: json("exportData").notNull(),
  fileName: varchar("fileName", { length: 255 }),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type HistoricalExport = typeof historicalExport.$inferSelect;
export type InsertHistoricalExport = typeof historicalExport.$inferInsert;

/**
 * Journal Chat Messages — persists Soul Beast and AI Twin conversations
 */
export const journalMessages = mysqlTable("journal_messages", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  sessionId: varchar("sessionId", { length: 64 }).notNull(),
  sender: mysqlEnum("sender", ["user", "soul-beast", "ai-twin"]).notNull(),
  text: text("text").notNull(),
  chatType: mysqlEnum("chatType", ["soul-beast", "ai-twin"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type JournalMessage = typeof journalMessages.$inferSelect;
export type InsertJournalMessage = typeof journalMessages.$inferInsert;
