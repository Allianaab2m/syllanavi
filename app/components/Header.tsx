import {
  Button,
  ButtonGroup,
  Flex,
  Hide,
  IconButton,
  Show,
  Spacer,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef } from "react";
import { MdMenu } from "react-icons/md";
import { HeaderDrawer } from "./HeaderDrawer";
import { RegisterAndLoginButton } from "./RegisterAndLoginButton";

export function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef(null);
  return (
    <Flex
      bg="teal.100"
      minW="max-content"
      minH="16"
      alignItems="center"
      px="4"
      py="2"
    >
      <Button variant="link" colorScheme="black">
        <Text fontSize="xl">Syllanavi</Text>
      </Button>
      <Spacer />
      <Show above="sm">
        <RegisterAndLoginButton />
      </Show>
      <Hide above="sm">
        <IconButton
          aria-label="Menu button"
          icon={<MdMenu />}
          ref={btnRef}
          onClick={onOpen}
        />
        <HeaderDrawer
          isOpen={isOpen}
          onClose={onClose}
          finalFocusRef={btnRef}
        />
      </Hide>
    </Flex>
  );
}
