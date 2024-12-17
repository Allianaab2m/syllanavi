CREATE TABLE `category` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `lectures` (
	`id` text PRIMARY KEY NOT NULL,
	`year` integer NOT NULL,
	`grade` integer NOT NULL,
	`semester` integer NOT NULL,
	`day` integer NOT NULL,
	`name` text NOT NULL,
	`credit` integer NOT NULL,
	`teacher` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
DROP TABLE `posts`;