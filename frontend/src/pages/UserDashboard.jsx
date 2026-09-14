import { Link } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import { orders } from "../data/demo";
export default function UserDashboard() {
  const active = orders
    .filter((order) => order.status !== "DELIVERED")
    .slice(0, 3);
  return (
    <>
      <div className="user-hero">
        <div>
          <div className="eyebrow">NORDIC COMPONENTS / ACCOUNT OVERVIEW</div>
          <h1>Good afternoon.</h1>
          <p>
            Keep an eye on your deliveries and get updates as they move through
            the network.
          </p>
        </div>
        <div className="user-hero-actions"><Link className="button secondary-button" to="/user/tracking">Track a shipment</Link><Link className="button primary-button" to="/user/request/new">＋ Create delivery</Link></div>
      </div>
      <div className="user-kpis">
        <div>
          <span>IN TRANSIT</span>
          <b>03</b>
          <small>Deliveries on the road</small>
        </div>
        <div>
          <span>DELIVERED THIS MONTH</span>
          <b>18</b>
          <small>98.4% on time</small>
        </div>
        <div>
          <span>NEXT ARRIVAL</span>
          <b>16:45</b>
          <small>Today · Vienna Hub</small>
        </div>
      </div>
      <div className="user-dashboard-grid">
        <section className="user-panel">
          <div className="user-panel-heading">
            <div>
              <div className="eyebrow">RECENT ACTIVITY</div>
              <h2>Your shipments</h2>
            </div>
            <Link to="/user/shipments">View all →</Link>
          </div>
          {active.map((order) => (
            <div className="user-shipment-row" key={order.id}>
              <div className="shipment-icon">↗</div>
              <div>
                <b>{order.id}</b>
                <span>
                  {order.pickup} → {order.destination}
                </span>
              </div>
              <StatusBadge>{order.status}</StatusBadge>
              <strong>{order.eta}</strong>
            </div>
          ))}
        </section>
        <section className="user-panel help-panel">
          <div className="eyebrow">TRANSPORTOX SUPPORT</div>
          <h2>Need help with a delivery?</h2>
          <p>
            Our operations team monitors every shipment and can help with
            changes, delays, or delivery instructions.
          </p>
          <Link className="button secondary-button" to="/user/support">Contact support</Link>
        </section>
        <section className="user-panel notification-panel">
          <div className="user-panel-heading"><div><div className="eyebrow">NOTIFICATIONS</div><h2>Latest updates</h2></div><span className="notification-count">2 new</span></div>
          <div className="notification-row"><span className="notification-dot warning"/><div><b>ETA recalculated</b><p>ORD-9842 updated due to vehicle maintenance.</p><small>8 minutes ago</small></div></div>
          <div className="notification-row"><span className="notification-dot success"/><div><b>Driver assigned</b><p>TX-042 is confirmed for your Vienna delivery.</p><small>32 minutes ago</small></div></div>
        </section>
      </div>
    </>
  );
}
