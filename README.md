# Angels Among Us

## Overview

Angels Among Us's mission is to save animals from shelters and owner surrenders. The purpose of this tool is to decouple the placement process of foster animals from the nonprofit's current platform, allowing quicker and improved matching of fosters to volunteers.

## Repo Walkthrough

Visit [this](https://www.notion.so/gtbitsofgood/Repo-Walkthrough-64fad02c388449bfafddede9870ca190) Notion page.

## Setup

### Using Docker (recommended)

> For those that use WSL on Windows, there are known bugs that can prevent the web app from connecting to your Mongo database. It is strongly encouraged that you set up the repository using Docker.

1. Download [MongoDB Compass](https://www.mongodb.com/try/download/compass#compass) to view your database documents in a GUI.

2. Run `yarn` in the root directory of the repository. These dependencies are used to automatically run some useful scripts when you commit your code. If you get an error specifying that the command is not found, install yarn:

   ```sh
   npm install --global yarn
   ```

   then attempt `yarn` again.

3. Acquire the `.env` file by navigating to the `web` directory and running:

   ```zsh
   yarn secrets
   ```

   You will need to obtain a password from your engineering leadership to complete this process. If you are on Windows, contact your engineering leadership to manually paste the text content into an `.env` file into the `web` directory.

4. Boot up the Docker containers:

   ```zsh
   docker-compose up -d
   ```

   This may take a while on your first build.

   To stop your Docker containers and remove their processes, run:

   ```zsh
   docker-compose down
   ```

   You can see currently running containers with `docker ps -a`.

5. Once everything has spun up successfully, connect to your database on MongoDB compass with the connection URL:

   ```zsh
   mongodb://localhost:30001/?directConnection=true
   ```

   Keep in mind that our Docker instance of MongoDB runs on a different port (30001) to prevent collisions with a local instance of MongoDB, if you have that installed (which runs on 27017 by default).

6. Add a document to the `accounts` collection, with email and role fields like this:

   ```js
    {
      _id: ...,
      email: "YOUR_EMAIL_HERE",
      role: "admin"
    }
   ```

   The value of the email field should be the email address you will be logging in with via gmail. You have now added yourself as a valid account with an admin role.

7. Navigate to `localhost:3000` using your web browser. Click "Sign in with Google" and log into using the email you used to make the `account` document.

### Manual setup

1. Install [MongoDB Community Server](https://www.mongodb.com/docs/manual/administration/install-community/) to host a local instance of MongoDB. Download [MongoDB Compass](https://www.mongodb.com/try/download/compass#compass) to view the state of your database using a GUI.

2. Run `yarn` in the root directory of the repository. If you get an error specifying that the command is not found, install yarn:

   ```zsh
   npm install --global yarn
   ```

   then attempt `yarn` again.

   Run the following commands.

   ```zsh
   cd web
   yarn
   ```

   You have now installed all the dependencies required to run the project.

3. Acquire the `.env` file by navigating to the `web` directory and running:

   ```zsh
   yarn secrets
   ```

   You will need to obtain a password from your engineering leadership to complete this process. If you are on Windows, contact your engineering leadership to manually paste the text content into an `.env` file into the `web` directory.

4. Connect to your MongoDB database using MongoDB compass. Use the connection URL:

   ```zsh
   mongodb://localhost:27017/
   ```

   Create a document within the `accounts` collection with the fields:

   ```js
    {
      _id: ...,
      email: "YOUR_EMAIL_HERE",
      role: "admin"
    }
   ```

   The value of the email field should be the email address you will be logging in with via gmail. You have now added yourself as a valid account with an admin role.

5. Configure MongoDB session transactions using [this](https://www.notion.so/gtbitsofgood/MongoDB-Transactions-Setup-42d280055f3b45beb6cea350882ab7b9?pvs=4) Notion doc.

6. Start the Next.js development server by running:

   ```zsh
   yarn dev
   ```

   in the `web` directory.

7. Navigate to `localhost:3000` using your web browser. Click "Sign in with Google" and log into using the email you used to make the `account` document.

## Testing

We use [jest](https://jestjs.io/docs/getting-started) for testing. See the `web/__tests__` directory for our unit and integration tests. Currently, our tests are mostly limited to testing backend functionality.

To run all test suites, navigate to the `web` directory and run `yarn jest`. To generate a coverage report, run:

```zsh
yarn jest --coverage --collectCoverageFrom='./**/*.{ts,tsx}'
```

## Code Formatting

Install and enable [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) in VSCode. This repository is also configured with a pre-commit hook that automatically formats any code you commit to ensure formatting consistency throughout the codebase.
