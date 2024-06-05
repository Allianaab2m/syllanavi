import {
  Button,
  ButtonGroup,
  Flex,
  IconButton,
  Spacer,
  Text,
} from "@chakra-ui/react";

export function Header() {
  return (
    <Flex
      bg="teal.100"
      minWidth="max-content"
      alignItems="center"
      gap="2"
      px="4"
      py="2"
    >
      <Button variant="link" colorScheme="black">
        <Text fontSize="xl">Syllanavi</Text>
      </Button>
      <Spacer />
      <ButtonGroup visibility={["hidden", "visible"]}>
        <Button>新規登録</Button>
        <Button>ログイン</Button>
      </ButtonGroup>
      {/* <IconButton visibility={["visible", "hidden"]} icon={}/> */}
    </Flex>
  );
}
