import juno from 'juno-sdk';
import { EmailRecipient } from 'juno-sdk/build/main/internal/api';

const JUNO_API_KEY = process.env.JUNO_API_KEY as string;
const JUNO_BASE_URL = process.env.JUNO_BASE_URL as string;
const JUNO_SENDER_EMAIL = process.env.JUNO_SENDER_EMAIL as string;
const JUNO_SENDER_NAME = process.env.JUNO_SENDER_NAME as string;

juno.init({
    apiKey: JUNO_API_KEY as string,
    baseURL: JUNO_BASE_URL as string,
});

export const sendJunoEmail = async (emailContent: string, emailSubject: string, emailRecipient: EmailRecipient[], throwError?: boolean) => {
    try {
        await juno.email.sendEmail({
            recipients: emailRecipient,
            bcc: [],
            cc: [],
            sender: {
                email: JUNO_SENDER_EMAIL as string,
                name: JUNO_SENDER_NAME as string,
            },
            subject: emailSubject,
            contents: [{ type: "text/html", value: emailContent }],
        });
    } catch (e) {
        if (throwError) {
            throw e;
        }
    }

}