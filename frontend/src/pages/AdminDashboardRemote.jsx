import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { useCompanyRequests, useCompanyVehicles, useCompanyDrivers, useCompanyIncidents } from '../hooks/useSupabaseData'
import StatusBadge from '../components/StatusBadge'
import FleetMap from '../components/FleetMap'

export default function AdminDashboardRemote(){
  const {session}=useAuth()
  const {data:requests}=useCompanyRequests(session.partnerId)
  const {data:vehicles}=useCompanyVehicles(session.partnerId)
  const {data:drivers}=useCompanyDrivers(session.partnerId)
  const {data:incidents}=useCompanyIncidents(session.partnerId)
  return <>
    <div className="page-header"><div><div className="eyebrow">{session.partnerName?.toUpperCase()} / ADMIN CONTROL</div><h1>Operations dashboard</h1><p>Verify customer requests, dispatch vehicles, and monitor your company delivery exceptions.</p></div><Link className="button primary-button" to="/admin/drivers">＋ Register driver</Link></div>
    <div className="admin-kpis"><div><span>PENDING VERIFICATION</span><b>{requests.filter(item=>item.status==='PENDING_APPROVAL').length.toString().padStart(2,'0')}</b></div><div><span>ACTIVE ORDERS</span><b>{requests.filter(item=>!['DELIVERED','REJECTED'].includes(item.status)).length.toString().padStart(2,'0')}</b></div><div><span>DRIVERS ON DUTY</span><b>{drivers.filter(item=>item.status==='AVAILABLE').length.toString().padStart(2,'0')}</b></div><div><span>OPEN INCIDENTS</span><b className="danger-text">{incidents.length.toString().padStart(2,'0')}</b></div></div>
    <div className="admin-dashboard-grid"><section className="panel verification-panel"><div className="panel-heading"><div><div className="eyebrow">ORDER VERIFICATION QUEUE</div><h2>Requests for {session.partnerName}</h2></div><Link className="text-link" to="/admin/requests">Full queue →</Link></div>{requests.length===0?<div className="empty-state">New customer orders for your company will appear here.</div>:requests.slice(0,6).map(item=><div className="verification-row" key={item.id}><div><b>{item.id.slice(0,8)}</b><span>{item.pickup} → {item.dropoff}</span></div><div><b>{item.payload_weight_kg} kg</b><span>{item.quoted_price_inr?`₹${Number(item.quoted_price_inr).toLocaleString('en-IN')}`:'Quote pending'}</span></div><StatusBadge>{item.status.replaceAll('_',' ')}</StatusBadge><div className="queue-actions"><Link to="/admin/requests">Review</Link></div></div>)}</section>
      <section className="panel"><div className="panel-heading"><div><div className="eyebrow">FLEET MAP / INCIDENTS</div><h2>{session.partnerName} dispatch</h2></div><StatusBadge>LIVE</StatusBadge></div><FleetMap compact companyId={session.partnerId} vehicleData={vehicles}/><div className="incident-strip"><span className="event-dot critical"/><div><b>{incidents[0]?.issue_type||'No active incidents'}</b><small>{incidents[0]?.reason||'Fleet operating normally'}</small></div><Link to="/admin/incidents">Review →</Link></div></section></div>
  </>
}
