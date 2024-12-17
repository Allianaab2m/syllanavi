import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { basicAuth } from "hono/basic-auth"
import { z } from "zod"
import { PostsRepository } from "./repository/posts"
import { d1DB } from "./schema"

const app = new Hono<{ Bindings: Env }>()

app.use(
  "/admin/*",
  basicAuth({
    username: "hono",
    password: "password",
  }),
)

export const routes = app
  .basePath("/api")
  .get("/posts", async (c) => {
    const res = await PostsRepository(d1DB(c.env.DB)).getAll()
    return c.json(res)
  })
  .post(
    "/posts/create",
    zValidator(
      "json",
      z.object({
        title: z.string(),
      }),
    ),
    async (c) => {
      const { title } = c.req.valid("json")
      await PostsRepository(d1DB(c.env.DB)).create({ title })
      return c.body("OK!")
    },
  )
  .get(
    "/posts/:id",
    zValidator(
      "param",
      z.object({
        id: z.coerce.number(),
      }),
    ),
    async (c) => {
      const { id } = c.req.valid("param")
      const res = await PostsRepository(d1DB(c.env.DB)).getFromId(id)
      if (res) {
        return c.json(res)
      }
      c.status(404)
      return c.body("Error: Not found")
    },
  )

export default app
