import { Center, Group, Select, Table, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { json, redirect } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { ClassDetailModal } from "~/components";
import { db } from "~/db";
import type { Class } from "~/db/repository/classes";
import { TakeClasses } from "~/db/repository/takeClasses";
import { Users } from "~/db/repository/users";
import { Day, serializeTerm } from "~/lib";
import { getUserSession } from "~/sessions";

export async function loader({ context, request }: LoaderFunctionArgs) {
  const session = await getUserSession(context)(request);
  if (session.userId) {
    const user = await Users(db(context)).findById(session.userId);
    const takeClasses = (
      await TakeClasses(db(context)).findByUserId(session.userId)
    )?.filter((d) => d !== null);
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

const Timetable = (classes?: Class[]) => {
  const timetableData: (Class | null)[][] = [];

  if (classes) {
    for (let time = 1; time <= 6; time++) {
      const timeArray: (Class | null)[] = [];
      for (let day = 1; day <= 6; day++) {
        const findClass = classes.find((cls) => {
          const { endAt } = cls;
          if (day === cls.day) {
            if (time === cls.startAt) {
              return true;
            }
            if (endAt && cls.startAt <= time && time <= endAt) {
              return true;
            }
            return false;
          }
          return false;
        });

        if (findClass) {
          timeArray.push(findClass);
        } else {
          timeArray.push(null);
        }
      }
      timetableData.push(timeArray);
    }
  }

  const rows = timetableData.map((data, i) => {
    return (
      // biome-ignore lint/suspicious/noArrayIndexKey: data is nullable
      <Table.Tr key={`timetable-tr-${i}`}>
        <Table.Td>{i + 1}</Table.Td>
        {data.map((d, i) => {
          const [opened, { open, close }] = useDisclosure(false);
          return (
            <>
              {/* biome-ignore lint/suspicious/noArrayIndexKey: data is nullable */}
              <Table.Td key={`timetable-td-${i}`} onClick={open}>
                {d ? d.name : ""}
              </Table.Td>
              {d ? (
                <ClassDetailModal
                  class={d}
                  opened={opened}
                  close={close}
                  // biome-ignore lint/suspicious/noArrayIndexKey: data is nullable
                  key={`timetable-classdetailmodal-${i}`}
                />
              ) : (
                <></>
              )}
            </>
          );
        })}
      </Table.Tr>
    );
  });
  return rows;
};

type Filter = {
  academicYear: string | null;
  term: string | null;
};

export function filterData(
  payload: {
    academicYear: number;
    term: number;
  },
  data?: Class[],
) {
  if (!data) return [];
  let ret = data;
  if (payload.academicYear !== 0) {
    ret = ret.filter((d) => d.academicYear === payload.academicYear);
  }

  if (payload.term !== 0) {
    ret = ret.filter((d) => d.term === payload.term);
  }

  return ret;
}

export default function MyPage() {
  const { user, classes } = useLoaderData<typeof loader>();

  const [filteredData, setFilteredData] = useState(classes);
  const [filter, setFilter] = useState<Filter>({
    academicYear: "1",
    term: "1",
  });
  const timetableData = Timetable(filteredData);

  useEffect(() => {
    setFilteredData(
      filterData(
        {
          academicYear: Number(filter.academicYear),
          term: serializeTerm(filter.term ?? ""),
        },
        classes,
      ),
    );
  }, [classes, filter]);

  const handleAcademicYearChange = (value: string | null) => {
    setFilter({ ...filter, academicYear: value });
  };

  const handleTermChange = (value: string | null) => {
    setFilter({ ...filter, term: value });
  };

  return (
    <>
      <Title>マイページ</Title>
      <Title order={2}>履修授業</Title>
      <Group>
        <Select
          placeholder="開講年次"
          data={["1", "2", "3", "4"].map((v) => ({
            value: v,
            label: `${v}年`,
          }))}
          defaultValue={"1"}
          onChange={handleAcademicYearChange}
          allowDeselect={false}
        />
        <Select
          placeholder="学期"
          data={["前期", "後期"]}
          defaultValue={"前期"}
          onChange={handleTermChange}
          allowDeselect={false}
        />
      </Group>
      {filter.academicYear !== null && filter.term !== null ? (
        filteredData ? (
          <Table
            withColumnBorders
            verticalSpacing="lg"
            layout="fixed"
            withTableBorder
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th w={50}>時限</Table.Th>
                {Day.map((v) => (
                  <Table.Th key={v}>
                    <Center>{v}</Center>
                  </Table.Th>
                ))}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{timetableData}</Table.Tbody>
          </Table>
        ) : (
          <></>
        )
      ) : (
        <Text>年度・学期を選択してください</Text>
      )}
    </>
  );
}
