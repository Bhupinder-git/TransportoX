const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' }
function json(data: unknown, status = 200) { return new Response(JSON.stringify(data), { status, headers: { ...cors, 'Content-Type': 'application/json' } }) }
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
async function aiRecovery(hasReplacement: boolean, distanceKm: number | null) {
  const apiKey = Deno.env.get('GEMINI_API_KEY')
  const fallback = hasReplacement
    ? { eta_minutes: 30, reason: 'Nearest available replacement vehicle requested.' }
    : { eta_minutes: 90, reason: 'No available replacement vehicle accepted; nearest repair-center dispatch requested.' }
  if (!apiKey) return fallback
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: `You are a logistics recovery assistant. Return JSON only with eta_minutes and reason. A vehicle failure occurred. replacement_available=${hasReplacement}; nearest_vehicle_distance_km=${distanceKm ?? 'unknown'}. Choose a realistic ETA between ${hasReplacement ? 15 : 45} and 180 minutes and explain the safest next action in under 100 characters.` }] }] })
    })
    if (!response.ok) return fallback
    const payload = await response.json()
    const text = payload?.candidates?.[0]?.content?.parts?.[0]?.text?.replace(/```json|```/g, '').trim()
    const result = JSON.parse(text)
    const eta = Number(result.eta_minutes)
    if (!Number.isFinite(eta)) return fallback
    return { eta_minutes: Math.max(15, Math.min(180, Math.round(eta))), reason: String(result.reason || fallback.reason).slice(0, 240) }
  } catch { return fallback }
}
Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: cors })
  try {
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
    const { request_id, incident_id: suppliedIncidentId, company_id, driver_id, issue_type, reason: failureReason } = await request.json()
    const { data: order, error: orderError } = await supabase.from('delivery_requests').select('id,customer_id,company_id,payload_weight_kg,pickup_lat,pickup_lng').eq('id', request_id).single()
    if (orderError || !order) throw new Error('Delivery request not found')
    let incident_id = suppliedIncidentId
    if (!incident_id) {
      const { data: incident, error: incidentError } = await supabase.from('incidents').insert({ request_id, driver_id: driver_id || null, company_id: company_id || order.company_id, issue_type: issue_type || 'Vehicle failure', reason: failureReason || 'Driver reported a vehicle failure', status: 'AI_RECOVERY_STARTED' }).select('id').single()
      if (incidentError || !incident) throw new Error(`Unable to create incident: ${incidentError?.message || 'unknown error'}`)
      incident_id = incident.id
    }
    const targetCompany = company_id || order.company_id
    let vehicle = null
    let distanceKm = null
    if (order.pickup_lat != null && order.pickup_lng != null) {
      const { data: nearest } = await supabase.rpc('find_nearest_available_vehicle', { target_company: targetCompany, target_lat: order.pickup_lat, target_lng: order.pickup_lng, radius_km: 50, target_weight_kg: order.payload_weight_kg })
      const nearestVehicle = nearest?.[0]
      if (nearestVehicle) {
        distanceKm = nearestVehicle.distance_km
        const { data } = await supabase.from('vehicles').select('id,vehicle_number,capacity_kg').eq('id', nearestVehicle.vehicle_id).single()
        vehicle = data
      }
    }
    if (!vehicle) {
      const { data: vehicles } = await supabase.from('vehicles').select('id,vehicle_number,capacity_kg').eq('company_id', targetCompany).eq('status', 'AVAILABLE').gte('capacity_kg', order.payload_weight_kg).limit(1)
      vehicle = vehicles?.[0] || null
    }
    const recoveryPlan = await aiRecovery(Boolean(vehicle), distanceKm)
    const etaMinutes = recoveryPlan.eta_minutes
    const reason = vehicle ? `Available replacement vehicle ${vehicle.vehicle_number} requested. ${recoveryPlan.reason}` : recoveryPlan.reason
    const { data: recovery, error: recoveryError } = await supabase.from('vehicle_recovery_requests').insert({ request_id, incident_id, company_id: company_id || order.company_id, vehicle_id: vehicle?.id || null, status: vehicle ? 'REQUESTED' : 'REPAIR_CENTER_REQUESTED', eta_minutes: etaMinutes, ai_reason: reason }).select().single()
    if (recoveryError) throw recoveryError
    await supabase.from('delivery_requests').update({ status: 'BREAKDOWN', updated_at: new Date().toISOString(), eta: new Date(Date.now() + etaMinutes * 60000).toISOString() }).eq('id', request_id)
    await supabase.from('notifications').insert({ user_id: order.customer_id, request_id, title: vehicle ? 'Replacement vehicle requested' : 'Repair center dispatched', message: `${reason} Updated recovery ETA: ${etaMinutes} minutes.` })
    return json({ recovery, vehicle, eta_minutes: etaMinutes, source: Deno.env.get('GEMINI_API_KEY') ? 'gemini-recovery' : 'safe-recovery-fallback' })
  } catch (error) { return json({ error: error.message || 'Recovery workflow failed' }, 400) }
})
