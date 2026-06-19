import i18n from "../i18n";

export const formatDate = (date, options = { year: "numeric", month: "short", day: "numeric" }) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString(i18n.resolvedLanguage, options);
};
