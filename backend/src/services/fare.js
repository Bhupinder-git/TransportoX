import { env } from '../config/env.js'

export function calculateFare({ distanceKm, cargoWeightKg, base = env.fareBase, perKm = env.farePerKm, perKg = env.farePerKg }) {
  return Math.round((base + (distanceKm * perKm) + (cargoWeightKg * perKg)) * 100) / 100
}
