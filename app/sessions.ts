import {
  createCookieSessionStorage,
  redirect,
  type AppLoadContext,
} from "@remix-run/cloudflare";
import type { Undefinable } from "option-t/undefinable";

type SessionData = {
  userId: string;
};

const sessionStorage = (context: AppLoadContext) =>
  createCookieSessionStorage<SessionData>({
    cookie: {
      name: "__session",
      secure: context.cloudflare.env.ENV === "production",
      secrets: [context.cloudflare.env.SESSION_SECRET],
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      httpOnly: true,
    },
  });

export const createUserSession =
  (context: AppLoadContext) => async (id: string, redirectPath: string) => {
    const session = await sessionStorage(context).getSession();
    session.set("userId", id);
    return redirect(redirectPath, {
      headers: {
        "Set-Cookie": await sessionStorage(context).commitSession(session),
      },
    });
  };

export const getUserSession =
  (context: AppLoadContext) =>
  async (request: Request): Promise<Undefinable<string>> => {
    const session = await sessionStorage(context).getSession(
      request.headers.get("Cookie"),
    );

    return session.get("userId");
  };
