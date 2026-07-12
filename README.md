# EcoSphere: ESG Management Platform

## System Architecture

This repository operates as a strict monorepo, housing a high-throughput Golang backend and a statically-typed React frontend.

### Tech Stack

- Backend Engine: Golang (Go 1.21+)
- Database: PostgreSQL (Relational Master/Transactional Data)
- Frontend: React + Vite + TypeScript
- Styling: Tailwind CSS
- Real-Time Communication: Native Go WebSockets (`gorilla/websocket`)

### Core Engineering Highlights

1. Real-Time Notification Hub: A custom WebSocket engine broadcasting CSR approvals, policy updates, and gamification badge unlocks with zero-latency polling.
2. ACID-Compliant Gamification Ledger: Raw, atomic SQL transactions governing the Reward Redemption system. Ensures absolute data integrity when deducting XP and managing reward inventory.
3. Asynchronous Processing: Heavy computational tasks, such as Auto Emission Calculations from ERP data, are offloaded to background Goroutines to prevent main-thread blocking.

---

## Project Structure

```text
ecosphere-hackathon/
├── backend/                        # High-concurrency Go REST & WebSocket API
│   ├── cmd/api/                    # Application entrypoint
│   ├── internal/                   # Domain logic (ESG modules, Gamification, Auth)
│   ├── pkg/database/               # Connection pooling & Postgres bindings
│   └── db/migrations/              # Raw .up.sql and .down.sql schema migrations
│
└── frontend/                       # Vite/React/TS Client
    ├── src/components/             # Reusable, semantic UI components
    ├── src/pages/                  # Module views (Environmental, Social, Governance)
    └── src/services/               # API clients and WebSocket hook implementations
```

## Recent Frontend Updates

- Added client-side routing with React Router for Dashboard, Environmental, Social, Governance, and Gamification pages.
- Added a shared Layout component to keep navigation and page structure consistent.
- Added Tailwind CSS and Prettier integration for styling and formatting consistency.
- Added ESLint Prettier compatibility so linting stays aligned with formatting rules.
- Added page-level structure for the app areas currently in the frontend.

## Getting Started

Run the app locally with:

```bash
npm install
npm run dev
```

## Expanding the ESLint Configuration

If you are developing a production application, consider using TypeScript with type-aware lint rules enabled. Check out the TS template for information on how to integrate TypeScript and `typescript-eslint` in your project.
