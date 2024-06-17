import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { takeClasses } from "./takeClasses";

export const classes = sqliteTable("classes", {
  id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
  name: text("name").notNull(),
});

export const classesRelations = relations(classes, ({ many }) => ({
  takeClasses: many(takeClasses),
}));
