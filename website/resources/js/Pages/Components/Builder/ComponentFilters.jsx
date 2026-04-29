import React, { useEffect, useState } from "react";
import axios from "axios";
import { useBuilder } from "../../../Contexts/BuilderContext";

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

const FILTER_LABELS = {
  socket: "Socket",
  cores: "Cores",
  integrated_graphics: "Integrated Graphics",
  cooler_included: "Cooler Included",
  chipset: "Chipset",
  form_factor: "Form Factor",
  memory_type: "Memory Type",
  wifi: "WiFi",
  capacity: "Capacity (GB)",
  frequency: "Frequency (MHz)",
  vram: "VRAM (GB)",
  min_psu: "Max PSU Req (W)",
  tdp_support: "Min TDP Support (W)",
  wattage: "Min Wattage (W)",
  efficiency_rating: "Efficiency Rating",
  modular: "Modular",
  psu_type: "PSU Type",
  type: "Type",
  interface: "Interface",
};

const ComponentFilters = () => {
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

  useEffect(() => {
    if (!currentCompToAdd) return;
    setAvailableFilters({});

    axios
      .get(`/api/components/${currentCompToAdd.toLowerCase()}/filters`)
      .then((res) => setAvailableFilters(res.data))
      .catch((err) => console.error("Failed to fetch filters", err));
  }, [currentCompToAdd]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const activeColumns = FILTER_CONFIG[currentCompToAdd.toLowerCase()] ?? [];

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search ${currentCompToAdd}...`}
          className="bg-secondary text-white p-2 flex-1 outline-border focus:outline-1"
        />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="bg-secondary-light p-2 text-text outline-border focus:outline-1"
        >
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="name_asc">Name: A to Z</option>
          <option value="name_desc">Name: Z to A</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          id="minPrice"
          className="bg-secondary p-2 text-white outline-border focus:outline-1"
          placeholder="Min price (€)"
          value={filters["min_price"] ?? ""}
          onChange={(e) =>
            updateFilter("min_price", e.target.value || undefined)
          }
        />

        <input
          type="number"
          id="maxPrice"
          className="bg-secondary p-2 text-white outline-border focus:outline-1"
          placeholder="Max price (€)"
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
              <option value="">{FILTER_LABELS[column] ?? column}: All</option>
              {values.map((value) => (
                <option key={value} value={value}>
                  {value === true || value === 1
                    ? "Yes"
                    : value === false || value === 0
                      ? "No"
                      : value}
                </option>
              ))}
            </select>
          );
        })}
      </div>

      <button
        className="w-full p-4 bg-secondary hover:bg-secondary-dark transition cursor-pointer text-white"
        onClick={() => setFilters({})}
      >
        Clear Filters
      </button>
    </div>
  );
};

export default ComponentFilters;
