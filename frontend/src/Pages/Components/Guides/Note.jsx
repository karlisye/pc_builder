import React from "react";
import { useTranslation } from "react-i18next";

const Note = ({ children }) => {
  const { t } = useTranslation("pages");
  return (
    <div className="border border-border p-4 bg-background text-sm text-muted mt-1.5 shadow">
      <span className="font-medium text-text">{t("guides.note.label")} </span>
      {children}
    </div>
  );
};

export default Note;
