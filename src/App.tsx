import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Login from "./pages/Login";
import Home from "./pages/Home"; // Replace with your actual Home component
import Activities from "./pages/Activities";
import ActivityDetails from "./pages/ActivityDetails";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import ClientDetails from "./pages/ClientDetails";
import Plans from "./pages/Plans";
import PlanDetails from "./pages/PlanDetails";
import Account from "./pages/Account";

// ProtectedRoute Component
const ProtectedRoute = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

const App = () => {
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const { currentUser } = useSelector((state: RootState) => state.user);

  const isAuthenticated = Boolean(accessToken && currentUser);

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" /> : <Login />}
      />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
        <Route path="/" element={<Home />}>
          {/* Nested Routes */}
          <Route index element={<Dashboard />} />
          <Route path="clients" element={<Clients />} />
          <Route path="clients/:companyId" element={<ClientDetails />} />
          <Route path="activities" element={<Activities />} />
          <Route path="activities/:activityId" element={<ActivityDetails />} />
          <Route path="plans" element={<Plans />} />
          <Route path="plans/:planId" element={<PlanDetails />} />
          <Route path="account" element={<Account />} />
        </Route>
      </Route>

      {/* Catch-all route */}
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/" : "/login"} />}
      />
    </Routes>
  );
};

export default App;
