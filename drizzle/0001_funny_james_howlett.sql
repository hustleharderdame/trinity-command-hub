CREATE TABLE `journal_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`sessionId` varchar(64) NOT NULL,
	`sender` enum('user','soul-beast','ai-twin') NOT NULL,
	`text` text NOT NULL,
	`chatType` enum('soul-beast','ai-twin') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `journal_messages_id` PRIMARY KEY(`id`)
);
