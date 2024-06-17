import { eq } from "drizzle-orm";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import type { Result } from "option-t/plain_result";
import { createOk } from "option-t/plain_result";
import * as schema from "~/db/schema";
import { takeClasses } from "~/db/schema";
import { wrapErr } from "~/lib";

export const TakeClasses = (db: DrizzleD1Database<typeof schema>) => {
  return {
    async create(
      userId: string,
      classId: number,
    ): Promise<Result<void, Error>> {
      try {
        await db.insert(takeClasses).values({ userId, classId });
        return createOk(undefined);
      } catch (e) {
        return wrapErr(e);
      }
    },
    async findByUserId(userId: string) {
      try {
        const res = await db
          .select()
          .from(takeClasses)
          .leftJoin(schema.users, eq(takeClasses.userId, schema.users.id))
          .leftJoin(schema.classes, eq(takeClasses.classId, schema.classes.id))
          .where(eq(schema.users.id, userId))
          .all();
        return res.map((d) => d.classes);
      } catch (e) {
        return null;
      }
    },
  };
};
