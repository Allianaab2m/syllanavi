import { Button, Flex, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Form } from "@remix-run/react";

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
        <Flex gap="sm">
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
      <Button color="teal.6" onClick={open}>
        ログアウト
      </Button>
    </>
  );
}
