import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import Layout from "../components/Layout";
import UserLayout from "../components/UserLayout";
import Dashboard from "../pages/Dashboard";
import Vehicles from "../pages/Vehicles";
import Orders from "../pages/Orders";
import Optimization from "../pages/Optimization";
import Incidents from "../pages/Incidents";
import Tracking from "../pages/Tracking";
import Settings from "../pages/Settings";
import Driver from "../pages/Driver";
import Login from "../pages/Login";
import UserDashboard from "../pages/UserDashboard";
import UserShipments from "../pages/UserShipments";
import CreateDeliveryRequest from "../pages/CreateDeliveryRequest";
import UserRequests from "../pages/UserRequests";
import AdminRequests from "../pages/AdminRequests";
import AdminDashboard from "../pages/AdminDashboard";
import AdminDrivers from "../pages/AdminDrivers";
import DriverLayout from "../components/DriverLayout";
import DriverDashboard from "../pages/DriverDashboard";

function RequireAuth({ role, children }) {
  const { session } = useAuth();
  const location = useLocation();
  if (!session)
    return <Navigate to="/login" state={{ from: location }} replace />;
  if (role && session.role !== role)
    return (
      <Navigate
        to={session.role === "admin" ? "/admin/dashboard" : session.role === "driver" ? "/driver/dashboard" : "/user/dashboard"}
        replace
      />
    );
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <RequireAuth role="admin">
            <Layout />
          </RequireAuth>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/vehicles" element={<Vehicles />} />
        <Route path="/admin/orders" element={<Orders />} />
        <Route path="/admin/optimize" element={<Optimization />} />
        <Route path="/admin/incidents" element={<Incidents />} />
        <Route path="/admin/requests" element={<AdminRequests />} />
        <Route path="/admin/drivers" element={<AdminDrivers />} />
        <Route path="/admin/tracking/:id" element={<Tracking />} />
        <Route path="/admin/tracking" element={<Tracking />} />
        <Route
          path="/admin/customer/tracking"
          element={<Tracking customerMode />}
        />
        <Route path="/admin/driver" element={<Driver />} />
        <Route path="/admin/settings" element={<Settings />} />
      </Route>
      <Route element={<RequireAuth role="driver"><DriverLayout /></RequireAuth>}>
        <Route path="/driver/dashboard" element={<DriverDashboard />} />
        <Route path="/driver/incidents" element={<DriverDashboard />} />
        <Route path="/driver/profile" element={<DriverDashboard />} />
      </Route>
      <Route
        element={
          <RequireAuth role="user">
            <UserLayout />
          </RequireAuth>
        }
      >
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/shipments" element={<UserShipments />} />
        <Route path="/user/requests" element={<UserRequests />} />
        <Route path="/user/request/new" element={<CreateDeliveryRequest />} />
        <Route path="/user/tracking" element={<Tracking customerMode />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
