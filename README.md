# Angels Among Us

## Overview

Angels Among Us's mission is to save animals from shelters and owner surrenders. The purpose of this tool is to decouple the placement process of foster animals from the nonprofit's current platform, allowing quicker and improved matching of fosters to volunteers.

## Repo Walkthrough

Visit [this](https://www.notion.so/gtbitsofgood/Repo-Walkthrough-64fad02c388449bfafddede9870ca190) Notion page.

## Onboarding

### MongoDB

Install [MongoDB Community Server](https://www.mongodb.com/docs/manual/administration/install-community/) to host a local instance of MongoDB. It may also be helpful to download [MongoDB Compass](https://www.mongodb.com/try/download/compass#compass) to view the state of your database.

### Dependencies

Run `yarn` in the root directory of the repository. If you get an error specifying that the command is not found, install yarn:

```zsh
npm install --global yarn
```

then attempt `yarn` again.

Run the following commands.

```zsh
cd web
yarn
```

These commands should have installed all necessary dependencies for your project to run.

### Environment Variables

In the `web` directory, run the following commands:

```
yarn secrets
```

You should be prompted for a master password. Ask your Engineering leadership to continue. Once the password has been verified, your `.env` file should have been created automatically for you.

### Development

To start the Next.js development server, run:

```
yarn dev
```

## Code Formatting

Install and enable [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) in VSCode. This repository is also configured with a pre-commit hook that automatically formats any code you commit to ensure formatting consistency throughout the codebase.
