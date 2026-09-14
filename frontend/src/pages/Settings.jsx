import PageHeader from "../components/PageHeader";
export default function Settings() {
  return (
    <>
      <PageHeader
        eyebrow="SYSTEM / CONFIGURATION"
        title="System Settings"
        description="Manage demo state, simulation behavior, and integration status."
      />
      <div className="settings-grid">
        <section className="panel">
          <div className="eyebrow">DEMO ENVIRONMENT</div>
          <h2>Simulation controls</h2>
          <div className="setting-row">
            <div>
              <b>Live telemetry simulation</b>
              <span>
                Move vehicle markers and emit fleet events automatically.
              </span>
            </div>
            <div className="toggle on">
              <i />
            </div>
          </div>
          <div className="setting-row">
            <div>
              <b>Auto re-optimization</b>
              <span>Suggest a new plan when traffic or incidents change.</span>
            </div>
            <div className="toggle on">
              <i />
            </div>
          </div>
          <div className="setting-row">
            <div>
              <b>Use seeded demo data</b>
              <span>
                Reset all vehicles, orders, and incidents to the demo scenario.
              </span>
            </div>
            <button className="button secondary-button">Reset data</button>
          </div>
        </section>
        <section className="panel">
          <div className="eyebrow">INTEGRATION STATUS</div>
          <h2>Service health</h2>
          {[
            ["REST API", "http://localhost:5000/api", "CONNECTED"],
            ["Socket.IO", "ws://localhost:5000", "CONNECTED"],
            ["MongoDB", "Local demo database", "SIMULATED"],
            ["AI assistant", "Deterministic engine", "READY"],
          ].map(([name, value, status]) => (
            <div className="service-row" key={name}>
              <span className="system-dot" />
              <div>
                <b>{name}</b>
                <small>{value}</small>
              </div>
              <StatusText status={status} />
            </div>
          ))}
        </section>
      </div>
    </>
  );
}
function StatusText({ status }) {
  return <span className="success-text">{status}</span>;
}
