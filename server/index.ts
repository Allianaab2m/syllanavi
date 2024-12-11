import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono"
import { z } from "zod";
import { PostsRepository } from "./repository/posts";
import { createDatabaseFromD1 } from "./schema";

const app = new Hono<{Bindings: Env}>().basePath("/api");

const routes = app
    .get("/", (c) => {
        return c.json({
            hello: "Hono"
        })
    })
    .post(
        "/posts/create", 
        zValidator(
            "json", 
            z.object({
                title: z.string() 
            })
        ),
        async (c) => {
            const { title } = c.req.valid("json")
            await PostsRepository(createDatabaseFromD1(c.env.DB)).create({ title })
            return c.body("OK!")
        }
    )
    .get(
        "/posts/:id",
        zValidator(
            "param",
            z.object({
                id: z.coerce.number()
            })
        ),
        async (c) => {
            const { id } = c.req.valid("param")
            const res = await PostsRepository(createDatabaseFromD1(c.env.DB)).getFromId(id)
            if (res) {
                return c.json(res)
            }
            c.status(404)
            return c.body("Error: Not found")
        }
    )

export default app