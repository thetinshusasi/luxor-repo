# LuxorRepo

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ Your new, shiny [Nx workspace](https://nx.dev) is almost ready ✨.

[Learn more about this workspace setup and its capabilities](https://nx.dev/nx-api/node?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or run `npx nx graph` to visually explore what was created. Now, let's get you up to speed!

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended) or npm
- Docker and Docker Compose (for database)

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment files (see Environment Configuration section below)
cp apps/bidding-api/.env.example apps/bidding-api/.env
cp apps/bidding-ui/.env.example apps/bidding-ui/.env

# Start database and both applications
npx nx run bidding-api:dev-full
```

## 🏃‍♂️ Local Development Setup

Follow these steps to run the project locally:

### Prerequisites

1. **Make sure Docker, pnpm, and Node.js are installed on your machine**
   - Docker and Docker Compose
   - pnpm (recommended package manager)
   - Node.js (v18 or higher)

### Step-by-Step Setup

2. **Start Docker application**

   ```bash
   # Make sure Docker is running on your system
   docker --version
   docker-compose --version
   ```

3. **Navigate to the API directory and run migrations**

   ```bash
   cd apps/bidding-api
   pnpm migration:run
   ```

4. **Move back to the base directory and start the backend**

   ```bash
   cd ../..  # Return to project root
   npx nx serve bidding-api
   ```

   Run this in one terminal window.

5. **Start the frontend in another terminal**
   ```bash
   npx nx serve bidding-ui
   ```
   Run this in a separate terminal window.

### Important Notes

⚠️ **Database Reset Warning**: Every time you restart the backend server, the database is cleared and reseeded.

**To handle this:**

- Make sure to go to the login page in the frontend to create the updated token
- Or use the login API to get the updated token
- This ensures you have valid authentication for the fresh database

### Access URLs

- **Frontend (bidding-ui)**: http://localhost:4200
- **Backend (bidding-api)**: http://localhost:3001/api
- **PostgreSQL Database**: localhost:5432
- **pgAdmin**: http://localhost:5050 (admin@luxor.com / admin)

### Docker Commands

The project includes Docker Compose setup for PostgreSQL and pgAdmin. Use these Nx targets:

```bash
# Start PostgreSQL and pgAdmin
npx nx run bidding-api:db-up

# Stop database services
npx nx run bidding-api:db-down

# View database logs
npx nx run bidding-api:db-logs

# Restart database services
npx nx run bidding-api:db-restart

# Clean up (removes volumes)
npx nx run bidding-api:db-clean

# Stop database services
npx nx run bidding-api:db-kill-ports

# Full development setup (DB + API + UI)
npx nx run bidding-api:dev-full
```

### Access URLs

- **Frontend (bidding-ui)**: http://localhost:4200
- **Backend (bidding-api)**: http://localhost:3001/api
- **PostgreSQL Database**: localhost:5432
- **pgAdmin**: http://localhost:5050 (admin@luxor.com / admin)

## 🗄️ pgAdmin Configuration

### Accessing pgAdmin

1. **Start the database services:**

   ```bash
   npx nx run bidding-api:db-up
   ```

2. **Access pgAdmin web interface:**
   - URL: http://localhost:5050
   - Email: admin@luxor.com
   - Password: admin

### Setting Up Database Connection

After logging into pgAdmin, follow these steps to connect to the PostgreSQL database:

1. **Right-click on "Servers"** in the left sidebar
2. **Select "Register" → "Server..."**
3. **Fill in the connection details:**

#### General Tab

- **Name**: Luxor Bidding Database (or any name you prefer)

#### Connection Tab

- **Host name/address**: `luxor-postgres` (container name)
- **Port**: `5432`
- **Maintenance database**: `luxor_bidding`
- **Username**: `postgres`
- **Password**: `password`

#### Advanced Tab (Optional)

- **DB restriction**: Leave empty for access to all databases
- **SSL mode**: `Prefer` (for development)

### Connection Details Summary

| Parameter    | Value            |
| ------------ | ---------------- |
| **Host**     | `luxor-postgres` |
| **Port**     | `5432`           |
| **Database** | `luxor_bidding`  |
| **Username** | `postgres`       |
| **Password** | `password`       |

### Environment Variables

You can customize pgAdmin settings using these environment variables:

```bash
# pgAdmin Configuration
PGADMIN_EMAIL=admin@luxor.com
PGADMIN_PASSWORD=admin
PGADMIN_PORT=5050
```

### Troubleshooting

**If you can't connect from pgAdmin:**

1. **Check if containers are running:**

   ```bash
   docker ps
   ```

2. **Verify the PostgreSQL container is healthy:**

   ```bash
   npx nx run bidding-api:db-logs
   ```

3. **Try connecting with `localhost` instead of `luxor-postgres`:**

   - Host: `localhost`
   - Port: `5432`

4. **Restart the database services:**
   ```bash
   npx nx run bidding-api:db-restart
   ```

### Database Management

Once connected, you can:

- **Browse databases**: Expand the server to see all databases
- **Run queries**: Use the Query Tool (SQL Editor)
- **Manage tables**: Right-click on schemas to create/modify tables
- **View data**: Browse table contents through the object browser
- **Export/Import**: Use pgAdmin's import/export tools for data migration

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
CORS_ORIGIN=http://localhost:4200

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

## 📦 Database Migrations

The Bidding API uses TypeORM for database migrations. You can generate and run migrations using the following commands (run from the `apps/bidding-api` directory):

### Generate a New Migration

```
pnpm migration:generate src/migrations/<NewMigrationName>
```

- Example: `pnpm migration:generate src/migrations/AddNewTable`
- This will create a new migration file in `apps/bidding-api/src/migrations/`.

### Run Migrations

```
pnpm migration:run
```

- This will apply all pending migrations to the database.

### Revert the Last Migration

```
pnpm migration:revert
```

- This will undo the most recent migration.

### Show Migration Status

```
pnpm migration:show
```

- This will list all migrations and their status.

> **Note:** Ensure your database is running and your environment variables are set correctly before running migrations.

## Finish your remote caching setup

[Click here to finish setting up your workspace!](https://cloud.nx.app/connect/Wcyg5kW8aW)

## Run tasks

### Bidding API

To run the dev server for your API, use:

```sh
npx nx serve bidding-api
```

To create a production bundle:

```sh
npx nx build bidding-api
```

To see all available targets to run for the API project, run:

```sh
npx nx show project bidding-api
```

### Bidding UI

To run the development server for the frontend application:

```sh
npx nx serve bidding-ui
```

This will start the Next.js development server, typically on `http://localhost:4200`.

To create a production build:

```sh
npx nx build bidding-ui
```

To see all available targets for the UI project:

```sh
npx nx show project bidding-ui
```

### Running Both Applications

For a full development setup with database, API, and UI:

```sh
# Start database and both applications
npx nx run bidding-api:dev-full
```

Or run them individually:

```sh
# Terminal 1: Start database
npx nx run bidding-api:db-up

# Terminal 2: Start API
npx nx serve bidding-api

# Terminal 3: Start UI
npx nx serve bidding-ui
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
