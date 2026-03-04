CREATE TABLE `battery_credits` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`totalBattery` decimal(10,2) DEFAULT '0',
	`totalCredits` decimal(10,2) DEFAULT '0',
	`spentCredits` decimal(10,2) DEFAULT '0',
	`availableCredits` decimal(10,2) DEFAULT '0',
	`mindBudget` decimal(5,2) DEFAULT '0',
	`bodyBudget` decimal(5,2) DEFAULT '0',
	`soulBudget` decimal(5,2) DEFAULT '0',
	`moneyBudget` decimal(5,2) DEFAULT '0',
	`powerBudget` decimal(5,2) DEFAULT '0',
	`respectBudget` decimal(5,2) DEFAULT '0',
	`consistencyBudget` decimal(5,2) DEFAULT '0',
	`happinessBudget` decimal(5,2) DEFAULT '0',
	`recoveryBudget` decimal(5,2) DEFAULT '0',
	`impactBudget` decimal(5,2) DEFAULT '0',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `battery_credits_id` PRIMARY KEY(`id`),
	CONSTRAINT `battery_credits_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `daily_snapshots` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`dateKey` varchar(10) NOT NULL,
	`faithScore` decimal(3,1),
	`writtenIntent` text,
	`beastMessage` text,
	`twinMessage` text,
	`hustleExecuted` decimal(5,1),
	`obstacles` json,
	`truthReflection` text,
	`enthusiasmScore` decimal(3,1),
	`gratitude` text,
	`worthIt` enum('yes','no','partial'),
	`pmReport` text,
	`mindPillar` decimal(3,1) DEFAULT '0',
	`bodyPillar` decimal(3,1) DEFAULT '0',
	`soulPillar` decimal(3,1) DEFAULT '0',
	`moneyPillar` decimal(3,1) DEFAULT '0',
	`powerPillar` decimal(3,1) DEFAULT '0',
	`respectPillar` decimal(3,1) DEFAULT '0',
	`consistencyPillar` decimal(3,1) DEFAULT '0',
	`happinessPillar` decimal(3,1) DEFAULT '0',
	`recoveryPillar` decimal(3,1) DEFAULT '0',
	`impactPillar` decimal(3,1) DEFAULT '0',
	`powerScore` decimal(10,2) DEFAULT '0',
	`tierRank` varchar(50) DEFAULT 'RECOVERY',
	`creditsEarned` decimal(5,2) DEFAULT '0',
	`completedPillars` int DEFAULT 0,
	`extraCredit` decimal(5,2) DEFAULT '0',
	`shadowAvg` decimal(5,2) DEFAULT '0',
	`lightAvg` decimal(5,2) DEFAULT '0',
	`degree` decimal(5,2) DEFAULT '0',
	`heavenMultiplier` decimal(5,2) DEFAULT '1',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `daily_snapshots_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `historical_export` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`exportType` enum('daily','cumulative','full') NOT NULL,
	`dateRange` varchar(100),
	`exportData` json NOT NULL,
	`fileName` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `historical_export_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `intelligence_engine` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`dateKey` varchar(10) NOT NULL,
	`burnoutRisk` enum('LOW','MODERATE','HIGH') DEFAULT 'LOW',
	`burnoutScore` decimal(5,2) DEFAULT '0',
	`faithDecayStatus` enum('STABLE','DECLINING','DECAYING') DEFAULT 'STABLE',
	`faithDecayPercent` decimal(5,2) DEFAULT '0',
	`momentumStatus` enum('STRONG','BUILDING','UNSTABLE') DEFAULT 'BUILDING',
	`momentumRatio` decimal(5,2) DEFAULT '0',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `intelligence_engine_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `spiritual_age` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`biologicalAge` int,
	`spiritualAge` int DEFAULT 0,
	`lifeCycles` int DEFAULT 0,
	`frictionScore` decimal(3,2) DEFAULT '1.0',
	`baseMaturityScore` decimal(5,2) DEFAULT '0',
	`wisdomMilestoneScore` decimal(5,2) DEFAULT '0',
	`lifeCycleBonus` decimal(5,2) DEFAULT '0',
	`statusColor` enum('green','yellow','red') DEFAULT 'yellow',
	`deltaFromBaseline` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `spiritual_age_id` PRIMARY KEY(`id`),
	CONSTRAINT `spiritual_age_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `streak_tracking` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`currentStreak` int DEFAULT 0,
	`longestStreak` int DEFAULT 0,
	`lastActiveDate` date,
	`streakStartDate` date,
	`totalDaysActive` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `streak_tracking_id` PRIMARY KEY(`id`),
	CONSTRAINT `streak_tracking_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `user_progression` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`currentStage` varchar(50) DEFAULT 'Trap',
	`currentLevel` int DEFAULT 1,
	`currentDegree` decimal(5,2) DEFAULT '0',
	`totalXP` int DEFAULT 0,
	`xpToNextLevel` int DEFAULT 100,
	`currentStreak` int DEFAULT 0,
	`longestStreak` int DEFAULT 0,
	`totalBattery` decimal(10,2) DEFAULT '0',
	`totalCredits` decimal(10,2) DEFAULT '0',
	`spentCredits` decimal(10,2) DEFAULT '0',
	`powerScore` decimal(10,2) DEFAULT '0',
	`tierRank` varchar(50) DEFAULT 'RECOVERY',
	`soulBeastName` varchar(100),
	`soulBeastLevel` int DEFAULT 1,
	`soulBeastEvolution` enum('egg','hatchling','evolved','ascended') DEFAULT 'egg',
	`spiritualAge` int DEFAULT 0,
	`biologicalAge` int,
	`frictionScore` decimal(3,2) DEFAULT '1.0',
	`lifeCycles` int DEFAULT 0,
	`burnoutRisk` enum('LOW','MODERATE','HIGH') DEFAULT 'LOW',
	`faithDecayStatus` enum('STABLE','DECLINING','DECAYING') DEFAULT 'STABLE',
	`momentumStatus` enum('STRONG','BUILDING','UNSTABLE') DEFAULT 'BUILDING',
	`currentZone` varchar(50) DEFAULT 'Purgatory',
	`lastActiveDate` date,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_progression_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_progression_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
CREATE TABLE `zone_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`zoneName` varchar(50) NOT NULL,
	`enteredAt` timestamp NOT NULL DEFAULT (now()),
	`exitedAt` timestamp,
	`purgatory_alignmentCheck` boolean,
	`heaven_powerMultiplier` decimal(5,2),
	`hell_penalty` decimal(5,2),
	`faithStreet_blessingCollected` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `zone_history_id` PRIMARY KEY(`id`)
);
