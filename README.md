# LuxorRepo

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ Your new, shiny [Nx workspace](https://nx.dev) is almost ready ✨.

[Learn more about this workspace setup and its capabilities](https://nx.dev/nx-api/node?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or run `npx nx graph` to visually explore what was created. Now, let's get you up to speed!

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended) or npm
- PostgreSQL (for database)

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment files (see Environment Configuration section below)
cp apps/bidding-api/.env.example apps/bidding-api/.env
cp apps/bidding-ui/.env.example apps/bidding-ui/.env

# Start both applications
npx nx run-many --targets=serve,dev --projects=bidding-api,bidding-ui
```

### Access URLs

- **Frontend (bidding-ui)**: http://localhost:3000
- **Backend (bidding-api)**: http://localhost:3001/api

## 🔧 Environment Configuration

This project uses environment-specific configuration files for both the API and UI applications.

### Environment Files Structure

```
apps/
├── bidding-api/
│   ├── .env                 # Base configuration
│   ├── .env.development     # Development-specific settings
│   └── .env.production      # Production-specific settings
└── bidding-ui/
    ├── .env                 # Base configuration
    ├── .env.development     # Development-specific settings
    └── .env.production      # Production-specific settings
```

### Bidding API Environment Variables

#### Base Configuration (`.env`)

```bash
# Server Configuration
NODE_ENV=development
PORT=3001
API_PREFIX=api

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=luxor_bidding
DB_USER=postgres
DB_PASSWORD=password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=debug
```

#### Development Configuration (`.env.development`)

```bash
# Additional development settings
DEBUG=true
ENABLE_SWAGGER=true
ENABLE_CORS=true
DB_NAME=luxor_bidding_dev
JWT_SECRET=dev-jwt-secret-key
```

#### Production Configuration (`.env.production`)

```bash
# Production-specific settings
NODE_ENV=production
DEBUG=false
ENABLE_SWAGGER=false
LOG_LEVEL=info
DB_HOST=your-production-db-host
DB_NAME=luxor_bidding_prod
DB_USER=your-production-user
DB_PASSWORD=your-production-password
JWT_SECRET=your-production-jwt-secret-key
CORS_ORIGIN=https://your-production-domain.com
```

### Bidding UI Environment Variables

#### Base Configuration (`.env`)

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_NAME=Luxor Bidding
NEXT_PUBLIC_APP_VERSION=1.0.0

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_DEBUG=true
```

#### Development Configuration (`.env.development`)

```bash
# Development-specific settings
NEXT_PUBLIC_APP_NAME=Luxor Bidding (Dev)
NEXT_PUBLIC_ENABLE_HOT_RELOAD=true
NEXT_PUBLIC_ENABLE_DEV_TOOLS=true
```

#### Production Configuration (`.env.production`)

```bash
# Production-specific settings
NEXT_PUBLIC_API_URL=https://your-production-api-domain.com/api
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_DEBUG=false
NEXT_PUBLIC_ENABLE_HOT_RELOAD=false
NEXT_PUBLIC_ENABLE_DEV_TOOLS=false
```

### Environment Loading Priority

The applications load environment variables in the following order (later files override earlier ones):

1. `.env` (base configuration)
2. `.env.development` (when `NODE_ENV=development`)
3. `.env.production` (when `NODE_ENV=production`)
4. `.env.local` (local overrides, not committed to git)

### Setting Up Environment Files

1. **Copy the template files:**

   ```bash
   cp apps/bidding-api/.env apps/bidding-api/.env.local
   cp apps/bidding-ui/.env apps/bidding-ui/.env.local
   ```

2. **Update the values** in `.env.local` files with your specific configuration

3. **For production deployment**, ensure you set the appropriate production values in your deployment environment

### Security Notes

- Never commit sensitive information like database passwords or JWT secrets to version control
- Use `.env.local` files for local development overrides
- In production, use your deployment platform's environment variable management
- Regularly rotate JWT secrets and database passwords

## Finish your remote caching setup

[Click here to finish setting up your workspace!](https://cloud.nx.app/connect/Wcyg5kW8aW)

## Run tasks

To run the dev server for your app, use:

```sh
npx nx serve bidding-api
```

To create a production bundle:

```sh
npx nx build bidding-api
```

To see all available targets to run for a project, run:

```sh
npx nx show project bidding-api
```

These targets are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.

[More about running tasks in the docs &raquo;](https://nx.dev/features/run-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Add new projects

While you could add new projects to your workspace manually, you might want to leverage [Nx plugins](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) and their [code generation](https://nx.dev/features/generate-code?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) feature.

Use the plugin's generator to create new projects.

To generate a new application, use:

```sh
npx nx g @nx/node:app demo
```

To generate a new library, use:

```sh
npx nx g @nx/node:lib mylib
```

You can use `npx nx list` to get a list of installed plugins. Then, run `npx nx list <plugin-name>` to learn about more specific capabilities of a particular plugin. Alternatively, [install Nx Console](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) to browse plugins and generators in your IDE.

[Learn more about Nx plugins &raquo;](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) | [Browse the plugin registry &raquo;](https://nx.dev/plugin-registry?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

[Learn more about Nx on CI](https://nx.dev/ci/intro/ci-with-nx#ready-get-started-with-your-provider?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Useful links

Learn more:

- [Learn more about this workspace setup](https://nx.dev/nx-api/node?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Learn about Nx on CI](https://nx.dev/ci/intro/ci-with-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Releasing Packages with Nx release](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [What are Nx plugins?](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

And join the Nx community:

- [Discord](https://go.nx.dev/community)
- [Follow us on X](https://twitter.com/nxdevtools) or [LinkedIn](https://www.linkedin.com/company/nrwl)
- [Our Youtube channel](https://www.youtube.com/@nxdevtools)
- [Our blog](https://nx.dev/blog?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
