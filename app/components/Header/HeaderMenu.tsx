import { ActionIcon, Button, Flex, Text } from "@mantine/core";
import { Menu2 } from "tabler-icons-react";
import { LogoutButton } from "../LogoutButton";
import { HeaderDrawer } from "./HeaderDrawer";

type Props = {
  opened: boolean;
  onOpen: () => void;
  onClose: () => void;
  name?: string;
};
export function HeaderMenu({ opened, onOpen, onClose, name }: Props) {
  return (
    <>
      <Flex hiddenFrom="sm">
        <ActionIcon color="dark" variant="transparent" onClick={onOpen}>
          <Menu2 />
        </ActionIcon>
        <HeaderDrawer opened={opened} onClose={onClose} name={name} />
      </Flex>
      <Flex columnGap="8" visibleFrom="sm" align="center">
        {name ? (
          <>
            <Text>{name}としてログイン中</Text>
            <LogoutButton />
          </>
        ) : (
          <>
            <Button color="teal.6" component="a" href="/register">
              新規登録
            </Button>
            <Button
              color="teal.6"
              variant="outline"
              component="a"
              href="/login"
            >
              ログイン
            </Button>
          </>
        )}
      </Flex>
    </>
  );
}
