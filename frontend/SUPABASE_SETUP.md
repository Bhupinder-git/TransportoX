# Supabase setup

The frontend uses Supabase automatically when both variables below are present. Without them it keeps the seeded local demo mode.

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
```

## Apply the database

From the repository root, install the Supabase CLI, link the project, and apply the migration:

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push --workdir frontend
```

The migrations create companies, profiles, vehicles, drivers, delivery requests, delivery images, incidents, invoices, notifications, order events, marketplace pricing fields, RLS policies, and the private `delivery-images` bucket.

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
