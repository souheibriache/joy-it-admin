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
import Account from "./pages/Account";
import Settings from "./pages/Settings";
import Blog from "./pages/Blog";
import ArticleDetails from "./pages/ArticleDetails";
import CreateArticle from "./pages/CreateArticle";
import Support from "./pages/Support";
import SupportDetails from "./pages/SupportDetails";

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
          <Route path="settings" element={<Settings />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:articleId" element={<ArticleDetails />} />
          <Route path="blog/create-new" element={<CreateArticle />} />
          <Route path="support" element={<Support />} />
          <Route path="support/:supportId" element={<SupportDetails />} />
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
