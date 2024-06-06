import { ActionIcon, Button, Flex } from "@mantine/core";
import { Menu2 } from "tabler-icons-react";
import { ModalButton } from "../ModalButton";
import { Register } from "../Register";
import { HeaderDrawer } from "./HeaderDrawer";

type Props = {
  opened: boolean;
  onOpen: () => void;
  onClose: () => void;
};
export function HeaderMenu({ opened, onOpen, onClose }: Props) {
  return (
    <>
      <Flex hiddenFrom="sm">
        <ActionIcon color="dark" variant="transparent" onClick={onOpen}>
          <Menu2 />
        </ActionIcon>
        <HeaderDrawer opened={opened} onClose={onClose} />
      </Flex>
      <Flex columnGap="8" visibleFrom="sm">
        <ModalButton
          title="新規登録"
          modalContent={<Register />}
          buttonProps={{ color: "teal.6" }}
        >
          新規登録
        </ModalButton>
        <Button color="teal.6" variant="outline" component="a" href="/login">
          ログイン
        </Button>
      </Flex>
    </>
  );
}
