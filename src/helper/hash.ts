import * as bcrypt from 'bcrypt';

export const HashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

export const VerifyPassword = async (
  hash: string,
  password: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};
