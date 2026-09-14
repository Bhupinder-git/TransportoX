import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { getProfile, signInWithSupabase, signOutFromSupabase } from '../services/supabaseAuth'

const AuthContext = createContext(null)
export function AuthProvider({children}){const [session,setSession]=useState(null); useEffect(()=>{if(!isSupabaseConfigured)return; supabase.auth.getSession().then(async({data})=>{if(data.session){try{setSession(await getProfile(data.session.user.id))}catch{await supabase.auth.signOut();setSession(null)}}}); const {data:{subscription}}=supabase.auth.onAuthStateChange(async(_event,current)=>{if(!current){setSession(null);return}try{setSession(await getProfile(current.user.id))}catch{setSession(null)}});return()=>subscription.unsubscribe()},[])
  async function login(email,password){if(!isSupabaseConfigured)return {ok:false,message:'Supabase is not configured.'};try{const profile=await signInWithSupabase(email,password);setSession(profile);return {ok:true,role:profile.role,session:profile}}catch(error){return {ok:false,message:error.message}}}
  async function logout(){if(isSupabaseConfigured)await signOutFromSupabase();localStorage.removeItem('transportox-session');setSession(null)}
  const value=useMemo(()=>({session,login,logout,isSupabaseConfigured}),[session]);return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>}
export function useAuth(){return useContext(AuthContext)}
