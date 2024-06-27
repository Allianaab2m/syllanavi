import { Button, Flex, Modal, Text, rem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Form } from "@remix-run/react";
import { Logout } from "tabler-icons-react";

export function LogoutButton() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal
        title={
          <Text size="lg" fw="bold">
            ログアウトします。よろしいですか？
          </Text>
        }
        opened={opened}
        onClose={close}
        withCloseButton={false}
        centered
      >
        <Flex gap="sm" justify="center">
          <Form method="POST" action="/resources/logout" navigate={false}>
            <Button color="red.6" type="submit">
              ログアウト
            </Button>
          </Form>
          <Button color="gray" onClick={close}>
            キャンセル
          </Button>
        </Flex>
      </Modal>
      <Button
        color="teal.6"
        onClick={open}
        rightSection={<Logout style={{ width: rem(16), height: rem(16) }} />}
      >
        ログアウト
      </Button>
    </>
  );
}
