import type { ActionFunctionArgs } from "@remix-run/cloudflare";
import { db } from "~/db";
import { TakeClasses } from "~/db/repository/takeClasses";

export async function action({ context, request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const userId = formData.get("userId")?.toString();
  const classId = formData.get("classId")?.toString();

  if (userId && classId) {
    await TakeClasses(db(context)).create(userId, Number.parseInt(classId));
  }
  return null;
}
