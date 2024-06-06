import { Drawer, Stack, Text } from "@mantine/core";

type Props = {
  opened: boolean;
  onClose: () => void;
};
export function HeaderDrawer(props: Props) {
  return (
    <Drawer {...props} position="right">
      <Stack>
        <Text component="a" href="/register" size="xl">
          新規登録
        </Text>
        <Text component="a" href="/login" size="xl">
          ログイン
        </Text>
      </Stack>
    </Drawer>
  );
}
