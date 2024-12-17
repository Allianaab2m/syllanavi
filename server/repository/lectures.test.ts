import { env } from "cloudflare:test"
import type { Lectures } from "server/models/lectures"
import { d1DB } from "server/schema"
import { LecturesRepositoryImpl } from "./lectures"

const repository = LecturesRepositoryImpl(d1DB(env.DB))

describe("LecturesRepository", () => {
  beforeEach(async () => {
    await env.DB.prepare(`
      INSERT INTO lectures(id, year, grade, semester, day, name, credit, teacher) VALUES ('1', 2024, 1, 0, 0, 'テスト講義1', 2, 'テスト教員1')`).run()
    await env.DB.prepare(`
      INSERT INTO lectures(id, year, grade, semester, day, name, credit, teacher) VALUES ('2', 2024, 1, 0, 0, 'テスト講義2', 2, 'テスト教員2')`).run()
  })

  afterEach(async () => {
    await env.DB.prepare("DELETE FROM lectures").run()
    await env.DB.prepare(
      "DELETE FROM sqlite_sequence WHERE name='lectures'",
    ).run()
  })

  it("should create a lecture", async () => {
    const args = {
      year: 2024,
      grade: 1,
      semester: 0,
      day: 0,
      name: "講義名",
      credit: 2,
      teacher: "教員名",
    }

    await repository.create(args, () => "1234")
    const { results } = await env.DB.prepare(
      "SELECT * FROM lectures WHERE id = '1234'",
    ).all()
    expect(results[0]).toStrictEqual({ ...args, id: "1234" })
  })

  it("should get a lecture by id", async () => {
    const id = "1"
    const expectedLecture = {
      id,
      year: 2024,
      grade: 1,
      semester: "前期",
      day: "月",
      name: "テスト講義1",
      credit: 2,
      teacher: "テスト教員1",
    } satisfies Lectures

    const result = await repository.getFromId(id)

    expect(result).toStrictEqual(expectedLecture)
  })

  it("should return null if lecture not found by id", async () => {
    const id = "non-existent-id"
    const result = await repository.getFromId(id)
    expect(result).toBeNull()
  })

  it("should get all lectures", async () => {
    const expectedLectures = [
      {
        id: "1",
        year: 2024,
        grade: 1,
        semester: "前期",
        day: "月",
        name: "テスト講義1",
        credit: 2,
        teacher: "テスト教員1",
      },
      {
        id: "2",
        year: 2024,
        grade: 1,
        semester: "前期",
        day: "月",
        name: "テスト講義2",
        credit: 2,
        teacher: "テスト教員2",
      },
    ] satisfies Lectures[]

    const result = await repository.getAll()

    expect(result).toStrictEqual(expectedLectures)
  })
})
