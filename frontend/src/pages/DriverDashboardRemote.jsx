import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { useDriverRequests } from '../hooks/useSupabaseData'
import { recoverFailure } from '../services/supabaseData'
import { calculateRoute, geocodeAddress } from '../services/supabaseRouting'
import RouteMap from '../components/RouteMap'

export default function DriverDashboardRemote(){
  const {session}=useAuth(); const {data:requests,refresh}=useDriverRequests(session.id)
  const [modal,setModal]=useState(false); const [issue,setIssue]=useState('Mechanical Failure'); const [reason,setReason]=useState(''); const [message,setMessage]=useState(''); const [route,setRoute]=useState(null); const [routeError,setRouteError]=useState(''); const [submitting,setSubmitting]=useState(false); const request=requests[0]
  useEffect(()=>{let active=true;async function load(){if(!request)return;try{const pickup=await geocodeAddress(request.pickup);const dropoff=await geocodeAddress(request.dropoff);const details=await calculateRoute(pickup,dropoff);if(active)setRoute({pickup,dropoff,...details})}catch(error){if(active)setRouteError(error.message)}}load();return()=>{active=false}},[request?.id])
  async function submit(){
    if(!request)return setMessage('No assigned delivery is available.')
    if(issue==='Other'&&!reason.trim())return setMessage('Please describe the failure.')
    setSubmitting(true); setMessage('Sending failure report and asking AI dispatch for recovery...')
    try{
      const recovery=await recoverFailure({request_id:request.id,driver_id:session.id,company_id:session.partnerId,issue_type:issue,reason:reason.trim()||issue})
      setMessage(`${recovery.vehicle?`Nearby vehicle ${recovery.vehicle.vehicle_number} requested.`:'No nearby vehicle available; service center requested.'} ${recovery.recovery?.ai_reason||''} ETA updated to ${recovery.eta_minutes} minutes.`)
      setModal(false); setReason(''); await refresh()
    }catch(error){setMessage(`Recovery failed: ${error.message||'Supabase recovery function did not respond.'}`)}finally{setSubmitting(false)}
  }
  const eta=route?new Date(Date.now()+route.duration_min*60000).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}):'Calculating'
  return <><div className="driver-greeting"><div><div className="eyebrow">{session.companyName} / ACTIVE ASSIGNMENT</div><h1>Good afternoon, {session.name?.split(' ')[0]}.</h1><p>You are registered with <b>{session.companyName}</b>. Fleet control is monitoring your route.</p></div><span className="driver-online"><i/> ON DUTY</span></div>{message&&!modal&&<div className="driver-alert"><b>{message}</b></div>}<section className="driver-assignment-card"><div className="assignment-card-head"><div><span className="eyebrow">CURRENT DELIVERY</span><h2>{request?request.id.slice(0,8):'No assignment'}</h2><p>{request?`${request.payload_weight_kg} kg · ${request.pickup} → ${request.dropoff}`:'No active order assigned yet.'}</p></div><span className="driver-status-badge">{request?.status||'AVAILABLE'}</span></div>{request&&<div className="driver-live-map"><div className="route-map">{route?<RouteMap pickup={route.pickup} dropoff={route.dropoff} geometry={route.geometry}/>:<div className="map-setup-message">{routeError||'Calculating live route...'}</div>}</div></div>}<div className="driver-stops"><div><b>Pickup</b><span>{request?.pickup||'—'}</span></div><div><b>Dropoff</b><span>{request?.dropoff||'—'} · ETA {eta}</span></div></div></section><button className="failure-button" onClick={()=>{setMessage('');setModal(true)}}>⚠ Raise Failure</button>{modal&&<div className="modal-backdrop"><div className="failure-modal"><button className="modal-close" onClick={()=>!submitting&&setModal(false)}>×</button><div className="eyebrow">EMERGENCY ASSISTANCE</div><h2>What went wrong?</h2>{['Mechanical Failure','Flat Tire','Accident / Safety','Other'].map(item=><label className="issue-option" key={item}><input type="radio" checked={issue===item} disabled={submitting} onChange={()=>setIssue(item)}/>{item}</label>)}{issue==='Other'&&<textarea className="failure-reason" disabled={submitting} value={reason} onChange={e=>setReason(e.target.value)} placeholder="Describe the failure..."/>}{message&&<div className={message.startsWith('Recovery failed')?'form-error':'driver-alert'}>{message}</div>}<button className="button danger-button wide" disabled={submitting} onClick={submit}>{submitting?'Finding replacement / service center...':'Submit failure report'}</button></div></div>}</>
}
