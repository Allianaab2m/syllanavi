import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { takeClasses } from "./takeClasses";

export const classes = sqliteTable("classes", {
  id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
  name: text("name").notNull(),
  departmentId: integer("department_id"),
  categoryId: integer("category_id"),
  academicYear: integer("academic_year", { mode: "number" })
    .default(0)
    .notNull(),
  term: integer("term", { mode: "number" }).default(0).notNull(),
  day: integer("day").default(0).notNull(),
  unit: integer("unit").default(0).notNull(),
  startAt: integer("start_at").default(0).notNull(),
  endAt: integer("end_at"),
});

export const classesRelations = relations(classes, ({ many }) => ({
  takeClasses: many(takeClasses),
}));
