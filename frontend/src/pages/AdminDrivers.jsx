import { useState } from "react";
import { getDrivers, saveDriver } from "../services/driverStore";
import { useAuth } from "../auth/AuthContext";
export default function AdminDrivers() {
  const { session } = useAuth();
  const [drivers, setDrivers] = useState(() =>
    getDrivers().filter(
      (driver) => !session.partnerId || driver.companyId === session.partnerId,
    ),
  );
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    vehicle: "",
  });
  const [created, setCreated] = useState(null);
  function submit(e) {
    e.preventDefault();
    const driver = {
      ...form,
      id: `DRV-${Math.floor(1000 + Math.random() * 8999)}`,
      password: `drive${Math.floor(1000 + Math.random() * 8999)}`,
      status: "AVAILABLE",
      companyId: session.partnerId || "swiftline",
      companyName: session.partnerName,
    };
    saveDriver(driver);
    setDrivers(
      getDrivers().filter(
        (item) => !session.partnerId || item.companyId === session.partnerId,
      ),
    );
    setCreated(driver);
    setForm({ name: "", email: "", phone: "", vehicle: "" });
  }
  return (
    <>
      <div className="page-header">
        <div>
          <div className="eyebrow">FLEET / DRIVER ACCESS</div>
          <h1>{session.partnerName} drivers</h1>
          <p>Only drivers registered with your transport company are shown.</p>
        </div>
      </div>
      <div className="driver-admin-grid">
        <section className="panel">
          <div className="eyebrow">REGISTER DRIVER</div>
          <h2>Create driver access</h2>
          <form className="driver-form" onSubmit={submit}>
            {[
              ["name", "Full name"],
              ["email", "Email"],
              ["phone", "Phone"],
              ["vehicle", "Assigned vehicle ID"],
            ].map(([name, label]) => (
              <label key={name}>
                {label}
                <input
                  required
                  name={name}
                  value={form[name]}
                  onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                />
              </label>
            ))}
            <button className="button primary-button">
              Register driver & generate password
            </button>
          </form>
          {created && (
            <div className="credential-card">
              <b>Driver account created for {session.partnerName}</b>
              <span>
                Email: <strong>{created.email}</strong>
              </span>
              <span>
                Password: <strong>{created.password}</strong>
              </span>
              <small>
                Share this email and password securely with {created.name}. They
                can now log in through the Driver app.
              </small>
            </div>
          )}
        </section>
        <section className="panel">
          <div className="eyebrow">REGISTERED DRIVERS</div>
          <h2>{drivers.length} company drivers</h2>
          {drivers.map((driver) => (
            <div className="driver-row" key={driver.id}>
              <div className="user-avatar">{driver.name[0]}</div>
              <div>
                <b>{driver.name}</b>
                <span>
                  {driver.id} · {driver.vehicle} · {driver.companyName}
                </span>
              </div>
              <span className="success-text">{driver.status}</span>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}
