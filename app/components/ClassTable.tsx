import { Modal, Table } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

type Props = {
  id: number;
  name: string;
};
export function ClassTable({ id, name }: Props) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Table.Tr onClick={open}>
        <Table.Td>{id}</Table.Td>
        <Table.Td>{name}</Table.Td>
      </Table.Tr>
      <Modal opened={opened} onClose={close}>
        {id}
      </Modal>
    </>
  );
}
