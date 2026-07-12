import { createContext, useContext, useEffect, useState } from "react";
import { Navigate } from "react-router";
import axios from "axios";
import { useLocalePath } from "../lib/localePath";

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);
  const [verifyBannerVisible, setVerifyBannerVisible] = useState(true);

  useEffect(() => {
    axios
      .get("/api/user")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  const login = async (email, password, turnstile_token) => {
    await axios.get("/sanctum/csrf-cookie");
    const res = await axios.post("/api/login", { email, password, turnstile_token });
    setUser(res.data);
    return res.data;
  };

  const register = async (name, email, password, password_confirmation, turnstile_token) => {
    await axios.get("/sanctum/csrf-cookie");
    const res = await axios.post("/api/register", {
      name,
      email,
      password,
      password_confirmation,
      turnstile_token,
    });
    setUser(res.data);
    return res.data;
  };

  const logout = async () => {
    await axios.post("/api/logout");
    setUser(null);
  };

  const forgotPassword = async (email, turnstile_token) => {
    await axios.get("/sanctum/csrf-cookie");
    return axios.post("/api/forgot-password", { email, turnstile_token });
  };

  const resetPassword = async (token, email, password, password_confirmation) => {
    await axios.get("/sanctum/csrf-cookie");
    return axios.post("/api/reset-password", { token, email, password, password_confirmation });
  };

  const resendVerification = () => {
    return axios.post("/api/email/verification-notification");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        resendVerification,
        verifyBannerVisible,
        dismissVerifyBanner: () => setVerifyBannerVisible(false),
        showVerifyBanner: () => setVerifyBannerVisible(true),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// Client-side guards — the SSR server never sees Sanctum cookies, so auth
// pages render null on the server and resolve after the /api/user fetch.
export const GuestRoute = ({ children }) => {
  const { user } = useAuth();
  const lp = useLocalePath();
  if (user === undefined) return null;
  return user ? <Navigate to={lp("/")} replace /> : children;
};

export const AuthRoute = ({ children }) => {
  const { user } = useAuth();
  const lp = useLocalePath();
  if (user === undefined) return null;
  return user ? children : <Navigate to={lp("/login")} replace />;
};
