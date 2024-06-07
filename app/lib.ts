import { createErr } from "option-t/plain_result";

export const wrapErr = (e: unknown) => {
  if (e instanceof Error) {
    return createErr(e);
  }
  return createErr(new Error(`Unexpected err: ${e}`));
};
