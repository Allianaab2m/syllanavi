import { Group, Table, UnstyledButton, Text, Center, rem } from "@mantine/core";
import type React from "react";
import { ChevronDown, ChevronUp, Selector } from "tabler-icons-react";

export interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
}

export function Th({ children, sorted, onSort }: ThProps) {
  return (
    <Table.Th>
      <UnstyledButton onClick={onSort}>
        <Group justify="space-between">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center>
            <Selector style={{ width: rem(16), height: rem(16) }} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}
