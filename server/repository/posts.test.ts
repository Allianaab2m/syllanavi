import { env } from "cloudflare:test"
import { d1DB } from "server/schema"
import { PostsRepository } from "./posts"

const repository = PostsRepository(d1DB(env.DB))

describe("Post Repository test", () => {
  beforeEach(async () => {
    await env.DB.prepare(
      `INSERT INTO posts VALUES (1, 'data1', strftime('%s', '2024-01-23 01:23:45'))`,
    ).run()
    await env.DB.prepare(
      `INSERT INTO posts VALUES (2, 'data2', strftime('%s', '2024-01-23 01:23:45'))`,
    ).run()
    await env.DB.prepare(
      `INSERT INTO posts VALUES (3, 'data3', strftime('%s', '2024-01-23 01:23:45'))`,
    ).run()
  })
  afterEach(async () => {
    await env.DB.prepare("DELETE FROM posts").run()
    await env.DB.prepare("DELETE FROM sqlite_sequence WHERE name='posts'").run()
  })
  it("should create post", async () => {
    await repository.create({ title: "test" })
    const { results } = await env.DB.prepare(
      "SELECT * FROM posts WHERE title = 'test'",
    ).all()
    expect(results[0].id).toBe(4)
    expect(results[0].title).toBe("test")
  })
  it("should get post", async () => {
    const res1 = await repository.getFromId(1)
    expect(res1?.title).toBe("data1")
    expect(res1?.createdAt).toStrictEqual(new Date("2024-01-23T01:23:45Z"))
  })
  it("should get all posts", async () => {
    const res = await repository.getAll()
    expect(res.length).toBe(3)
    expect(res[0].title).toBe("data1")
    expect(res[1].title).toBe("data2")
    expect(res[2].title).toBe("data3")
  })
})
