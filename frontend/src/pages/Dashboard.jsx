import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import KpiCard from "../components/KpiCard";
import FleetMap from "../components/FleetMap";
import AiRecommendationCard from "../components/AiRecommendationCard";
import StatusBadge from "../components/StatusBadge";
import { events, orders, vehicles } from "../data/demo";
export default function Dashboard() {
  return (
    <>
      <PageHeader
        eyebrow="MONDAY · 14 SEP 2026 · 14:35 CET"
        title="Fleet Command Center"
        description="Real-time orchestration across your European delivery network."
        action={
          <Link className="button primary-button" to="/admin/optimize">
            ↗ Run optimization
          </Link>
        }
      />
      <div className="kpi-grid">
        <KpiCard
          label="ACTIVE VEHICLES"
          value="42 / 48"
          detail="87.5% fleet availability"
        />
        <KpiCard
          label="ACTIVE SHIPMENTS"
          value="126"
          detail="↑ 8.4% vs yesterday"
        />
        <KpiCard
          label="ON-TIME RISK"
          value="03"
          detail="2 critical · 1 elevated"
          accent="risk"
        />
        <KpiCard
          label="FLEET UTILIZATION"
          value="81.6%"
          detail="+4.2% after last run"
        />
        <KpiCard
          label="OPEN INCIDENTS"
          value="01"
          detail="Recovery plan ready"
          accent="incident"
        />
      </div>
      <div className="dashboard-grid">
        <section className="panel map-panel">
          <div className="panel-heading">
            <div>
              <div className="eyebrow">NETWORK OVERVIEW</div>
              <h2>Live vehicle telemetry</h2>
            </div>
            <span className="muted">Last sync 14:34:52</span>
          </div>
          <FleetMap />
        </section>
        <section className="panel">
          <div className="panel-heading">
            <div>
              <div className="eyebrow">AUTOMATED INSIGHT</div>
              <h2>AI Operations</h2>
            </div>
            <Link to="/admin/incidents" className="text-link">
              View all →
            </Link>
          </div>
          <AiRecommendationCard compact />
        </section>
      </div>
      <div className="bottom-grid">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <div className="eyebrow">CURRENT LOAD</div>
              <h2>Priority shipments</h2>
            </div>
            <Link to="/admin/orders" className="text-link">
              All shipments →
            </Link>
          </div>
          <div className="mini-list">
            {orders.slice(0, 3).map((order) => (
              <div className="mini-row" key={order.id}>
                <div>
                  <b>{order.id}</b>
                  <span>{order.customer}</span>
                </div>
                <StatusBadge>{order.status}</StatusBadge>
                <strong>{order.eta}</strong>
              </div>
            ))}
          </div>
        </section>
        <section className="panel">
          <div className="panel-heading">
            <div>
              <div className="eyebrow">EVENT STREAM</div>
              <h2>Live activity</h2>
            </div>
            <span className="live small">
              <i /> LIVE
            </span>
          </div>
          <div className="event-list">
            {events.slice(0, 4).map(([time, text, tone]) => (
              <div className="event" key={text}>
                <span className={`event-dot ${tone}`} />
                <span className="event-time">{time}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
