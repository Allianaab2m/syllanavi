import { Box, Table, Text } from "@mantine/core";
import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { isErr } from "option-t/plain_result";
import { db } from "~/db";
import { Classes } from "~/db/repository/classes";

export async function loader({ context, request }: LoaderFunctionArgs) {
  const classes = await Classes(db(context)).getAll();
  if (isErr(classes)) {
    return {
      data: null,
      error: classes.err,
    };
  }

  return {
    data: classes.val,
    error: null,
  };
}

export default function ClassRoute() {
  const { data, error } = useLoaderData<typeof loader>();

  return data ? (
    <Box mx="xl" mt="md">
      <Text size="xl" fw="bold">
        授業一覧
      </Text>
      <Table
        stickyHeader
        data={{
          head: ["ID", "授業名"],
          body: data.map((v) => [v.id, v.name]),
        }}
      />
    </Box>
  ) : (
    <p>{error.message}</p>
  );
}
