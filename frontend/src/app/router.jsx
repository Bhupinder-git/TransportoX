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
import { isSupabaseConfigured } from "../lib/supabase";
import AdminDashboardRemote from "../pages/AdminDashboardRemote";
import VehiclesRemote from "../pages/VehiclesRemote";
import OrdersRemote from "../pages/OrdersRemote";
import IncidentsRemote from "../pages/IncidentsRemote";
import AdminRequestsRemote from "../pages/AdminRequestsRemote";
import AdminDriversRemote from "../pages/AdminDriversRemote";
import UserDashboardRemote from "../pages/UserDashboardRemote";
import UserShipmentsRemote from "../pages/UserShipmentsRemote";
import UserRequestsRemote from "../pages/UserRequestsRemote";
import CreateDeliveryRequestRemote from "../pages/CreateDeliveryRequestRemote";
import DriverDashboardRemote from "../pages/DriverDashboardRemote";
import TrackingRemote from "../pages/TrackingRemote";
import OptimizationRemote from "../pages/OptimizationRemote";
import Signup from "../pages/Signup";
import ContactSupport from "../pages/ContactSupport";

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
      <Route path="/signup" element={<Signup />} />
      <Route
        element={
          <RequireAuth role="admin">
            <Layout />
          </RequireAuth>
        }
      >
        <Route path="/admin/dashboard" element={isSupabaseConfigured ? <AdminDashboardRemote /> : <AdminDashboard />} />
        <Route path="/admin/vehicles" element={isSupabaseConfigured ? <VehiclesRemote /> : <Vehicles />} />
        <Route path="/admin/orders" element={isSupabaseConfigured ? <OrdersRemote /> : <Orders />} />
        <Route path="/admin/optimize" element={isSupabaseConfigured ? <OptimizationRemote /> : <Optimization />} />
        <Route path="/admin/incidents" element={isSupabaseConfigured ? <IncidentsRemote /> : <Incidents />} />
        <Route path="/admin/requests" element={isSupabaseConfigured ? <AdminRequestsRemote /> : <AdminRequests />} />
        <Route path="/admin/drivers" element={isSupabaseConfigured ? <AdminDriversRemote /> : <AdminDrivers />} />
        <Route path="/admin/tracking/:id" element={isSupabaseConfigured ? <TrackingRemote /> : <Tracking />} />
        <Route path="/admin/tracking" element={isSupabaseConfigured ? <TrackingRemote /> : <Tracking />} />
        <Route
          path="/admin/customer/tracking"
          element={isSupabaseConfigured ? <TrackingRemote /> : <Tracking customerMode />}
        />
        <Route path="/admin/driver" element={<Driver />} />
        <Route path="/admin/settings" element={<Settings />} />
      </Route>
      <Route element={<RequireAuth role="driver"><DriverLayout /></RequireAuth>}>
        <Route path="/driver/dashboard" element={isSupabaseConfigured ? <DriverDashboardRemote /> : <DriverDashboard />} />
        <Route path="/driver/incidents" element={isSupabaseConfigured ? <DriverDashboardRemote /> : <DriverDashboard />} />
        <Route path="/driver/profile" element={isSupabaseConfigured ? <DriverDashboardRemote /> : <DriverDashboard />} />
      </Route>
      <Route
        element={
          <RequireAuth role="user">
            <UserLayout />
          </RequireAuth>
        }
      >
        <Route path="/user/dashboard" element={isSupabaseConfigured ? <UserDashboardRemote /> : <UserDashboard />} />
        <Route path="/user/shipments" element={isSupabaseConfigured ? <UserShipmentsRemote /> : <UserShipments />} />
        <Route path="/user/requests" element={isSupabaseConfigured ? <UserRequestsRemote /> : <UserRequests />} />
        <Route path="/user/request/new" element={isSupabaseConfigured ? <CreateDeliveryRequestRemote /> : <CreateDeliveryRequest />} />
        <Route path="/user/tracking/:id" element={isSupabaseConfigured ? <TrackingRemote /> : <Tracking customerMode />} />
        <Route path="/user/tracking" element={isSupabaseConfigured ? <TrackingRemote /> : <Tracking customerMode />} />
        <Route path="/user/support" element={<ContactSupport />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
