import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router-dom";

export default function Login() {
  const { session, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  if (session)
    return (
      <Navigate
        to={session.role === "admin" ? "/admin/dashboard" : session.role === "driver" ? "/driver/dashboard" : "/user/dashboard"}
        replace
      />
    );
  async function submit(event) {
    event.preventDefault();
    const result = await login(email, password);
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
        <p className="signup-prompt">Need an account? <Link to="/signup">Sign up as User or Admin</Link></p>
      </div>
      <div className="login-footer">
        SECURE TRANSPORT OPERATIONS PLATFORM
      </div>
    </div>
  );
}
