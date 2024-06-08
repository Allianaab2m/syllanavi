import pkg from "bcryptjs";
const { compare, hash } = pkg;
export const checkPassword = async (
  password: string,
  hash: string,
): Promise<boolean> => await compare(password, hash);

export const hashPassword = async (password: string): Promise<string> =>
  await hash(password, 10);
