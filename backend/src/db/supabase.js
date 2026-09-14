import { createClient } from '@supabase/supabase-js'
import { env } from '../config/env.js'

export const supabaseAdmin = createClient(env.supabaseUrl, env.serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } })
