ALTER TABLE `posts` RENAME COLUMN "visible_in_profile" TO "visibility";--> statement-breakpoint
ALTER TABLE `posts` RENAME COLUMN "report_count" TO "comment_count";--> statement-breakpoint
ALTER TABLE `pow_nonces` RENAME COLUMN "used" TO "fuel";--> statement-breakpoint
ALTER TABLE `profiles` RENAME COLUMN "profile_public" TO "profileVisibility";--> statement-breakpoint
ALTER TABLE `profiles` RENAME COLUMN "posts_public" TO "postsVisibility";--> statement-breakpoint
ALTER TABLE `profiles` RENAME COLUMN "reacts_public" TO "reactsVisibility";--> statement-breakpoint
ALTER TABLE `rate_limits` RENAME COLUMN "key" TO "id";--> statement-breakpoint
ALTER TABLE `reactions` RENAME COLUMN "visible_to_public" TO "visibility";--> statement-breakpoint
CREATE TABLE `comments` (
	`id` text PRIMARY KEY NOT NULL,
	`post_id` text NOT NULL,
	`author_pubkey` text NOT NULL,
	`content` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`author_pubkey`) REFERENCES `profiles`(`pubkey`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_comments_post` ON `comments` (`post_id`,`created_at`);--> statement-breakpoint
DROP INDEX "idx_comments_post";--> statement-breakpoint
DROP INDEX "idx_posts_author";--> statement-breakpoint
DROP INDEX "idx_posts_feed";--> statement-breakpoint
ALTER TABLE `posts` ALTER COLUMN "visibility" TO "visibility" integer NOT NULL DEFAULT 2;--> statement-breakpoint
CREATE INDEX `idx_posts_author` ON `posts` (`author_pubkey`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_posts_feed` ON `posts` (`created_at`);--> statement-breakpoint
ALTER TABLE `pow_nonces` ALTER COLUMN "fuel" TO "fuel" integer NOT NULL DEFAULT 15;--> statement-breakpoint
ALTER TABLE `pow_nonces` ADD `revoked` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `profiles` ALTER COLUMN "profileVisibility" TO "profileVisibility" integer NOT NULL DEFAULT 2;--> statement-breakpoint
ALTER TABLE `profiles` ALTER COLUMN "postsVisibility" TO "postsVisibility" integer NOT NULL DEFAULT 2;--> statement-breakpoint
ALTER TABLE `profiles` ALTER COLUMN "reactsVisibility" TO "reactsVisibility" integer NOT NULL DEFAULT 2;--> statement-breakpoint
ALTER TABLE `reactions` ALTER COLUMN "visibility" TO "visibility" integer NOT NULL DEFAULT 2;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_reports` (
	`id` text PRIMARY KEY NOT NULL,
	`author_pubkey` text NOT NULL,
	`post_id` text,
	`profile_pubkey` text,
	`reason` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`author_pubkey`) REFERENCES `profiles`(`pubkey`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`profile_pubkey`) REFERENCES `profiles`(`pubkey`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "check_report_target" CHECK((
      (post_id IS NOT NULL AND profile_pubkey IS NULL) OR 
      (post_id IS NULL AND profile_pubkey IS NOT NULL)
    ))
);
--> statement-breakpoint
INSERT INTO `__new_reports`("id", "author_pubkey", "post_id", "profile_pubkey", "reason", "created_at") SELECT "id", "author_pubkey", "post_id", "profile_pubkey", "reason", "created_at" FROM `reports`;--> statement-breakpoint
DROP TABLE `reports`;--> statement-breakpoint
ALTER TABLE `__new_reports` RENAME TO `reports`;--> statement-breakpoint
PRAGMA foreign_keys=ON;