import { hc } from "hono/client"
import type { routes } from "server"

export const client = (req: Request) => {
  const { origin } = new URL(req.url)
  return hc<typeof routes>(origin)
}
