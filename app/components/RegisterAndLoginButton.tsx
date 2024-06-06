import { Button, ButtonGroup } from "@chakra-ui/react";

type Props = {
  direction?: "row" | "column";
};

export function RegisterAndLoginButton({ direction = "row" }: Props) {
  return (
    <ButtonGroup
      spacing={direction === "column" ? "0" : "0.5rem"}
      rowGap="2"
      flexDirection={direction}
      colorScheme={direction === "column" ? undefined : "teal"}
    >
      <Button variant={direction === "column" ? "link" : "solid"}>
        新規登録
      </Button>
      <Button variant={direction === "column" ? "link" : "outline"}>
        ログイン
      </Button>
    </ButtonGroup>
  );
}
