import { createErr } from "option-t/plain_result";

export const wrapErr = (e: unknown) => {
  if (e instanceof Error) {
    return createErr(e);
  }
  return createErr(new Error(`Unexpected err: ${e}`));
};

export const Day = ["月", "火", "水", "木", "金", "土"] as const;
export const Term = ["前期", "後期"] as const;

export const serializeDay = (day: (typeof Day)[number]) => {
  return Day.findIndex((v) => v === day) + 1;
};

export const deserializeDay = (dayNumber: number) => {
  return Day[dayNumber - 1];
};

export const serializeTerm = (term: (typeof Term)[number]) => {
  return Term.findIndex((v) => v === term) + 1;
};

export const deserializeTerm = (termNumber: number) => {
  return Term[termNumber - 1];
};
