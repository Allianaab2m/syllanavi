import { Table, Title } from "@mantine/core";
import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { isErr } from "option-t/plain_result";
import { ClassTable } from "~/components";
import { db } from "~/db";
import { Classes } from "~/db/repository/classes";
import { getUserSession } from "~/sessions";

export async function loader({ context, request }: LoaderFunctionArgs) {
  const classes = await Classes(db(context)).getAll();
  const session = await getUserSession(context)(request);

  if (isErr(classes)) {
    return {
      data: null,
      userId: session.userId,
      error: classes.err,
    };
  }

  return {
    data: classes.val,
    userId: session.userId,
    error: null,
  };
}

export default function ClassRoute() {
  const { data, error, userId } = useLoaderData<typeof loader>();

  const rows = data?.map((d) => (
    <ClassTable key={d.id} userId={userId} {...d} />
  ));

  return (
    <>
      <Title>授業一覧</Title>
      {data ? (
        <Table stickyHeader highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>授業名</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      ) : (
        <p>{error.message}</p>
      )}
    </>
  );
}
