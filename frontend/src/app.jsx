import "./bootstrap";
import "./app.css";
import "./i18n";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider, useAuth } from "./Contexts/AuthContext";
import { ToastProvider } from "./Contexts/ToastContext";
import ToastContainer from "./Pages/Components/Common/ToastContainer";

import Layout from "./Layouts/Layout";

import Home from "./Pages/Home";
import Guide from "./Pages/Guide";
import Builder from "./Pages/Builder";
import SavedBuilds from "./Pages/SavedBuilds";
import NotFound from "./Pages/NotFound";
import EmailVerified from "./Pages/EmailVerified";

import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";

import AccountSettings from "./Pages/Components/Profile/AccountSettings";

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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
  <HelmetProvider>
    <AuthProvider>
      <ToastProvider>
        <ToastContainer />
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/guide" element={<Guide />} />
              <Route path="/email-verified" element={<EmailVerified />} />

              {/* Guest-only */}
              <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
              <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

              {/* Manual builder available to guests; auto-generate features are auth-gated inline */}
              <Route path="/builder" element={<Builder />} />

              {/* Auth-required */}
              <Route path="/builds" element={<AuthRoute><SavedBuilds /></AuthRoute>} />

              <Route path="/profile" element={<AuthRoute><AccountSettings /></AuthRoute>} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  </HelmetProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("app")).render(<App />);
