import { Center, Table, Text, Title } from "@mantine/core";
import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { json, redirect } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/db";
import type { Class } from "~/db/repository/classes";
import { TakeClasses } from "~/db/repository/takeClasses";
import { Users } from "~/db/repository/users";
import { Day } from "~/lib";
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

const Timetable = (classes: (Class | null)[] | null) => {
  const timetableData: (Class | null)[][] = [];
  if (classes) {
    for (let time = 1; time <= 6; time++) {
      const timeArray: (Class | null)[] = [];
      for (let day = 1; day <= 6; day++) {
        const findClass = classes.find((cls) => {
          if (!cls) return false;
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
        {data.map((d, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: data is nullable
          <Table.Td key={`timetable-td-${i}`}>{d ? d.name : ""}</Table.Td>
        ))}
      </Table.Tr>
    );
  });
  return rows;
};

export default function MyPage() {
  const { user, classes } = useLoaderData<typeof loader>();
  const timetableData = Timetable(classes);
  return (
    <>
      <Title>マイページ</Title>
      <Text>ID: {user.id}</Text>
      <Text>Name: {user.name}</Text>
      <Text>履修授業</Text>
      {classes ? (
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
      )}
    </>
  );
}
