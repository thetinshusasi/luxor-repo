# Luxor Bidding App

A full-stack bidding application built with Next.js, NestJS, and PostgreSQL.

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended) or npm
- Docker and Docker Compose

### Installation

```bash
# Install dependencies
pnpm install

# Start the full development environment
npx nx run bidding-api:dev-full
```

This will start:

- PostgreSQL database
- NestJS API server
- Next.js frontend

### Access URLs

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:3001/api
- **Database**: localhost:5432

## 🏃‍♂️ Development

### Running Individual Services

```bash
# Start database only
npx nx run bidding-api:db-up

# Start API only
npx nx serve bidding-api

# Start UI only
npx nx serve bidding-ui
```

### Database Management

```bash
# Run migrations
cd apps/bidding-api
pnpm migration:run

# View database logs
npx nx run bidding-api:db-logs

# Restart database
npx nx run bidding-api:db-restart
```

## 📁 Project Structure

```
apps/
├── bidding-api/          # NestJS backend
│   ├── src/
│   │   ├── auth/         # Authentication
│   │   ├── bid/          # Bid management
│   │   ├── collection/   # Collection management
│   │   ├── user/         # User management
│   │   └── token/        # Token management
│   └── Dockerfile
└── bidding-ui/           # Next.js frontend
    ├── src/
    │   ├── app/          # Pages
    │   ├── components/   # Reusable components
    │   └── lib/          # Utilities and hooks
    └── Dockerfile
```

## 🔧 Environment Configuration

Copy and configure environment files:

```bash
cp apps/bidding-api/.env.example apps/bidding-api/.env
cp apps/bidding-ui/.env.example apps/bidding-ui/.env
```

### Key Environment Variables

**API (.env)**

```bash
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=luxor_bidding
DB_USER=postgres
DB_PASSWORD=password
JWT_SECRET=your-super-secret-jwt-key
```

**UI (.env)**

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 🗄️ Database

The project uses PostgreSQL with Docker. Database is automatically seeded with test data on startup.

### pgAdmin Access

- **URL**: http://localhost:5050
- **Email**: admin@luxor.com
- **Password**: admin

### Connection Details

- **Host**: `luxor-postgres`
- **Port**: `5432`
- **Database**: `luxor_bidding`
- **Username**: `postgres`
- **Password**: `password`

## 📦 Available Commands

```bash
# Development
npx nx serve bidding-api    # Start API
npx nx serve bidding-ui     # Start UI
npx nx run bidding-api:dev-full  # Start everything

# Database
npx nx run bidding-api:db-up     # Start database
npx nx run bidding-api:db-down   # Stop database
npx nx run bidding-api:db-logs   # View logs

# Build
npx nx build bidding-api    # Build API
npx nx build bidding-ui     # Build UI
```

## 🔐 Authentication

The app uses JWT authentication. Login credentials are seeded in the database on startup.

## 📝 Notes

- Database is reset and reseeded on each API restart
- All API endpoints require authentication except `/auth/login`
- Frontend automatically redirects to login if not authenticated

## 🧪 Testing

**<span style="color: #FFD600;">Currently unit tests are not implemented due to time crunch. However, for frontend we primarily use React Testing Library and backend we use Mocha and Chai, and for e2e we use Cypress or Playwright.</span>**
