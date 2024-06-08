import type { AppLoadContext } from "@remix-run/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import * as Schema from "./schema";

export const db = (context: AppLoadContext) => {
  return drizzle<typeof Schema>(context.cloudflare.env.DB, { schema: Schema });
};
