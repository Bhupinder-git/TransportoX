import { supabaseAdmin } from '../db/supabase.js'

export async function requireAuth(request, response, next) {
  try {
    const token = request.headers.authorization?.replace(/^Bearer\s+/i, '')
    if (!token) return response.status(401).json({ error: 'Bearer token is required' })
    const { data, error } = await supabaseAdmin.auth.getUser(token)
    if (error || !data.user) return response.status(401).json({ error: 'Invalid or expired token' })
    request.authUser = data.user
    next()
  } catch (error) { next(error) }
}
