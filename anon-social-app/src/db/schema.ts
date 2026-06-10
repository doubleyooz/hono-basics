import { sqliteTable, text, integer, index, primaryKey } from 'drizzle-orm/sqlite-core';

// Profiles
export const profiles = sqliteTable('profiles', {
  pubkey: text('pubkey').primaryKey(),
  displayName: text('display_name'),
  bio: text('bio'),
  profilePublic: integer('profile_public', { mode: 'boolean' }).notNull().default(false),
  postsPublic: integer('posts_public', { mode: 'boolean' }).notNull().default(false),
  reactsPublic: integer('reacts_public', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// Posts
export const posts = sqliteTable('posts', {
  id: text('id').primaryKey(),
  authorPubkey: text('author_pubkey').notNull().references(() => profiles.pubkey),
  content: text('content').notNull(),
  visibleInProfile: integer('visible_in_profile', { mode: 'boolean' }).notNull().default(true),
  reactionCount: integer('reaction_count').notNull().default(0),
  reportCount: integer('report_count').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
}, (table) => [
  index('idx_posts_author').on(table.authorPubkey, table.createdAt), // DESC not directly supported in index()
  index('idx_posts_feed').on(table.createdAt),
]);

// Reactions
export const reactions = sqliteTable('reactions', {
  postId: text('post_id').notNull().references(() => posts.id),
  authorPubkey: text('author_pubkey').notNull().references(() => profiles.pubkey),
  kind: text('kind', { enum: ['like', 'heart', 'laugh', 'fire'] }).notNull(),
  visibleToPublic: integer('visible_to_public', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
}, (table) => [
  primaryKey({ columns: [table.postId, table.authorPubkey, table.kind] }),
]);

// Reports
export const reports = sqliteTable('reports', {
  id: text('id').primaryKey(),
  postId: text('post_id').notNull().references(() => posts.id),
  reason: text('reason').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// PoW Nonces
export const powNonces = sqliteTable('pow_nonces', {
  challengeId: text('challenge_id').primaryKey(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  used: integer('used').notNull().default(0),
});

// Rate Limits
export const rateLimits = sqliteTable('rate_limits', {
  key: text('key').primaryKey(),
  windowStart: integer('window_start', { mode: 'timestamp' }).notNull(),
  count: integer('count').notNull().default(0),
});