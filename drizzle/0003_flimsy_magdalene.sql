CREATE TABLE `autonomy_stage` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`stage` int DEFAULT 1,
	`stageName` varchar(50) DEFAULT 'I DO',
	`systemControl` int DEFAULT 95,
	`voiceAgent` varchar(50) DEFAULT 'Soul Beast',
	`stageStartDate` timestamp DEFAULT (now()),
	`stageCompletionPercentage` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `autonomy_stage_id` PRIMARY KEY(`id`),
	CONSTRAINT `autonomy_stage_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `behavioral_governance` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`currentMode` enum('IDEALIZATION','DISCIPLINE','REFLECTION','RECONCILIATION') DEFAULT 'REFLECTION',
	`disrespectLevel` int DEFAULT 0,
	`lastDisrespectDate` timestamp,
	`ulcActive` boolean DEFAULT false,
	`ulcCode` varchar(100),
	`shadowLoopCount` int DEFAULT 0,
	`shadowLoopLessons` json NOT NULL,
	`graceBonus` int DEFAULT 0,
	`lastGraceBonusDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `behavioral_governance_id` PRIMARY KEY(`id`),
	CONSTRAINT `behavioral_governance_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `blessing_probability` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`currentFaith` int DEFAULT 5,
	`currentLove` int DEFAULT 5,
	`currentStreak` int DEFAULT 0,
	`blessingProbability` decimal(5,2) DEFAULT '0',
	`lastBlessingDate` timestamp,
	`blessingCount` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `blessing_probability_id` PRIMARY KEY(`id`),
	CONSTRAINT `blessing_probability_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `financial_milestones` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`grossRevenue` decimal(12,2) DEFAULT '0',
	`grossMilestoneReached` boolean DEFAULT false,
	`netIncome` decimal(12,2) DEFAULT '0',
	`netMilestoneReached` boolean DEFAULT false,
	`savedCapital` decimal(12,2) DEFAULT '0',
	`savedMilestoneReached` boolean DEFAULT false,
	`passiveIncome` decimal(12,2) DEFAULT '0',
	`passiveMilestoneReached` boolean DEFAULT false,
	`netWorth` decimal(12,2) DEFAULT '0',
	`millionaireMilestoneReached` boolean DEFAULT false,
	`hustleAge` varchar(50) DEFAULT 'Infant Hustler',
	`hlvlRange` varchar(20) DEFAULT '0–100',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `financial_milestones_id` PRIMARY KEY(`id`),
	CONSTRAINT `financial_milestones_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `mbs_mpr_credits` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`mindCredits` int DEFAULT 0,
	`bodyCredits` int DEFAULT 0,
	`soulCredits` int DEFAULT 0,
	`moneyCredits` int DEFAULT 0,
	`powerCredits` int DEFAULT 0,
	`respectCredits` int DEFAULT 0,
	`totalDailyCredits` int DEFAULT 0,
	`perfectDayBonus` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `mbs_mpr_credits_id` PRIMARY KEY(`id`),
	CONSTRAINT `mbs_mpr_credits_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `minddna_thought_cells` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`emotionFrequency` varchar(255) NOT NULL,
	`emotionIntensity` int NOT NULL,
	`ideaMeaning` text NOT NULL,
	`ideaClarity` int NOT NULL,
	`actionOutput` text NOT NULL,
	`actionCompletion` int NOT NULL,
	`strandActivation` json NOT NULL,
	`expressionLevel` decimal(5,2) DEFAULT '0',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `minddna_thought_cells_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rpg_world_layers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`currentLayer` enum('TrapHouse','Street','Apartments','Penthouse','Mansion') DEFAULT 'TrapHouse',
	`fogRadius` decimal(3,2) DEFAULT '0.1',
	`layerUnlocked` json NOT NULL,
	`missionsCompletedForExpansion` int DEFAULT 0,
	`daysNeglected` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `rpg_world_layers_id` PRIMARY KEY(`id`),
	CONSTRAINT `rpg_world_layers_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `weekly_ritual` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`dayOfWeek` int NOT NULL,
	`ritualName` varchar(100) NOT NULL,
	`completed` boolean DEFAULT false,
	`completedAt` timestamp,
	`divineToDoHierarchy` enum('Survival','Support','Growth') NOT NULL,
	`toDoItems` json NOT NULL,
	`weekStartDate` date NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `weekly_ritual_id` PRIMARY KEY(`id`)
);
