import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { saveDriverIncident } from "../services/driverStore";
export default function DriverDashboard() {
  const { session } = useAuth();
  const [modal, setModal] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [issue, setIssue] = useState("Mechanical Failure");
  const [reason, setReason] = useState("");
  const [raised, setRaised] = useState(false);
  function submit() {
    if (issue === "Other" && !reason.trim()) return;
    saveDriverIncident({
      id: `INC-${Date.now().toString().slice(-5)}`,
      driver: session.name,
      vehicle: session.vehicle || "TX-042",
      companyId: session.partnerId,
      companyName: session.companyName || session.partnerName,
      issue,
      reason,
      status: "AI RECOVERY STARTED",
      createdAt: new Date().toISOString(),
    });
    setRaised(true);
    setModal(false);
    setReason("");
  }
  return (
    <>
      <div className="driver-greeting">
        <div>
          <div className="eyebrow">
            {session?.companyName || session?.partnerName} / ACTIVE ASSIGNMENT
          </div>
          <h1>Good afternoon, {session?.name?.split(" ")[0]}.</h1>
          <p>
            You are registered with{" "}
            <b>{session?.companyName || session?.partnerName}</b>. Fleet control
            is monitoring your route.
          </p>
        </div>
        <span className="driver-online">
          <i /> ON DUTY
        </span>
      </div>
      {raised && (
        <div className="driver-alert">
          <b>Failure reported · AI recovery started</b>
          <span>
            Fleet control is finding a replacement vehicle and notifying the
            customer.
          </span>
        </div>
      )}
      <section className="driver-assignment-card">
        <div className="assignment-card-head">
          <div>
            <span className="eyebrow">CURRENT DELIVERY</span>
            <h2>ORD-9842</h2>
            <p>Nordic Components · 860 kg</p>
          </div>
          <span className="driver-status-badge">EN ROUTE</span>
        </div>
        <div className={`driver-map ${fullscreen ? "map-fullscreen" : ""}`}>
          <button
            className="map-fullscreen-button"
            onClick={() => setFullscreen(!fullscreen)}
          >
            {fullscreen ? "× Close map" : "⛶ Full screen"}
          </button>
          <div className="driver-route-line" />
          <span className="driver-map-pin start">P</span>
          <span className="driver-map-pin current">●</span>
          <span className="driver-map-pin end">D</span>
          <div className="map-caption">ETA 16:45 · 42 km remaining</div>
        </div>
        <div className="driver-stops">
          <div>
            <b>Pickup</b>
            <span>Hamburg Port, DE · Completed 06:00</span>
          </div>
          <div>
            <b>Dropoff</b>
            <span>Vienna Hub, AT · ETA 16:45</span>
          </div>
        </div>
      </section>
      <button className="failure-button" onClick={() => setModal(true)}>
        ⚠ Raise Failure
      </button>
      {modal && (
        <div className="modal-backdrop">
          <div className="failure-modal">
            <button className="modal-close" onClick={() => setModal(false)}>
              ×
            </button>
            <div className="eyebrow">EMERGENCY ASSISTANCE</div>
            <h2>What went wrong?</h2>
            <p>Select the issue so Fleet Rescue can respond quickly.</p>
            {[
              "Mechanical Failure",
              "Flat Tire",
              "Accident / Safety",
              "Other",
            ].map((item) => (
              <label className="issue-option" key={item}>
                <input
                  type="radio"
                  checked={issue === item}
                  onChange={() => setIssue(item)}
                />
                {item}
              </label>
            ))}
            {issue === "Other" && (
              <textarea
                className="failure-reason"
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Describe the failure so dispatch can respond..."
              />
            )}
            <button className="button danger-button wide" onClick={submit}>
              Submit failure report
            </button>
          </div>
        </div>
      )}
    </>
  );
}
