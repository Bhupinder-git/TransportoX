import 'dotenv/config'

export const env = {
  port: Number(process.env.PORT || 4000),
  supabaseUrl: process.env.SUPABASE_URL,
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  publishableKey: process.env.SUPABASE_PUBLISHABLE_KEY,
  googleMapsKey: process.env.GOOGLE_MAPS_API_KEY,
  fareBase: Number(process.env.FARE_BASE || 500),
  farePerKm: Number(process.env.FARE_PER_KM || 25),
  farePerKg: Number(process.env.FARE_PER_KG || 2),
  driverSearchRadiusKm: Number(process.env.DRIVER_SEARCH_RADIUS_KM || 25)
}

if (!env.supabaseUrl || !env.serviceRoleKey) throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required')
