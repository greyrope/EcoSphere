# EcoSphere: ESG Management Platform

## System Architecture

This repository operates as a strict monorepo, housing a high-throughput Golang backend and a statically-typed React frontend.

### Tech Stack

- Backend Engine: Golang (Go 1.21+)
- Database: PostgreSQL via Supabase (Relational Master/Transactional Data)
- Frontend: React + Vite
- Styling: Tailwind CSS
- Real-Time Communication: Native Go WebSockets (`gorilla/websocket`)
- Containerization: Docker + Docker Compose

### Core Engineering Highlights

1. Real-Time Notification Hub: A custom Go WebSocket engine broadcasting CSR approvals, policy updates, and gamification badge unlocks with zero-latency polling.
2. ACID-Compliant Gamification Ledger: PostgreSQL stored procedures (`redeem_reward`) with `FOR UPDATE` row locking ensure absolute data integrity when deducting XP and managing reward inventory.
3. Asynchronous Processing: Heavy computational tasks, such as Auto Emission Calculations from ERP data, are offloaded to background Goroutines to prevent main-thread blocking.

---

## Project Structure

```text
EcoSphere/
├── backend/                        # High-concurrency Go REST & WebSocket API
│   ├── cmd/api/                    # Application entrypoint (main.go)
│   ├── internal/
│   │   ├── config/                 # Environment configuration
│   │   ├── handlers/               # HTTP handlers (auth, metrics, policies, gamification, notifications)
│   │   └── middleware/             # Auth middleware (JWT validation)
│   ├── pkg/database/               # pgx connection pool & all SQL queries
│   └── db/migrations/              # SQL schema migrations
│
├── frontend/                       # Vite/React Frontend
│   ├── src/
│   │   ├── components/             # Reusable, semantic UI components
│   │   └── pages/                  # Module views (Dashboard, Environmental, Social, Governance, Gamification)
│   ├── public/                     # Static assets
│   └── package.json                # Frontend dependencies and scripts
│
├── supabase/                       # Supabase configuration
│   ├── config.toml                 # Supabase project config
│   └── migrations/                 # SQL schema migrations
│
├── Dockerfile                      # Multi-stage build (Go backend + React frontend + nginx)
├── Dockerfile.dev                  # Development build with hot-reload
├── docker-compose.yml              # Service orchestration
├── nginx.conf                      # SPA routing + API proxy + WebSocket proxy
├── entrypoint.sh                   # Container entrypoint (nginx + Go API)
└── .env.example                    # Required environment variables
```

---

## Backend (Go)

The backend is a Go HTTP server using `gorilla/mux` for routing, `pgx` for PostgreSQL connections, and `gorilla/websocket` for real-time communication.

### API Endpoints

| Method | Endpoint                     | Description                            |
| ------ | ---------------------------- | -------------------------------------- |
| POST   | `/api/auth/signup`           | Register a new user                    |
| POST   | `/api/auth/signin`           | Authenticate and get token             |
| GET    | `/api/auth/me`               | Get current authenticated user         |
| GET    | `/api/profile`               | Get user profile by ID                 |
| GET    | `/api/organizations`         | Get organization details               |
| GET    | `/api/metrics/environmental` | Get environmental metrics              |
| GET    | `/api/metrics/social`        | Get social metrics                     |
| GET    | `/api/metrics/governance`    | Get governance metrics                 |
| GET    | `/api/policies`              | List policies (filterable by category) |
| POST   | `/api/policies`              | Create a new policy                    |
| GET    | `/api/badges`                | List all gamification badges           |
| GET    | `/api/badges/user`           | Get user's earned badges               |
| GET    | `/api/rewards`               | List redeemable rewards                |
| POST   | `/api/rewards/redeem`        | Redeem a reward (ACID transaction)     |
| GET    | `/api/notifications`         | Get user notifications                 |
| POST   | `/api/notifications/read`    | Mark notification as read              |
| WS     | `/ws?user_id=`               | WebSocket for real-time notifications  |

### Go Packages

| Package               | Purpose                                                           |
| --------------------- | ----------------------------------------------------------------- |
| `cmd/api`             | Application entrypoint, router setup, server start                |
| `internal/config`     | Loads `.env` into typed `Config` struct                           |
| `internal/handlers`   | HTTP handler functions for each endpoint                          |
| `internal/middleware` | Auth middleware (extracts user from `Authorization` header)       |
| `pkg/database`        | `pgxpool` connection pool, all SQL query functions, WebSocket hub |

---

## Database Setup (Supabase + PostgreSQL)

EcoSphere uses [Supabase](https://supabase.com) as the database layer, which provides a managed PostgreSQL instance with Row Level Security (RLS) built in.

### Schema Overview

| Table                   | Purpose                                                  |
| ----------------------- | -------------------------------------------------------- |
| `profiles`              | Extended user profiles with XP/level tracking            |
| `organizations`         | Company/organization records                             |
| `environmental_metrics` | Carbon, energy, water, waste data                        |
| `social_metrics`        | Employee count, satisfaction, diversity, safety          |
| `governance_metrics`    | Board independence, compliance, audits                   |
| `policies`              | CSR/ESG policy documents with approval workflows         |
| `csr_approvals`         | Approval request tracking                                |
| `badges`                | Gamification badge catalog (bronze/silver/gold/platinum) |
| `user_badges`           | Earned badge records                                     |
| `rewards`               | Redeemable reward catalog with XP costs                  |
| `reward_redemptions`    | ACID-compliant redemption ledger                         |
| `xp_transactions`       | XP earning/deduction audit trail                         |
| `notifications`         | Real-time notification feed                              |

### Setup Steps

1. **Create a Supabase project** at [supabase.com/dashboard](https://supabase.com/dashboard)
2. **Copy your API keys** from Project Settings → API
3. **Copy the database connection string** from Project Settings → Database → Connection string → URI
4. **Create a `.env` file** from the example:

   ```bash
   cp .env.example .env
   ```

5. **Fill in the values**:

   ```
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   DATABASE_URL=postgresql://postgres.xxx:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```

6. **Run the migration** — open the Supabase SQL Editor and paste the contents of:

   ```
   supabase/migrations/20250101000000_initial_schema.sql
   ```

   This creates all tables, RLS policies, indexes, triggers, and stored procedures.

### Key Database Features

- **Row Level Security (RLS)**: Every table is protected. Users can only see their own data unless they have admin/manager roles.
- **Auto-Profile Creation**: A trigger on `auth.users` automatically creates a `profiles` row on signup.
- **ACID Reward Redemption**: The `redeem_reward()` stored procedure uses `FOR UPDATE` row locking to prevent race conditions when deducting XP and managing stock.

---

## Docker Setup

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

### Production Build

Build and run the optimized production image (Go API + nginx serving React SPA):

```bash
# Create .env file first (see Database Setup above)
cp .env.example .env

# Build and start
docker compose up backend --build
```

The app will be available at `http://localhost:80` (frontend) and `http://localhost:8080` (API).

### Development Mode

Run both the Go backend and React dev server with hot-reload:

```bash
docker compose --profile dev up backend-dev frontend-dev
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8080`

### Docker Architecture

```text
Dockerfile (production — multi-stage)
├── Stage 1 (go-builder)     → Go 1.21 compile → static binary
├── Stage 2 (frontend-builder) → npm ci → Vite build
└── Stage 3 (production)     → Alpine + nginx + Go binary
    ├── nginx serves React SPA at :80
    ├── nginx proxies /api/ to Go at :8080
    └── nginx proxies /ws to Go WebSocket at :8080
```

### Available Commands

| Command                                                    | Description              |
| ---------------------------------------------------------- | ------------------------ |
| `docker compose up backend --build`                        | Build and run production |
| `docker compose --profile dev up backend-dev frontend-dev` | Run dev with hot-reload  |
| `docker compose down`                                      | Stop all containers      |
| `docker compose build --no-cache`                          | Rebuild from scratch     |

---

## Getting Started

### Local Development (without Docker)

```bash
# 1. Install frontend dependencies
cd frontend && npm install && cd ..

# 2. Install Go dependencies
cd backend && go mod download && cd ..

# 3. Set up environment
cp .env.example .env
# Edit .env with your Supabase credentials

# 4. Run the migration in Supabase SQL Editor
# Paste: supabase/migrations/20250101000000_initial_schema.sql

# 5. Start the Go backend
cd backend && go run ./cmd/api

# 6. Start the frontend (in another terminal)
cd frontend && npm run dev
```

### Local Development (with Docker)

```bash
# 1. Set up environment
cp .env.example .env
# Edit .env with your Supabase credentials

# 2. Run everything in Docker
docker compose --profile dev up backend-dev frontend-dev
```

### Production (with Docker)

```bash
# 1. Set up environment
cp .env.example .env
# Edit .env with your Supabase credentials

# 2. Build and run
docker compose up backend --build
```

---

## Backend API Usage (Go)

The Go backend connects directly to Supabase's PostgreSQL using `pgx`:

```go
import "github.com/ecosphere/backend/pkg/database"

// Initialize connection (called in main.go)
database.Connect(databaseURL)

// Query environmental metrics
metrics, err := database.GetEnvironmentalMetrics(orgID, startDate, endDate)

// Redeem a reward (ACID transaction)
result, err := database.RedeemReward(userID, rewardID)

// Register WebSocket for real-time notifications
database.RegisterWebSocket(userID, conn)
```

The frontend calls the Go API at `/api/*` — nginx proxies these requests to the Go server.
