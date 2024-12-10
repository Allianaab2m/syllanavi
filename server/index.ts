import { Hono } from "hono"

const app = new Hono<{Bindings: Env}>().basePath("/api");

const routes = app.
    get("/", (c) => {
        return c.json({
            hello: "Hono"
        })
    })

export default app