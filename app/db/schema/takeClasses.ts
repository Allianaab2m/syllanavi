import { relations } from "drizzle-orm";
import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { classes } from "./classes";
import { users } from "./users";

export const takeClasses = sqliteTable(
  "take_classes",
  {
    userId: text("user_id").references(() => users.id),
    classId: integer("class_id").references(() => classes.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.classId] }),
  }),
);

export const takeClassesRelations = relations(takeClasses, ({ one }) => ({
  userId: one(users, {
    fields: [takeClasses.userId],
    references: [users.id],
  }),
  classId: one(classes, {
    fields: [takeClasses.classId],
    references: [classes.id],
  }),
}));
