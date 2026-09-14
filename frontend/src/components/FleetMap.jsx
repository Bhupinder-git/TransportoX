import { getVehicles } from "../services/vehicleStore";
import RouteMap from "./RouteMap";

export default function FleetMap({ compact = false, companyId, vehicleData }) {
  const vehicles = vehicleData || getVehicles(companyId);
  const hasCoordinates = vehicles.some((vehicle) => vehicle.current_lat != null && vehicle.current_lng != null);

  return (
    <div className={`fleet-map ${compact ? "compact" : ""}`}>
      <div className="map-toolbar">
        <span>LIVE FLEET MAP</span>
        <span className="map-status"><i /> OPENSTREETMAP / ORS</span>
      </div>
      <RouteMap vehicles={vehicles} />
      {!hasCoordinates && <small className="map-data-notice">Vehicle coordinates are not available yet. Add live coordinates to show fleet markers.</small>}
    </div>
  );
}
