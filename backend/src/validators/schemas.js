import { z } from 'zod'

export const geocodeSchema = z.object({ address: z.string().trim().min(3) })
export const routeSchema = z.object({ origin: z.string().trim().min(2), destination: z.string().trim().min(2) })
export const fareSchema = z.object({ distance_km: z.number().nonnegative(), cargo_weight_kg: z.number().positive() })
export const orderSchema = z.object({
  company_id: z.string().uuid(), pickup_address: z.string().trim().min(2), pickup_lat: z.number().gte(-90).lte(90), pickup_lng: z.number().gte(-180).lte(180),
  dropoff_address: z.string().trim().min(2), dropoff_lat: z.number().gte(-90).lte(90), dropoff_lng: z.number().gte(-180).lte(180),
  cargo_type: z.string().trim().min(2), cargo_weight_kg: z.number().positive(), cargo_dimensions: z.record(z.number().positive()).default({}), fare: z.number().nonnegative().optional(), distance_km: z.number().nonnegative().optional(), duration_min: z.number().int().nonnegative().optional(), notes: z.string().max(2000).optional()
})
export const statusSchema = z.object({ status: z.enum(['placed','accepted','picked_up','in_transit','delivered','cancelled']) })
