import { Button, Modal, Table, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useSubmit } from "@remix-run/react";
import type { Class } from "~/db/repository/classes";
import {
  findCategoryById,
  findDepartmentByID,
} from "~/db/repository/departments";
import { deserializeDay, deserializeTerm } from "~/lib";

type Props = {
  class: Class;
  userId?: string;
};

export function filterData(
  data: Class[] | null,
  payload: {
    search: string | null;
    department: number;
    category: number;
    day: number;
    academicYear: number;
    term: number;
    time: number;
  },
) {
  if (!data) return [];
  let ret = data;
  const { search, department, category, day, academicYear, term, time } =
    payload;
  console.log(ret);
  console.log(payload);

  if (search) {
    ret = ret.filter((d) => d.name.toLowerCase().includes(search));
  }

  if (department !== 0) {
    ret = ret.filter((d) => d.departmentId === department);
    if (category >= 0) {
      ret = ret.filter((d) => d.categoryId === category);
    }
  }

  if (day) {
    ret = ret.filter((d) => d.day === day);
  }

  if (academicYear !== 0) {
    ret = ret.filter((d) => d.academicYear === academicYear);
  }

  if (term !== 0) {
    ret = ret.filter((d) => d.term === term);
  }

  if (time) {
    ret = ret.filter((d) => {
      const { endAt } = d;
      if (d.startAt === time) return true;
      if (endAt) {
        if (endAt >= time && time >= d.startAt) {
          return true;
        }
      }
      return false;
    });
  }

  return ret;
}

export function ClassTableHeader() {
  return (
    <Table.Thead>
      <Table.Tr>
        <Table.Th w={10}>ID</Table.Th>
        <Table.Th>授業名</Table.Th>
        <Table.Th>学部・学科</Table.Th>
        <Table.Th>区分</Table.Th>
        <Table.Th>曜日</Table.Th>
        <Table.Th>時限</Table.Th>
        <Table.Th>開講年次</Table.Th>
        <Table.Th>学期</Table.Th>
        <Table.Th>単位数</Table.Th>
      </Table.Tr>
    </Table.Thead>
  );
}

export function ClassDetailModal({
  userId,
  class: cls,
  opened,
  close,
}: Props & { opened: boolean; close: () => void }) {
  const submit = useSubmit();
  const department = findDepartmentByID(cls.departmentId);
  return (
    <Modal opened={opened} onClose={close}>
      <Title>{cls.name}</Title>
      <Text>{department?.name}</Text>
      {department ? (
        <Text>{findCategoryById(department, cls.categoryId)?.name}</Text>
      ) : (
        <></>
      )}
      <Text>
        {cls.academicYear}年{deserializeTerm(cls.term)}{" "}
        {deserializeDay(cls.day)}曜{cls.startAt}
        {cls.endAt ? ` ~ ${cls.endAt}` : ""}限
      </Text>
      {userId ? (
        <Button
          onClick={() => {
            const formData = new FormData();
            formData.append("userId", userId);
            formData.append("classId", cls.id.toString());
            submit(formData, {
              action: "/resources/takeclass",
              method: "POST",
              navigate: false,
            });
            close();
          }}
        >
          履修する
        </Button>
      ) : (
        <></>
      )}
    </Modal>
  );
}

export function ClassTable({ userId, class: cls }: Props) {
  const department = findDepartmentByID(cls.departmentId);
  const category = department?.categories.find((v) => v.id === cls.categoryId);
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Table.Tr onClick={open}>
        <Table.Td>{cls.id}</Table.Td>
        <Table.Td>{cls.name}</Table.Td>
        <Table.Td>{department ? department.name : "未設定"}</Table.Td>
        <Table.Td>{category ? category.name : "未設定"}</Table.Td>
        <Table.Td>{deserializeDay(cls.day)}</Table.Td>
        <Table.Td>
          {cls.startAt}
          {cls.endAt ? `~${cls.endAt}` : ""}限
        </Table.Td>
        <Table.Td>{cls.academicYear}年</Table.Td>
        <Table.Td>{deserializeTerm(cls.term)}</Table.Td>
        <Table.Td>{cls.unit}</Table.Td>
      </Table.Tr>
      <ClassDetailModal
        userId={userId}
        class={cls}
        opened={opened}
        close={close}
      />
    </>
  );
}
