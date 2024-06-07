import { Drawer, Stack, Text } from "@mantine/core";
import { ModalButton } from "../ModalButton";
import { Register } from "../Register";

type Props = {
  opened: boolean;
  onClose: () => void;
};
export function HeaderDrawer(props: Props) {
  return (
    <Drawer {...props} position="right">
      <Stack>
        <ModalButton
          title="新規登録"
          modalContent={<Register />}
          buttonProps={{ size: "lg", color: "dark", variant: "transparent" }}
        >
          新規登録
        </ModalButton>
        <Text component="a" href="/login" size="xl">
          ログイン
        </Text>
      </Stack>
    </Drawer>
  );
}
