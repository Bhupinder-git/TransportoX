import { Link } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import { orders } from "../data/demo";
export default function UserShipments() {
  return (
    <>
      <div className="user-hero compact-hero">
        <div>
          <div className="eyebrow">SHIPMENT HISTORY</div>
          <h1>My shipments</h1>
          <p>All current and completed deliveries linked to your account.</p>
        </div>
        <Link className="button primary-button" to="/user/tracking">
          Track by waybill
        </Link>
      </div>
      <div className="user-panel user-table-panel">
        <div className="user-panel-heading">
          <h2>Shipment history</h2>
          <span className="muted">5 shipments</span>
        </div>
        <div className="user-table-wrap">
          <table>
            <thead>
              <tr>
                <th>SHIPMENT</th>
                <th>ROUTE</th>
                <th>STATUS</th>
                <th>ETA / DELIVERY</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <b>{order.id}</b>
                    <small>{order.customer}</small>
                  </td>
                  <td>
                    {order.pickup}
                    <small>→ {order.destination}</small>
                  </td>
                  <td>
                    <StatusBadge>{order.status}</StatusBadge>
                  </td>
                  <td>{order.eta}</td>
                  <td>
                    <Link
                      className="text-link"
                      to={`/user/tracking?shipment=${order.id}`}
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
