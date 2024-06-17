import { Button, Modal, Table, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useSubmit } from "@remix-run/react";

type Props = {
  userId?: string;
  id: number;
  name: string;
};

export function ClassTable({ id, name, userId }: Props) {
  const submit = useSubmit();
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Table.Tr onClick={open}>
        <Table.Td>{id}</Table.Td>
        <Table.Td>{name}</Table.Td>
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
