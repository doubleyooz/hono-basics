import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, index, primaryKey, check, uniqueIndex } from 'drizzle-orm/sqlite-core';

// Profiles
export const profiles = sqliteTable('profiles', {
  pubkey: text('pubkey').primaryKey().$defaultFn(() => crypto.randomUUID()), 
  displayName: text('display_name'),
  bio: text('bio'),
  profileVisibility: integer('profileVisibility').notNull().default(2), // default to public
  postsVisibility: integer('postsVisibility').notNull().default(2), // default to public
  reactsVisibility: integer('reactsVisibility').notNull().default(2), // default to public
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// Posts
export const posts = sqliteTable('posts', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()), 
  authorPubkey: text('author_pubkey').notNull().references(() => profiles.pubkey),
  content: text('content').notNull(),
  // Visibility: 0 = private, 1 = protected, 2 = public
  visibility: integer('visibility').notNull().default(2), // default to public
  reactionCount: integer('reaction_count').notNull().default(0),
  commentCount: integer('comment_count').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
}, (table) => [
  index('idx_posts_author').on(table.authorPubkey, table.createdAt), // DESC not directly supported in index()
  index('idx_posts_feed').on(table.createdAt),
]);

export const comments = sqliteTable('comments', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()), 
  postId: text('post_id').notNull().references(() => posts.id),
  authorPubkey: text('author_pubkey').notNull().references(() => profiles.pubkey),
  content: text('content').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
}, (table) => [
  index('idx_comments_post').on(table.postId, table.createdAt), // DESC not directly supported in index()
]);

// Reactions
export const reactions = sqliteTable('reactions', {
  // Can react to a post xOR a comment
  postId: text('post_id').references(() => posts.id),
  commentId: text('comment_id').references(() => comments.id),

  authorPubkey: text('author_pubkey').notNull().references(() => profiles.pubkey),
  kind: text('kind', { enum: ['like', 'heart', 'laugh', 'fire'] }).notNull(),
  visibility: integer('visibility').notNull().default(2), // default to public
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
}, (table) => [
  primaryKey({ columns: [table.postId, table.authorPubkey, table.kind] }),
  // Ensure exactly one of postId or commentId is set
  check(
    'check_reaction_target',
    sql`(
      (post_id IS NOT NULL AND comment_id IS NULL) OR 
      (post_id IS NULL AND comment_id IS NOT NULL)
    )`
  ),
]);

// Reports
export const reports = sqliteTable('reports', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()), 
  authorPubkey: text('author_pubkey').notNull().references(() => profiles.pubkey),

  // Can report a post OR a profile
  postId: text('post_id').references(() => posts.id),
  profilePubkey: text('profile_pubkey').references(() => profiles.pubkey),

  reason: text('reason').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
}, (table) => [
  // Ensure exactly one of postId or profilePubkey is set
  check(
    'check_report_target',
    sql`(
      (post_id IS NOT NULL AND profile_pubkey IS NULL) OR 
      (post_id IS NULL AND profile_pubkey IS NOT NULL)
    )`
  ),
  
]);

// PoW Nonces
export const powNonces = sqliteTable('pow_nonces', {
  challengeId: text('challenge_id').primaryKey(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  fuel: integer('fuel').notNull().default(15),
  revoked: integer('revoked', { mode: 'boolean' }).notNull().default(false),
});

// Rate Limits
export const rateLimits = sqliteTable('rate_limits', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()), 
  windowStart: integer('window_start', { mode: 'timestamp' }).notNull(),
  count: integer('count').notNull().default(0),
});

