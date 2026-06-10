CREATE TABLE `posts` (
	`id` text PRIMARY KEY NOT NULL,
	`author_pubkey` text NOT NULL,
	`content` text NOT NULL,
	`visible_in_profile` integer DEFAULT true NOT NULL,
	`reaction_count` integer DEFAULT 0 NOT NULL,
	`report_count` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`author_pubkey`) REFERENCES `profiles`(`pubkey`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_posts_author` ON `posts` (`author_pubkey`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_posts_feed` ON `posts` (`created_at`);--> statement-breakpoint
CREATE TABLE `pow_nonces` (
	`challenge_id` text PRIMARY KEY NOT NULL,
	`expires_at` integer NOT NULL,
	`used` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `profiles` (
	`pubkey` text PRIMARY KEY NOT NULL,
	`display_name` text,
	`bio` text,
	`profile_public` integer DEFAULT false NOT NULL,
	`posts_public` integer DEFAULT false NOT NULL,
	`reacts_public` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `rate_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`window_start` integer NOT NULL,
	`count` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `reactions` (
	`post_id` text NOT NULL,
	`author_pubkey` text NOT NULL,
	`kind` text NOT NULL,
	`visible_to_public` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	PRIMARY KEY(`post_id`, `author_pubkey`, `kind`),
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`author_pubkey`) REFERENCES `profiles`(`pubkey`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `reports` (
	`id` text PRIMARY KEY NOT NULL,
	`post_id` text NOT NULL,
	`reason` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE no action
);
