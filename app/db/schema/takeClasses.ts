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
