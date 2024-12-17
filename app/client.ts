import { hc } from "hono/client"
import type { routes } from "server"

export const client = hc<typeof routes>(import.meta.env.VITE_API_URL)
