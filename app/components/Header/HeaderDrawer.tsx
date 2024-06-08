import { Button, Drawer, Stack, Text } from "@mantine/core";
import { LogoutButton } from "../LogoutButton";

type Props = {
  opened: boolean;
  onClose: () => void;
  name?: string;
};
export function HeaderDrawer(props: Props) {
  return (
    <Drawer {...props} position="right">
      {props.name ? (
        <Stack>
          <Text>{props.name}としてログイン中</Text>
          <LogoutButton />
        </Stack>
      ) : (
        <Stack>
          <Text component="a" href="/register" size="xl">
            新規登録
          </Text>
          <Text component="a" href="/login" size="xl">
            ログイン
          </Text>
        </Stack>
      )}
    </Drawer>
  );
}
