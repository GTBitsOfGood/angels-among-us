# Use an official Node runtime as the parent image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and yarn.lock files to the container
COPY package.json yarn.lock ./

# Copy the rest of the application to the container (not necessary since we will use volumes, but it's a good practice)
COPY . .

# Install application dependencies
RUN yarn

# The command to run the application
CMD ["yarn", "dev"]
