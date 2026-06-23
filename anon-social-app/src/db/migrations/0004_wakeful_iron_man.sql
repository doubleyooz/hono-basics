PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_reactions` (
	`id` text PRIMARY KEY NOT NULL,
	`post_id` text,
	`comment_id` text,
	`author_pubkey` text NOT NULL,
	`kind` text NOT NULL,
	`visibility` integer DEFAULT 2 NOT NULL,
	`created_at` integer NOT NULL,
	PRIMARY KEY(`post_id`, `author_pubkey`, `kind`),
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`comment_id`) REFERENCES `comments`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`author_pubkey`) REFERENCES `profiles`(`pubkey`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "check_reaction_target" CHECK((
      (post_id IS NOT NULL AND comment_id IS NULL) OR 
      (post_id IS NULL AND comment_id IS NOT NULL)
    ))
);
--> statement-breakpoint
INSERT INTO `__new_reactions`("id", "post_id", "comment_id", "author_pubkey", "kind", "visibility", "created_at") SELECT "id", "post_id", "comment_id", "author_pubkey", "kind", "visibility", "created_at" FROM `reactions`;--> statement-breakpoint
DROP TABLE `reactions`;--> statement-breakpoint
ALTER TABLE `__new_reactions` RENAME TO `reactions`;--> statement-breakpoint
PRAGMA foreign_keys=ON;