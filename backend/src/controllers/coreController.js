import { geocodeSchema, routeSchema, fareSchema } from '../validators/schemas.js'
import { geocodeAddress, calculateRoute } from '../services/maps.js'
import { calculateFare } from '../services/fare.js'
export async function geocode(request, response) { response.json(await geocodeAddress(geocodeSchema.parse(request.body).address)) }
export async function route(request, response) { const input = routeSchema.parse(request.body); response.json(await calculateRoute(input.origin, input.destination)) }
export async function fareEstimate(request, response) { const input = fareSchema.parse(request.body); response.json({ fare: calculateFare({ distanceKm: input.distance_km, cargoWeightKg: input.cargo_weight_kg }) }) }
