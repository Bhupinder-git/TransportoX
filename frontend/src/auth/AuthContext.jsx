import { createContext, useContext, useMemo, useState } from "react";
import { partners } from "../data/partners";
import { getDrivers } from "../services/driverStore";

const AuthContext = createContext(null);
const DEMO_USERS = {
  admin: {
    email: "admin@transportox.local",
    password: "admin123",
    name: "Fleet Manager",
    role: "admin",
  },
  user: {
    email: "user@transportox.local",
    password: "user123",
    name: "Nordic Components",
    role: "user",
  },
};
partners.forEach((partner) => { DEMO_USERS[partner.id] = { email: partner.adminEmail, password: partner.adminPassword, name: `${partner.name} Admin`, role: "admin", partnerId: partner.id, partnerName: partner.name }; });

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() =>
    JSON.parse(localStorage.getItem("transportox-session") || "null"),
  );
  function login(email, password) {
    const driverAccounts = getDrivers().map((driver) => ({ ...driver, name: driver.name, role: "driver" }));
    const account = [...Object.values(DEMO_USERS), ...driverAccounts].find(
      (user) => user.email === email && user.password === password,
    );
    if (!account) return { ok: false, message: "Invalid demo credentials." };
    const next = {
      name: account.name,
      email: account.email,
      role: account.role,
      partnerId: account.partnerId || account.companyId || null,
      partnerName: account.partnerName || account.companyName || "TransportoX Network",
      companyName: account.companyName || account.partnerName || "TransportoX Network",
      driverId: account.id || null,
      vehicle: account.vehicle || null,
    };
    localStorage.setItem("transportox-session", JSON.stringify(next));
    setSession(next);
    return { ok: true, role: account.role };
  }
  function loginAs(role) {
    const account = DEMO_USERS[role];
    return login(account.email, account.password);
  }
  function logout() {
    localStorage.removeItem("transportox-session");
    setSession(null);
  }
  const value = useMemo(() => ({ session, login, loginAs, logout }), [session]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
