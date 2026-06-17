import "./bootstrap";
import "../css/app.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./Contexts/AuthContext";

import Layout from "./Layouts/Layout";
import AdminLayout from "./Layouts/AdminLayout";
import ProfileLayout from "./Layouts/ProfileLayout";

import Home from "./Pages/Home";
import Guide from "./Pages/Guide";
import Builder from "./Pages/Builder";
import SavedBuilds from "./Pages/SavedBuilds";
import Shared from "./Pages/Shared";
import NotFound from "./Pages/NotFound";

import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";

import Profile from "./Pages/Profile";
import AccountSettings from "./Pages/Components/Profile/AccountSettings";
import BookmarkedBuilds from "./Pages/Components/Profile/BookmarkedBuilds";
import PublicProfile from "./Pages/Components/Profile/PublicProfile";

import AdminDashboard from "./Pages/Admin/Dashboard";
import AdminScraper from "./Pages/Admin/Scraper";
import AdminHistory from "./Pages/Admin/History";
import AdminTest from "./Pages/Admin/Test";

const GuestRoute = ({ children }) => {
  const { user } = useAuth();
  if (user === undefined) return null;
  return user ? <Navigate to="/" replace /> : children;
};

const AuthRoute = ({ children }) => {
  const { user } = useAuth();
  if (user === undefined) return null;
  return user ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (user === undefined) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;
  return children;
};

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/guide" element={<Guide />} />

          {/* Guest-only */}
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

          {/* Auth-required */}
          <Route path="/builder" element={<AuthRoute><Builder /></AuthRoute>} />
          <Route path="/builds" element={<AuthRoute><SavedBuilds /></AuthRoute>} />
          <Route path="/shared" element={<AuthRoute><Shared /></AuthRoute>} />

          {/* Profile (nested layout) */}
          <Route element={<AuthRoute><ProfileLayout /></AuthRoute>}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/account" element={<AccountSettings />} />
            <Route path="/profile/bookmarked" element={<BookmarkedBuilds />} />
          </Route>

          <Route path="/profile/:user" element={<PublicProfile />} />
        </Route>

        {/* Admin */}
        <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/scrape" element={<AdminScraper />} />
          <Route path="/admin/history" element={<AdminHistory />} />
          <Route path="/admin/test" element={<AdminTest />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

createRoot(document.getElementById("app")).render(<App />);
