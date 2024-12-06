import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Login from "./pages/Login";
import Home from "./pages/Home"; // Replace with your actual Home component

const App = () => {
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const { currentUser } = useSelector((state: RootState) => state.user);

  const isAuthenticated = Boolean(accessToken && currentUser);

  return (
    <Routes>
      {/* Home page (root) */}
      <Route
        path="/"
        element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
      />

      {/* Login page */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" /> : <Login />}
      />

      {/* Catch-all route for undefined paths */}
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/" : "/login"} />}
      />
    </Routes>
  );
};

export default App;
