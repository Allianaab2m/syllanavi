import type { Config } from "drizzle-kit"

export default {
  schema: "./server/schema",
  out: "./drizzle/migrations",
  dialect: "sqlite",
} satisfies Config
