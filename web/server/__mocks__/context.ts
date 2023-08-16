import type { inferAsyncReturnType } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { IUser } from "../../utils/types/user";
import { faker } from "@faker-js/faker";
import { Role } from "../../utils/types/account";

faker.seed(0);

export const callingUser: IUser = {
  name: faker.person.fullName(),
  email: faker.internet.email(),
  uid: faker.string.alphanumeric(28),
  role: faker.helpers.arrayElement(Object.values(Role)),
  disabled: faker.datatype.boolean(),
};

interface CreateInnerContextOptions extends Partial<CreateNextContextOptions> {
  session: DecodedIdToken | null;
}

export async function createContextInner(opts?: CreateInnerContextOptions) {
  return {
    session: opts?.session ?? {
      email: callingUser.email,
      uid: callingUser.uid,
    },
  };
}

export async function createContext(opts: CreateNextContextOptions) {
  const contextInner = await createContextInner();

  return {
    ...contextInner,
    req: opts.req,
    res: opts.res,
  };
}
export type Context = inferAsyncReturnType<typeof createContextInner>;
