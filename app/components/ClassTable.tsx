import { Button, Modal, Table, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useSubmit } from "@remix-run/react";
import type { Class } from "~/db/repository/classes";
import { findDepartmentByID } from "~/db/repository/departments";
import { deserializeDay, deserializeTerm } from "~/lib";

type Props = {
  class: Class;
  userId?: string;
};

export function ClassTable({ userId, class: cls }: Props) {
  const submit = useSubmit();
  const [opened, { open, close }] = useDisclosure(false);
  const department = findDepartmentByID(cls.departmentId);
  const category = department?.categories.find((v) => v.id === cls.categoryId);

  return (
    <>
      <Table.Tr onClick={open}>
        <Table.Td>{cls.id}</Table.Td>
        <Table.Td>{cls.name}</Table.Td>
        <Table.Td>{department ? department.name : "未設定"}</Table.Td>
        <Table.Td>{category ? category.name : "未設定"}</Table.Td>
        <Table.Td>
          {cls.day ? `${deserializeDay(cls.day)}曜${cls.startAt}限` : "未設定"}
        </Table.Td>
        <Table.Td>{cls.academicYear}年</Table.Td>
        <Table.Td>{cls.term ? deserializeTerm(cls.term) : "未設定"}</Table.Td>
        <Table.Td>{cls.unit}</Table.Td>
      </Table.Tr>
      <Modal opened={opened} onClose={close}>
        <Title>{cls.name}</Title>
        {cls.id}
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
    </>
  );
}
