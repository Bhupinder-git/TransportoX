import { supabase } from '../lib/supabase'

export async function signInWithSupabase(email, password) { const { data, error } = await supabase.auth.signInWithPassword({ email, password }); if (error) throw error; const profile = await getProfile(data.user.id); return { ...data.user, ...profile } }
export async function getProfile(userId) { const { data, error } = await supabase.from('profiles').select('id,name,email,role,company_id,company_name,driver_id,vehicle_id').eq('id',userId).single(); if (error) throw error; const roleMap={COMPANY_ADMIN:'admin',PLATFORM_ADMIN:'admin',CUSTOMER:'user',DRIVER:'driver'}; return { id:data.id, name:data.name, email:data.email, role:roleMap[data.role]||'user', partnerId:data.company_id, partnerName:data.company_name, companyName:data.company_name, driverId:data.driver_id, vehicle:data.vehicle_id } }
export async function signOutFromSupabase() { await supabase.auth.signOut() }
