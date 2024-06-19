import { Button, Modal, Table, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useSubmit } from "@remix-run/react";
import {
  findCategoryById,
  findDepartmentByID,
} from "~/db/repository/departments";

type Props = {
  userId?: string;
  id: number;
  name: string;
  departmentId: number | null;
  categoryId: number | null;
};

export function ClassTable({
  id,
  name,
  userId,
  departmentId,
  categoryId,
}: Props) {
  const submit = useSubmit();
  const [opened, { open, close }] = useDisclosure(false);
  const department = findDepartmentByID(departmentId);
  const category = department?.categories.find((v) => v.id === categoryId);

  return (
    <>
      <Table.Tr onClick={open}>
        <Table.Td>{id}</Table.Td>
        <Table.Td>{name}</Table.Td>
        <Table.Td>{department ? department.name : "未設定"}</Table.Td>
        <Table.Td>{category ? category.name : "未設定"}</Table.Td>
      </Table.Tr>
      <Modal opened={opened} onClose={close}>
        <Title>{name}</Title>
        {id}
        {userId ? (
          <Button
            onClick={() => {
              const formData = new FormData();
              formData.append("userId", userId);
              formData.append("classId", id.toString());
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
