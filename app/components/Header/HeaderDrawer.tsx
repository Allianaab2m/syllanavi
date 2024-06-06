import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
} from "@chakra-ui/react";
import type { MutableRefObject } from "react";
import { RegisterAndLoginButton } from "./RegisterAndLoginButton";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  finalFocusRef?: MutableRefObject<null>;
};
export function HeaderDrawer(props: Props) {
  return (
    <Drawer placement="right" {...props}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerBody>
          <RegisterAndLoginButton direction="column" />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
