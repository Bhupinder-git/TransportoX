import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' }

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: cors })
  try {
    const body = await request.json()
    const { name, email, password, role, companyName } = body
    if (!name || !email || !password || !['user', 'admin'].includes(role)) throw new Error('Name, email, password, and account type are required.')
    if (password.length < 8) throw new Error('Password must contain at least 8 characters.')
    if (role === 'admin' && !companyName) throw new Error('Transport company name is required for an admin account.')

    const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
    const created = await admin.auth.admin.createUser({ email, password, email_confirm: true })
    if (created.error || !created.data.user) throw new Error(created.error?.message || 'Unable to create account.')
    const userId = created.data.user.id
    let companyId = null
    if (role === 'admin') {
      const company = await admin.from('companies').insert({ name: companyName, email, status: 'ACTIVE' }).select('id').single()
      if (company.error) { await admin.auth.admin.deleteUser(userId); throw new Error(company.error.message) }
      companyId = company.data.id
    }
    const profile = await admin.from('profiles').insert({ id: userId, name, email, role: role === 'admin' ? 'COMPANY_ADMIN' : 'CUSTOMER', company_id: companyId, company_name: companyName || null }).select('id').single()
    if (profile.error) { if (companyId) await admin.from('companies').delete().eq('id', companyId); await admin.auth.admin.deleteUser(userId); throw new Error(profile.error.message) }
    return new Response(JSON.stringify({ ok: true, role, email }), { headers: { ...cors, 'Content-Type': 'application/json' } })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'Unable to create account.' }), { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } })
  }
})
