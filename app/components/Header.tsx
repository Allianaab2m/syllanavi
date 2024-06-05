import {
  Button,
  ButtonGroup,
  Flex,
  IconButton,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { MdMenu } from "react-icons/md";

export function Header() {
  return (
    <Flex
      bg="teal.100"
      minW="max-content"
      minH="16"
      alignItems="center"
      gap="2"
      px="4"
      py="2"
    >
      <Button variant="link" colorScheme="black">
        <Text fontSize="xl">Syllanavi</Text>
      </Button>
      <Spacer />
      <ButtonGroup display={["none", "contents"]}>
        <Button>新規登録</Button>
        <Button>ログイン</Button>
      </ButtonGroup>
      <IconButton
        aria-label="Menu button"
        display={["contents", "none"]}
        icon={<MdMenu />}
      />
    </Flex>
  );
}
