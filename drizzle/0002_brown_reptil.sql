ALTER TABLE `user_progression` ADD `wealthNetWorth` decimal(15,2) DEFAULT '0';--> statement-breakpoint
ALTER TABLE `user_progression` ADD `wealthLevel` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `user_progression` ADD `wealthStageId` int DEFAULT 0;