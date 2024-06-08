import type { ActionFunctionArgs } from "@remix-run/cloudflare";
import { destroyUserSession } from "~/sessions";

export async function action({ context, request }: ActionFunctionArgs) {
  return await destroyUserSession(context)(request);
}
