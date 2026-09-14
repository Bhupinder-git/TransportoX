import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import bellIcon from "../public/bell.png";
const nav = [
  ["dashboard", "Dashboard", "▦"],
  ["vehicles", "Vehicles", "▣"],
  ["drivers", "Drivers", "♙"],
  ["orders", "Orders", "≡"],
  ["requests", "Requests", "◫"],
  ["optimize", "Optimization", "↗"],
  ["incidents", "Incident Center", "⚠"],
  ["tracking", "Tracking", "◎"],
];
export default function Layout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const title = location.pathname.includes("/customer")
    ? "Customer Tracking"
    : location.pathname.includes("/driver")
      ? "Driver Assignment"
      : nav.find(([path]) => location.pathname.includes(path))?.[1] ||
        "Fleet Operations";
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">↗</span>
          <span>
            Transporto<span className="accent">X</span>
          </span>
        </div>
        <div className="workspace-label">ADMIN CONSOLE</div>
        <nav>
          {nav.map(([path, label, icon]) => (
            <NavLink
              key={path}
              to={`/admin/${path}`}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <span className="nav-icon">{icon}</span>
              {label}
              {path === "incidents" && <span className="nav-count">1</span>}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-foot">
          <div className="system-dot" /> All systems operational
          <div className="version">v0.9.4 · Demo environment</div>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div>
            <div className="crumb">
              TRANSPORTOX / ADMIN / {title.toUpperCase()}
            </div>
            <div className="top-title">{title}</div>
          </div>
          <div className="top-actions">
            <NavLink className="audience-link" to="/admin/customer/tracking">
              Customer portal
            </NavLink>
            <NavLink className="audience-link" to="/admin/driver">
              Driver view
            </NavLink>
            <span className="live">
              <i /> LIVE SIMULATION
            </span>
            <button className="icon-button" aria-label="Notifications" title="Notifications"><img className="notification-icon" src={bellIcon} alt="" /></button>
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
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
