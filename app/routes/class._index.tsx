import { Table, TextInput, Title, keys, rem } from "@mantine/core";
import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { isErr } from "option-t/plain_result";
import type React from "react";
import { useMemo, useState } from "react";
import { Search } from "tabler-icons-react";
import { ClassTable } from "~/components";
import { Th } from "~/components";
import { db } from "~/db";
import { type Class, Classes } from "~/db/repository/classes";
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

function ClassTableHeader() {
  return (
    <Table.Thead>
      <Table.Tr>
        <Table.Th>ID</Table.Th>
        <Table.Th>授業名</Table.Th>
        <Table.Th>学科</Table.Th>
        <Table.Th>区分</Table.Th>
        <Table.Th>曜日・時限</Table.Th>
        <Table.Th>開講年次</Table.Th>
        <Table.Th>学期</Table.Th>
        <Table.Th>単位数</Table.Th>
      </Table.Tr>
    </Table.Thead>
  );
}

function filterData(data: Class[] | null, search: string) {
  if (!data) return [];
  const query = search.toLowerCase().trim();
  const filtered = data?.filter((item) =>
    item.name.toLowerCase().includes(query),
  );

  if (!filtered) return [];
  return filtered;
}

export default function ClassRoute() {
  const { data, error, userId } = useLoaderData<typeof loader>();
  const classData = useMemo(() => data, [data]);
  const [filteredData, setFilteredData] = useState(classData);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    console.log(value);
    setFilteredData(filterData(classData, value));
  };

  return (
    <>
      <Title>授業一覧</Title>
      <TextInput
        mb="md"
        leftSection={<Search style={{ width: rem(16), height: rem(16) }} />}
        placeholder="授業名で検索..."
        onChange={handleSearchChange}
      />
      {filteredData ? (
        <Table stickyHeader highlightOnHover>
          <ClassTableHeader />
          <Table.Tbody>
            {filteredData.map((d) => (
              <ClassTable key={d.id} userId={userId} class={d} />
            ))}
          </Table.Tbody>
        </Table>
      ) : (
        <p>{error?.message}</p>
      )}
    </>
  );
}
