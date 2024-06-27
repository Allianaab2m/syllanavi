import { ActionIcon, Button, Flex, Text, rem } from "@mantine/core";
import { Id, Login, Menu2 } from "tabler-icons-react";
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
            <Text component="a" href="/mypage">
              {name}としてログイン中
            </Text>
            <LogoutButton />
          </>
        ) : (
          <>
            <Button
              color="teal.6"
              component="a"
              href="/register"
              rightSection={<Id style={{ width: rem(16), height: rem(16) }} />}
            >
              新規登録
            </Button>
            <Button
              color="teal.6"
              variant="outline"
              component="a"
              href="/login"
              rightSection={
                <Login style={{ width: rem(16), height: rem(16) }} />
              }
            >
              ログイン
            </Button>
          </>
        )}
      </Flex>
    </>
  );
}
