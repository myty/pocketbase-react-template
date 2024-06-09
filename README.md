# PocketBase + React (Template)

This is a template for a fullstack application using PocketBase and React.
It also includes a devcontainer for easy development.
For the best experience following the instructions in the devcontainer section is recommended.

## Getting Started

1. (non-devcontainer) Install prerequisites: PocketBase, Node.js
   - Install PocketBase: <https://pocketbase.io/docs/>
   - Install Node.js: <https://nodejs.org/en/download/>
   - Enable corepack: `corepack enable`

2. `pnpm install` in the root directory
3. `pnpm run dev` to start the development server
   - The frontend sample application will be running at <http://localhost:5173>
   - PocketBase admin console be running at <http://localhost:8090/_/>
4. Login to PocketBase admin console and create an admin user
5. Create new user within the PocketBase admin console
6. Login to the frontend application with the created user
7. To login via the Google provider, you need to first create a Google OAuth2 client ID and secret.
   - Create a new project in the Google Cloud Console: <https://console.cloud.google.com/projectcreate>
   - Create OAuth2 credentials: <https://console.cloud.google.com/apis/credentials>
   - Add the client ID and secret to the PocketBase admin console.
   - __Enable the Google provider in the PocketBase admin console.__
