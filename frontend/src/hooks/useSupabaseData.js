import { useEffect, useState } from 'react'
import { isSupabaseConfigured } from '../lib/supabase'
import { listCompanyVehicles, listCompanyDrivers, listRequests, listCompanies, listNotifications, listIncidents, listDriverRequests } from '../services/supabaseData'
function useRemote(loader, deps=[]) { const [data,setData]=useState([]); const [loading,setLoading]=useState(true); const [error,setError]=useState(null); useEffect(()=>{let active=true;setLoading(true);loader().then(value=>{if(active)setData(value||[])}).catch(setError).finally(()=>{if(active)setLoading(false)});return()=>{active=false}},deps);return {data,loading,error,refresh:()=>loader().then(setData)} }
export function useCompanyVehicles(companyId){return useRemote(()=>listCompanyVehicles(companyId),[companyId])}
export function useCompanyDrivers(companyId){return useRemote(()=>listCompanyDrivers(companyId),[companyId])}
export function useCompanyRequests(companyId){return useRemote(()=>listRequests({companyId}),[companyId])}
export function useCustomerRequests(customerId){return useRemote(()=>listRequests({customerId}),[customerId])}
export function useCompanies(){return useRemote(listCompanies,[])}
export function useNotifications(userId){return useRemote(()=>listNotifications(userId),[userId])}
export function useCompanyIncidents(companyId){return useRemote(()=>listIncidents(companyId),[companyId])}
export function useDriverRequests(driverId){return useRemote(()=>listDriverRequests(driverId),[driverId])}
export { isSupabaseConfigured }
