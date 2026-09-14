import { useState } from "react";
import PageHeader from "../components/PageHeader";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import { orders } from "../data/demo";
export default function Orders() {
  const [query, setQuery] = useState("");
  const filtered = orders.filter((o) =>
    `${o.id} ${o.customer} ${o.destination}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <>
      <PageHeader
        eyebrow="ORDERS / SHIPMENT CONTROL"
        title="Shipment Manifest"
        description="Prioritized order flow and delivery risk across the network."
        action={
          <button className="button primary-button">＋ Create shipment</button>
        }
      />
      <div className="order-stats">
        <div>
          <b>126</b>
          <span>Active</span>
        </div>
        <div>
          <b>08</b>
          <span>Critical priority</span>
        </div>
        <div>
          <b>03</b>
          <span>At risk</span>
        </div>
        <div>
          <b>94.2%</b>
          <span>On-time rate</span>
        </div>
      </div>
      <div className="toolbar">
        <div className="eyebrow">ALL SHIPMENTS · SORTED BY DELIVERY RISK</div>
        <input
          className="search"
          placeholder="Search order or destination..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="panel table-panel">
        <DataTable
          columns={[
            "ORDER / CUSTOMER",
            "ROUTE",
            "WEIGHT",
            "PRIORITY",
            "DEADLINE",
            "STATUS",
            "VEHICLE",
            "ETA",
          ]}
          rows={filtered}
          renderRow={(o) => (
            <tr key={o.id}>
              <td>
                <b>{o.id}</b>
                <small>{o.customer}</small>
              </td>
              <td>
                <b>{o.pickup}</b>
                <small>→ {o.destination}</small>
              </td>
              <td>{o.weight}</td>
              <td>
                <StatusBadge>{o.priority}</StatusBadge>
              </td>
              <td>{o.deadline}</td>
              <td>
                <StatusBadge>{o.status}</StatusBadge>
              </td>
              <td>
                <b>{o.vehicle}</b>
              </td>
              <td className={o.status === "AT RISK" ? "danger-text" : ""}>
                {o.eta}
              </td>
            </tr>
          )}
        />
      </div>
    </>
  );
}
