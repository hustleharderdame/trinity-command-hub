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
  // 200-Level Wealth Progression
  wealthNetWorth: decimal("wealthNetWorth", { precision: 15, scale: 2 }).default("0"),
  wealthLevel: int("wealthLevel").default(0),
  wealthStageId: int("wealthStageId").default(0),
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


/**
 * HustleSystem: MindDNA Thought Cells
 * Stores symbolic genome of thought with emotion, idea, action nucleotides
 */
export const mindDNAThoughtCells = mysqlTable("minddna_thought_cells", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  
  // Emotion nucleotide (frequency signature)
  emotionFrequency: varchar("emotionFrequency", { length: 255 }).notNull(),
  emotionIntensity: int("emotionIntensity").notNull(), // 1-10
  
  // Idea nucleotide (cognitive meaning)
  ideaMeaning: text("ideaMeaning").notNull(),
  ideaClarity: int("ideaClarity").notNull(), // 1-10
  
  // Action nucleotide (behavioral output)
  actionOutput: text("actionOutput").notNull(),
  actionCompletion: int("actionCompletion").notNull(), // 0-100%
  
  // Strands activated
  strandActivation: json("strandActivation").notNull(), // ["HUSTLE", "FAITH", "LOVE"]
  
  // Expression level (calculated)
  expressionLevel: decimal("expressionLevel", { precision: 5, scale: 2 }).default("0"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type MindDNAThoughtCell = typeof mindDNAThoughtCells.$inferSelect;
export type InsertMindDNAThoughtCell = typeof mindDNAThoughtCells.$inferInsert;

/**
 * HustleSystem: MBS/MPR Credits Tracking
 * Dual Trinity balance: Mind, Body, Soul vs Money, Power, Respect
 */
export const mbsMprCredits = mysqlTable("mbs_mpr_credits", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  
  // MBS (Internal Engine)
  mindCredits: int("mindCredits").default(0), // max 20
  bodyCredits: int("bodyCredits").default(0), // max 15
  soulCredits: int("soulCredits").default(0), // max 15
  
  // MPR (External Engine)
  moneyCredits: int("moneyCredits").default(0), // max 20
  powerCredits: int("powerCredits").default(0), // max 15
  respectCredits: int("respectCredits").default(0), // max 15
  
  // Daily tracking
  totalDailyCredits: int("totalDailyCredits").default(0), // max 100
  perfectDayBonus: int("perfectDayBonus").default(0), // max 10
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type MBSMPRCredits = typeof mbsMprCredits.$inferSelect;
export type InsertMBSMPRCredits = typeof mbsMprCredits.$inferInsert;

/**
 * HustleSystem: Blessing Probability & Synchronicity
 * Tracks faith, love, streak for blessing calculation
 */
export const blessingProbability = mysqlTable("blessing_probability", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  
  currentFaith: int("currentFaith").default(5), // 1-10
  currentLove: int("currentLove").default(5), // 1-10
  currentStreak: int("currentStreak").default(0),
  
  // Calculated blessing probability
  blessingProbability: decimal("blessingProbability", { precision: 5, scale: 2 }).default("0"),
  
  // Last blessing event
  lastBlessingDate: timestamp("lastBlessingDate"),
  blessingCount: int("blessingCount").default(0),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type BlessingProbability = typeof blessingProbability.$inferSelect;
export type InsertBlessingProbability = typeof blessingProbability.$inferInsert;

/**
 * HustleSystem: Financial Milestones Tracking
 * 5-tier wealth progression: Gross → Net → Saved → Passive → $1M
 */
export const financialMilestones = mysqlTable("financial_milestones", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  
  // Tier 1: Gross Revenue
  grossRevenue: decimal("grossRevenue", { precision: 12, scale: 2 }).default("0"),
  grossMilestoneReached: boolean("grossMilestoneReached").default(false),
  
  // Tier 2: Net Income
  netIncome: decimal("netIncome", { precision: 12, scale: 2 }).default("0"),
  netMilestoneReached: boolean("netMilestoneReached").default(false),
  
  // Tier 3: Saved Capital
  savedCapital: decimal("savedCapital", { precision: 12, scale: 2 }).default("0"),
  savedMilestoneReached: boolean("savedMilestoneReached").default(false),
  
  // Tier 4: Passive Income
  passiveIncome: decimal("passiveIncome", { precision: 12, scale: 2 }).default("0"),
  passiveMilestoneReached: boolean("passiveMilestoneReached").default(false),
  
  // Tier 5: Net Worth
  netWorth: decimal("netWorth", { precision: 12, scale: 2 }).default("0"),
  millionaireMilestoneReached: boolean("millionaireMilestoneReached").default(false),
  
  // Hustle Age
  hustleAge: varchar("hustleAge", { length: 50 }).default("Infant Hustler"),
  hlvlRange: varchar("hlvlRange", { length: 20 }).default("0–100"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type FinancialMilestones = typeof financialMilestones.$inferSelect;
export type InsertFinancialMilestones = typeof financialMilestones.$inferInsert;

/**
 * HustleSystem: Behavioral Governance & Energetic Justice
 * Tracks current mode, disrespect level, ULC (Unlearned Lesson Code)
 */
export const behavioralGovernance = mysqlTable("behavioral_governance", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  
  // Current energetic justice mode
  currentMode: mysqlEnum("currentMode", ["IDEALIZATION", "DISCIPLINE", "REFLECTION", "RECONCILIATION"]).default("REFLECTION"),
  
  // Disrespect tracking
  disrespectLevel: int("disrespectLevel").default(0), // 0=none, 1=light check, 2=heavy check, 3=divine discipline
  lastDisrespectDate: timestamp("lastDisrespectDate"),
  
  // ULC (Unlearned Lesson Code) & Shadow Loops
  ulcActive: boolean("ulcActive").default(false),
  ulcCode: varchar("ulcCode", { length: 100 }),
  shadowLoopCount: int("shadowLoopCount").default(0),
  shadowLoopLessons: json("shadowLoopLessons").notNull(), // Array of lessons learned
  
  // Grace bonus tracking
  graceBonus: int("graceBonus").default(0),
  lastGraceBonusDate: timestamp("lastGraceBonusDate"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type BehavioralGovernance = typeof behavioralGovernance.$inferSelect;
export type InsertBehavioralGovernance = typeof behavioralGovernance.$inferInsert;

/**
 * HustleSystem: RPG World Layers & Fog Radius
 * Tracks current layer, fog radius, mission completion for expansion
 */
export const rpgWorldLayers = mysqlTable("rpg_world_layers", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  
  // Current layer
  currentLayer: mysqlEnum("currentLayer", ["TrapHouse", "Street", "Apartments", "Penthouse", "Mansion"]).default("TrapHouse"),
  
  // Fog Radius (0-1, expands with missions, shrinks with neglect)
  fogRadius: decimal("fogRadius", { precision: 3, scale: 2 }).default("0.1"),
  
  // Layer progression
  layerUnlocked: json("layerUnlocked").notNull(), // Array of unlocked layers
  
  // Fog mechanics
  missionsCompletedForExpansion: int("missionsCompletedForExpansion").default(0),
  daysNeglected: int("daysNeglected").default(0),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type RPGWorldLayers = typeof rpgWorldLayers.$inferSelect;
export type InsertRPGWorldLayers = typeof rpgWorldLayers.$inferInsert;

/**
 * HustleSystem: 6-Day Weekly Ritual & Divine To-Do List
 * Tracks daily ritual completion and Divine To-Do priorities
 */
export const weeklyRitual = mysqlTable("weekly_ritual", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  
  // Day of week (0=Sunday, 6=Saturday)
  dayOfWeek: int("dayOfWeek").notNull(),
  
  // Ritual completion
  ritualName: varchar("ritualName", { length: 100 }).notNull(),
  completed: boolean("completed").default(false),
  completedAt: timestamp("completedAt"),
  
  // Divine To-Do List
  divineToDoHierarchy: mysqlEnum("divineToDoHierarchy", ["Survival", "Support", "Growth"]).notNull(),
  toDoItems: json("toDoItems").notNull(), // Array of items
  
  // Week tracking
  weekStartDate: date("weekStartDate").notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type WeeklyRitual = typeof weeklyRitual.$inferSelect;
export type InsertWeeklyRitual = typeof weeklyRitual.$inferInsert;

/**
 * HustleSystem: Autonomy Stage Progression
 * Tracks user's current autonomy level (I DO → WE DO → YOU DO → YOU FLY → YOU SOAR)
 */
export const autonomyStage = mysqlTable("autonomy_stage", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  
  // Current autonomy stage
  stage: int("stage").default(1), // 1-5
  stageName: varchar("stageName", { length: 50 }).default("I DO"),
  systemControl: int("systemControl").default(95), // Percentage
  voiceAgent: varchar("voiceAgent", { length: 50 }).default("Soul Beast"),
  
  // Stage progression tracking
  stageStartDate: timestamp("stageStartDate").defaultNow(),
  stageCompletionPercentage: int("stageCompletionPercentage").default(0), // 0-100
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type AutonomyStage = typeof autonomyStage.$inferSelect;
export type InsertAutonomyStage = typeof autonomyStage.$inferInsert;


// ─── Business Task Tracking ───

export const taskCompletions = mysqlTable('task_completions', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull(),
  taskId: varchar('task_id', { length: 50 }).notNull(),
  mindScore: decimal('mind_score', { precision: 3, scale: 1 }).notNull(), // 0-10
  bodyScore: decimal('body_score', { precision: 3, scale: 1 }).notNull(),
  soulScore: decimal('soul_score', { precision: 3, scale: 1 }).notNull(),
  moneyScore: decimal('money_score', { precision: 3, scale: 1 }).notNull(),
  powerScore: decimal('power_score', { precision: 3, scale: 1 }).notNull(),
  respectScore: decimal('respect_score', { precision: 3, scale: 1 }).notNull(),
  mbsAverage: decimal('mbs_average', { precision: 4, scale: 2 }).notNull(),
  mprAverage: decimal('mpr_average', { precision: 4, scale: 2 }).notNull(),
  overallScore: decimal('overall_score', { precision: 4, scale: 2 }).notNull(),
  masteryLevel: decimal('mastery_level', { precision: 2, scale: 1 }).notNull(), // 0-4 stars
  masteryLevelsCompleted: json('mastery_levels_completed').notNull(), // [0-4 for each challenge]
  completedAt: timestamp('completed_at').notNull().defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export type TaskCompletion = typeof taskCompletions.$inferSelect
export type InsertTaskCompletion = typeof taskCompletions.$inferInsert
