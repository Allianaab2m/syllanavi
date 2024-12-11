import { eq } from "drizzle-orm"
import { expect, describe, it } from "vitest"
import { posts } from "server/schema";
import { PostsRepository } from "./posts";
import { testDB } from "server/test/db";

const repository = PostsRepository(testDB)

describe("Post Repository test", () => {
    it("should create post", async () => {
        await repository.create({ title: "test" })
        const res = await testDB.select().from(posts).where(eq(posts.title, "test"))
        expect(res[0].id).toBe(1)
        expect(res[0].title).toBe("test")
    })
})
