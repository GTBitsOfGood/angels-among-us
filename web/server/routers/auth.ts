import { TRPCError } from "@trpc/server";
import { findAccount } from "../../db/actions/Account";
import {
  createUser,
  findUserByEmail,
  updateUserByUid,
} from "../../db/actions/User";
import { router, procedure } from "../trpc";

const FACEBOOK_SIGN_IN_PROVIDER = "facebook.com" as const;

export const authRouter = router({
  signIn: procedure
    // Firebase displayName needed to populate first-time sign in User
    .query(async ({ ctx }) => {
      try {
        if (!ctx.session.email) {
          if (
            ctx.session.firebase.sign_in_provider === FACEBOOK_SIGN_IN_PROVIDER
          ) {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message:
                "Your Facebook account is missing a primary email. Ensure that a primary email is set and verified.",
            });
          }
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Not authenticated",
          });
        }

        const user = await findUserByEmail(ctx.session.email);
        const account = await findAccount(ctx.session.email);

        if (user && account) {
          // Subsequent sign-in, authorized account
          const document = await updateUserByUid(ctx.session.uid, {
            role: account.role,
            disabled: false,
          });

          return {
            user: document,
            authorized: true,
            hasCompletedOnboarding: document!.hasCompletedOnboarding,
          };
        } else if (user && !account) {
          // Subsequent sign-in, unauthorized account
          await updateUserByUid(ctx.session.uid, {
            disabled: true,
          });
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message:
              "You are not permitted to log into this site. Ensure that the account you are logging in with has been given access to the tool.",
          });
        } else if (!user && account) {
          // First-time sign-in, authorized account
          const document = await createUser({
            uid: ctx.session.uid,
            email: ctx.session.email,
            role: account.role,
            hasCompletedOnboarding: false,
            disabled: false,
          });
          return {
            user: document,
            authorized: true,
            hasCompletedOnboarding: false,
          };
        } else {
          // First-time sign-in, unauthorized
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message:
              "You are not permitted to log into this site. Ensure that the account you are logging in with has the correct email address.",
          });
        }
      } catch (e) {
        if (e instanceof TRPCError) throw e;
        else
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An unexpected error occurred",
          });
      }
    }),
});
