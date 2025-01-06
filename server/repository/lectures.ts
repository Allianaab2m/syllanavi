import { eq } from "drizzle-orm"
import type { DrizzleD1Database } from "drizzle-orm/d1"
import { Result, err, fromPromise, ok, safeTry } from "neverthrow"
import {
  Lecture,
  LectureNotFound,
  LectureRepositoryInternalError,
} from "server/models/lectures"
import { lectures } from "server/schema"
import type {
  LectureRepository as ILectureRepository,
  LectureId,
} from "../models/lectures"

export const LecturesRepositoryImpl = (db: DrizzleD1Database) =>
  ({
    create: (args, genID) =>
      safeTry(async function* () {
        yield* await fromPromise(
          db.insert(lectures).values({ id: genID(), ...args }),
          () => new LectureRepositoryInternalError(),
        )
        return ok(undefined)
      }),
    getFromId: (id: LectureId) =>
      safeTry(async function* () {
        const res = yield* await fromPromise(
          db.select().from(lectures).where(eq(lectures.id, id)).limit(1),
          () => new LectureRepositoryInternalError(),
        )

        const lecture = res.at(0)

        if (!lecture) {
          return err(new LectureNotFound(id))
        }

        const parsedLecture = yield* Lecture.fromRepository(lecture)

        return ok(parsedLecture)
      }),
    getAll: () =>
      safeTry(async function* () {
        const res = yield* await fromPromise(
          db.select().from(lectures).all(),
          () => new LectureRepositoryInternalError(),
        )

        return Result.combineWithAllErrors(res.map(Lecture.fromRepository))
      }),
  }) satisfies ILectureRepository
