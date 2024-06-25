import {
  Group,
  NumberInput,
  Select,
  Table,
  TextInput,
  Title,
  rem,
} from "@mantine/core";
import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { isErr } from "option-t/plain_result";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { Search } from "tabler-icons-react";
import { ClassTable, ClassTableHeader, filterData } from "~/components";
import { db } from "~/db";
import { Classes } from "~/db/repository/classes";
import { type Category, findDepartmentByID } from "~/db/repository/departments";
import departments from "~/departments.json";
import { Day, serializeDay, serializeTerm } from "~/lib";
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

type Filter = {
  search: string | null;
  department: string | null;
  category: string | null;
  day: string | null;
  academicYear: string | null;
  term: string | null;
  time: string | null;
};

export default function ClassRoute() {
  const { data, error, userId } = useLoaderData<typeof loader>();
  const classData = useMemo(() => data, [data]);
  const [categories, setCategories] = useState<Category[] | undefined>(
    undefined,
  );
  const [filter, setFilter] = useState<Filter>({
    search: "",
    department: null,
    category: null,
    day: null,
    academicYear: null,
    term: null,
    time: null,
  });
  const [filteredData, setFilteredData] = useState(classData);

  useEffect(() => {
    setFilteredData(
      filterData(classData, {
        search: filter.search,
        department: Number(filter.department),
        category: filter.category ? Number(filter.category) : -1,
        day: serializeDay(filter.day ?? ""),
        academicYear: Number(filter.academicYear),
        term: serializeTerm(filter.term ?? ""),
        time: Number(filter.time),
      }),
    );
  }, [classData, filter]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({ ...filter, search: event.currentTarget.value });
  };

  const handleDepartmentChange = (value: string | null) => {
    setFilter({
      ...filter,
      department: value,
    });
    setCategories(findDepartmentByID(Number(value))?.categories);
  };

  const handleCategoryChange = (value: string | null) => {
    setFilter({
      ...filter,
      category: value,
    });
  };

  const handleDayChange = (value: string | null) => {
    setFilter({ ...filter, day: value });
  };

  const handleAcademicYearChange = (value: string | null) => {
    setFilter({ ...filter, academicYear: value });
  };

  const handleTimeChange = (value: string | number) => {
    setFilter({ ...filter, time: value.toString() });
  };

  const handleTermChange = (value: string | null) => {
    setFilter({ ...filter, term: value });
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
      <Group>
        <Select
          placeholder="学科"
          data={departments.map((d) => ({
            value: d.id.toString(),
            label: d.name,
          }))}
          onChange={handleDepartmentChange}
        />
        <Select
          placeholder="区分"
          data={categories?.map((c) => ({
            value: c.id.toString(),
            label: c.name,
          }))}
          onChange={handleCategoryChange}
        />
        <Select placeholder="曜日" data={Day} onChange={handleDayChange} />
        <NumberInput
          placeholder="時限"
          allowNegative={false}
          min={1}
          onChange={(e) => {
            handleTimeChange(e);
          }}
        />
        <Select
          placeholder="開講年次"
          data={["1", "2", "3", "4"].map((v) => ({
            value: v,
            label: `${v}年`,
          }))}
          onChange={handleAcademicYearChange}
        />
        <Select
          placeholder="学期"
          data={["前期", "後期"]}
          onChange={handleTermChange}
        />
      </Group>
      {filteredData ? (
        <Table stickyHeader highlightOnHover layout="fixed">
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
