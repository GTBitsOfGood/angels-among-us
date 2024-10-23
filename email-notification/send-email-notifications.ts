import mongoose from "mongoose";
import { EmailContent, EmailRecipient } from "juno-sdk/build/main/internal/api";
import juno from "juno-sdk";
import { IUser, Role } from "./types";
import { PostModel, UserModel } from "./models";

const MONGODB_URI = process.env.DATABASE_URL || "mongodb://localhost:27017";
const DATABASE_NAME = process.env.DATABASE_NAME || "angels-among-us";
const ONE_DAY = 24 * 60 * 60 * 1000;

juno.init({
    apiKey: process.env.JUNO_API_KEY as string,
    baseURL: process.env.JUNO_BASE_URL as string
})

export async function sendEmail({ bccRecipients, ccRecipients, recipients, content, subject }:
    { subject: string, content: EmailContent[], bccRecipients?: EmailRecipient[], recipients?: EmailRecipient[], ccRecipients?: EmailRecipient[], }) {
    try {
        await juno.email.sendEmail({
            recipients: recipients ?? [],
            bcc: bccRecipients ?? [],
            cc: ccRecipients ?? [],
            sender: {
                email: process.env.JUNO_SENDER_EMAIL as string,
                name: process.env.JUNO_SENDER_NAME as string
            },
            subject: subject,
            contents: content
        })
    } catch (e) {
        console.log(e)
    }
}

async function dbConnect(): Promise<void> {
    if (mongoose.connections[0].readyState) return;
    await mongoose
        .connect(MONGODB_URI, {
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
    const cutoffDate = new Date(
        Date.now() - ONE_DAY
    );

    await dbConnect();
    const posts = await PostModel.find({
        date: { $lt: cutoffDate },
        draft: false,
    })

    return posts
}

async function sendEmailNotification() {
    const voluneers = await getUsersByRole(Role.Volunteer);
    const recipients = voluneers.map((volunteer: IUser) => {
        return { email: volunteer.email, name: volunteer.name }
    })
    const posts = await getPostsInLastDay();

    if (posts.length > 0) {
        await sendEmail({ bccRecipients: [{ name: 'Bits of Good Engineering', email: 'gt.engineering@hack4impact.org' }], subject: "See Today's Foster Posts From Angels Among Us", content: [] })
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