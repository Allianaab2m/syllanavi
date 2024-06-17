import { Text, Title } from "@mantine/core";
import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { json, redirect } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/db";
import { TakeClasses } from "~/db/repository/takeClasses";
import { Users } from "~/db/repository/users";
import { getUserSession } from "~/sessions";

export async function loader({ context, request }: LoaderFunctionArgs) {
  const session = await getUserSession(context)(request);
  if (session.userId) {
    const user = await Users(db(context)).findById(session.userId);
    const takeClasses = await TakeClasses(db(context)).findByUserId(
      session.userId,
    );
    if (user) {
      return json({
        success: true,
        error: null,
        user,
        classes: takeClasses,
      });
    }
  }
  return redirect("/login?redirect=mypage");
}

export default function MyPage() {
  const { user, classes } = useLoaderData<typeof loader>();
  return (
    <>
      <Title>マイページ</Title>
      <Text>ID: {user.id}</Text>
      <Text>Name: {user.name}</Text>
      <Text>履修授業</Text>
      {classes ? (
        classes
          .filter((c) => c !== null)
          .map((c) => (
            <Text key={c?.id}>
              {c?.id} {c?.name}
            </Text>
          ))
      ) : (
        <></>
      )}
    </>
  );
}
