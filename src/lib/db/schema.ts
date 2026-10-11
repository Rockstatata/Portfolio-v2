import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export type SocialLink = { label: string; url: string };
export type Stat = { label: string; value: string };

/** Single-row table holding the hero, about and contact copy. */
export const profile = pgTable("profile", {
  id: integer("id").primaryKey().default(1),
  name: text("name").notNull(),
  headline: text("headline").notNull(),
  roles: text("roles").array().notNull().default([]),
  bio: text("bio").notNull(),
  location: text("location").notNull().default(""),
  email: text("email").notNull().default(""),
  avatarUrl: text("avatar_url").notNull().default(""),
  resumeUrl: text("resume_url").notNull().default(""),
  availability: text("availability").notNull().default(""),
  socials: jsonb("socials").$type<SocialLink[]>().notNull().default([]),
  stats: jsonb("stats").$type<Stat[]>().notNull().default([]),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

const ordering = {
  sortOrder: integer("sort_order").notNull().default(0),
  visible: boolean("visible").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
};

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  tagline: text("tagline").notNull().default(""),
  description: text("description").notNull().default(""),
  highlights: text("highlights").array().notNull().default([]),
  tech: text("tech").array().notNull().default([]),
  category: text("category").notNull().default("Web"),
  repoUrl: text("repo_url").notNull().default(""),
  liveUrl: text("live_url").notNull().default(""),
  imageUrl: text("image_url").notNull().default(""),
  year: text("year").notNull().default(""),
  context: text("context").notNull().default(""),
  isPrivate: boolean("is_private").notNull().default(false),
  featured: boolean("featured").notNull().default(false),
  ...ordering,
});

export const publications = pgTable("publications", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  authors: text("authors").notNull().default(""),
  venue: text("venue").notNull().default(""),
  year: text("year").notNull().default(""),
  status: text("status").notNull().default("published"),
  kind: text("kind").notNull().default("Conference"),
  abstract: text("abstract").notNull().default(""),
  url: text("url").notNull().default(""),
  pdfUrl: text("pdf_url").notNull().default(""),
  ...ordering,
});

export const experiences = pgTable("experiences", {
  id: serial("id").primaryKey(),
  role: text("role").notNull(),
  org: text("org").notNull(),
  orgUrl: text("org_url").notNull().default(""),
  period: text("period").notNull().default(""),
  kind: text("kind").notNull().default("Work"),
  description: text("description").notNull().default(""),
  ...ordering,
});

export const education = pgTable("education", {
  id: serial("id").primaryKey(),
  degree: text("degree").notNull(),
  school: text("school").notNull(),
  period: text("period").notNull().default(""),
  score: text("score").notNull().default(""),
  ...ordering,
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  event: text("event").notNull(),
  date: text("date").notNull().default(""),
  description: text("description").notNull().default(""),
  url: text("url").notNull().default(""),
  ...ordering,
});

/** Research directions shown as cards in the Research Vectors section. */
export const focusAreas = pgTable("focus_areas", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  summary: text("summary").notNull().default(""),
  keywords: text("keywords").array().notNull().default([]),
  status: text("status").notNull().default(""),
  ...ordering,
});

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull().default("Languages"),
  ...ordering,
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  body: text("body").notNull(),
  read: boolean("read").notNull().default(false),
  deliveryStatus: text("delivery_status").notNull().default("pending"),
  deliveryError: text("delivery_error").notNull().default(""),
  deliveredAt: timestamp("delivered_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type Profile = typeof profile.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Publication = typeof publications.$inferSelect;
export type Experience = typeof experiences.$inferSelect;
export type Education = typeof education.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
export type Skill = typeof skills.$inferSelect;
export type FocusArea = typeof focusAreas.$inferSelect;
export type Message = typeof messages.$inferSelect;

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull().default(""),
  body: text("body").notNull().default(""),
  coverUrl: text("cover_url").notNull().default(""),
  tags: text("tags").array().notNull().default([]),
  status: text("status").notNull().default("draft"),
  publishedDate: text("published_date").notNull().default(""),
  featured: boolean("featured").notNull().default(false),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  ...ordering,
});
export type Post = typeof posts.$inferSelect;
