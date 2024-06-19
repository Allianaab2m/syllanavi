import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import type { Result } from "option-t/plain_result";
import { createOk } from "option-t/plain_result";
import type * as Schema from "~/db/schema";
import { classes } from "~/db/schema";
import { wrapErr } from "~/lib";

export type Class = InferSelectModel<typeof classes>;

export const Classes = (db: DrizzleD1Database<typeof Schema>) => {
  return {
    async create(
      data: InferInsertModel<typeof classes>,
    ): Promise<Result<Class, Error>> {
      try {
        const cls = (
          await db.insert(classes).values(data).returning({
            id: classes.id,
            name: classes.name,
            departmentId: classes.departmentId,
            categoryId: classes.categoryId,
            academicYear: classes.academicYear,
            term: classes.term,
            day: classes.day,
          })
        )[0];
        return createOk(cls);
      } catch (e) {
        return wrapErr(e);
      }
    },
    async getAll(): Promise<Result<Class[], Error>> {
      try {
        const classes = await db.query.classes.findMany();
        return createOk(classes);
      } catch (e) {
        return wrapErr(e);
      }
    },
  };
};
