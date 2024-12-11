import path from "node:path"
import {
  defineWorkersConfig,
  readD1Migrations,
} from "@cloudflare/vitest-pool-workers/config"

const migrationsPath = path.join(__dirname, "drizzle", "migrations")
const migrations = await readD1Migrations(migrationsPath)

export default defineWorkersConfig({
  test: {
    setupFiles: ["./server/test/apply-migrations.ts"],
    poolOptions: {
      workers: {
        singleWorker: true,
        wrangler: {
          configPath: "./wrangler-test.toml",
          environment: "production",
        },
        miniflare: {
          bindings: { TEST_MIGRATIONS: migrations },
        },
      },
    },
  },
})
