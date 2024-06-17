import type { InferInsertModel } from "drizzle-orm";
import { eq } from "drizzle-orm";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import type { Nullable } from "option-t/nullable";
import type { Result } from "option-t/plain_result";
import { createOk } from "option-t/plain_result";
import type * as Schema from "~/db/schema";
import { users } from "~/db/schema";
import { wrapErr } from "~/lib";

export const Users = (db: DrizzleD1Database<typeof Schema>) => {
  return {
    async create(
      data: InferInsertModel<typeof users>,
    ): Promise<Result<{ id: string; name: string }, Error>> {
      try {
        const user = (
          await db.insert(users).values(data).returning({
            id: users.id,
            name: users.name,
          })
        )[0];
        return createOk(user);
      } catch (e) {
        console.log(e);
        return wrapErr(e);
      }
    },
    async findById(
      id: string,
    ): Promise<
      Nullable<{ id: string; name: string; isAdmin: boolean | null }>
    > {
      try {
        const user = await db.query.users.findFirst({
          where: eq(users.id, id),
          columns: {
            password: false,
          },
        });

        if (!user) {
          return null;
        }
        return user;
      } catch (e) {
        return null;
      }
    },
    async findByName(
      name: string,
      withPassword = false,
    ): Promise<
      Nullable<{
        id: string;
        name: string;
        isAdmin: boolean | null;
        password?: string;
      }>
    > {
      try {
        const user = await db
          .select({
            id: users.id,
            name: users.name,
            isAdmin: users.isAdmin,
            ...(withPassword && { password: users.password }),
          })
          .from(users)
          .where(eq(users.name, name));

        if (user.length === 0) {
          return null;
        }

        return user[0];
      } catch (e) {
        return null;
      }
    },
  };
};
