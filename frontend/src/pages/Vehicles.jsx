import { useState } from "react";
import PageHeader from "../components/PageHeader";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../auth/AuthContext";
import { getVehicles, saveVehicle } from "../services/vehicleStore";
export default function Vehicles() {
  const { session } = useAuth();
  const [filter, setFilter] = useState("ALL");
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [vehicleList, setVehicleList] = useState(() =>
    getVehicles(session.partnerId),
  );
  const [form, setForm] = useState({
    id: "",
    plate: "",
    type: "EV",
    capacity: "",
    driver: "",
  });
  const filtered = vehicleList.filter(
    (v) =>
      (filter === "ALL" || v.type === filter) &&
      `${v.id} ${v.plate} ${v.job}`.toLowerCase().includes(query.toLowerCase()),
  );
  function submit(e) {
    e.preventDefault();
    const vehicle = {
      id: form.id,
      plate: form.plate,
      type: form.type,
      status: "AVAILABLE",
      capacity: `${form.capacity} kg`,
      load: "0 kg",
      energy: 100,
      range: "500 km",
      health: 100,
      job: "—",
      driver: form.driver,
      x: 50,
      y: 50,
      companyId: session.partnerId || "swiftline",
      companyName: session.partnerName,
    };
    saveVehicle(vehicle);
    setVehicleList(getVehicles(session.partnerId));
    setForm({ id: "", plate: "", type: "EV", capacity: "", driver: "" });
    setShowModal(false);
  }
  return (
    <>
      <PageHeader
        eyebrow={`FLEET / ${session.partnerName?.toUpperCase()}`}
        title="Vehicle Fleet"
        description={`Only vehicles registered with ${session.partnerName || "your transport company"} are shown.`}
        action={
          <button
            className="button primary-button"
            onClick={() => setShowModal(true)}
          >
            ＋ Add vehicle
          </button>
        }
      />
      <div className="toolbar">
        <div className="segmented">
          {["ALL", "DIESEL", "EV", "HYBRID"].map((item) => (
            <button
              className={filter === item ? "selected" : ""}
              onClick={() => setFilter(item)}
              key={item}
            >
              {item === "ALL" ? "All types" : item}
            </button>
          ))}
        </div>
        <input
          className="search"
          placeholder="Search vehicle, plate, job..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="panel table-panel">
        <div className="panel-heading">
          <h2>
            {filtered.length} {session.partnerName} vehicles
          </h2>
          <span className="muted">Company-scoped fleet register</span>
        </div>
        <DataTable
          columns={[
            "VEHICLE",
            "TYPE",
            "STATUS",
            "CAPACITY / LOAD",
            "ENERGY",
            "HEALTH",
            "CURRENT JOB",
            "",
          ]}
          rows={filtered}
          renderRow={(v) => (
            <tr key={v.id}>
              <td>
                <b>{v.id}</b>
                <small>
                  {v.plate} · {v.driver}
                </small>
              </td>
              <td>{v.type}</td>
              <td>
                <StatusBadge>{v.status}</StatusBadge>
              </td>
              <td>
                <b>{v.load}</b>
                <small>of {v.capacity}</small>
              </td>
              <td>
                <div className="meter">
                  <i style={{ width: `${v.energy}%` }} />
                  <span>{v.energy}%</span>
                </div>
                <small>{v.range}</small>
              </td>
              <td>
                <span
                  className={v.health < 60 ? "danger-text" : "success-text"}
                >
                  {v.health}%
                </span>
              </td>
              <td>
                <b>{v.job}</b>
              </td>
              <td>
                <button className="row-action">⋮</button>
              </td>
            </tr>
          )}
        />
      </div>
      {showModal && (
        <div className="modal-backdrop">
          <form className="failure-modal vehicle-modal" onSubmit={submit}>
            <button
              type="button"
              className="modal-close"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>
            <div className="eyebrow">{session.partnerName?.toUpperCase()}</div>
            <h2>Register vehicle</h2>
            <p>This vehicle will only be visible to your company.</p>
            {[
              ["id", "Vehicle ID"],
              ["plate", "Plate number"],
              ["capacity", "Capacity in kg"],
              ["driver", "Assigned driver"],
            ].map(([name, label]) => (
              <label className="driver-form-label" key={name}>
                {label}
                <input
                  required
                  name={name}
                  value={form[name]}
                  onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                />
              </label>
            ))}
            <label className="driver-form-label">
              Vehicle type
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option>EV</option>
                <option>DIESEL</option>
                <option>HYBRID</option>
              </select>
            </label>
            <button className="button primary-button wide">Save vehicle</button>
          </form>
        </div>
      )}
    </>
  );
}
