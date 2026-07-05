import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

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

  const login = async (email, password) => {
    await axios.get("/sanctum/csrf-cookie");
    const res = await axios.post("/api/login", { email, password });
    setUser(res.data);
    return res.data;
  };

  const register = async (name, email, password, password_confirmation) => {
    await axios.get("/sanctum/csrf-cookie");
    const res = await axios.post("/api/register", {
      name,
      email,
      password,
      password_confirmation,
    });
    setUser(res.data);
    return res.data;
  };

  const logout = async () => {
    await axios.post("/api/logout");
    setUser(null);
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
