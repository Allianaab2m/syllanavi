import { Box, Table, Text } from "@mantine/core";
import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { isErr } from "option-t/plain_result";
import { ClassTable } from "~/components";
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

  const rows = data?.map((d) => (
    <ClassTable id={d.id} name={d.name} key={d.id} />
  ));
  return data ? (
    <Box mx="xl" mt="md">
      <Text size="xl" fw="bold">
        授業一覧
      </Text>
      <Table stickyHeader highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>授業名</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Box>
  ) : (
    <p>{error.message}</p>
  );
}
