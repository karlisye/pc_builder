const currentLang = () =>
  typeof document !== "undefined" ? document.documentElement.lang || "lv" : "lv";

export const formatDate = (date, options = { year: "numeric", month: "short", day: "numeric" }) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString(currentLang(), options);
};
