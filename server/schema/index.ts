import { sql } from "drizzle-orm"
import { drizzle as d1Drizzle } from "drizzle-orm/d1"
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const posts = sqliteTable("posts", {
  id: int("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  createdAt: int("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`,
  ),
})

export const lectures = sqliteTable("lectures", {
  id: text("id").primaryKey(),
})

export const d1DB = (d1: D1Database) => {
  return d1Drizzle(d1)
}
