import { Result, type ResultAsync, err, ok, safeTry } from "neverthrow"
import type { lectures } from "server/schema"

export class LectureNotFound extends Error {
  constructor(id: string) {
    super(`Lecture not found: ${id}`)
  }
}

export class LectureRepositoryInternalError extends Error {}
export class LectureModelParseError extends Error {
  constructor(key: string) {
    super(`Failed to parse lecture model: ${key}`)
  }
}

export type LectureRepository = {
  create: (
    args: Omit<typeof lectures.$inferInsert, "id">,
    genID: () => LectureId,
  ) => ResultAsync<
    void,
    LectureRepositoryInternalError | LectureModelParseError[]
  >
  getFromId: (
    id: LectureId,
  ) => ResultAsync<
    Lecture,
    LectureRepositoryInternalError | LectureNotFound | LectureModelParseError[]
  >
  getAll: () => ResultAsync<
    Lecture[],
    LectureRepositoryInternalError | LectureModelParseError[][]
  >
}

export type LectureId = string & { readonly brand: unique symbol }

export type LectureGrade = 1 | 2 | 3 | 4
export const LectureGrade = {
  fromNumber(num: number): Result<LectureGrade, LectureModelParseError> {
    if (1 <= num && num <= 4) {
      return ok(num as LectureGrade)
    }
    return err(new LectureModelParseError("grade"))
  },
}

export type LectureSemester = "前期" | "後期" | "通年" | "集中前期" | "集中後期"
export const LectureSemester = {
  fromNumber(num: number): Result<LectureSemester, LectureModelParseError> {
    switch (num) {
      case 0:
        return ok("前期")
      case 1:
        return ok("後期")
      case 2:
        return ok("通年")
      case 3:
        return ok("集中前期")
      case 4:
        return ok("集中後期")
      default:
        return err(new LectureModelParseError("semester"))
    }
  },
}

export type LectureDay = "月" | "火" | "水" | "木" | "金" | "土" | "日"
export const LectureDay = {
  fromNumber(num: number): Result<LectureDay, LectureModelParseError> {
    switch (num) {
      case 0:
        return ok("月")
      case 1:
        return ok("火")
      case 2:
        return ok("水")
      case 3:
        return ok("木")
      case 4:
        return ok("金")
      case 5:
        return ok("土")
      case 6:
        return ok("日")
      default:
        return err(new LectureModelParseError("day"))
    }
  },
}

export type Lecture = {
  id: LectureId
  year: number
  grade: LectureGrade
  semester: LectureSemester
  day: LectureDay
  name: string
  credit: number
  teacher: string
}
export const Lecture = {
  fromRepository(
    args: typeof lectures.$inferSelect,
  ): Result<Lecture, LectureModelParseError[]> {
    return safeTry(function* () {
      const [grade, semester, day] = yield* Result.combineWithAllErrors([
        LectureGrade.fromNumber(args.grade),
        LectureSemester.fromNumber(args.semester),
        LectureDay.fromNumber(args.day),
      ])

      return ok({
        id: args.id as LectureId,
        year: args.year,
        grade,
        semester,
        day,
        name: args.name,
        credit: args.credit,
        teacher: args.teacher,
      })
    })
  },
}
