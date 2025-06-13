# Use the official Node.js image as base
FROM node:22

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY ./package*.json ./

# Install dependencies
RUN npm install

COPY . ./

CMD ["npx", "tsx", "/app/send-email-notifications.ts"]