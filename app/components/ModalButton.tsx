import type { ButtonProps } from "@mantine/core";
import { Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import type { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
  modalContent: ReactNode;
  buttonProps?: ButtonProps;
};

export function ModalButton({
  title,
  children,
  modalContent,
  buttonProps,
}: Props) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal title={title} opened={opened} onClose={close} centered>
        {modalContent}
      </Modal>
      <Button {...buttonProps} onClick={open}>
        {children}
      </Button>
    </>
  );
}
