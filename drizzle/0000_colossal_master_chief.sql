CREATE TABLE `classes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `take_classes` (
	`user_id` text,
	`class_id` integer,
	PRIMARY KEY(`class_id`, `user_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`password` text DEFAULT '' NOT NULL,
	`is_admin` integer DEFAULT false
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_name_unique` ON `users` (`name`);