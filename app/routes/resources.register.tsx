import { json, type ActionFunctionArgs } from "@remix-run/cloudflare";
import { db } from "~/db";
import { Users } from "~/db/repository/users";

type ActionResponse =
  | {
      success: true;
      error: undefined;
    }
  | { success: false; error: { message: string } };

export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.formData();
  const name = formData.get("name")?.toString() ?? "";
  const password = formData.get("password")?.toString();
  const users = Users(db(context));

  let response: ActionResponse;

  if (!(await users.checkNameDuplicate(name))) {
    response = {
      success: false,
      error: {
        message: "Duplicate name",
      },
    };
  } else {
    response = {
      success: true,
      error: undefined,
    };
  }

  return json(response);
}

export type RegisterAction = typeof action;
