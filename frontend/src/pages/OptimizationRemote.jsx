import { useAuth } from '../auth/AuthContext'
import { useCompanyRequests, useCompanyVehicles } from '../hooks/useSupabaseData'
import PageHeader from '../components/PageHeader'
import StatusBadge from '../components/StatusBadge'

export default function OptimizationRemote(){
  const {session}=useAuth(); const {data:requests}=useCompanyRequests(session.partnerId); const {data:vehicles}=useCompanyVehicles(session.partnerId)
  const pending=requests.filter(item=>!['DELIVERED','REJECTED'].includes(item.status)); const available=vehicles.filter(item=>item.status==='AVAILABLE')
  return <>
    <PageHeader eyebrow="DECISION ENGINE / LIVE DATA" title="Dynamic optimization" description="Review current company requests and available fleet before assigning vehicles."/>
    <div className="optimization-metrics"><div className="optimization-metric"><small>OPEN REQUESTS</small><strong>{pending.length}</strong><span>Awaiting fleet decisions</span></div><div className="optimization-metric"><small>AVAILABLE VEHICLES</small><strong>{available.length}</strong><span>Ready for assignment</span></div></div>
    <section className="panel optimization-panel"><div className="panel-heading"><div><div className="eyebrow">DISPATCH RECOMMENDATIONS</div><h2>Assignment candidates</h2></div><StatusBadge>SUPABASE DATA</StatusBadge></div>{pending.length===0?<div className="empty-state">No open requests require optimization.</div>:<div className="optimization-candidates">{pending.map(item=>{const match=available.find(vehicle=>Number(vehicle.capacity_kg)>=Number(item.payload_weight_kg));return <article className="optimization-candidate" key={item.id}><div className="optimization-route"><b>{item.pickup} → {item.dropoff}</b><small>{item.id.slice(0,8)} · {item.payload_weight_kg} kg</small></div><StatusBadge>{item.status.replaceAll('_',' ')}</StatusBadge><div className={`optimization-match ${match?'match-found':''}`}><small>RECOMMENDED VEHICLE</small><b>{match?.vehicle_number||'No matching vehicle'}</b>{match&&<span>{match.capacity_kg} kg capacity · {match.status}</span>}</div></article>})}</div>}</section>
  </>
}
