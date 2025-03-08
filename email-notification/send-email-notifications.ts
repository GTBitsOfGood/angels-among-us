import mongoose from "mongoose";
import juno from "juno-sdk";
import { IPost, IUser, Role, Trained } from "./types";
import { PostModel, UserModel } from "./models";
import { EmailContent, EmailRecipient } from "juno-sdk/internal/api";

const DATABASE_URL = process.env.DATABASE_URL as string;
const DATABASE_NAME = process.env.DATABASE_NAME as string;
const JUNO_API_KEY = process.env.JUNO_API_KEY as string;
const JUNO_BASE_URL = process.env.JUNO_BASE_URL as string;
const JUNO_SENDER_EMAIL = process.env.JUNO_SENDER_EMAIL as string;
const JUNO_SENDER_NAME = process.env.JUNO_SENDER_NAME as string;
const ONE_DAY = 24 * 60 * 60 * 1000;

juno.init({
  apiKey: JUNO_API_KEY as string,
  baseURL: JUNO_BASE_URL as string,
});

export async function sendEmail({
  bccRecipients,
  content,
  subject,
}: {
  subject: string;
  content: EmailContent[];
  bccRecipients?: EmailRecipient[];
  recipients?: EmailRecipient[];
  ccRecipients?: EmailRecipient[];
}) {
  const BATCH_SIZE = 50;

  try {
    for (
      let i = 0;
      i < (bccRecipients as EmailRecipient[]).length;
      i += BATCH_SIZE
    ) {
      const limitedBcc = (bccRecipients as EmailRecipient[]).slice(
        i,
        i + BATCH_SIZE
      );
      await juno.email.sendEmail({
        recipients: [
          {
            email: "gt.engineering@hack4impact.org",
            name: "Bits of Good Engineering",
          },
        ],
        bcc: limitedBcc ?? [],
        cc: [],
        sender: {
          email: JUNO_SENDER_EMAIL as string,
          name: JUNO_SENDER_NAME as string,
        },
        subject: subject,
        contents: content,
      });
    }
  } catch (e) {
    console.log(e);
  }
}

async function dbConnect(): Promise<void> {
  if (mongoose.connections[0].readyState) return;
  await mongoose
    .connect(DATABASE_URL, {
      socketTimeoutMS: 360000,
      dbName: DATABASE_NAME,
    })
    .catch((error) => {
      console.error("Unable to connect to database.");
      throw error;
    });
}
async function getUsersByRole(role: Role) {
  await dbConnect();
  return await UserModel.find({ role });
}

async function getPostsInLastDay() {
  const cutoffDate = new Date(Date.now() - ONE_DAY);

  await dbConnect();
  const posts = await PostModel.find({
    date: { $gt: cutoffDate },
    draft: false,
  });

  return posts;
}

export function generateEmailTemplate(posts: IPost[]): string {
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusClass = (status: Trained): string => {
    if (status === "yes") {
      return "background-color: #c6f6d5; color: #276749; border: 1px solid #9ae6b4;";
    }
    return "background-color: #fed7d7; color: #9b2c2c; border: 1px solid #feb2b2;";
  };

  const getStatusText = (status: Trained): string => {
    return status === "unknown" ? "unknown" : status;
  };

  const generatePost = (post: IPost): string => `
    <table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 24px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px;">
      <tr>
        <td style="background-color: #ebf8ff; border-bottom: 1px solid #bee3f8; padding: 16px;">
          <table cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
              <td>
                <h2 style="font-family: 'Arial', sans-serif; font-size: 26px; color: #2c5282; margin: 0; font-weight: 600; letter-spacing: -0.02em;">${
                  post.name
                }</h2>
                <div style="font-family: 'Arial', sans-serif; color: #4a5568; font-size: 14px; margin-top: 4px; font-weight: normal;">${formatDate(
                  post.date
                )}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 0 20px;">
          <table cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
              <td style="font-family: 'Arial', sans-serif; color: #4a5568; font-size: 16px; line-height: 1.6; padding: 12px 0;">${
                post.description
              }</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 0 20px;">
          <table cellspacing="0" cellpadding="0" border="0" width="100%" style="padding: 12px 0; border-bottom: 1px solid #edf2f7;">
            <tr>
              <td>
                <div style="font-family: 'Arial', sans-serif; font-weight: 600; color: #2d3748; font-size: 15px; margin-bottom: 8px;">Basic Info:</div>
                ${[post.type, post.size, post.gender, post.age]
                  .map(
                    (tag) =>
                      `<span style="display: inline-block; background-color: #e6f6ff; color: #2b6cb0; padding: 4px 12px; border-radius: 16px; margin: 3px; font-size: 13px; font-weight: 500; border: 1px solid #bee3f8; font-family: 'Arial', sans-serif;">${tag}</span>`
                  )
                  .join("")}
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 0 20px;">
          <table cellspacing="0" cellpadding="0" border="0" width="100%" style="padding: 12px 0; border-bottom: 1px solid #edf2f7;">
            <tr>
              <td>
                <div style="font-family: 'Arial', sans-serif; font-weight: 600; color: #2d3748; font-size: 15px; margin-bottom: 8px;">Breed:</div>
                ${post.breed
                  .map(
                    (breed) =>
                      `<span style="display: inline-block; background-color: #e6f6ff; color: #2b6cb0; padding: 4px 12px; border-radius: 16px; margin: 3px; font-size: 13px; font-weight: 500; border: 1px solid #bee3f8; font-family: 'Arial', sans-serif;">${breed}</span>`
                  )
                  .join("")}
              </td>
            </tr>
          </table>
        </td>
      </tr>
      ${
        post.temperament.length > 0
          ? `
        <tr>
          <td style="padding: 0 20px;">
            <table cellspacing="0" cellpadding="0" border="0" width="100%" style="padding: 12px 0; border-bottom: 1px solid #edf2f7;">
              <tr>
                <td>
                  <div style="font-family: 'Arial', sans-serif; font-weight: 600; color: #2d3748; font-size: 15px; margin-bottom: 8px;">Temperament:</div>
                  ${post.temperament
                    .map(
                      (temp) =>
                        `<span style="display: inline-block; background-color: #e6f6ff; color: #2b6cb0; padding: 4px 12px; border-radius: 16px; margin: 3px; font-size: 13px; font-weight: 500; border: 1px solid #bee3f8; font-family: 'Arial', sans-serif;">${temp}</span>`
                    )
                    .join("")}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      `
          : ""
      }
      ${
        post.medical.length > 0
          ? `
        <tr>
          <td style="padding: 0 20px;">
            <table cellspacing="0" cellpadding="0" border="0" width="100%" style="padding: 12px 0; border-bottom: 1px solid #edf2f7;">
              <tr>
                <td>
                  <div style="font-family: 'Arial', sans-serif; font-weight: 600; color: #2d3748; font-size: 15px; margin-bottom: 8px;">Medical Info:</div>
                  ${post.medical
                    .map(
                      (med) =>
                        `<span style="display: inline-block; background-color: #e6f6ff; color: #2b6cb0; padding: 4px 12px; border-radius: 16px; margin: 3px; font-size: 13px; font-weight: 500; border: 1px solid #bee3f8; font-family: 'Arial', sans-serif;">${med}</span>`
                    )
                    .join("")}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      `
          : ""
      }
      ${
        post.behavioral.length > 0
          ? `
        <tr>
          <td style="padding: 0 20px;">
            <table cellspacing="0" cellpadding="0" border="0" width="100%" style="padding: 12px 0; border-bottom: 1px solid #edf2f7;">
              <tr>
                <td>
                  <div style="font-family: 'Arial', sans-serif; font-weight: 600; color: #2d3748; font-size: 15px; margin-bottom: 8px;">Behavioral Notes:</div>
                  ${post.behavioral
                    .map(
                      (beh) =>
                        `<span style="display: inline-block; background-color: #e6f6ff; color: #2b6cb0; padding: 4px 12px; border-radius: 16px; margin: 3px; font-size: 13px; font-weight: 500; border: 1px solid #bee3f8; font-family: 'Arial', sans-serif;">${beh}</span>`
                    )
                    .join("")}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      `
          : ""
      }
      <tr>
        <td style="padding: 0 20px;">
          <table cellspacing="0" cellpadding="0" border="0" width="100%" style="padding: 12px 0; border-bottom: 1px solid #edf2f7;">
            <tr>
              <td>
                <div style="font-family: 'Arial', sans-serif; font-weight: 600; color: #2d3748; font-size: 15px; margin-bottom: 8px;">Training & Compatibility:</div>
                <table cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td style="padding: 4px;">
                      <span style="display: inline-block; padding: 4px 12px; border-radius: 16px; font-size: 13px; font-weight: 500; font-family: 'Arial', sans-serif; ${getStatusClass(
                        post.houseTrained
                      )}">
                        House Trained: ${getStatusText(post.houseTrained)}
                      </span>
                    </td>
                    <td style="padding: 4px;">
                      <span style="display: inline-block; padding: 4px 12px; border-radius: 16px; font-size: 13px; font-weight: 500; font-family: 'Arial', sans-serif; ${getStatusClass(
                        post.crateTrained
                      )}">
                        Crate Trained: ${getStatusText(post.crateTrained)}
                      </span>
                    </td>
                    <td style="padding: 4px;">
                      <span style="display: inline-block; padding: 4px 12px; border-radius: 16px; font-size: 13px; font-weight: 500; font-family: 'Arial', sans-serif; ${getStatusClass(
                        post.spayNeuterStatus
                      )}">
                        Spayed/Neutered: ${getStatusText(post.spayNeuterStatus)}
                      </span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 0 20px;">
          <table cellspacing="0" cellpadding="0" border="0" width="100%" style="padding: 12px 0; border-bottom: 1px solid #edf2f7;">
            <tr>
              <td>
                <div style="font-family: 'Arial', sans-serif; font-weight: 600; color: #2d3748; font-size: 15px; margin-bottom: 8px;">Gets Along With:</div>
                <table cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td style="padding: 4px;">
                      <span style="display: inline-block; padding: 4px 12px; border-radius: 16px; font-size: 13px; font-weight: 500; font-family: 'Arial', sans-serif; ${getStatusClass(
                        post.getsAlongWithMen
                      )}">
                        Men: ${getStatusText(post.getsAlongWithMen)}
                      </span>
                    </td>
                    <td style="padding: 4px;">
                      <span style="display: inline-block; padding: 4px 12px; border-radius: 16px; font-size: 13px; font-weight: 500; font-family: 'Arial', sans-serif; ${getStatusClass(
                        post.getsAlongWithWomen
                      )}">
                        Women: ${getStatusText(post.getsAlongWithWomen)}
                      </span>
                    </td>
                    <td style="padding: 4px;">
                      <span style="display: inline-block; padding: 4px 12px; border-radius: 16px; font-size: 13px; font-weight: 500; font-family: 'Arial', sans-serif; ${getStatusClass(
                        post.getsAlongWithOlderKids
                      )}">
                        Older Kids: ${getStatusText(
                          post.getsAlongWithOlderKids
                        )}
                      </span>
                    </td>
                    <td style="padding: 4px;">
                      <span style="display: inline-block; padding: 4px 12px; border-radius: 16px; font-size: 13px; font-weight: 500; font-family: 'Arial', sans-serif; ${getStatusClass(
                        post.getsAlongWithYoungKids
                      )}">
                        Young Kids: ${getStatusText(
                          post.getsAlongWithYoungKids
                        )}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 4px;">
                      <span style="display: inline-block; padding: 4px 12px; border-radius: 16px; font-size: 13px; font-weight: 500; font-family: 'Arial', sans-serif; ${getStatusClass(
                        post.getsAlongWithLargeDogs
                      )}">
                        Large Dogs: ${getStatusText(
                          post.getsAlongWithLargeDogs
                        )}
                      </span>
                    </td>
                    <td style="padding: 4px;">
                      <span style="display: inline-block; padding: 4px 12px; border-radius: 16px; font-size: 13px; font-weight: 500; font-family: 'Arial', sans-serif; ${getStatusClass(
                        post.getsAlongWithSmallDogs
                      )}">
                        Small Dogs: ${getStatusText(
                          post.getsAlongWithSmallDogs
                        )}
                      </span>
                    </td>
                    <td style="padding: 4px;">
                      <span style="display: inline-block; padding: 4px 12px; border-radius: 16px; font-size: 13px; font-weight: 500; font-family: 'Arial', sans-serif; ${getStatusClass(
                        post.getsAlongWithCats
                      )}">
                        Cats: ${getStatusText(post.getsAlongWithCats)}
                      </span>
                    </td>
                    <td></td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;

  return `
<!DOCTYPE html>
<html dir="ltr" lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daily Foster Posts Update</title>
</head>
<body style="font-family: 'Arial', sans-serif; line-height: 1.6; color: #2d3748; margin: 0; padding: 24px; background-color: #f7fafc; font-weight: normal;">
    <table cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 800px; margin: 0 auto;">
        <tr>
            <td>
                <h1 style="color: #2b6cb0; font-size: 32px; font-weight: 600; margin-bottom: 24px; font-family: 'Arial', sans-serif; letter-spacing: -0.025em;">Daily Foster Posts Update</h1>
                <p style="color: #4a5568; font-size: 16px; margin-bottom: 24px; font-weight: normal; font-family: 'Arial', sans-serif;">
                    Here are the new foster posts from the last 24 hours:
                </p>
                ${posts.map((post) => generatePost(post)).join("\n")}
                <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 13px; color: #718096; text-align: center; font-weight: normal; font-family: 'Arial', sans-serif;">
                    <p>This is an automated email for new foster posts. Please do not reply to this email.</p>
                </div>
            </td>
        </tr>
    </table>
</body>
</html>
  `;
}
async function sendEmailNotification() {
  const voluneers = await getUsersByRole(Role.Volunteer);
  const recipients = voluneers.map((volunteer: IUser) => {
    return { email: volunteer.email, name: volunteer.name };
  });
  const posts = await getPostsInLastDay();
  if (posts.length > 0) {
    await sendEmail({
      bccRecipients: recipients,
      subject: "Daily Foster Update From Angels Among Us",
      content: [{ type: "text/html", value: generateEmailTemplate(posts) }],
    });
  }
  return posts.length;
}

sendEmailNotification()
  .then((totalPosts) => {
    if (totalPosts) {
      console.log(`\nScript completed. Emails sent for: ${totalPosts} posts.`);
    } else {
      console.log(`\nScript completed. No emails sent due to no new posts.`);
    }
    process.exit(0);
  })
  .catch((error) => {
    console.error("An error occurred:", error);
    process.exit(1);
  });
