import mongoose from "mongoose";
import { EmailContent, EmailRecipient } from "juno-sdk/build/main/internal/api";
import juno from "juno-sdk";
import { IPost, IUser, Role, Trained } from "./types";
import { PostModel, UserModel } from "./models";

const MONGODB_URI = process.env.DATABASE_URL as string;
const DATABASE_NAME = process.env.DATABASE_NAME || "angels-among-us-dev";
const ONE_DAY = 24 * 60 * 60 * 1000;

juno.init({
    apiKey: process.env.JUNO_API_KEY as string,
    baseURL: process.env.JUNO_BASE_URL as string
})

export async function sendEmail({ bccRecipients, ccRecipients, recipients, content, subject }:
    { subject: string, content: EmailContent[], bccRecipients?: EmailRecipient[], recipients?: EmailRecipient[], ccRecipients?: EmailRecipient[], }) {
    try {
        await juno.email.sendEmail({
            recipients: bccRecipients ?? [],
            bcc: recipients ?? [],
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
        date: { $gt: cutoffDate },
        draft: false,
    })

    return posts
}

export function generateEmailTemplate(posts: IPost[]): string {
    const formatDate = (date: Date): string => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusClass = (status: Trained): string => {
        return status === 'yes' ? 'status-yes' : 'status-no';
    };

    const getStatusText = (status: Trained): string => {
        return status === 'unknown' ? 'unknown' : status;
    };

    const generatePost = (post: IPost): string => `
    <div class="post">
      <div class="post-header">
        <h2 class="post-title">${post.name}</h2>
        <div class="post-date">
          ${formatDate(post.date)}
        </div>
      </div>
      <div class="attribute-group">
        <p class="description">${post.description}</p>
      </div>
      <div class="attribute-group">
        <span class="attribute-label">Basic Info:</span>
        <span class="tag">${post.type}</span>
        <span class="tag">${post.size}</span>
        <span class="tag">${post.gender}</span>
        <span class="tag">${post.age}</span>
      </div>
      <div class="attribute-group">
        <span class="attribute-label">Breed:</span>
        ${post.breed.map(breed => `<span class="tag">${breed}</span>`).join('')}
      </div>
      ${post.temperament.length > 0 ? `
        <div class="attribute-group">
          <span class="attribute-label">Temperament:</span>
          ${post.temperament.map(temp => `<span class="tag">${temp}</span>`).join('')}
        </div>
      ` : ''}
      ${post.medical.length > 0 ? `
        <div class="attribute-group">
          <span class="attribute-label">Medical Info:</span>
          ${post.medical.map(med => `<span class="tag">${med}</span>`).join('')}
        </div>
      ` : ''}
      ${post.behavioral.length > 0 ? `
        <div class="attribute-group">
          <span class="attribute-label">Behavioral Notes:</span>
          ${post.behavioral.map(beh => `<span class="tag">${beh}</span>`).join('')}
        </div>
      ` : ''}
      <div class="attribute-group">
        <span class="attribute-label">Training & Compatibility:</span>
        <div class="status-container">
          <span class="status ${getStatusClass(post.houseTrained)}">
            House Trained: ${getStatusText(post.houseTrained)}
          </span>
          <span class="status ${getStatusClass(post.crateTrained)}">
            Crate Trained: ${getStatusText(post.crateTrained)}
          </span>
          <span class="status ${getStatusClass(post.spayNeuterStatus)}">
            Spayed/Neutered: ${getStatusText(post.spayNeuterStatus)}
          </span>
        </div>
      </div>
      <div class="attribute-group">
        <span class="attribute-label">Gets Along With:</span>
        <div class="status-container">
          <span class="status ${getStatusClass(post.getsAlongWithMen)}">
            Men: ${getStatusText(post.getsAlongWithMen)}
          </span>
          <span class="status ${getStatusClass(post.getsAlongWithWomen)}">
            Women: ${getStatusText(post.getsAlongWithWomen)}
          </span>
          <span class="status ${getStatusClass(post.getsAlongWithOlderKids)}">
            Older Kids: ${getStatusText(post.getsAlongWithOlderKids)}
          </span>
          <span class="status ${getStatusClass(post.getsAlongWithYoungKids)}">
            Young Kids: ${getStatusText(post.getsAlongWithYoungKids)}
          </span>
        </div>
        <div class="status-container" style="margin-top:8px">
          <span class="status ${getStatusClass(post.getsAlongWithLargeDogs)}">
            Large Dogs: ${getStatusText(post.getsAlongWithLargeDogs)}
          </span>
          <span class="status ${getStatusClass(post.getsAlongWithSmallDogs)}">
            Small Dogs: ${getStatusText(post.getsAlongWithSmallDogs)}
          </span>
          <span class="status ${getStatusClass(post.getsAlongWithCats)}">
            Cats: ${getStatusText(post.getsAlongWithCats)}
          </span>
        </div>
      </div>
      ${post.attachments.length > 0 ? `
        <div class="attribute-group">
          <span class="attribute-label">Images:</span>
          <div class="images">
            ${post.attachments.map(attachment => `
              <img src="${attachment}" alt="Pet image" />
            `).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;

    return `
<!DOCTYPE html>
<html dir="ltr" lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daily Foster Posts Update</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style type="text/css">
        body {
            font-family: 'Outfit', system-ui, -apple-system, sans-serif;
            line-height: 1.6;
            color: #2d3748;
            max-width: 800px;
            margin: 0 auto;
            padding: 24px;
            background-color: #f7fafc;
            font-weight: 400;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        h1 {
            color: #2b6cb0;
            font-size: 32px;
            font-weight: 600;
            margin-bottom: 24px;
            letter-spacing: -0.025em;
        }
        .post {
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            margin-bottom: 24px;
            padding: 20px;
            background-color: #ffffff;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            transition: all 0.2s ease;
        }
        .post:hover {
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transform: translateY(-2px);
        }
        .post-header {
            background-color: #ebf8ff;
            padding: 16px;
            margin: -20px -20px 20px -20px;
            border-radius: 8px 8px 0 0;
            border-bottom: 1px solid #bee3f8;
        }
        .post-title {
            font-size: 26px;
            color: #2c5282;
            margin: 0;
            font-weight: 600;
            letter-spacing: -0.02em;
        }
        .post-date {
            color: #4a5568;
            font-size: 14px;
            margin-top: 4px;
            font-weight: 400;
        }
        .description {
            color: #4a5568;
            font-size: 16px;
            line-height: 1.6;
            margin: 12px 0;
            font-weight: 300;
        }
        .attribute-group {
            margin: 16px 0;
            padding: 12px 0;
            border-bottom: 1px solid #edf2f7;
        }
        .attribute-group:last-child {
            border-bottom: none;
        }
        .attribute-label {
            font-weight: 600;
            color: #2d3748;
            font-size: 15px;
            display: block;
            margin-bottom: 8px;
            letter-spacing: -0.01em;
        }
        .tag {
            display: inline-block;
            background-color: #e6f6ff;
            color: #2b6cb0;
            padding: 4px 12px;
            border-radius: 16px;
            margin: 3px;
            font-size: 13px;
            font-weight: 500;
            border: 1px solid #bee3f8;
            transition: all 0.2s ease;
        }
        .status-container {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        .status {
            display: inline-flex;
            align-items: center;
            padding: 4px 12px;
            border-radius: 16px;
            font-size: 13px;
            font-weight: 500;
            transition: all 0.2s ease;
            letter-spacing: 0.01em;
        }
        .status-yes {
            background-color: #c6f6d5;
            color: #276749;
            border: 1px solid #9ae6b4;
        }
        .status-no {
            background-color: #fed7d7;
            color: #9b2c2c;
            border: 1px solid #feb2b2;
        }
        .images {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 12px;
            margin: 12px 0;
        }
        .images img {
            width: 100%;
            height: 150px;
            object-fit: cover;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
            transition: all 0.2s ease;
        }
        .footer {
            margin-top: 24px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            font-size: 13px;
            color: #718096;
            text-align: center;
            font-weight: 300;
        }
    </style>
</head>
<body>
    <h1>Daily Foster Posts Update</h1>
    <p style="color:#4a5568;font-size:16px;margin-bottom:24px;font-weight:300">
        Here are the new foster posts from the last 24 hours:
    </p>
    ${posts.map(post => generatePost(post)).join('\n')}
    <div class="footer">
        <p>This is an automated email for new foster posts. Please do not reply to this email.</p>
    </div>
</body>
</html>
  `;
}
async function sendEmailNotification() {
    const voluneers = await getUsersByRole(Role.Volunteer);
    const recipients = voluneers.map((volunteer: IUser) => {
        return { email: volunteer.email, name: volunteer.name }
    })
    const posts = await getPostsInLastDay();
    console.log(generateEmailTemplate(posts))
    if (posts.length > 0) {
        await sendEmail({
            bccRecipients: [{ name: 'Bits of Good Engineering', email: 'gt.engineering@hack4impact.org' }],
            subject: "Daily Foster Update From Angels Among Us",
            content: [
                { type: "text/html", value: generateEmailTemplate(posts) }
            ]
        })
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