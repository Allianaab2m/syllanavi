import { Box, Text } from "@mantine/core";
import { json, redirect, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/db";
import { Users } from "~/db/repository/users";
import { getUserSession } from "~/sessions";

export async function loader({ context, request }: LoaderFunctionArgs) {
  const session = await getUserSession(context)(request);
  if (session.userId) {
    const user = await Users(db(context)).findById(session.userId);
    if (user) {
      return json({
        success: true,
        error: null,
        user,
      });
    }
  }
  return redirect("/login?redirect=mypage");
}

export default function MyPage() {
  const { user } = useLoaderData<typeof loader>();
  return user ? (
    <Box mx="xl">
      <Text fw="bold" size="xl">
        マイページ
      </Text>
      <Text>ID: {user.id}</Text>
      <Text>Name: {user.name}</Text>
    </Box>
  ) : (
    <></>
  );
}
