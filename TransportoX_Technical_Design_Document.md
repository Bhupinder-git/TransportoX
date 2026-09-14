# TransportoX — Technical Design Document (Hackathon MVP)

**Version:** 1.0 (consolidated)
**Build window:** 1 day
**Audience:** AI IDE / coding agent (paste this entire document as the first instruction)

> This is the single source of truth for building TransportoX. It merges the product spec and build instructions into one document. Do not ask the user for missing information — every default needed to build is defined here. Work phase by phase, verify each phase runs before moving to the next.

---

## 1. Mission

Build **TransportoX**, a polished, demo-ready web app for AI-based dynamic fleet optimization and intelligent vehicle recovery — **not** an over-engineered production platform. Favor working, demoable features over architectural purity. The app must run **entirely locally on seeded/simulated data**, with **no paid or external API key required**.

---

## 2. Product Definition

**TransportoX** = AI-based dynamic fleet optimization + intelligent vehicle recovery for transportation/logistics.

**Core (base) features:** vehicle capacity, delivery priority, delivery time windows, traffic/road-condition simulation, automatic re-optimization, vehicle assignment minimizing distance/time/fuel, driver navigation view, customer ETA, fleet manager dashboard.

**Differentiator — Fleet Rescue & Recovery Intelligence:** treats a breakdown as a recovery problem, not a failed delivery. On incident: locate the vehicle → identify affected shipments and urgency → evaluate nearby support vehicles, repair centers, company depots, charging stations → rank recovery options → recommend cargo transfer / vehicle replacement / repair → update ETAs → re-optimize the fleet.

**Signature principle:** *"Recover the delivery, not just the vehicle."*

**Future-ready feature:** Mixed Fleet Intelligence across Diesel, EV, Hybrid — payload, range, fuel/battery level, charging availability, operating cost, emissions, vehicle health all factor into assignment.

**AI feature:** a Logistics AI Agent that turns manager goals into explainable, approval-based recommendations. It never executes autonomously.

---

## 3. MVP Scope

### Must build
- Fleet manager dashboard
- Vehicle CRUD + demo seed
- Order/shipment CRUD + demo seed
- Dynamic assignment via deterministic weighted scoring
- Map with simulated live vehicle markers
- ETA calculation
- Breakdown simulation
- Fleet Rescue & Recovery Engine
- Support vehicle / repair center / company depot matching
- Mixed-fleet logic (Diesel/EV/Hybrid)
- Structured AI decision assistant
- Live updates via Socket.IO
- Resettable demo data

### Explicitly out of scope
Microservices, full ML training pipeline, paid API as a hard dependency, native driver mobile app, production telematics ingestion, full EV battery physics, production-grade routing solver, unsupervised autonomous dispatch, enterprise SSO/billing.

### Hard constraints
- Buildable and demoable in **one day**.
- **One monorepo, one Express backend** — no microservices.
- Must work **without any paid API or LLM key**.
- Seeded demo data + deterministic algorithms are the default, always-working path.
- Map: Leaflet + OpenStreetMap with seeded coordinates and simple polylines — no external routing dependency for the core demo.
- Any LLM integration is optional, gated behind `ENABLE_LLM=false`, and the app must be fully functional with it off.

---

## 4. Tech Stack

| Layer | Choice |
|---|---|
| Frontend | Vite, React, React Router, Tailwind CSS, Axios, TanStack Query, React Leaflet, Socket.IO client |
| Backend | Node.js, Express, Mongoose, Socket.IO, Zod or Joi, Helmet, CORS |
| Database | MongoDB |
| Map | Leaflet + OpenStreetMap, seeded coordinates, simple polylines |
| AI | Default: deterministic structured decision assistant. Optional: LLM behind `ENABLE_LLM=false` |

---

## 5. Users & Roles

| Role | MVP behavior |
|---|---|
| Fleet Manager (`MANAGER`) | View dashboard, create vehicles/orders, run optimization, simulate incidents, approve recovery plans |
| Driver (`DRIVER`, simulated) | View assignment/status, trigger Breakdown/SOS, acknowledge assistance |
| Customer | View shipment status and latest ETA via a public tracking page |

Manager-only endpoints: optimization run and recovery approval.

---

## 6. Frontend Pages

| Route | Page | Purpose | Priority |
|---|---|---|---|
| `/dashboard` | Fleet Command Center | KPIs, map, alerts, active vehicles, recovery incidents | P0 |
| `/vehicles` | Vehicles | Vehicle list, status, capacity, fuel/battery, health | P0 |
| `/orders` | Shipments | Orders, priority, deadline, weight, destination, ETA | P0 |
| `/optimize` | Optimization | Run assignment/re-optimization, show recommendations | P0 |
| `/incidents` | Incident Center | Breakdowns, affected shipments, recovery options, approval | P0 |
| `/tracking/:id` | Shipment Tracking | Customer status + latest ETA | P1 |
| `/settings` | Settings | Reset demo, configuration, API status | P1 |

### Dashboard
- **KPIs:** Active Vehicles, Active Shipments, On-Time Risk, Open Incidents, Fleet Utilization, Estimated Operational Cost
- **Main area:** large fleet map — vehicle markers, planned route lines, incident markers, support resource markers
- **Right panel:** "AI Operations" recommendation, reason, confidence/risk label, Approve action
- **Bottom:** live event feed

### Vehicles
- Columns: Vehicle ID, Plate Number, Type, Status, Capacity, Current Load, Fuel/Battery, Range, Health, Current Job
- Types: `DIESEL`, `EV`, `HYBRID`
- Statuses: `AVAILABLE`, `ASSIGNED`, `EN_ROUTE`, `IDLE`, `BREAKDOWN`, `REPAIR`
- Actions: View, Edit, Simulate Breakdown

### Shipments
- Fields: Order ID, Pickup, Destination, Weight, Priority, Deadline, Status, Assigned Vehicle, ETA
- Priorities: `LOW`, `NORMAL`, `HIGH`, `CRITICAL`
- Statuses: `PENDING`, `ASSIGNED`, `IN_TRANSIT`, `DELIVERED`, `AT_RISK`, `RECOVERY`

### Incident Center
- Incident card: Vehicle, Failure type, Severity, GPS location, Affected shipments, Critical shipments, Incident age, Recommended recovery
- Recovery option card: Resource name, Type, Estimated arrival, Extra cost, Remaining capacity, Compatibility, Delivery risk
- Actions: Generate Recovery Plan, Simulate Plan, Approve Recovery

---

## 7. Visual Design

**Theme:** Dark futuristic Cloud Logistics Command Center
- Midnight/navy application shell, cyan/electric-blue accents, restrained purple reserved for AI-only elements
- Glassmorphism cards, clean typography, digital logistics map, connected cloud/network motifs
- Strong status badges, minimal but polished animation
- Should feel like a technology startup / enterprise ops product, not a college template

---

## 8. Repository & Folder Structure

```text
TransportoX/
  frontend/
    src/
      app/
        router.jsx
        queryClient.js
      components/
        Layout.jsx
        Sidebar.jsx
        Topbar.jsx
        KpiCard.jsx
        FleetMap.jsx
        VehicleMarker.jsx
        RoutePolyline.jsx
        EventFeed.jsx
        AiRecommendationCard.jsx
        RecoveryOptionCard.jsx
        StatusBadge.jsx
        DataTable.jsx
        Modal.jsx
      pages/
        Dashboard.jsx
        Vehicles.jsx
        Orders.jsx
        Optimization.jsx
        Incidents.jsx
        Tracking.jsx
        Settings.jsx
      hooks/
        useSocket.js
        useFleet.js
        useOrders.js
      services/
        api.js
        socket.js
      utils/
        formatters.js
        map.js
        scoring.js
      main.jsx
      styles.css
  backend/
    src/
      server.js
      app.js
      config/
        db.js
        env.js
      routes/
        vehicle.routes.js
        order.routes.js
        optimization.routes.js
        incident.routes.js
        support.routes.js
        ai.routes.js
        tracking.routes.js
      controllers/
        vehicle.controller.js
        order.controller.js
        optimization.controller.js
        incident.controller.js
        support.controller.js
        ai.controller.js
      services/
        assignment.service.js
        eta.service.js
        recovery.service.js
        mixedFleet.service.js
        incident.service.js
        aiAgent.service.js
        simulation.service.js
      models/
        Vehicle.js
        Order.js
        Incident.js
        SupportResource.js
        EventLog.js
      sockets/
        index.js
      middleware/
        errorHandler.js
        validate.js
      utils/
        distance.js
        scoring.js
        seed.js
  README.md
  .gitignore
  docker-compose.yml   # optional, MongoDB only if helpful
```

---

## 9. MongoDB Models

```js
// Vehicle
{
  vehicleId, plateNumber,
  type,              // DIESEL | EV | HYBRID
  status,            // AVAILABLE | ASSIGNED | EN_ROUTE | IDLE | BREAKDOWN | REPAIR
  capacityKg, currentLoadKg,
  location: { lat, lng, label },
  fuelPct, batteryPct, rangeKm, healthScore,
  driverName, driverPhone, capabilities: [],
  updatedAt
}

// Order
{
  orderId,
  pickup: { lat, lng, label },
  destination: { lat, lng, label },
  weightKg, volumeM3,
  priority,          // LOW | NORMAL | HIGH | CRITICAL
  deadline,
  status,            // PENDING | ASSIGNED | IN_TRANSIT | DELIVERED | AT_RISK | RECOVERY
  assignedVehicleId, eta, requiredVehicleType,
  createdAt, updatedAt
}

// Incident
{
  incidentId, vehicleId, type, severity,
  location: { lat, lng, label },
  affectedOrderIds: [], criticalOrderIds: [],
  status, recommendedAction, selectedRecoveryId,
  createdAt, resolvedAt
}

// SupportResource
{
  resourceId,
  type,              // SUPPORT_VEHICLE | REPAIR_CENTER | COMPANY_DEPOT | CHARGING_STATION
  name, status,
  location: { lat, lng, label },
  vehicleType, capacityKg, serviceTypes: [],
  estimatedResponseMin, companyOwned, phone
}

// EventLog
{
  type, message, entityType, entityId, severity, metadata, createdAt
}
```

---

## 10. REST API Contract

```text
GET    /api/health

GET    /api/vehicles
POST   /api/vehicles
PATCH  /api/vehicles/:id

GET    /api/orders
POST   /api/orders
PATCH  /api/orders/:id

POST   /api/optimization/run
GET    /api/optimization/preview

POST   /api/incidents/simulate-breakdown
GET    /api/incidents
GET    /api/incidents/:id
POST   /api/incidents/:id/recommend-recovery
POST   /api/incidents/:id/approve-recovery

GET    /api/support-resources/nearby

POST   /api/ai/ask

GET    /api/events

POST   /api/demo/reset
```

---

## 11. Assignment Algorithm (dynamic fleet optimization)

Deterministic weighted scoring — fast, transparent, easy to defend to judges. No ML required for the MVP.

**Hard constraints (disqualify a vehicle if any is true):**
- `currentLoadKg + order.weightKg > capacityKg`
- vehicle type does not satisfy `requiredVehicleType`
- vehicle status is `BREAKDOWN` or `REPAIR`
- `healthScore` is below the configured threshold for a new high-risk assignment
- for EV, the vehicle cannot complete the expected trip while keeping the demo reserve

**Score (each term normalized 0–100):**
```text
assignmentScore =
  0.25 * capacityFit +
  0.20 * deadlineFit +
  0.15 * priorityFit +
  0.15 * distanceFit +
  0.10 * vehicleTypeFit +
  0.10 * energyOrFuelFit +
  0.05 * healthFit
```

**EV rule:** keep a 20% range reserve in demo rules.

**ETA:**
```text
etaMinutes = routeDistanceKm / effectiveSpeedKmh * 60
effectiveSpeedKmh = baseSpeed * trafficMultiplier
LOW traffic = 1.0, MEDIUM traffic = 0.8, HIGH traffic = 0.6
```
Use seeded distances or Haversine between coordinates for demo routes.

---

## 12. Fleet Rescue & Recovery Engine (the differentiator — make it clearly visible in the UI)

**Breakdown sequence:**
```text
1.  Vehicle becomes BREAKDOWN
2.  Find active orders assigned to that vehicle
3.  Rank affected orders by priority and deadline
4.  Identify CRITICAL / HIGH / NORMAL groups
5.  Find nearby support vehicles
6.  Find repair centers / company depots / charging stations
7.  Filter by availability + capacity + compatibility
8.  Rank recovery options
9.  Recommend cargo transfer / vehicle replacement / repair
10. Require manager approval
11. Apply recovery plan
12. Reassign recoverable orders
13. Recalculate ETAs
14. Emit real-time events
```

**Recovery score:**
```text
recoveryScore =
  0.30 * responseTimeScore +
  0.20 * deliveryRiskScore +
  0.15 * capacityCompatibility +
  0.15 * repairFeasibility +
  0.10 * distanceScore +
  0.10 * costScore
```

**Key principle:** *Recover the delivery, not just the vehicle.* For critical cargo, prioritize a compatible support vehicle over waiting on the original vehicle if it can continue the shipment sooner.

---

## 13. Mixed Fleet Intelligence

- **Diesel:** prefer for suitable long-distance / heavier shipments.
- **EV:** prefer for suitable urban/short routes when battery/range and charging availability are acceptable.
- **Hybrid:** flexible option for mixed-distance, time-sensitive deliveries.
- Always surface the **reason** for the assignment in the UI (payload, range, fuel/battery, cost, emissions, health).

---

## 14. Logistics AI Agent

Implement as a **structured operational assistant** — the app must not depend on an LLM.

**Supported commands:** optimize fleet, simulate breakdown, generate recovery plan, identify at-risk deliveries, explain recommendation.

**Response schema (always returned by `/api/ai/ask`):**
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

Optional LLM path: gated behind `ENABLE_LLM=false`; must enforce JSON output matching the schema above; sanitize data before sending to any external model. The agent recommends and explains only — it must never claim or perform autonomous control; approval gates remain in force.

---

## 15. Real-time Behavior (Socket.IO)

Events: `fleet:vehicle_updated`, `order:updated`, `incident:created`, `incident:recovery_generated`, `incident:recovery_approved`, `fleet:reoptimized`, `eta:updated`, `event:new`.

Breakdown simulation must update the incident panel/map immediately, then push recovery and ETA updates — no page refresh required anywhere in the app.

---

## 16. Map Strategy

- Leaflet + OpenStreetMap.
- All demo locations are seeded; draw simple route polylines from stored points.
- Animate marker positions only if time permits.
- Do not make Google Maps/Mapbox routing a hard dependency — add an adapter layer later if production routing is needed post-hackathon.

---

## 17. Demo Seed Data

- 8 vehicles: 3 Diesel, 3 EV, 2 Hybrid
- 20 orders
- 3 support vehicles, 3 repair centers, 2 company depots, 3 charging stations

**Seed one obvious breakdown case:**
- Vehicle `V102`, 13 remaining deliveries, 4 critical
- Failure: `ENGINE_FAILURE`, location label: `NH-44 Demo Point`
- Nearby: support vehicle `SV-04`, repair center `RC-02`

`POST /api/demo/reset` must restore this exact state instantly, at any time.

---

## 18. Demo Scenarios (must all work end-to-end)

**A — Normal optimization:** open dashboard → show fleet/orders → click Optimize Fleet → show assignments, ETAs, utilization.

**B — New urgent order:** create a CRITICAL order with a near deadline → Re-optimize → show one vehicle reassignment → show changed ETA/event feed.

**C — Vehicle breakdown (main demo, must finish in under 3 minutes):**
1. Select `V102` → 2. Simulate Breakdown → 3. Show incident on map → 4. Show 13 affected shipments → 5. Highlight 4 critical → 6. Generate recovery options → 7. Compare support vehicle vs repair center vs depot → 8. Approve cargo transfer + repair → 9. Show reassigned critical orders → 10. Show updated ETAs and event feed.

---

## 19. Validation, Error Handling & Security

- Validate all required fields on frontend and backend.
- Never allow negative capacity, fuel, battery, or invalid coordinates.
- Show loading, empty, and error states everywhere.
- Confirm before breakdown simulation and before recovery approval.
- Never silently change the live plan.
- Label simulated incidents `DEMO / SIMULATION`.
- Log important changes to EventLog.
- Roles `MANAGER` / `DRIVER`; manager-only endpoints for optimization and recovery approval.
- Secrets in `.env` only; never expose MongoDB credentials to the frontend.
- Add Helmet and CORS; simple rate limiting on AI endpoints if time permits.

---

## 20. Environment Variables

**Backend**
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/TransportoX
JWT_SECRET=change-me
CLIENT_URL=http://localhost:5173
ENABLE_LLM=false
LLM_API_KEY=
```

**Frontend**
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## 21. One-Day Development Plan (build in this order; verify each phase before moving on)

| Time | Phase | Work | Result |
|---|---|---|---|
| 0:00–0:45 | 1 | Setup | React + Express + MongoDB + base UI scaffold |
| 0:45–2:00 | 2 | Models + seed | Vehicle, Order, Incident, SupportResource, EventLog + `/api/demo/reset` |
| 2:00–3:30 | 3 | CRUD | Vehicle + Order pages and APIs |
| 3:30–5:00 | 4 | Dashboard/map | KPIs, markers, event feed |
| 5:00–6:30 | 5 | Assignment engine | Optimize endpoint + result UI |
| 6:30–8:00 | 6 | Recovery engine | Breakdown + ranked recovery options |
| 8:00–9:00 | 7 | Mixed fleet + AI | Rules engine + structured agent |
| 9:00–10:00 | 8 | Realtime + polish | Socket.IO + loading/error states |
| 10:00–11:00 | 9 | Demo testing | Run all 3 scenarios, fix blockers |
| 11:00–12:00 | 10 | Packaging | README + final seed state + backup demo path |

---

## 22. Quality Bar

- No placeholder buttons that do nothing. No broken routes.
- Loading, empty, and error states everywhere.
- Validate inputs on both ends.
- Recovery actions are always approval-based, never automatic.
- Demo data is resettable at any time.
- Concise README with setup commands, env variables, and demo steps.
- Simple, readable code and reusable components.
- Do not introduce libraries unless they materially reduce build time.

---

## 23. MVP Acceptance Criteria (definition of done)

- App starts locally with a simple root command or clear frontend/backend commands.
- Seeded dashboard loads without manual data entry.
- Optimize Fleet produces visible assignments.
- Breakdown simulation creates an incident.
- Incident center identifies affected orders.
- Recovery resources are ranked.
- Manager can approve a recovery plan.
- Critical orders can be reassigned to a support vehicle.
- ETAs/statuses update without page reload.
- Diesel/EV/Hybrid logic is visible with a stated reason.
- AI assistant supports at least four useful operational commands.
- Breakdown recovery demo completes in under three minutes.

---

## 24. Hackathon Rubric Alignment

| Rubric | What TransportoX demonstrates |
|---|---|
| Innovation | Fleet Rescue & Recovery Intelligence; shipment continuity during vehicle failure |
| Originality | Recovery-first logistics + mixed-fleet intelligence + explainable AI agent |
| Realistic Capability | Simulation-first MVP with clear boundaries and manager approval |
| Value Addition | Reduced disruption, downtime, and inefficient emergency coordination |
| Model Design | Modular monolith with services/controllers/models |
| Domain Knowledge | Capacity, priority, deadlines, fleet types, recovery resources, ETA |
| Methodology | Phased development, validation, seeded scenarios |
| Technology | React + Express + MongoDB + Socket.IO + map + optional AI |
| Presentation / Code | Clear UI, reusable components, validation, error handling |

---

## 25. Final Pre-Demo Checklist

- [ ] Reset demo data works
- [ ] Dashboard loads quickly
- [ ] Optimize Fleet visibly changes assignments
- [ ] Breakdown is visible on the map and Incident Center
- [ ] Affected shipments are correctly identified
- [ ] Recovery options are understandable and ranked
- [ ] Approval changes truck/order statuses without page reload
- [ ] ETA changes are visible
- [ ] Mixed-fleet recommendations show their reason
- [ ] AI agent produces useful structured actions
- [ ] No secrets are committed
- [ ] README has exact setup and demo commands

---

## 26. MASTER PROMPT — paste this block into the AI IDE as the first instruction

```text
You are building TransportoX, a one-day hackathon MVP for transportation/logistics. The goal is a polished, demo-ready web application, not an over-engineered production platform.

PRODUCT
TransportoX = AI-Based Dynamic Fleet Optimization & Intelligent Vehicle Recovery.
Core challenge features: vehicle capacity, delivery priority, delivery time windows, traffic/road-condition simulation, automatic re-optimization, vehicle assignment, minimize distance/time/fuel, driver navigation view, customer ETA, fleet manager dashboard.
Differentiator: Fleet Rescue & Recovery Intelligence. When a vehicle breaks down, locate it, identify affected shipments, find suitable support vehicles/repair centers/company depots/charging stations, rank recovery options, recommend cargo transfer or vehicle replacement, update ETAs, and re-optimize the fleet.
Signature principle: "Recover the delivery, not just the vehicle."
Future-ready feature: Mixed Fleet Intelligence across Diesel, EV, Hybrid.
AI feature: Logistics AI Agent that turns manager goals into explainable, approval-based actions.

MVP CONSTRAINTS
- Must be buildable and demoable in one day.
- Use one monorepo and one Express backend, not microservices.
- The app must work without paid APIs or an LLM key.
- Use seeded demo data and deterministic algorithms as the default.
- Use Leaflet/OpenStreetMap for the map; use seeded demo coordinates and simple polylines instead of relying on external routing for the core demo.
- If an LLM integration is added, make it optional behind ENABLE_LLM=false.

STACK
Frontend: Vite, React, React Router, Tailwind, Axios, TanStack Query, React Leaflet, Socket.IO client.
Backend: Node, Express, Mongoose, Socket.IO, Zod/Joi, Helmet, CORS.
Database: MongoDB.

UI
Build a dark futuristic cloud logistics command center. Shared sidebar/topbar. Dashboard with KPI cards, live map, event feed, AI recommendation panel. Dedicated Vehicles, Orders, Optimization, Incidents, Tracking and Settings pages. Keep visual hierarchy strong and readable.

DATA MODELS
Vehicle: vehicleId, plateNumber, type[DIESEL|EV|HYBRID], status[AVAILABLE|ASSIGNED|EN_ROUTE|IDLE|BREAKDOWN|REPAIR], capacityKg, currentLoadKg, location{lat,lng,label}, fuelPct, batteryPct, rangeKm, healthScore, driverName, capabilities[], updatedAt.
Order: orderId, pickup{...}, destination{...}, weightKg, volumeM3, priority[LOW|NORMAL|HIGH|CRITICAL], deadline, status[PENDING|ASSIGNED|IN_TRANSIT|DELIVERED|AT_RISK|RECOVERY], assignedVehicleId, eta, requiredVehicleType.
Incident: incidentId, vehicleId, type, severity, location, affectedOrderIds[], criticalOrderIds[], status, recommendedAction, selectedRecoveryId, createdAt, resolvedAt.
SupportResource: resourceId, type[SUPPORT_VEHICLE|REPAIR_CENTER|COMPANY_DEPOT|CHARGING_STATION], name, status, location, vehicleType, capacityKg, serviceTypes[], estimatedResponseMin, companyOwned, phone.
EventLog: type, message, entityType, entityId, severity, metadata, createdAt.

API
GET /api/health
GET/POST/PATCH /api/vehicles
GET/POST/PATCH /api/orders
POST /api/optimization/run
GET /api/optimization/preview
POST /api/incidents/simulate-breakdown
GET /api/incidents
GET /api/incidents/:id
POST /api/incidents/:id/recommend-recovery
POST /api/incidents/:id/approve-recovery
GET /api/support-resources/nearby
POST /api/ai/ask
GET /api/events
POST /api/demo/reset

ASSIGNMENT LOGIC
First enforce hard constraints. Then score eligible vehicles:
assignmentScore = 0.25 capacityFit + 0.20 deadlineFit + 0.15 priorityFit + 0.15 distanceFit + 0.10 vehicleTypeFit + 0.10 energyOrFuelFit + 0.05 healthFit.
Normalize components 0..100. For EV, keep a 20% range reserve in demo rules.
ETA = distance/speed adjusted by traffic multiplier.

RECOVERY LOGIC
On breakdown: find active orders assigned to vehicle. Rank by priority/deadline. Find nearby support vehicles, repair centers, depots, charging stations. Filter by compatibility/capacity. Score options:
recoveryScore = 0.30 responseTimeScore + 0.20 deliveryRiskScore + 0.15 capacityCompatibility + 0.15 repairFeasibility + 0.10 distanceScore + 0.10 costScore.
For critical shipments, prefer cargo transfer if eligible support capacity exists. Mark original vehicle BREAKDOWN/REPAIR. Reassign recoverable orders. Recalculate ETAs. Emit Socket.IO events. Require manager approval before final apply.

MIXED FLEET
Diesel for suitable long/heavy trips. EV for suitable short/urban trips with battery/range constraints. Hybrid as flexible option. Expose the reason for every assignment.

AI AGENT
Implement a structured operational assistant. Supported commands: optimize fleet, simulate breakdown, generate recovery plan, identify at-risk deliveries, explain recommendation. Return {action, summary, reasons[], affectedEntities[], recommendedChanges[], requiresApproval}. Never claim autonomous control.

REALTIME
Socket.IO events: fleet:vehicle_updated, order:updated, incident:created, incident:recovery_generated, incident:recovery_approved, fleet:reoptimized, eta:updated, event:new.

DEMO SCENARIOS
1) Normal optimize: seed 8 vehicles and 20 orders, run optimize.
2) New urgent order: add critical order with near deadline and re-optimize.
3) Breakdown: V102 breaks down on NH-44; show 13 affected orders, 4 critical, rank support vehicle vs repair center vs depot, approve cargo transfer + repair, update ETAs.

IMPLEMENTATION ORDER
Phase 1: scaffold repo, env, database, base UI.
Phase 2: models + seed/reset.
Phase 3: CRUD APIs/pages.
Phase 4: dashboard/map.
Phase 5: assignment engine.
Phase 6: incident/recovery engine.
Phase 7: mixed fleet + AI agent.
Phase 8: realtime + polish + demo test.

QUALITY BAR
- No placeholder buttons that do nothing.
- No broken routes.
- Use loading, empty and error states.
- Validate inputs.
- Keep recovery actions approval-based.
- Keep demo data resettable.
- Provide a concise README with setup commands, env variables and demo steps.
- Prefer simple, readable code and reusable components.
- Do not introduce libraries unless they materially reduce build time.

START NOW
First generate the project structure and setup files, then implement Phase 1 and Phase 2 completely. After each phase, verify that the app starts and the requested endpoints/components work before moving on. Do not skip validation, loading states, or the approval-based recovery flow to save time — instead simplify visuals or defer P1 pages (Tracking, Settings) if time runs short.
```

---

**How to use this document:** paste the whole file into your AI IDE (Cursor, Claude Code, Copilot Workspace, etc.) as the first message, or point it at this file directly. Section 26 alone is enough to start the build; the rest of the document is the reference the agent should return to for details on any given phase.
