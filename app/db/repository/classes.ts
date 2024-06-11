import type { InferInsertModel } from "drizzle-orm";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import type { Result } from "option-t/plain_result";
import { createOk } from "option-t/plain_result";
import type * as Schema from "~/db/schema";
import { classes } from "~/db/schema";
import { wrapErr } from "~/lib";

export const Classes = (db: DrizzleD1Database<typeof Schema>) => {
  return {
    async create(
      data: InferInsertModel<typeof classes>,
    ): Promise<Result<{ id: number; name: string }, Error>> {
      try {
        const cls = (
          await db.insert(classes).values(data).returning({
            id: classes.id,
            name: classes.name,
          })
        )[0];
        return createOk(cls);
      } catch (e) {
        return wrapErr(e);
      }
    },
  };
};
