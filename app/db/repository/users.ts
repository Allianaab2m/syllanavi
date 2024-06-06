import type { InferInsertModel } from "drizzle-orm";
import { eq } from "drizzle-orm";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import type * as Schema from "~/db/schema";
import { users } from "~/db/schema";

export const Users = (db: DrizzleD1Database<typeof Schema>) => {
  return {
    async create(data: InferInsertModel<typeof users>) {
      return (
        await db.insert(users).values(data).returning({
          id: users.id,
          name: users.name,
        })
      )[0];
    },
    async checkNameDuplicate(name: string) {
      const user = await db.query.users.findFirst({
        where: eq(users.name, name),
      });

      if (user) {
        return true;
      }

      return false;
    },
  };
};
