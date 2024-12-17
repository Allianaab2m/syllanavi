import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { basicAuth } from "hono/basic-auth"
import { z } from "zod"
import { LecturesRepositoryImpl } from "./repository/lectures"
import { d1DB } from "./schema"

const app = new Hono<{ Bindings: Env }>()

app.use(
  "/admin/*",
  basicAuth({
    username: "hono",
    password: "password",
  }),
)

export const routes = app.basePath("/api").get("/lectures", async (c) => {
  const res = await LecturesRepositoryImpl(d1DB(c.env.DB)).getAll()
  if (res.isErr()) {
    return c.json(res.unwrapOr(new Error("Internal server error")), 500)
  }
  return c.json(res.unwrapOr({}))
})

export default app
