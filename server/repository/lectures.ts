import { eq } from "drizzle-orm"
import type { DrizzleD1Database } from "drizzle-orm/d1"
import { Lectures } from "server/models/lectures"
import { lectures } from "server/schema"
import type { LecturesRepository as ILecturesRepository } from "../models/lectures"

export const LecturesRepositoryImpl = (db: DrizzleD1Database) =>
  ({
    async create(args, genID) {
      await db.insert(lectures).values({ id: genID(), ...args })
      return undefined
    },
    async getFromId(id: string) {
      const res = (
        await db.select().from(lectures).where(eq(lectures.id, id))
      ).at(0)
      if (res) {
        return Lectures.fromRepository(res)
      }
      return null
    },
    async getAll() {
      const res = await db.select().from(lectures).all()
      return res.map(Lectures.fromRepository)
    },
  }) satisfies ILecturesRepository
