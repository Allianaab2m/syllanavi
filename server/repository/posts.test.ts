import { eq } from "drizzle-orm"
import { posts } from "server/schema"
import { testDB } from "server/test/db"
import { describe, expect, it } from "vitest"
import { PostsRepository } from "./posts"

const repository = PostsRepository(testDB)

describe("Post Repository test", () => {
  it("should create post", async () => {
    await repository.create({ title: "test" })
    const res = await testDB.select().from(posts).where(eq(posts.title, "test"))
    expect(res[0].id).toBe(1)
    expect(res[0].title).toBe("test")
  })
})
