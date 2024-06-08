import type { AppLoadContext } from "@remix-run/cloudflare";
import { createCookieSessionStorage, redirect } from "@remix-run/cloudflare";

type SessionData = {
  userId: string;
  userName?: string;
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
  (context: AppLoadContext) =>
  async (id: string, redirectPath: string, name?: string) => {
    const session = await sessionStorage(context).getSession();
    session.set("userId", id);
    session.set("userName", name);
    return redirect(redirectPath, {
      headers: {
        "Set-Cookie": await sessionStorage(context).commitSession(session),
      },
    });
  };

export const getUserSession =
  (context: AppLoadContext) => async (request: Request) => {
    const session = await sessionStorage(context).getSession(
      request.headers.get("Cookie"),
    );

    return {
      userId: session.get("userId"),
      userName: session.get("userName"),
    };
  };
