import React from "react";
import ClosedSection from "../../Components/Common/ClosedSection";
import ComponentCheckbox from "./ComponentCheckbox";
import { useTranslation } from "react-i18next";

const COMPONENT_CATEGORIES = [
  "cpu",
  "motherboard",
  "ram",
  "gpu",
  "ssd",
  "hdd",
  "case",
  "fan",
  "psu",
  "cooler",
];

const HistoryFilters = ({ filters, setFilters, sort, setSort }) => {
  const { t } = useTranslation("admin");
  const clearFilters = () => {
    setSort("");
    setFilters({});
  };

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const updateCategories = (category) => {
    setFilters((prev) => {
      const current = prev.categories ?? [];
      const updated = current.includes(category)
        ? current.filter((c) => c !== category)
        : [...current, category];
      return { ...prev, categories: updated };
    });
  };

  return (
    <div className="space-y-4">
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="bg-secondary-light p-2 text-text outline-border focus:outline-1 w-full"
      >
        <option value="date_asc">{t("history.filters.sortDateAsc")}</option>
        <option value="date_desc">{t("history.filters.sortDateDesc")}</option>
      </select>

      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col">
          <label className="text-sm text-secondary-light" htmlFor="date_from">
            {t("history.filters.dateFrom")}
          </label>
          <input
            type="date"
            id="date_from"
            className="bg-secondary p-2 text-secondary-light outline-border focus:outline-1"
            value={filters["date_from"] ?? ""}
            onChange={(e) =>
              updateFilter("date_from", e.target.value || undefined)
            }
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-secondary-light" htmlFor="date_to">
            {t("history.filters.dateTo")}
          </label>
          <input
            type="date"
            id="date_to"
            className="bg-secondary p-2 text-secondary-light outline-border focus:outline-1"
            value={filters["date_to"] ?? ""}
            onChange={(e) =>
              updateFilter("date_to", e.target.value || undefined)
            }
          />
        </div>
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-secondary-light" htmlFor="status">
          {t("history.filters.status")}
        </label>
        <select
          value={filters["status"] ?? ""}
          onChange={(e) => updateFilter("status", e.target.value || undefined)}
          className="p-1 text-secondary-light text-sm border border-muted hover:outline focus:outline outline-secondary-light"
        >
          <option value="">{t("history.filters.statusAny")}</option>
          <option value="success">{t("history.filters.statusSuccess")}</option>
          <option value="failed">{t("history.filters.statusFailed")}</option>
        </select>
      </div>

      <ClosedSection title={t("history.filters.scrapedComponents")}>
        <div className="grid grid-cols-2 gap-2">
          {COMPONENT_CATEGORIES.map((category) => (
            <ComponentCheckbox
              key={category}
              component={category}
              checked={(filters.categories ?? []).includes(category)}
              onChange={updateCategories}
            />
          ))}
        </div>
      </ClosedSection>

      <button
        className="w-full p-4 bg-secondary hover:bg-secondary-dark transition cursor-pointer text-white"
        onClick={clearFilters}
      >
        {t("history.filters.clearFilters")}
      </button>
    </div>
  );
};

export default HistoryFilters;
