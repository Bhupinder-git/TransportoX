import { useState } from "react";
import PageHeader from "../components/PageHeader";
import FleetMap from "../components/FleetMap";
import StatusBadge from "../components/StatusBadge";
import { orders } from "../data/demo";
export default function Optimization() {
  const [running, setRunning] = useState(false);
  return (
    <>
      <PageHeader
        eyebrow="DECISION ENGINE / ASSIGNMENT"
        title="Dynamic Optimization"
        description="Deterministic weighted scoring for distance, time, fuel, capacity, and delivery risk."
        action={
          <button
            className="button primary-button"
            onClick={() => {
              setRunning(true);
              setTimeout(() => setRunning(false), 1500);
            }}
          >
            {running ? "◌ Running engine..." : "↗ Run optimization"}
          </button>
        }
      />
      <div className="optimization-layout">
        <div>
          <div className="panel">
            <div className="panel-heading">
              <div>
                <div className="eyebrow">OPTIMIZATION RUN 0142</div>
                <h2>
                  {running
                    ? "Calculating best assignments..."
                    : "Recommended assignment plan"}
                </h2>
              </div>
              <StatusBadge>
                {running ? "IN PROGRESS" : "READY TO APPLY"}
              </StatusBadge>
            </div>
            <div className="score-grid">
              <div>
                <span>DELIVERY SLA</span>
                <b>+11.8%</b>
                <small>Projected on-time improvement</small>
              </div>
              <div>
                <span>EST. DISTANCE</span>
                <b>−384 km</b>
                <small>Compared to current plan</small>
              </div>
              <div>
                <span>OPERATING COST</span>
                <b>−₹53,500</b>
                <small>Fuel and overtime savings</small>
              </div>
            </div>
            <div className="recommendation-list">
              {orders.slice(0, 4).map((o, i) => (
                <div className="assignment" key={o.id}>
                  <div className="rank">0{i + 1}</div>
                  <div>
                    <b>{o.id}</b>
                    <span>
                      {o.destination} · {o.weight}
                    </span>
                  </div>
                  <div className="arrow">→</div>
                  <strong>{["TX-042", "TX-031", "TX-024", "TX-017"][i]}</strong>
                  <StatusBadge>{i === 2 ? "REASSIGN" : "OPTIMAL"}</StatusBadge>
                </div>
              ))}
            </div>
            <button
              className="button primary-button wide"
              onClick={() => alert("Assignment plan applied to demo state.")}
            >
              Approve and apply plan
            </button>
          </div>
          <div className="panel methodology">
            <div className="eyebrow">SCORING MODEL</div>
            <h2>Why this plan?</h2>
            {[
              ["Delivery priority", 40],
              ["Time window fit", 25],
              ["Distance & traffic", 20],
              ["Fleet compatibility", 15],
            ].map(([label, value]) => (
              <div className="score-bar" key={label}>
                <span>{label}</span>
                <b>{value}%</b>
                <i>
                  <em style={{ width: `${value * 2}%` }} />
                </i>
              </div>
            ))}
          </div>
        </div>
        <FleetMap />
      </div>
    </>
  );
}
