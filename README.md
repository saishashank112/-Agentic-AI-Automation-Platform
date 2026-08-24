# Agentic AI Automation Platform (`Agentflow_AI`)

An enterprise-grade, full-stack AI Operations Automation Platform built according to [Specification.md](./Specification.md) as the single source of truth.

`Agentflow_AI` enables operators to describe complex business automations in natural language, generate visual graph workflows, execute them through a 5-agent cooperating chain (Planner, Execution, Validation, Recovery, Monitoring), interface with third-party tools (Gmail, Slack, Discord, Google Sheets) over OAuth, and monitor real-time execution telemetry over Socket.IO.

---

## 🌟 Key Features

1. **Natural Language Prompt-to-Workflow Engine**:
   - Primary: OpenRouter API
   - Fallback 1: Google Gemini SDK (`@google/generative-ai`)
   - Fallback 2: Rule-based Deterministic Graph Builder

2. **Drag-and-Drop Visual Canvas**:
   - Built on Next.js (Pages Router) and `@xyflow/react` (React Flow)
   - Node Palette with support for Triggers, AI Agents, Gmail, Slack, Discord, and Google Sheets
   - Side panel node configuration and custom edge connections

3. **5-Agent Cooperating Execution Chain**:
   - **Planner Agent**: Calculates node execution order via graph topological sorting and computes confidence scores.
   - **Execution Agent**: Runs node logic against third-party OAuth APIs or LLMs.
   - **Validation Agent**: Verifies output schema completeness.
   - **Recovery Agent**: Classifies errors (`MISSING_FIELDS`, `API_FAILURE`, `AUTH_EXPIRED`, `RATE_LIMIT`, `TRANSIENT`) and handles exponential backoff or escalation.
   - **Monitoring Agent**: Emits Socket.IO telemetry and persists `ExecutionLog` audit records in MongoDB.

4. **OAuth Integrations & Security**:
   - Integration status dashboard for Gmail, Slack, Discord, and Google Sheets.
   - Credentials encrypted at rest using AES-256-CBC with `CREDENTIAL_ENCRYPTION_KEY`.
   - JWT authentication with password hashing (`bcrypt` cost factor 12).

5. **In-Memory Zero-Setup Fallbacks**:
   - **MongoDB Fallback**: Automatically initializes `mongodb-memory-server` if no external database URI is supplied.
   - **Redis / Queue Fallback**: Operates with an async in-memory queue fallback if Redis is unconfigured.

---

## 📁 Repository Structure

```
AI Automation Platform/
├── Specification.md           # Single source of truth spec
├── README.md                  # Project setup and running instructions
├── server/                    # Express + Node.js + Socket.IO Backend
│   ├── src/
│   │   ├── config/            # env.js, db.js (with memory fallback), socket.js
│   │   ├── models/            # User, Workflow, Execution, ExecutionLog, Integration, Notification
│   │   ├── integrations/      # BaseIntegration, Gmail, Slack, Discord, Google Sheets
│   │   ├── agents/            # Orchestrator, Planner, Execution, Validation, Recovery, Monitoring
│   │   ├── services/          # AuthService, WorkflowService, ExecutionService, AIService, IntegrationService
│   │   ├── controllers/       # HTTP controllers
│   │   ├── routes/            # API routes
│   │   ├── queues/            # BullMQ & In-memory execution queue
│   │   └── index.js           # Express server entry point
│   └── package.json
└── client/                    # Next.js Pages Router + React + Tailwind + React Flow Frontend
    ├── src/
    │   ├── components/        # AppShell, MetricGrid, NodePalette, NodeConfigPanel, WorkflowCanvas, ProtectedRoute
    │   ├── store/             # Zustand stores (authStore, workflowStore)
    │   ├── services/          # Axios API & Socket.IO client connectors
    │   ├── pages/             # _, index, login, register, dashboard, workflows, executions, integrations, settings
    │   └── styles/            # globals.css & Tailwind configuration
    └── package.json
```

---

## 🛠️ Requirements & Prerequisites

- **Node.js**: `v18.x` or higher
- **npm** or **yarn**
- *(Optional)* **MongoDB**: Local or MongoDB Atlas URI (If not provided, the platform automatically starts an in-memory MongoDB server).
- *(Optional)* **Redis**: Local or cloud Redis URI (If not provided, the platform operates with an in-memory execution queue).

---

## 🚀 Getting Started & Setup Guide

### 1. Backend Setup (`server/`)

Open a terminal in the project root:

```bash
cd server
npm install
```

#### Environment Variables (`server/.env`)
Create a `.env` file in the `server` directory (or use the defaults provided in `env.js`):

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=
JWT_SECRET=agentflow_default_jwt_secret_key_32bytes_min!
CREDENTIAL_ENCRYPTION_KEY=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
CLIENT_URL=http://localhost:3000
REDIS_URL=
OPENROUTER_API_KEY=
GEMINI_API_KEY=
```

#### Start Backend Server
```bash
npm run dev
```
*The backend server will run at `http://localhost:5000`.*

---

### 2. Frontend Setup (`client/`)

Open a second terminal window in the project root:

```bash
cd client
npm install
```

#### Environment Variables (`client/.env.local`)
Create a `.env.local` file in the `client` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

#### Start Frontend Client
```bash
npm run dev
```
*The client application will run at `http://localhost:3000`.*

---

## 🧪 Testing the Platform Workflow

1. Open `http://localhost:3000` in your web browser.
2. Click **Get Started** and register a new operator account (e.g. `operator@company.com`).
3. Navigate to **AI Builder** (`/workflows/builder`) and type a prompt such as:
   > *"When a client submits an invoice email, extract fields with AI and append to Google Sheet and notify Slack #finance"*
4. Click **Generate Graph**. The platform will visualize the nodes and edges on the React Flow canvas.
5. Click **Save to Canvas**, then click **Execute Chain**.
6. Watch the live **Agentic Socket.IO Timeline** stream agent events (`Planner` -> `Execution` -> `Validation` -> `Recovery` -> `Monitoring`) in real time!

---

## 🔒 Security Best Practices

- Password hashing via `bcrypt` with cost factor 12.
- Session authorization via signed JWTs.
- Sensitive third-party OAuth access/refresh tokens are encrypted at rest using AES-256-CBC via `CREDENTIAL_ENCRYPTION_KEY`.
- HTTP Security Headers enabled via `helmet`.
