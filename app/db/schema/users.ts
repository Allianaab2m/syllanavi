import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { takeClasses } from "./takeClasses";

export const users = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull().unique(),
  password: text("password").notNull().default(""),
  isAdmin: integer("is_admin", { mode: "boolean" }).default(false),
});

export const usersRelations = relations(users, ({ many }) => ({
  takeClasses: many(takeClasses),
}));
