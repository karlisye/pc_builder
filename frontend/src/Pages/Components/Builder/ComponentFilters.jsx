import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useBuilder } from "../../../Contexts/BuilderContext";
import { ArrowIcon } from "../Common/Icons";

const FILTER_CONFIG = {
  cpu: ["socket", "cores", "integrated_graphics", "cooler_included"],
  motherboard: ["socket", "chipset", "form_factor", "memory_type", "wifi"],
  ram: ["memory_type", "capacity", "frequency"],
  gpu: ["vram", "min_psu"],
  case: ["form_factor"],
  cooler: ["tdp_support"],
  psu: ["wattage", "efficiency_rating", "modular", "psu_type"],
  ssd: ["capacity", "type", "form_factor", "interface"],
};

const ComponentFilters = () => {
  const { t } = useTranslation(["builder", "common"]);
  const {
    search,
    setSearch,
    sort,
    setSort,
    filters,
    setFilters,
    currentCompToAdd,
  } = useBuilder();
  const [availableFilters, setAvailableFilters] = useState({});
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!currentCompToAdd) return;
    setError("");
    setAvailableFilters({});
    fetchFilters();
  }, [currentCompToAdd]);

  const fetchFilters = async () => {
    try {
      const res = await axios.get(
        `/api/components/${currentCompToAdd.toLowerCase()}/filters`,
      );
      setAvailableFilters(res.data);
    } catch (err) {
      console.error("Failed to fetch filters", err);
      setError(t("componentFilters.failedToFetchFilters"));
    }
  };

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setSearch("");
    setSort("");
    setFilters({});
  };

  const activeColumns = FILTER_CONFIG[currentCompToAdd.toLowerCase()] ?? [];

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("componentFilters.searchPlaceholder", {
            component: t(`common:components.${currentCompToAdd?.toLowerCase()}`),
          })}
          className="bg-secondary text-white p-2 flex-1 outline-border focus:outline-1"
        />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="bg-secondary-light p-2 text-text outline-border focus:outline-1"
        >
          <option value="price_asc">{t("componentFilters.sort.priceAsc")}</option>
          <option value="price_desc">{t("componentFilters.sort.priceDesc")}</option>
          <option value="name_asc">{t("componentFilters.sort.nameAsc")}</option>
          <option value="name_desc">{t("componentFilters.sort.nameDesc")}</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          id="minPrice"
          className="bg-secondary p-2 text-white outline-border focus:outline-1"
          placeholder={t("componentFilters.minPrice")}
          value={filters["min_price"] ?? ""}
          onChange={(e) =>
            updateFilter("min_price", e.target.value || undefined)
          }
        />

        <input
          type="number"
          id="maxPrice"
          className="bg-secondary p-2 text-white outline-border focus:outline-1"
          placeholder={t("componentFilters.maxPrice")}
          value={filters["max_price"] ?? ""}
          onChange={(e) =>
            updateFilter("max_price", e.target.value || undefined)
          }
        />

        {activeColumns.map((column) => {
          const values = availableFilters[column] ?? [];
          if (values.length === 0) return null;

          return (
            <select
              value={filters[column] ?? ""}
              onChange={(e) =>
                updateFilter(column, e.target.value || undefined)
              }
              className="bg-secondary-light p-2 text-text outline-border focus:outline-1"
              key={column}
            >
              <option value="">
                {t(`componentFilters.labels.${column}`, column)}:{" "}
                {t("componentFilters.all")}
              </option>
              {values.map((value) => (
                <option key={value} value={value}>
                  {value === true || value === 1
                    ? t("componentFilters.yes")
                    : value === false || value === 0
                      ? t("componentFilters.no")
                      : value}
                </option>
              ))}
            </select>
          );
        })}

        {error && <p className="text-danger text-sm">{error}</p>}
      </div>

      <div>
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="w-full flex justify-between items-center text-secondary-light hover:text-surface transition cursor-pointer"
        >
          <span className="">{t("componentFilters.display")}</span>
          <ArrowIcon active={open} />
        </button>

        <div
          className={`grid transition-all ${open ? "grid-rows-[1fr] mt-2" : "grid-rows-[0fr]"}`}
        >
          <div className="grid grid-cols-2 gap-2 overflow-hidden">
            <div className="flex gap-2 items-center">
              <input
                className="accent-secondary-light"
                id="show_in_stock"
                type="checkbox"
                checked={filters["show_in_stock"] ?? true}
                onChange={(e) =>
                  updateFilter("show_in_stock", e.target.checked)
                }
              />
              <label
                className="text-secondary-light text-sm"
                htmlFor="show_in_stock"
              >
                {t("componentFilters.inStock")}
              </label>
            </div>

            <div className="flex gap-2 items-center">
              <input
                className="accent-secondary-light"
                id="show_orderable"
                type="checkbox"
                checked={filters["show_orderable"] ?? true}
                onChange={(e) =>
                  updateFilter("show_orderable", e.target.checked)
                }
              />
              <label
                className="text-secondary-light text-sm"
                htmlFor="show_orderable"
              >
                {t("componentFilters.canBeOrdered")}
              </label>
            </div>

            <div className="flex col-span-2 gap-2 items-center">
              <input
                className="accent-secondary-light"
                id="show_compatible_only"
                type="checkbox"
                checked={filters["show_compatible_only"] ?? false}
                onChange={(e) =>
                  updateFilter("show_compatible_only", e.target.checked)
                }
              />
              <label
                className="text-secondary-light text-sm"
                htmlFor="show_compatible_only"
              >
                {t("componentFilters.compatibleOnly")}
              </label>
            </div>
          </div>
        </div>
      </div>

      <button
        className="w-full p-4 bg-secondary hover:bg-secondary-dark transition cursor-pointer text-white"
        onClick={clearFilters}
      >
        {t("componentFilters.clearFilters")}
      </button>
    </div>
  );
};

export default ComponentFilters;
