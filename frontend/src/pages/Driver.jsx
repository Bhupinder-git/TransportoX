import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
export default function Driver() {
  return (
    <>
      <PageHeader
        eyebrow="DRIVER APP / ASSIGNED RUN"
        title="My Assignment"
        description="A focused navigation view for the simulated driver role."
        action={
          <button className="button danger-button">⚠ Breakdown / SOS</button>
        }
      />
      <div className="driver-grid">
        <section className="panel">
          <div className="driver-status">
            <div>
              <span className="eyebrow">CURRENT RUN</span>
              <h2>ORD-9842 · Nordic Components</h2>
              <p>Hamburg Port → Vienna Hub</p>
            </div>
            <StatusBadge>IN TRANSIT</StatusBadge>
          </div>
          <div className="driver-route">
            <div className="route-point done">
              <i />
              Hamburg Port, DE<span>Loaded · 06:00 CET</span>
            </div>
            <div className="route-line-vertical" />
            <div className="route-point current">
              <i />
              Linz East Checkpoint<span>Passed · 14:12 CET</span>
            </div>
            <div className="route-line-vertical" />
            <div className="route-point">
              <i />
              Vienna Hub, AT<span>ETA · 16:45 CET</span>
            </div>
          </div>
          <div className="driver-actions">
            <button className="button primary-button">
              Acknowledge next stop
            </button>
            <button className="button secondary-button">Open navigation</button>
          </div>
        </section>
        <aside className="panel">
          <div className="eyebrow">VEHICLE TELEMETRY</div>
          <h2>TX-042 · B-TR 4201</h2>
          {[
            ["Battery", "78%"],
            ["Range remaining", "246 km"],
            ["Vehicle health", "96 / 100"],
            ["Cargo load", "860 / 1,200 kg"],
          ].map(([label, value]) => (
            <div className="detail-line" key={label}>
              <span>{label}</span>
              <b>{value}</b>
            </div>
          ))}
          <div className="driver-help">
            <b>Need assistance?</b>
            <span>Fleet control is monitoring this run.</span>
            <button className="button secondary-button">
              Contact dispatch
            </button>
          </div>
        </aside>
      </div>
    </>
  );
}
