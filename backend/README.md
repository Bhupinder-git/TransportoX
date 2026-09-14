# TransportoX backend

Node.js + Express backend foundation for general cargo transport. The API and database are deliberately being built in phases.

## Mobile choice

The planned mobile client will use Expo React Native. Expo provides faster iteration, straightforward FCM/location setup, and easier Android/iOS development. Bare React Native remains an option if native background location or platform-specific driver integrations later require custom native modules.

## Supabase integration

The backend uses the existing Supabase project as its source of truth. It does not create duplicate `users`, `drivers`, or `orders` tables. The integration migration is `frontend/supabase/migrations/202609150001_backend_integration.sql` and adds PostGIS driver locations, order coordinates, order status history, and the nearest-driver RPC to the existing `profiles`, `drivers`, and `delivery_requests` tables.

Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in the backend environment. The service-role key must stay server-side and must never be exposed to the frontend.

The REST API is now available under `/api` for geocoding, routing, fare estimation, and authenticated order operations.

## Planned structure

```text
backend/
├── migrations/
│   └── (Supabase migrations live in ../frontend/supabase/migrations/)
├── src/
│   ├── config/
│   ├── controllers/
│   ├── db/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── sockets/
│   ├── validators/
│   └── server.js
└── tests/
```
