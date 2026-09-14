import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import AiRecommendationCard from "../components/AiRecommendationCard";
export default function Incidents() {
  return (
    <>
      <PageHeader
        eyebrow="FLEET RESCUE / RECOVERY INTELLIGENCE"
        title="Incident Center"
        description="Recover the delivery, not just the vehicle."
        action={
          <button className="button danger-button">⚠ Simulate breakdown</button>
        }
      />
      <div className="incident-layout">
        <div>
          <div className="incident-banner">
            <div className="incident-symbol">!</div>
            <div>
              <StatusBadge>CRITICAL INCIDENT</StatusBadge>
              <h2>TX-008 · Powertrain failure</h2>
              <p>
                Detected 26 minutes ago near Leipzig A14 · Driver R. Singh is
                safe and awaiting assistance.
              </p>
            </div>
            <div className="incident-time">
              <b>00:26:14</b>
              <span>INCIDENT AGE</span>
            </div>
          </div>
          <div className="panel">
            <div className="panel-heading">
              <div>
                <div className="eyebrow">AFFECTED CARGO</div>
                <h2>2 shipments require recovery</h2>
              </div>
              <span className="danger-text">Delivery risk elevated</span>
            </div>
            <div className="affected-row">
              <b>ORD-9834</b>
              <span>MediCore Supplies → Prague Clinic</span>
              <StatusBadge>CRITICAL</StatusBadge>
              <strong>420 kg</strong>
            </div>
            <div className="affected-row">
              <b>ORD-9829</b>
              <span>Retail replenishment → Dresden Hub</span>
              <StatusBadge>HIGH</StatusBadge>
              <strong>1,760 kg</strong>
            </div>
          </div>
          <div className="panel">
            <div className="panel-heading">
              <div>
                <div className="eyebrow">RECOVERY OPTIONS</div>
                <h2>Nearby support resources</h2>
              </div>
              <button className="button secondary-button">
                ↻ Refresh options
              </button>
            </div>
            {[
              [
                "TX-024",
                "Support vehicle · EV",
                "12 min",
                "1,500 kg",
                "LOW RISK",
              ],
              [
                "Leipzig Depot",
                "Company depot · Cargo van",
                "18 min",
                "2,100 kg",
                "MEDIUM RISK",
              ],
              [
                "A14 Service Hub",
                "Repair center · Tow + repair",
                "24 min",
                "—",
                "HIGH RISK",
              ],
            ].map(([name, type, time, capacity, risk]) => (
              <div className="recovery-option" key={name}>
                <div className="resource-icon">{name[0]}</div>
                <div>
                  <b>{name}</b>
                  <span>{type}</span>
                </div>
                <div>
                  <small>ARRIVAL</small>
                  <b>{time}</b>
                </div>
                <div>
                  <small>CAPACITY</small>
                  <b>{capacity}</b>
                </div>
                <StatusBadge>{risk}</StatusBadge>
                <button className="row-action">→</button>
              </div>
            ))}
          </div>
        </div>
        <aside>
          <AiRecommendationCard />
          <div className="panel incident-details">
            <div className="eyebrow">INCIDENT TELEMETRY</div>
            <h2>TX-008</h2>
            <div className="detail-line">
              <span>Last known GPS</span>
              <b>51.339° N, 12.374° E</b>
            </div>
            <div className="detail-line">
              <span>Vehicle health</span>
              <b className="danger-text">42 / 100</b>
            </div>
            <div className="detail-line">
              <span>Remaining fuel</span>
              <b>19%</b>
            </div>
            <button className="button primary-button wide">
              Generate recovery plan
            </button>
          </div>
        </aside>
      </div>
    </>
  );
}
