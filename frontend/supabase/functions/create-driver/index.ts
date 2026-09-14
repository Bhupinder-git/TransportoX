import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' }
Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: cors })
  const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  const auth = request.headers.get('Authorization') || ''
  const { data: { user } } = await admin.auth.getUser(auth.replace('Bearer ', ''))
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...cors, 'Content-Type': 'application/json' } })
  const { data: caller } = await admin.from('profiles').select('role,company_id,company_name').eq('id', user.id).single()
  if (!caller || !['COMPANY_ADMIN', 'PLATFORM_ADMIN'].includes(caller.role)) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { ...cors, 'Content-Type': 'application/json' } })
  const body = await request.json()
  if (!body.name || !body.email) return new Response(JSON.stringify({ error: 'Driver name and email are required.' }), { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } })
  const temporaryPassword = body.password || crypto.randomUUID().replaceAll('-', '').slice(0, 12)
  const { data: created, error } = await admin.auth.admin.createUser({ email: body.email, password: temporaryPassword, email_confirm: true, user_metadata: { name: body.name, role: 'DRIVER' } })
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } })
  const companyId = caller.role === 'PLATFORM_ADMIN' ? body.companyId : caller.company_id
  if (!companyId) { await admin.auth.admin.deleteUser(created.user.id); return new Response(JSON.stringify({ error: 'Your account is not linked to a transport company.' }), { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } }) }
  const driverCode = body.driverCode || `DRV-${Math.floor(1000 + Math.random() * 9000)}`
  let vehicleUuid = null
  if (body.vehicleId) {
    const { data: vehicle, error: vehicleError } = await admin.from('vehicles').select('id').eq('id', body.vehicleId).eq('company_id', companyId).maybeSingle()
    if (vehicleError || !vehicle) { await admin.auth.admin.deleteUser(created.user.id); return new Response(JSON.stringify({ error: 'Selected vehicle was not found in your company fleet.' }), { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } }) }
    vehicleUuid = vehicle.id
  }
  const { error: profileError } = await admin.from('profiles').insert({ id: created.user.id, name: body.name, email: body.email, role: 'DRIVER', company_id: companyId, company_name: caller.company_name, driver_id: driverCode, vehicle_id: vehicleUuid })
  if (profileError) { await admin.auth.admin.deleteUser(created.user.id); return new Response(JSON.stringify({ error: profileError.message }), { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } }) }
  const { error: driverError } = await admin.from('drivers').insert({ profile_id: created.user.id, company_id: companyId, driver_code: driverCode, vehicle_id: vehicleUuid, status: 'AVAILABLE' })
  if (driverError) { await admin.from('profiles').delete().eq('id', created.user.id); await admin.auth.admin.deleteUser(created.user.id); return new Response(JSON.stringify({ error: driverError.message }), { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } }) }
  return new Response(JSON.stringify({ email: body.email, password: temporaryPassword, driverId: body.driverCode }), { headers: { ...cors, 'Content-Type': 'application/json' } })
})
