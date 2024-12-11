import { env } from "cloudflare:test"
import { createDatabaseFromD1 } from "server/schema"

export const testDB = createDatabaseFromD1(env.DB)
