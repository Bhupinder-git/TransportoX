const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' }
const ORS_URL = 'https://api.openrouteservice.org'

function json(data: unknown, status = 200) { return new Response(JSON.stringify(data), { status, headers: { ...cors, 'Content-Type': 'application/json' } }) }
async function geocode(address: string) {
  const response = await fetch(`${ORS_URL}/geocode/search?${new URLSearchParams({ api_key: Deno.env.get('ORS_API_KEY') || '', text: address, size: '1' })}`)
  const data = await response.json()
  if (!response.ok || !data.features?.[0]) throw new Error(data.error?.message || `Location not found: ${address}`)
  const feature = data.features[0]
  return { formatted_address: feature.properties.label, lat: feature.geometry.coordinates[1], lng: feature.geometry.coordinates[0] }
}
async function route(pickup: { lat: number, lng: number }, dropoff: { lat: number, lng: number }) {
  const response = await fetch(`${ORS_URL}/v2/directions/driving-car/geojson`, { method: 'POST', headers: { Authorization: Deno.env.get('ORS_API_KEY') || '', 'Content-Type': 'application/json' }, body: JSON.stringify({ coordinates: [[pickup.lng, pickup.lat], [dropoff.lng, dropoff.lat]] }) })
  const data = await response.json()
  if (!response.ok || !data.features?.[0]) throw new Error(data.error?.message || 'Unable to calculate route')
  const feature = data.features[0]; const summary = feature.properties.summary
  return { distance_km: Math.round(summary.distance / 10) / 100, duration_min: Math.ceil(summary.duration / 60), geometry: feature.geometry }
}
function fare(distanceKm: number, weightKg: number) { return Math.round((500 + distanceKm * 25 + weightKg * 2) * 100) / 100 }
async function aiEstimate(body: { distance_km: number, duration_min: number, cargo_weight_kg: number, fare: number }) {
  const fallback = { fare: body.fare, duration_min: body.duration_min, confidence: 'standard', source: 'deterministic-fallback' }
  const key = Deno.env.get('GEMINI_API_KEY')
  if (!key) return fallback
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${key}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: `You optimize a cargo delivery estimate. Return JSON only with fare and duration_min. Never reduce fare below the supplied fare. Use distance ${body.distance_km} km, route duration ${body.duration_min} minutes, cargo weight ${body.cargo_weight_kg} kg, base fare ${body.fare} INR. Adjust only for cargo handling complexity and realistic traffic, and keep duration within 2x of the route duration.` }] }] }) })
    const data = await response.json(); const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''; const parsed = JSON.parse(text.replace(/```json|```/g, '').trim()); const optimizedFare = Number(parsed.fare); const optimizedDuration = Number(parsed.duration_min)
    if (!Number.isFinite(optimizedFare) || !Number.isFinite(optimizedDuration)) return fallback
    return { fare: Math.round(Math.max(body.fare, optimizedFare) * 100) / 100, duration_min: Math.max(1, Math.round(optimizedDuration)), confidence: 'ai-optimized', source: 'gemini' }
  } catch { return fallback }
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: cors })
  try {
    if (!Deno.env.get('ORS_API_KEY')) return json({ error: 'ORS_API_KEY is not configured in Supabase secrets.' }, 503)
    const body = await request.json()
    if (body.action === 'geocode') return json(await geocode(body.address))
    if (body.action === 'route') return json(await route(body.pickup, body.dropoff))
    if (body.action === 'fare') return json({ fare: fare(Number(body.distance_km), Number(body.cargo_weight_kg || 0)) })
    if (body.action === 'ai-estimate') return json(await aiEstimate({ distance_km: Number(body.distance_km), duration_min: Number(body.duration_min), cargo_weight_kg: Number(body.cargo_weight_kg || 0), fare: Number(body.fare) }))
    return json({ error: 'Unsupported action' }, 400)
  } catch (error) { return json({ error: error.message || 'Routing request failed' }, 400) }
})
