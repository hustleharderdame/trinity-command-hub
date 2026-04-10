CREATE TABLE `task_completions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`task_id` varchar(50) NOT NULL,
	`mind_score` decimal(3,1) NOT NULL,
	`body_score` decimal(3,1) NOT NULL,
	`soul_score` decimal(3,1) NOT NULL,
	`money_score` decimal(3,1) NOT NULL,
	`power_score` decimal(3,1) NOT NULL,
	`respect_score` decimal(3,1) NOT NULL,
	`mbs_average` decimal(4,2) NOT NULL,
	`mpr_average` decimal(4,2) NOT NULL,
	`overall_score` decimal(4,2) NOT NULL,
	`mastery_level` decimal(2,1) NOT NULL,
	`mastery_levels_completed` json NOT NULL,
	`completed_at` timestamp NOT NULL DEFAULT (now()),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `task_completions_id` PRIMARY KEY(`id`)
);
