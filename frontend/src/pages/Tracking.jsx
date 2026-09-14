import { useState } from "react";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";

const shipments = {
  "TRX-9842-AX": {
    status: "IN TRANSIT",
    tone: "in-transit",
    eta: "Today, 16:45 CET",
    confidence: "High (94%)",
    carrier: "Unit #V-409",
    driver: "M. Kowalski",
    progress: 75,
    step: 3,
    origin: "Hamburg Port, DE",
    destination: "Vienna, AT",
    logs: [
      ["Passed checkpoint Linz East, AT", "14:12 CET"],
      ["Crossed German-Austrian border", "11:30 CET"],
      ["Loaded & Departed Hamburg Hub", "06:00 CET"],
    ],
  },
  "TRX-4411-BT": {
    status: "AT RISK",
    tone: "at-risk",
    eta: "Tomorrow, 09:30 CET (+45m)",
    confidence: "Medium (81%)",
    carrier: "Unit #V-212",
    driver: "S. Novak",
    progress: 50,
    step: 3,
    origin: "Munich DC, DE",
    destination: "Salzburg, AT",
    warning:
      "Heavy congestion on A1 motorway near Salzburg. Dynamic rerouting engaged to bypass blockage.",
    logs: [
      ["Traffic delay detected on A1 motorway", "13:45 CET"],
      ["Encountered slow moving freight queue", "12:10 CET"],
      ["Departed Munich Distribution Center", "05:15 CET"],
    ],
  },
  "TRX-1092-DL": {
    status: "DELIVERED",
    tone: "delivered",
    eta: "Delivered today, 12:04 CET",
    confidence: "High (99%)",
    carrier: "Unit #V-118",
    driver: "E. Bauer",
    progress: 100,
    step: 4,
    origin: "Berlin DC, DE",
    destination: "Leipzig, DE",
    logs: [
      ["Delivery confirmed by recipient", "12:04 CET"],
      ["Arrived at Leipzig destination hub", "11:48 CET"],
      ["Departed Berlin DC", "07:20 CET"],
    ],
  },
};

export default function Tracking({ customerMode = false }) {
  const [code, setCode] = useState("TRX-9842-AX");
  const [active, setActive] = useState("TRX-9842-AX");
  const shipment = shipments[active] || shipments["TRX-9842-AX"];
  function lookup(next = code) {
    const normalized = next.trim().toUpperCase();
    setActive(shipments[normalized] ? normalized : "TRX-9842-AX");
    setCode(normalized);
  }
  return (
    <>
      <PageHeader
        eyebrow={
          customerMode
            ? "CUSTOMER PORTAL / SECURE LOOKUP"
            : "SHIPMENT STATUS / PUBLIC TRACKING"
        }
        title="Shipment Tracker"
        description="Enter a waybill or order ID to inspect real-time logistics telemetry and transit milestones."
      />
      <div className="tracking-wrap">
        <div className="tracking-search">
          <div>
            <div className="eyebrow">
              {customerMode ? "SECURE PORTAL" : "WAYBILL LOOKUP"}
            </div>
            <h2>Track your shipment</h2>
          </div>
          <div className="search-action">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && lookup()}
              placeholder="e.g. TRX-9842-AX"
            />
            <button className="button primary-button" onClick={() => lookup()}>
              Track
            </button>
          </div>
        </div>
        <div className="tracking-card">
          <div className="tracking-top">
            <div>
              <span className="eyebrow">WAYBILL ID</span>
              <h2>{active}</h2>
              <p>
                Origin: {shipment.origin} <span>→</span> Dest:{" "}
                {shipment.destination}
              </p>
            </div>
            <div className="tracking-status">
              <span className="eyebrow">CURRENT STATUS</span>
              <StatusBadge tone={shipment.tone}>{shipment.status}</StatusBadge>
            </div>
          </div>
          {shipment.warning && (
            <div className="tracking-warning">
              <b>Transit Advisory: Minor Delay</b>
              <span>{shipment.warning}</span>
            </div>
          )}
          <div className="tracking-metrics">
            <div>
              <span className="eyebrow">ESTIMATED ARRIVAL</span>
              <b>{shipment.eta}</b>
              <span>Confidence: {shipment.confidence}</span>
            </div>
            <div>
              <span className="eyebrow">ASSIGNED CARRIER</span>
              <b>{shipment.carrier}</b>
              <span>Driver: {shipment.driver}</span>
            </div>
          </div>
          <div className="milestone">
            <span className="eyebrow">MILESTONE PROGRESS</span>
            <div className="progress-track">
              <i style={{ width: `${shipment.progress}%` }} />
            </div>
            <div className="milestone-steps">
              {["Pending", "Assigned", "In Transit", "Delivered"].map(
                (step, index) => (
                  <div
                    className={`${index + 1 <= shipment.step ? "complete" : ""} ${index + 1 === shipment.step ? "current" : ""}`}
                    key={step}
                  >
                    <b>
                      {index + 1 < shipment.step
                        ? "✓"
                        : index + 1 === shipment.step
                          ? "●"
                          : "○"}
                    </b>
                    <span>{step}</span>
                  </div>
                ),
              )}
            </div>
          </div>
          <div className="activity">
            <span className="eyebrow">ACTIVITY LOG</span>
            {shipment.logs.map(([text, time]) => (
              <div className="activity-row" key={text}>
                <span>
                  <i />
                  {text}
                </span>
                <b>{time}</b>
              </div>
            ))}
          </div>
        </div>
        <div className="demo-codes">
          <span>Try demo codes:</span>
          {Object.entries(shipments).map(([id, item]) => (
            <button className="demo-code" key={id} onClick={() => lookup(id)}>
              {id} (
              {item.status
                .replace("AT RISK", "At Risk")
                .replace("IN TRANSIT", "In Transit")
                .replace("DELIVERED", "Delivered")}
              )
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
