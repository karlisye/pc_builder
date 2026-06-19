import React from "react";
import { useTranslation } from "react-i18next";

const ComponentCheckbox = ({
  component,
  checked,
  onChange,
  disabled = false,
}) => {
  const { t } = useTranslation(["admin", "common"]);
  return (
    <div className="flex items-center gap-2">
      <input
        className="accent-secondary-light disabled:accent-red-500"
        id={component}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(component, e.target.checked)}
        disabled={disabled}
      />
      <label
        className={`text-sm capitalize ${
          disabled ? "text-muted" : "text-secondary-light"
        }`}
        htmlFor={component}
      >
        {component === "all"
          ? t("scraper.allCategories")
          : t(`common:components.${component}`)}
      </label>
    </div>
  );
};

export default ComponentCheckbox;
