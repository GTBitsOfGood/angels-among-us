# Use an official Node runtime as the parent image
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and yarn.lock files to the container
COPY web/package.json web/yarn.lock ./

# Install application dependencies
RUN yarn

# Copy the rest of the application to the container (not necessary since we will use volumes, but it's a good practice)
COPY web/ .

# The command to run the application
CMD ["yarn", "dev"]
