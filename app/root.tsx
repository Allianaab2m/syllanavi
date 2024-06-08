import { Box, ColorSchemeScript, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  useLoaderData,
} from "@remix-run/react";
import { Header } from "./components";
import { db } from "./db";
import { Users } from "./db/repository/users";
import { getUserSession } from "./sessions";

export async function loader({ context, request }: LoaderFunctionArgs) {
  const userId = await getUserSession(context)(request);

  if (userId) {
    const user = await Users(db(context)).findById(userId);
    if (user) {
      return json({
        userId,
        userName: user.name,
      });
    }
  }

  return json({
    userId,
    userName: null,
  });
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { userName } = useLoaderData<typeof loader>();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>
          <Header name={userName} />
          <Box mx="xl">{children}</Box>
        </MantineProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
