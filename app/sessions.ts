import type { AppLoadContext } from "@remix-run/cloudflare";
import { createCookieSessionStorage, redirect } from "@remix-run/cloudflare";

type SessionData = {
  userId: string;
  userName?: string;
  isAdmin: boolean;
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
  async (
    id: string,
    redirectPath: string,
    name?: string,
    isAdmin: boolean | null = false,
  ) => {
    const session = await sessionStorage(context).getSession();
    session.set("userId", id);
    session.set("userName", name);
    session.set("isAdmin", isAdmin ?? false);
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
      isAdmin: session.get("isAdmin"),
    };
  };

export const destroyUserSession =
  (context: AppLoadContext) => async (request: Request) => {
    const session = await sessionStorage(context).getSession(
      request.headers.get("Cookie"),
    );

    return redirect("/", {
      headers: {
        "Set-Cookie": await sessionStorage(context).destroySession(session),
      },
    });
  };

export const checkAdmin = async (context: AppLoadContext, request: Request) => {
  const userSession = await getUserSession(context)(request);
  if (userSession.isAdmin) {
    return true;
  }
  return false;
};
