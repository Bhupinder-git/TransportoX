import { useState } from "react";
import { Link } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import FleetMap from "../components/FleetMap";
import { useAuth } from "../auth/AuthContext";
import { getRequests, updateRequest } from "../services/requestStore";
export default function AdminDashboard() {
  const { session } = useAuth();
  const [requests, setRequests] = useState(() =>
    getRequests().filter(
      (request) =>
        !session.partnerId || request.partnerId === session.partnerId,
    ),
  );
  function act(request, status) {
    updateRequest(request.id, { status });
    setRequests(
      getRequests().filter(
        (item) => !session.partnerId || item.partnerId === session.partnerId,
      ),
    );
  }
  return (
    <>
      <div className="page-header">
        <div>
          <div className="eyebrow">
            {session.partnerName?.toUpperCase()} / ADMIN CONTROL
          </div>
          <h1>Operations dashboard</h1>
          <p>
            Verify customer requests, dispatch vehicles, and monitor your
            company delivery exceptions.
          </p>
        </div>
        <Link className="button primary-button" to="/admin/drivers">
          ＋ Register driver
        </Link>
      </div>
      <div className="admin-kpis">
        <div>
          <span>PENDING VERIFICATION</span>
          <b>
            {requests.filter((r) => r.status === "PENDING_APPROVAL").length}
          </b>
        </div>
        <div>
          <span>ACTIVE ORDERS</span>
          <b>12</b>
        </div>
        <div>
          <span>DRIVERS ON DUTY</span>
          <b>08</b>
        </div>
        <div>
          <span>OPEN INCIDENTS</span>
          <b className="danger-text">01</b>
        </div>
      </div>
      <div className="admin-dashboard-grid">
        <section className="panel verification-panel">
          <div className="panel-heading">
            <div>
              <div className="eyebrow">ORDER VERIFICATION QUEUE</div>
              <h2>Requests for {session.partnerName}</h2>
            </div>
            <Link className="text-link" to="/admin/requests">
              Full queue →
            </Link>
          </div>
          {requests.length === 0 ? (
            <div className="empty-state">
              New customer orders for your company will appear here.
            </div>
          ) : (
            requests.map((request) => (
              <div className="verification-row" key={request.id}>
                <div>
                  <b>{request.id}</b>
                  <span>
                    {request.pickup} → {request.delivery}
                  </span>
                </div>
                <div>
                  <b>{request.weight} kg</b>
                  <span>{request.partnerName}</span>
                </div>
                <StatusBadge>{request.status.replaceAll("_", " ")}</StatusBadge>
                <div className="queue-actions">
                  {request.status === "PENDING_APPROVAL" && (
                    <>
                      <button onClick={() => act(request, "APPROVED")}>
                        Verify
                      </button>
                      <button
                        className="accept"
                        onClick={() => act(request, "APPROVED")}
                      >
                        Accept
                      </button>
                      <button
                        className="reject"
                        onClick={() => act(request, "REJECTED")}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </section>
        <section className="panel">
          <div className="panel-heading">
            <div>
              <div className="eyebrow">FLEET MAP / INCIDENTS</div>
              <h2>{session.partnerName} dispatch</h2>
            </div>
            <StatusBadge>LIVE</StatusBadge>
          </div>
          <FleetMap compact companyId={session.partnerId} />
          <div className="incident-strip">
            <span className="event-dot critical" />
            <div>
              <b>TX-008 · Engine alert</b>
              <small>Recovery workflow ready</small>
            </div>
            <Link to="/admin/incidents">Review →</Link>
          </div>
        </section>
      </div>
    </>
  );
}
