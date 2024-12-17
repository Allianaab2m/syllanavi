import cuid2 from "@paralleldrive/cuid2"
import { relations } from "drizzle-orm"
import { drizzle as d1Drizzle } from "drizzle-orm/d1"
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const lectures = sqliteTable("lectures", {
  // CUID2で採番
  id: text("id").primaryKey(),

  // 年度
  year: int("year").notNull(),

  // 学年
  // 1: 1年, 2: 2年, 3: 3年, 4: 4年
  grade: int("grade").notNull(),

  // 開講学期
  // 0: 前期, 1: 後期, 2: 通年, 3: 集中前期, 4: 集中後期
  semester: int("semester").notNull(),

  // 曜日
  // 0: 月 1: 火 2: 水 3: 木 4: 金 5: 土 6: 日
  day: int("day").notNull(),

  // 講義名
  name: text("name").notNull(),

  // 単位数
  credit: int("credit").notNull(),

  // 担当教員
  teacher: text("teacher").notNull(),
})

export const lecturesRelations = relations(lectures, ({ one, many }) => ({
  category: one(category),
  tags: many(tags),
}))

// 授業区分を示すテーブル
export const category = sqliteTable("category", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => cuid2.createId()),

  // 区分名
  name: text("name").notNull(),
})

export const categoryRelations = relations(category, ({ many }) => ({
  lectures: many(lectures),
}))

// 授業の持つ属性を示すテーブル
export const tags = sqliteTable("tags", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => cuid2.createId()),
})

export const tagsRelations = relations(tags, ({ many }) => ({
  lectures: many(lectures),
}))

export const d1DB = (d1: D1Database) => {
  return d1Drizzle(d1)
}
