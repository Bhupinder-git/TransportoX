import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const { session, login, loginAs } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState("admin");
  const [email, setEmail] = useState("admin@transportox.local");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  if (session)
    return (
      <Navigate
        to={session.role === "admin" ? "/admin/dashboard" : session.role === "driver" ? "/driver/dashboard" : "/user/dashboard"}
        replace
      />
    );
  function changeRole(next) {
    setRole(next);
    setEmail(next === "admin" ? "admin@transportox.local" : next === "driver" ? "driver.ravi@transportox.local" : "user@transportox.local");
    setPassword(next === "admin" ? "admin123" : next === "driver" ? "ravi123" : "user123");
    setError("");
  }
  function submit(event) {
    event.preventDefault();
    const result = login(email, password);
    if (result.ok)
      navigate(
        location.state?.from?.pathname ||
          (result.role === "admin" ? "/admin/dashboard" : result.role === "driver" ? "/driver/dashboard" : "/user/dashboard"),
        { replace: true },
      );
    else setError(result.message);
  }
  return (
    <div className="login-page">
      <div className="login-brand">
        <span className="brand-mark">↗</span>
        <span>
          Transporto<span className="accent">X</span>
        </span>
      </div>
      <div className="login-card">
        <div className="eyebrow">FLEET OPERATIONS PLATFORM</div>
        <h1>Welcome back</h1>
        <p className="login-copy">
          Sign in to access your logistics workspace.
        </p>
        <div className="role-tabs">
          <button
            className={role === "admin" ? "selected" : ""}
            onClick={() => changeRole("admin")}
          >
            Admin panel
          </button>
          <button
            className={role === "user" ? "selected" : ""}
            onClick={() => changeRole("user")}
          >
            User portal
          </button>
          <button className={role === "driver" ? "selected" : ""} onClick={() => changeRole("driver")}>Driver app</button>
        </div>
        <form onSubmit={submit}>
          <label>
            Email address
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {error && <div className="login-error">{error}</div>}
          <button className="button primary-button login-button">
            Sign in
          </button>
        </form>
        <div className="demo-login">
          <span>Demo access</span>
          <button
            onClick={() => {
              loginAs("admin");
              navigate("/admin/dashboard");
            }}
          >
            Enter as Admin
          </button>
          <button
            onClick={() => {
              loginAs("user");
              navigate("/user/dashboard");
            }}
          >
            Enter as User
          </button>
        </div>
      </div>
      <div className="login-footer">
        LOCAL DEMO ENVIRONMENT · NO EXTERNAL API REQUIRED
      </div>
    </div>
  );
}
