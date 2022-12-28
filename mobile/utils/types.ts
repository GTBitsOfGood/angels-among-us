import { z } from "zod";

export const UserSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email address" }),
  admin: z.boolean(),
});

export type User = z.infer<typeof UserSchema>;
