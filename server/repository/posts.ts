import { eq } from "drizzle-orm"
import type { DrizzleD1Database } from "drizzle-orm/d1"
import { posts } from "server/schema"

export type PostsRepository = {
  create(args: { title: string }): Promise<void>
  getFromId(id: number): Promise<typeof posts.$inferSelect | undefined>
  getAll(): Promise<(typeof posts.$inferSelect)[]>
}

export const PostsRepository = (db: DrizzleD1Database) =>
  ({
    async create(args: { title: string }) {
      await db.insert(posts).values(args)
      return undefined
    },
    async getFromId(id: number) {
      return (await db.select().from(posts).where(eq(posts.id, id))).at(0)
    },
    async getAll() {
      return await db.select().from(posts).all()
    },
  }) satisfies PostsRepository
