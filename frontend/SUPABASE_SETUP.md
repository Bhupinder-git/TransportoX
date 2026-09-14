# Supabase setup

The frontend uses Supabase automatically when both variables below are present. Without them it keeps the seeded local demo mode.

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
```

## Routing without a Node server

Routing runs through the deployed Supabase Edge Function `routing`. The ORS key is stored only as the Supabase secret `ORS_API_KEY`; it is never exposed in frontend code. The function provides geocoding, OpenRouteService directions, and INR fare estimation. The frontend draws the returned GeoJSON route with Leaflet and OpenStreetMap tiles.

Set the secret once:

```powershell
npx supabase secrets set ORS_API_KEY="your_ors_key" --project-ref YOUR_PROJECT_REF
npx supabase functions deploy routing --project-ref YOUR_PROJECT_REF
```

The routing function can use Gemini to optimize the verified route fare and ETA. Keep the Gemini key server-side as a Supabase secret, then deploy both functions:

```powershell
npx supabase secrets set GEMINI_API_KEY="your_gemini_key" --project-ref YOUR_PROJECT_REF
npx supabase functions deploy routing --project-ref YOUR_PROJECT_REF
npx supabase functions deploy recover-failure --project-ref YOUR_PROJECT_REF
```

If Gemini is unavailable, the app uses the deterministic INR fare and route duration returned by OpenRouteService. It never displays a price or ETA before both addresses are geocoded and the route is calculated.

No Node, Express, Render, or other server process is required for the frontend routing flow.

`VITE_SUPABASE_ANON_KEY` is also accepted as an alternative name for the publishable key.

For Vercel, set the project Root Directory to `frontend`, add both variables for the Preview and Production environments, then redeploy. Vite embeds `VITE_*` values during the build, so changing a variable does not update an existing deployment until it is rebuilt.

## Apply the database

From the repository root, install the Supabase CLI, link the project, and apply the migration:

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push --workdir frontend
```

The migrations create companies, profiles, vehicles, drivers, delivery requests, delivery images, incidents, invoices, notifications, order events, marketplace pricing fields, RLS policies, and the private `delivery-images` bucket.

The vehicle-recovery migration also adds vehicle coordinates, a PostGIS nearest-vehicle lookup, and recovery requests. When a driver raises a failure, the recovery function requests a nearby eligible vehicle first; if none is available it records a repair-center dispatch and updates the order ETA and customer notification.

## Driver registration function

Deploy the secure Edge Function after setting the service-role secret in Supabase:

```bash
supabase functions deploy create-driver --project-ref YOUR_PROJECT_REF
```

The service-role key is used only inside the function. Never place it in `VITE_*` variables or browser code.

## Auth flow

- Customers, company admins, and drivers use Supabase email/password Auth.
- The `profiles` row determines the role and company scope.
- Company admins can only access rows with their `company_id` through RLS.
- Driver accounts are created by the `create-driver` Edge Function and can sign in with the returned email/password.

The current seeded demo accounts remain available when Supabase is not configured, which keeps local UI development possible before the project credentials are added.

## Seed Supabase testing data

Deploy the protected demo seeder:

```bash
supabase functions deploy seed-demo --project-ref YOUR_PROJECT_REF
supabase secrets set SEED_SECRET="choose-a-one-time-secret" --project-ref YOUR_PROJECT_REF
```

Invoke it once from PowerShell:

```powershell
Invoke-RestMethod -Method Post `
  -Uri "https://YOUR_PROJECT_REF.supabase.co/functions/v1/seed-demo" `
  -Headers @{ "x-seed-secret" = "choose-a-one-time-secret" }
```

The seeder is idempotent and creates Swiftline Transport, Northstar Logistics, one company admin, one customer, one driver, vehicles, an assigned delivery request, and a notification.

When the `VITE_SUPABASE_*` variables are configured, the primary admin, customer, and driver routes use Supabase data and mutations. Local demo stores are only used when Supabase is not configured.

Test credentials:

```text
Admin:   admin.swiftline@transportox.local / SwiftlineAdmin123!
Customer: customer@transportox.local / Customer123!
Driver:  driver.swiftline@transportox.local / Driver123!
```
