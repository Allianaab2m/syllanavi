import { Flex, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { HeaderMenu } from "./HeaderMenu";

type Props = {
  name?: string;
};

export function Header({ name }: Props) {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <Flex
      px="md"
      py="sm"
      h="64"
      miw="max-content"
      bg="teal.1"
      align="center"
      justify="space-between"
    >
      <Text component="a" href="/" fw="bold" size="xl">
        Syllanavi
      </Text>
      {name ? (
        <Text component="a" href="/mypage">
          {name}としてログイン中
        </Text>
      ) : (
        <HeaderMenu opened={opened} onOpen={open} onClose={close} />
      )}
    </Flex>
  );
}
