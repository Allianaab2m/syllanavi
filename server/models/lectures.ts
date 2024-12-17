import type { lectures } from "server/schema"

export type LecturesRepository = {
  create(
    args: Omit<typeof lectures.$inferInsert, "id">,
    genID: () => string,
  ): Promise<void>
  getFromId(id: string): Promise<Lectures | null>
  getAll(): Promise<Lectures[]>
}

export type LecturesGrade = 1 | 2 | 3 | 4
export const LecturesGrade = {
  fromNumber(num: number) {
    switch (num) {
      case 1:
        return 1
      case 2:
        return 2
      case 3:
        return 3
      case 4:
        return 4
      default:
        // TODO: Resultでエラーを返す
        throw new Error("Invalid number")
    }
  },
}

export type LecturesSemester =
  | "前期"
  | "後期"
  | "通年"
  | "集中前期"
  | "集中後期"
export const LecturesSemester = {
  fromNumber(num: number) {
    switch (num) {
      case 0:
        return "前期"
      case 1:
        return "後期"
      case 2:
        return "通年"
      case 3:
        return "集中前期"
      case 4:
        return "集中後期"
      default:
        // TODO: Resultでエラーを返す
        throw new Error("Invalid number")
    }
  },
}

export type LecturesDay = "月" | "火" | "水" | "木" | "金" | "土" | "日"
export const LecturesDay = {
  fromNumber(num: number) {
    switch (num) {
      case 0:
        return "月"
      case 1:
        return "火"
      case 2:
        return "水"
      case 3:
        return "木"
      case 4:
        return "金"
      case 5:
        return "土"
      case 6:
        return "日"
      default:
        // TODO: Resultでエラーを返す
        throw new Error("Invalid number")
    }
  },
}

export type Lectures = {
  id: string
  year: number
  grade: LecturesGrade
  semester: LecturesSemester
  day: LecturesDay
  name: string
  credit: number
  teacher: string
}
export const Lectures = {
  fromRepository(args: typeof lectures.$inferSelect): Lectures {
    return {
      id: args.id,
      year: args.year,
      grade: LecturesGrade.fromNumber(args.grade),
      semester: LecturesSemester.fromNumber(args.semester),
      day: LecturesDay.fromNumber(args.day),
      name: args.name,
      credit: args.credit,
      teacher: args.teacher,
    }
  },
}
