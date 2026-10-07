# TransportoX

**AI-based dynamic fleet optimization & intelligent vehicle recovery — for transportation & logistics.**

> *"Recover the delivery, not just the vehicle."*

TransportoX is a hackathon MVP that treats a vehicle breakdown as a **recovery problem**, not a failed delivery. When a truck goes down, the system locates it, identifies affected shipments, finds nearby support vehicles / repair centers / depots / charging stations, ranks recovery options, and lets a fleet manager approve a plan — all in real time, on seeded demo data, with zero paid APIs required.

---

## Table of Contents

- [Why TransportoX](#why-transportox)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Overview](#api-overview)
- [Demo Script](#demo-script-3-minutes)
- [How It Works](#how-it-works)
- [Roadmap / Out of Scope for MVP](#roadmap--out-of-scope-for-mvp)
- [License](#license)

---

## Why TransportoX

Most fleet dashboards stop at "the truck broke down." TransportoX keeps going:

1. **Dynamic fleet optimization** — assigns and re-optimizes deliveries using a transparent, deterministic scoring model (capacity, deadline, priority, distance, vehicle type, fuel/energy, health).
2. **Fleet Rescue & Recovery Intelligence** — the differentiator. A breakdown triggers an automatic recovery workflow: affected shipments are ranked, nearby support resources are scored, and a manager approves the plan before anything changes.
3. **Mixed Fleet Intelligence** — Diesel, EV, and Hybrid vehicles are scored differently based on range, payload, charging access, cost, and emissions, with the reasoning always shown in the UI.
4. **Explainable AI Agent** — a structured (non-autonomous) assistant that turns manager goals into approval-gated recommendations, with no LLM key required by default.

---

## Key Features

| Area | What it does |
|---|---|
| 🚚 Fleet Dashboard | Live KPIs, map, event feed, AI recommendation panel |
| 📦 Vehicle & Order Management | Full CRUD with seeded demo data |
| ⚙️ Dynamic Assignment | Weighted scoring engine, no ML required |
| 🗺️ Live Map | Leaflet + OpenStreetMap, simulated vehicle positions, route polylines |
| 🚨 Breakdown Simulation | One click to trigger a realistic incident |
| 🛠️ Recovery Engine | Ranks support vehicles, repair centers, depots, and charging stations |
| 🔋 Mixed Fleet Logic | Diesel / EV / Hybrid-aware assignment with visible reasoning |
| 🤖 AI Decision Assistant | Structured, explainable, always approval-gated |
| 🔌 Real-Time Updates | Socket.IO — no page refresh, anywhere |
| ♻️ Resettable Demo | One command restores the full seeded scenario |

---

## Tech Stack

**Frontend:** Vite · React · React Router · Tailwind CSS · Axios · TanStack Query · React Leaflet · Socket.IO client

**Backend:** Node.js · Express · Mongoose · Socket.IO · Zod/Joi · Helmet · CORS

**Database:** MongoDB

**Map:** Leaflet + OpenStreetMap (seeded coordinates, no external routing dependency)

**AI:** Deterministic structured decision assistant by default; optional LLM path gated behind `ENABLE_LLM`

---

## Project Structure

```text
TransportoX/
├── frontend/           # Vite + React client
│   └── src/
│       ├── app/         # Router, query client
│       ├── components/  # Map, cards, tables, layout
│       ├── pages/        # Dashboard, Vehicles, Orders, Optimization, Incidents, Tracking, Settings
│       ├── hooks/         # useSocket, useFleet, useOrders
│       ├── services/      # api.js, socket.js
│       └── utils/          # formatters, map, scoring
└── backend/             # Express API
    └── src/
        ├── config/        # db.js, env.js
        ├── routes/        # vehicle, order, optimization, incident, support, ai, tracking
        ├── controllers/
        ├── services/       # assignment, eta, recovery, mixedFleet, incident, aiAgent, simulation
        ├── models/          # Vehicle, Order, Incident, SupportResource, EventLog
        ├── sockets/
        └── middleware/
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running locally (or update `MONGODB_URI`)

### 1. Clone & install

```bash
git clone <repo-url>
cd TransportoX

# install backend deps
cd backend && npm install

# install frontend deps
cd ../frontend && npm install
```

### 2. Configure environment

Copy the example env files and adjust if needed (defaults work out of the box for local MongoDB):

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### 3. Seed the demo data

```bash
cd backend
npm run seed
```

### 4. Run the app

In two terminals:

```bash
# Terminal 1 — backend (http://localhost:5000)
cd backend && npm run dev

# Terminal 2 — frontend (http://localhost:5173)
cd frontend && npm run dev
```

Open **http://localhost:5173** and you'll land on the Fleet Command Center with seeded vehicles, orders, and one pre-built breakdown scenario ready to go.

> At any point, reset to the clean seeded state with **Settings → Reset Demo Data**, or `POST /api/demo/reset`.

---

## Environment Variables

**`backend/.env`**

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/TransportoX
JWT_SECRET=change-me
CLIENT_URL=http://localhost:5173
ENABLE_LLM=false
LLM_API_KEY=
```

**`frontend/.env`**

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

> `ENABLE_LLM=false` is the default and fully supported path — the AI assistant runs on deterministic rules with no external key needed.

---

## API Overview

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Health check |
| GET/POST/PATCH | `/api/vehicles` | Vehicle CRUD |
| GET/POST/PATCH | `/api/orders` | Order/shipment CRUD |
| POST | `/api/optimization/run` | Run fleet assignment |
| GET | `/api/optimization/preview` | Preview optimization result |
| POST | `/api/incidents/simulate-breakdown` | Trigger a breakdown |
| GET | `/api/incidents` / `/api/incidents/:id` | List / fetch incidents |
| POST | `/api/incidents/:id/recommend-recovery` | Generate ranked recovery options |
| POST | `/api/incidents/:id/approve-recovery` | Manager approves a recovery plan |
| GET | `/api/support-resources/nearby` | Nearby support vehicles, repair centers, depots, charging stations |
| POST | `/api/ai/ask` | Structured AI assistant command |
| GET | `/api/events` | Event log |
| POST | `/api/demo/reset` | Restore seeded demo state |

Manager-only endpoints: optimization run, recovery approval.

---

## Demo Script (3 minutes)

The signature flow — vehicle breakdown → recovery — is designed to run end-to-end in under three minutes:

1. Open the **Dashboard** — seeded fleet, orders, and map load instantly.
2. Go to **Vehicles**, select **V102**, click **Simulate Breakdown**.
3. Watch the incident appear live on the map and in the **Incident Center**.
4. See **13 affected shipments**, **4 flagged critical**.
5. Click **Generate Recovery Plan** — support vehicle `SV-04`, repair center `RC-02`, and other options appear, ranked.
6. Compare support vehicle vs. repair center vs. depot.
7. Click **Approve Recovery** — a cargo transfer + repair plan is applied.
8. Critical orders are reassigned to `SV-04` in real time.
9. ETAs and statuses update across the app with no page reload.
10. Check the **event feed** for a full audit trail of what just happened.

Two additional scenarios are also demoable:
- **Normal optimization** — run **Optimize Fleet** from a clean state and see assignments, ETAs, and utilization populate.
- **New urgent order** — create a `CRITICAL` order with a near deadline, re-optimize, and watch a vehicle get reassigned.

---

## How It Works

### Dynamic Assignment
A transparent weighted-scoring model (no ML needed) ranks eligible vehicles after hard constraints (capacity, vehicle type, breakdown/repair status, health threshold, EV range reserve) are enforced:

```text
assignmentScore =
  0.25 × capacityFit +
  0.20 × deadlineFit +
  0.15 × priorityFit +
  0.15 × distanceFit +
  0.10 × vehicleTypeFit +
  0.10 × energyOrFuelFit +
  0.05 × healthFit
```

### Fleet Rescue & Recovery
On breakdown: locate the vehicle → identify & rank affected shipments → scan nearby support resources → score and rank recovery options → recommend a plan → **require manager approval** → apply, reassign, recalculate ETAs, and broadcast updates.

```text
recoveryScore =
  0.30 × responseTimeScore +
  0.20 × deliveryRiskScore +
  0.15 × capacityCompatibility +
  0.15 × repairFeasibility +
  0.10 × distanceScore +
  0.10 × costScore
```

### AI Agent
Returns a structured, explainable response for every command — it recommends and explains, and **never executes autonomously**:

```json
{
  "action": "GENERATE_RECOVERY",
  "summary": "Transfer critical cargo to SV-04 and dispatch V102 to repair.",
  "reasons": [],
  "affectedEntities": [],
  "recommendedChanges": [],
  "requiresApproval": true
}
```

---

## Roadmap / Out of Scope for MVP

Deliberately excluded from this build to keep it demoable in one day:

- Microservices architecture
- Full ML training pipeline
- Paid API/LLM as a hard dependency
- Native driver mobile app
- Production telematics ingestion
- Full EV battery physics
- Production-grade routing solver
- Unsupervised autonomous dispatch
- Enterprise SSO / billing

These are natural next steps for a production version, not gaps in the MVP's logic.

---

## License

MIT — built for hackathon demonstration purposes.
