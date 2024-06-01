import { relations, sql } from "drizzle-orm";
import {
  timestamp,
  pgTable,
  text,
  integer,
  boolean,
  primaryKey,
} from "drizzle-orm/pg-core";
import crypto from "crypto";
import type { AdapterAccount } from "next-auth/adapters";

export const user = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export const userRelations = relations(user, ({ many }) => ({
  stories: many(story),
  comment: many(comment),
  clap: many(clap),
  save: many(save),
}));

export const story = pgTable("story", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  content: text("content"),
  topics: text("topics")
    .array()
    .default(sql`'{}'::text[]`),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  publish: boolean("publish").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const storyRelations = relations(story, ({ one, many }) => ({
  author: one(user, {
    fields: [story.userId],
    references: [user.id],
  }),
  comment: many(comment),
  clap: many(clap),
  save: many(save),
}));

export const comment = pgTable("comment", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  content: text("content").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  storyId: text("storyId").references(() => story.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const commentRelations = relations(comment, ({ one, many }) => ({
  author: one(user, {
    fields: [comment.userId],
    references: [user.id],
  }),
  story: one(story, {
    fields: [comment.storyId],
    references: [story.id],
  }),
  replies: many(reply),
  clap: many(clap),
}));

export const reply = pgTable("reply", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  content: text("content").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  commentId: text("commentId").references(() => comment.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const replyRelations = relations(reply, ({ one, many }) => ({
  author: one(user, {
    fields: [reply.userId],
    references: [user.id],
  }),
  comment: one(comment, {
    fields: [reply.commentId],
    references: [comment.id],
  }),
  clap: many(clap),
}));

export const clap = pgTable("clap", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  content: text("content"),
  userId: text("userId")
    .references(() => user.id)
    .notNull(),
  commentId: text("commentId").references(() => comment.id),
  replyId: text("replyId").references(() => reply.id, { onDelete: "cascade" }),
  storyId: text("storyId")
    .references(() => story.id, { onDelete: "cascade" })
    .notNull(),
  clapCount: integer("clapCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const clapRelations = relations(clap, ({ one, many }) => ({
  author: one(user, {
    fields: [clap.userId],
    references: [user.id],
  }),
  comment: one(comment, {
    fields: [clap.commentId],
    references: [comment.id],
  }),
  reply: one(reply, {
    fields: [clap.replyId],
    references: [reply.id],
  }),
  story: one(story, {
    fields: [clap.storyId],
    references: [story.id],
  }),
}));

export const save = pgTable("save", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  storyId: text("storyId")
    .references(() => story.id)
    .notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const savesRelations = relations(save, ({ one }) => ({
  author: one(user, {
    fields: [save.userId],
    references: [user.id],
  }),
  story: one(story, {
    fields: [save.storyId],
    references: [story.id],
  }),
}));

export const topics = pgTable("topics", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  topics: text("topics")
    .array()
    .default(sql`'{}'::text[]`),
  userId: text("userId")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
