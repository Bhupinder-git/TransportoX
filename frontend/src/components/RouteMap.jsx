import { MapContainer, TileLayer, CircleMarker, Polyline, Popup, useMap } from 'react-leaflet'
import { useEffect, useState } from 'react'

function FitRoute({ points }) { const map=useMap(); useEffect(()=>{if(points.length>1)map.fitBounds(points,{padding:[28,28]});setTimeout(()=>map.invalidateSize(),100)},[map,points]); return null }

export default function RouteMap({ pickup, dropoff, geometry, vehicles = [] }) {
  const [fullscreen,setFullscreen]=useState(false)
  const points=(geometry?.coordinates||[]).map(([lng,lat])=>[lat,lng])
  const vehiclePoints=vehicles.filter(vehicle=>vehicle.current_lat!=null&&vehicle.current_lng!=null).map(vehicle=>[vehicle.current_lat,vehicle.current_lng])
  const center=pickup?[pickup.lat,pickup.lng]:vehiclePoints[0]||[20.5937,78.9629]
  return <div className={`route-map-shell ${fullscreen?'route-map-fullscreen':''}`}><button type="button" className="map-fullscreen-button" onClick={()=>setFullscreen(!fullscreen)}>{fullscreen?'← Back to page':'⛶ Full screen'}</button><MapContainer center={center} zoom={pickup&&dropoff?7:5} scrollWheelZoom className="route-map-canvas"><TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/><FitRoute points={[...points,...vehiclePoints]}/>{pickup&&<CircleMarker center={[pickup.lat,pickup.lng]} pathOptions={{color:'#087ea4',fillColor:'#087ea4',fillOpacity:1}} radius={9}><Popup>Pickup</Popup></CircleMarker>}{dropoff&&<CircleMarker center={[dropoff.lat,dropoff.lng]} pathOptions={{color:'#eb5e28',fillColor:'#eb5e28',fillOpacity:1}} radius={9}><Popup>Drop-off</Popup></CircleMarker>}{vehicles.filter(vehicle=>vehicle.current_lat!=null&&vehicle.current_lng!=null).map(vehicle=><CircleMarker key={vehicle.id} center={[vehicle.current_lat,vehicle.current_lng]} pathOptions={{color:vehicle.status==='BREAKDOWN'?'#c62828':'#6c4ab6',fillColor:vehicle.status==='BREAKDOWN'?'#c62828':'#6c4ab6',fillOpacity:1}} radius={8}><Popup>{vehicle.vehicle_number} · {vehicle.status}</Popup></CircleMarker>)}{points.length>1&&<Polyline positions={points} pathOptions={{color:'#eb5e28',weight:5}}/>}</MapContainer><small className="map-provider-label">OpenStreetMap · OpenRouteService</small></div>
}
