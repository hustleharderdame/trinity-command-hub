import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, json, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
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
 * HustleSystem Stages - Macro environments (Trap, Suburbs, Penthouse, Mansion, Fort, Keep, Castle, Kingdom)
 */
export const hsStages = mysqlTable("hs_stages", {
  id: int("id").autoincrement().primaryKey(),
  stageName: varchar("stageName", { length: 50 }).notNull().unique(), // Trap, Suburbs, Penthouse, etc.
  description: text("description"),
  levelRangeStart: int("levelRangeStart").notNull(), // e.g., 1 for Trap
  levelRangeEnd: int("levelRangeEnd").notNull(), // e.g., 25 for Trap
  stageOrder: int("stageOrder").notNull(), // 1-8 for progression order
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type HSStage = typeof hsStages.$inferSelect;
export type InsertHSStage = typeof hsStages.$inferInsert;

/**
 * User Progression - Current stage, level, degree tracking
 */
export const userProgression = mysqlTable("user_progression", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  
  // Stage → Level → Degree
  currentStage: varchar("currentStage", { length: 50 }).default("Trap"), // Stage name
  currentLevel: int("currentLevel").default(1).notNull(),
  currentDegree: decimal("currentDegree", { precision: 5, scale: 2 }).default("0"), // -90 to +90
  
  // Progression metrics
  totalXP: int("totalXP").default(0).notNull(),
  xpToNextLevel: int("xpToNextLevel").default(100).notNull(),
  
  // Pillar stats (0-100 scale)
  mindPillar: decimal("mindPillar", { precision: 5, scale: 2 }).default("50"),
  bodyPillar: decimal("bodyPillar", { precision: 5, scale: 2 }).default("50"),
  spiritPillar: decimal("spiritPillar", { precision: 5, scale: 2 }).default("50"),
  moneyPillar: decimal("moneyPillar", { precision: 5, scale: 2 }).default("50"),
  powerPillar: decimal("powerPillar", { precision: 5, scale: 2 }).default("50"),
  respectPillar: decimal("respectPillar", { precision: 5, scale: 2 }).default("50"),
  
  // Power calculation
  powerScore: decimal("powerScore", { precision: 10, scale: 2 }).default("0"),
  hustleScore: decimal("hustleScore", { precision: 5, scale: 2 }).default("0"),
  faithScore: decimal("faithScore", { precision: 5, scale: 2 }).default("0"),
  loveScore: decimal("loveScore", { precision: 5, scale: 2 }).default("0"),
  
  // Soul Beast
  soulBeastName: varchar("soulBeastName", { length: 100 }),
  soulBeastLevel: int("soulBeastLevel").default(1),
  soulBeastEvolution: varchar("soulBeastEvolution", { length: 50 }).default("egg"), // egg, hatchling, evolved, ascended
  
  // Legacy & Depth
  legacyFactor: decimal("legacyFactor", { precision: 5, scale: 2 }).default("1"),
  depthScore: decimal("depthScore", { precision: 5, scale: 2 }).default("0"),
  
  // Blessing probability
  blessingProbability: decimal("blessingProbability", { precision: 5, scale: 2 }).default("50"),
  
  // Zone tracking
  currentZone: varchar("currentZone", { length: 50 }).default("Purgatory"), // Purgatory, Heaven, Hell, Faith Street
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserProgression = typeof userProgression.$inferSelect;
export type InsertUserProgression = typeof userProgression.$inferInsert;

/**
 * HL Modules (HL0-HL15) - 16 life domains
 */
export const hlModules = mysqlTable("hl_modules", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  
  // HL0: Foundation
  hl0_identity: decimal("hl0_identity", { precision: 5, scale: 2 }).default("0"),
  hl0_archetype: varchar("hl0_archetype", { length: 100 }),
  
  // HL1: Mind
  hl1_clarity: decimal("hl1_clarity", { precision: 5, scale: 2 }).default("0"),
  hl1_habits: decimal("hl1_habits", { precision: 5, scale: 2 }).default("0"),
  
  // HL2: Spirit
  hl2_faith: decimal("hl2_faith", { precision: 5, scale: 2 }).default("0"),
  hl2_meditation: decimal("hl2_meditation", { precision: 5, scale: 2 }).default("0"),
  
  // HL3: Body
  hl3_sleep: decimal("hl3_sleep", { precision: 5, scale: 2 }).default("0"),
  hl3_nutrition: decimal("hl3_nutrition", { precision: 5, scale: 2 }).default("0"),
  hl3_energy: decimal("hl3_energy", { precision: 5, scale: 2 }).default("0"),
  
  // HL4: Money
  hl4_income: decimal("hl4_income", { precision: 10, scale: 2 }).default("0"),
  hl4_expenses: decimal("hl4_expenses", { precision: 10, scale: 2 }).default("0"),
  hl4_savings: decimal("hl4_savings", { precision: 10, scale: 2 }).default("0"),
  
  // HL5: Social
  hl5_relationships: decimal("hl5_relationships", { precision: 5, scale: 2 }).default("0"),
  hl5_network: decimal("hl5_network", { precision: 5, scale: 2 }).default("0"),
  
  // HL6: Mission
  hl6_goals: decimal("hl6_goals", { precision: 5, scale: 2 }).default("0"),
  hl6_momentum: decimal("hl6_momentum", { precision: 5, scale: 2 }).default("0"),
  
  // HL7: Environment
  hl7_space: decimal("hl7_space", { precision: 5, scale: 2 }).default("0"),
  
  // HL8: Knowledge
  hl8_skills: decimal("hl8_skills", { precision: 5, scale: 2 }).default("0"),
  hl8_mastery: decimal("hl8_mastery", { precision: 5, scale: 2 }).default("0"),
  
  // HL9: Legacy
  hl9_impact: decimal("hl9_impact", { precision: 5, scale: 2 }).default("0"),
  
  // HL10: Emotion
  hl10_awareness: decimal("hl10_awareness", { precision: 5, scale: 2 }).default("0"),
  hl10_regulation: decimal("hl10_regulation", { precision: 5, scale: 2 }).default("0"),
  
  // HL11: Intuition
  hl11_alignment: decimal("hl11_alignment", { precision: 5, scale: 2 }).default("0"),
  
  // HL12: Synchronicity
  hl12_flow: decimal("hl12_flow", { precision: 5, scale: 2 }).default("0"),
  
  // HL13: Collective
  hl13_influence: decimal("hl13_influence", { precision: 5, scale: 2 }).default("0"),
  
  // HL14: Energy
  hl14_vitality: decimal("hl14_vitality", { precision: 5, scale: 2 }).default("0"),
  
  // HL15: Drive
  hl15_persistence: decimal("hl15_persistence", { precision: 5, scale: 2 }).default("0"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type HLModules = typeof hlModules.$inferSelect;
export type InsertHLModules = typeof hlModules.$inferInsert;

/**
 * Engine Outputs - Results from 9 engines
 */
export const engineOutputs = mysqlTable("engine_outputs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD
  
  // Hustle Engine
  hustleEngine_momentum: decimal("hustleEngine_momentum", { precision: 5, scale: 2 }).default("0"),
  hustleEngine_xpGain: int("hustleEngine_xpGain").default(0),
  
  // Money Engine
  moneyEngine_netFlow: decimal("moneyEngine_netFlow", { precision: 10, scale: 2 }).default("0"),
  moneyEngine_savings: decimal("moneyEngine_savings", { precision: 10, scale: 2 }).default("0"),
  
  // Spirit Engine
  spiritEngine_faith: decimal("spiritEngine_faith", { precision: 5, scale: 2 }).default("0"),
  spiritEngine_blessingProb: decimal("spiritEngine_blessingProb", { precision: 5, scale: 2 }).default("0"),
  
  // Body Engine
  bodyEngine_energy: decimal("bodyEngine_energy", { precision: 5, scale: 2 }).default("0"),
  bodyEngine_readiness: decimal("bodyEngine_readiness", { precision: 5, scale: 2 }).default("0"),
  
  // Alignment Engine
  alignmentEngine_degree: decimal("alignmentEngine_degree", { precision: 5, scale: 2 }).default("0"),
  alignmentEngine_status: varchar("alignmentEngine_status", { length: 50 }).default("neutral"), // aligned, misaligned, extreme
  
  // Story Engine
  storyEngine_narrative: text("storyEngine_narrative"),
  storyEngine_milestone: varchar("storyEngine_milestone", { length: 100 }),
  
  // Recursive Engine
  recursiveEngine_shadowPattern: text("recursiveEngine_shadowPattern"),
  recursiveEngine_correction: text("recursiveEngine_correction"),
  
  // Blessing Engine
  blessingEngine_applied: boolean("blessingEngine_applied").default(false),
  blessingEngine_multiplier: decimal("blessingEngine_multiplier", { precision: 5, scale: 2 }).default("1"),
  
  // Soul Engine
  soulEngine_legacyFactor: decimal("soulEngine_legacyFactor", { precision: 5, scale: 2 }).default("1"),
  soulEngine_beastEvolution: varchar("soulEngine_beastEvolution", { length: 50 }),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EngineOutputs = typeof engineOutputs.$inferSelect;
export type InsertEngineOutputs = typeof engineOutputs.$inferInsert;

/**
 * Zone History - Track zone transitions
 */
export const zoneHistory = mysqlTable("zone_history", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  
  zoneName: varchar("zoneName", { length: 50 }).notNull(), // Purgatory, Heaven, Hell, Faith Street
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
 * Missions & Evidence - Track user actions and proof
 */
export const missions = mysqlTable("missions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  
  missionTitle: varchar("missionTitle", { length: 200 }).notNull(),
  missionDescription: text("missionDescription"),
  relatedModule: varchar("relatedModule", { length: 10 }), // HL0-HL15
  relatedPillar: varchar("relatedPillar", { length: 20 }), // Mind, Body, Spirit, Money, Power, Respect
  
  status: mysqlEnum("status", ["pending", "in_progress", "completed", "failed"]).default("pending"),
  xpReward: int("xpReward").default(0),
  
  evidence: text("evidence"), // Proof/documentation
  completedAt: timestamp("completedAt"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Missions = typeof missions.$inferSelect;
export type InsertMissions = typeof missions.$inferInsert;

/**
 * Life Folders - Identity, finances, health, work
 */
export const lifeFolders = mysqlTable("life_folders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  
  folderType: mysqlEnum("folderType", ["identity", "finances", "health", "work"]).notNull(),
  folderName: varchar("folderName", { length: 200 }).notNull(),
  folderData: json("folderData").$type<Record<string, any>>().default({}),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LifeFolders = typeof lifeFolders.$inferSelect;
export type InsertLifeFolders = typeof lifeFolders.$inferInsert;

/**
 * Daily Snapshots - Capture daily state
 */
export const dailySnapshots = mysqlTable("daily_snapshots", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  date: varchar("date", { length: 10 }).notNull().unique(), // YYYY-MM-DD
  
  // Daily readings
  stage: varchar("stage", { length: 50 }),
  level: int("level"),
  degree: decimal("degree", { precision: 5, scale: 2 }),
  powerScore: decimal("powerScore", { precision: 10, scale: 2 }),
  zone: varchar("zone", { length: 50 }),
  
  // Pillar snapshot
  pillars: json("pillars").$type<Record<string, number>>().default({}),
  
  // Module snapshot
  modules: json("modules").$type<Record<string, number>>().default({}),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DailySnapshots = typeof dailySnapshots.$inferSelect;
export type InsertDailySnapshots = typeof dailySnapshots.$inferInsert;
