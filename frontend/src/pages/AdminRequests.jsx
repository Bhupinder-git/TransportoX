import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { getRequests, updateRequest } from "../services/requestStore";
import { partners } from "../data/partners";
import StatusBadge from "../components/StatusBadge";
export default function AdminRequests() {
  const { session } = useAuth();
  const partner = partners.find((item) => item.id === session.partnerId);
  const [requests, setRequests] = useState(() =>
    getRequests().filter(
      (request) =>
        !session.partnerId || request.partnerId === session.partnerId,
    ),
  );
  function approve(request) {
    const vehicle = request.weight > 1500 ? "TX-017" : "TX-042";
    const invoice = {
      number: `TX-${Date.now().toString().slice(-8)}`,
      total: request.quotedPrice,
      status: "ISSUED",
      issuedAt: new Date().toISOString(),
    };
    updateRequest(request.id, { status: "VEHICLE_ASSIGNED", vehicle, invoice });
    setRequests(
      getRequests().filter(
        (item) => !session.partnerId || item.partnerId === session.partnerId,
      ),
    );
  }
  function reject(request) {
    updateRequest(request.id, { status: "REJECTED" });
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
          <div className="eyebrow">ADMIN / INBOUND REQUESTS</div>
          <h1>Delivery requests</h1>
          <p>Requests routed to {partner?.name || "all delivery partners"}.</p>
        </div>
      </div>
      <div className="admin-request-grid">
        {requests.length === 0 ? (
          <div className="panel empty-state">
            No pending requests for this partner.
          </div>
        ) : (
          requests.map((request) => (
            <article className="panel admin-request-card" key={request.id}>
              <div className="request-card-head">
                <div>
                  <div className="eyebrow">{request.id}</div>
                  <h2>
                    {request.pickup} → {request.delivery}
                  </h2>
                  <span>
                    Submitted by {request.requester} ·{" "}
                    {new Date(request.createdAt).toLocaleString()}
                  </span>
                </div>
                <StatusBadge>{request.status.replaceAll("_", " ")}</StatusBadge>
              </div>
              <div className="request-detail-grid">
                <div>
                  <small>WEIGHT</small>
                  <b>{request.weight} kg</b>
                </div>
                <div>
                  <small>SIZE</small>
                  <b>
                    {request.length} × {request.width} × {request.height} cm
                  </b>
                </div>
                <div>
                  <small>QUOTE</small>
                  <b>₹{request.quotedPrice.toLocaleString("en-IN")}</b>
                </div>
                <div>
                  <small>IMAGES</small>
                  <b>{request.images?.length || 0} attached</b>
                </div>
              </div>
              {request.images?.[0] && (
                <img
                  className="admin-product-image"
                  src={request.images[0].data}
                  alt="Submitted product"
                />
              )}
              <div className="request-card-footer">
                {request.status === "PENDING_APPROVAL" ? (
                  <>
                    <button
                      className="button danger-button"
                      onClick={() => reject(request)}
                    >
                      Reject
                    </button>
                    <button
                      className="button primary-button"
                      onClick={() => approve(request)}
                    >
                      Approve, assign vehicle & issue bill
                    </button>
                  </>
                ) : (
                  <span>
                    Vehicle: <b>{request.vehicle}</b> · Invoice:{" "}
                    <b>{request.invoice?.number}</b>
                  </span>
                )}
              </div>
            </article>
          ))
        )}
      </div>
    </>
  );
}
