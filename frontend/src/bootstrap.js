import axios from "axios";

window.axios = axios;
window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
window.axios.defaults.withCredentials = true;
window.axios.defaults.withXSRFToken = true;

axios.interceptors.request.use((config) => {
  // <html lang> is set from the URL locale by root.jsx
  config.headers["X-Locale"] = document.documentElement.lang || "lv";
  return config;
});
