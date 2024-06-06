import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  driver: "d1-http",
  schema: "./app/db/schema/index.ts",
  dbCredentials: {
    accountId: "ede942a8080ac32ce803bbeac7396cee",
    databaseId: "09d4e3b3-779e-4a46-921e-be6a30175417",
    token: "7pTe2QLbclKVMiJEbGarU9KobbLAnUTfd7iPFTqj",
  },
});
