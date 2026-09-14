import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function UserLayout() {
  const { session, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const title = location.pathname.includes("shipments")
    ? "My Shipments"
    : location.pathname.includes("tracking")
      ? "Track Delivery"
      : "Customer Portal";
  return (
    <div className="user-shell">
      <aside className="user-sidebar">
        <div className="brand">
          <span className="brand-mark">↗</span>
          <span>
            Transporto<span className="accent">X</span>
          </span>
        </div>
        <div className="user-welcome">
          <div className="user-avatar">{session?.name?.slice(0, 1) || "N"}</div>
          <div>
            <b>{session?.name || "Customer"}</b>
            <span>Customer account</span>
          </div>
        </div>
        <nav>
          <NavLink
            to="/user/dashboard"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Overview
          </NavLink>
          <NavLink
            to="/user/shipments"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            My shipments
          </NavLink>
          <NavLink
            to="/user/requests"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Delivery requests
          </NavLink>
          <NavLink
            to="/user/request/new"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            + New delivery
          </NavLink>
          <NavLink
            to="/user/tracking"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Track a delivery
          </NavLink>
        </nav>
        <div className="user-side-foot">
          <span>Need help?</span>
          <b>Contact support</b>
        </div>
      </aside>
      <div className="user-main">
        <header className="user-topbar">
          <div>
            <span className="eyebrow">CUSTOMER PORTAL</span>
            <strong>{title}</strong>
          </div>
          <div className="user-top-actions">
            <span className="portal-live">
              <i /> Delivery network online
            </span>
            <button
              className="logout-button"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              Log out
            </button>
          </div>
        </header>
        <main className="user-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
