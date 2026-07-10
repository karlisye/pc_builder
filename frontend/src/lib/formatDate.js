export const formatDate = (
  date,
  lang = "lv",
  options = { year: "numeric", month: "short", day: "numeric" },
) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString(lang, options);
};
