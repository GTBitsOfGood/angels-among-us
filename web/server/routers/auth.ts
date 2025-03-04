import { TRPCError } from "@trpc/server";
import { findAccount } from "../../db/actions/Account";
import {
  createUser,
  findUserByEmail,
  updateUserByUid,
} from "../../db/actions/User";
import { router, procedure } from "../trpc";
import { logUserCreateEvent } from "../../utils/analytics-logger";
import { Role } from "../../utils/types/account";
import { sendJunoEmail } from "../juno";
import { errorCodeMessageMap } from "../../utils/errorCode";

const FACEBOOK_SIGN_IN_PROVIDER = "facebook.com" as const;
const EMAIL_PASSWORD_SIGN_IN_PROVIDER = "password" as const;

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
        const emailVerified =
          ctx.session.firebase.sign_in_provider !==
            EMAIL_PASSWORD_SIGN_IN_PROVIDER || ctx.session.email_verified;

        const user = await findUserByEmail(ctx.session.email);
        const account = await findAccount(ctx.session.email);
        if (user && account) {
          // Subsequent sign-in, authorized account
          const document = await updateUserByUid(ctx.session.uid, {
            role: account.role,
            disabled: false,
            ...(!user.name && { name: ctx.session.name }),
            ...(!user.picture && { picture: ctx.session.picture }),
          });

          return {
            user: document,
            authorized: true,
            emailVerified,
            hasCompletedOnboarding: document!.hasCompletedOnboarding,
          };
        } else if (user && !account) {
          // Subsequent sign-in, unauthorized account (approval request workflow)
          const document = await updateUserByUid(ctx.session.uid, {
            disabled: true,
          });
          return {
            user: document,
            authorized: false,
            emailVerified,
            hasCompletedOnboarding: false,
          };
        } else if (!user && account) {
          // First-time sign-in, authorized account (invitation workflow)
          const document = await createUser({
            uid: ctx.session.uid,
            email: ctx.session.email,
            verifiedByAdmin: true,
            role: account.role,
            hasCompletedOnboarding: false,
            disabled: false,
            name: ctx.session.name,
            picture: ctx.session.picture,
          });
          await logUserCreateEvent(account.role);
          return {
            user: document,
            authorized: true,
            emailVerified,
            hasCompletedOnboarding: false,
          };
        } else {
          // First-time sign-in, unauthorized account (approval request workflow)
          const document = await createUser({
            uid: ctx.session.uid,
            email: ctx.session.email,
            verifiedByAdmin: false,
            role: Role.Volunteer,
            hasCompletedOnboarding: false,
            disabled: true,
            name: ctx.session.name,
            picture: ctx.session.picture,
          });

          // TODO: send email to manager
          const emailContent = `A new user signed up: ${ctx.session.email}, please go to admin request management portal to approve/decline their request.`;

          if (process.env.NEXT_PUBLIC_CONTEXT !== "production") {
            await sendJunoEmail(
              emailContent,
              "Angels Among Us New User Sign-in Request",
              [
                {
                  email: "gt.engineering@hack4impact.org",
                  name: "Bits of Good Engineering",
                },
              ],
              false
            );
          }
          return {
            user: document,
            authorized: false,
            emailVerified,
            hasCompletedOnboarding: false,
          };
        }
      } catch (e) {
        if (e instanceof TRPCError) throw e;
        else
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An unexpected error occurred",
            cause: e,
          });
      }
    }),
});
