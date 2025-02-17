import { TRPCError } from "@trpc/server";
import { findAccount } from "../../db/actions/Account";
import juno from "juno-sdk";
import {
  createUser,
  findUserByEmail,
  updateUserByUid,
} from "../../db/actions/User";
import { router, procedure } from "../trpc";
import { logUserCreateEvent } from "../../utils/analytics-logger";
import { Role } from "../../utils/types/account";

const FACEBOOK_SIGN_IN_PROVIDER = "facebook.com" as const;
const JUNO_API_KEY = process.env.JUNO_API_KEY as string;
const JUNO_BASE_URL = process.env.JUNO_BASE_URL as string;
const JUNO_SENDER_EMAIL = process.env.JUNO_SENDER_EMAIL as string;
const JUNO_SENDER_NAME = process.env.JUNO_SENDER_NAME as string;

juno.init({
  apiKey: JUNO_API_KEY as string,
  baseURL: JUNO_BASE_URL as string,
});

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
            ...(!user.name && { name: ctx.session.name }),
            ...(!user.picture && { picture: ctx.session.picture }),
          });

          return {
            user: document,
            authorized: true,
            hasCompletedOnboarding: document!.hasCompletedOnboarding,
          };
        } else if (user && !account) {
          // Subsequent sign-in, unauthorized account (approval request workflow)
          await updateUserByUid(ctx.session.uid, {
            disabled: true,
          });
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message:
              "You are not permitted to log into this site. Please try again after your request for access has been approved.",
          });
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
          await juno.email.sendEmail({
            recipients: [
              {
                email: "gt.engineering@hack4impact.org",
                name: "Bits of Good Engineering",
              },
            ],
            bcc: [],
            cc: [],
            sender: {
              email: JUNO_SENDER_EMAIL as string,
              name: JUNO_SENDER_NAME as string,
            },
            subject: "Angels Among Us New User Sign-in Request",
            contents: [{ type: "text/html", value: emailContent }],
          });

          throw new TRPCError({
            code: "UNAUTHORIZED",
            message:
              "You are not permitted to log into this site. Please try again after your request for access has been approved.",
          });
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
