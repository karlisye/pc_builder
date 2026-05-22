import React, { useState } from "react";
import ComponentCheckbox from "./ComponentCheckbox";
import { ArrowIcon } from "../../Components/Common/Icons";
import ClosedSection from "../../Components/Common/ClosedSection";

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

const ScraperFilters = ({
  categories,
  updateCategories,
  settings,
  setSettings,
  error,
}) => {
  const [open, setOpen] = useState(false);

  const validateSettings = (key, value) => {
    const num = Number(value);

    if (Number.isNaN(num)) return null;

    switch (key) {
      case "delay":
        if (num < 0) return 0;
        if (num > 10) return 10;
        return num;

      case "maxErrors":
        if (num < 1) return 1;
        if (num > 100) return 100;
        return num;

      default:
        return value;
    }
  };

  const updateSettings = (key, value) => {
    const validated = validateSettings(key, value);

    if (validated === null) return;

    setSettings((prev) => ({
      ...prev,
      [key]: validated,
    }));
  };

  return (
    <>
      <div>
        <p className="text-secondary-light mb-2">Categories to scrape</p>

        <ComponentCheckbox
          component={"all"}
          checked={categories.includes("all")}
          onChange={updateCategories}
        />

        <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-muted">
          {COMPONENT_CATEGORIES.map((category) => (
            <ComponentCheckbox
              key={category}
              component={category}
              checked={categories.includes(category)}
              onChange={updateCategories}
              disabled={categories.includes("all")}
            />
          ))}
        </div>
      </div>

      <div>
        <ClosedSection title={"Settings"}>
          <div className="flex gap-4 justify-between items-center">
            <label className="text-sm text-secondary-light" htmlFor="delay">
              Delay (seconds)
            </label>
            <input
              className="border border-muted p-0.5 outline-0 text-secondary-light w-30"
              type="number"
              value={settings.delay}
              min={0}
              max={10}
              step={0.2}
              onChange={(e) => updateSettings("delay", e.target.value)}
            />
          </div>

          <div className="flex gap-4 justify-between items-center">
            <label className="text-sm text-secondary-light" htmlFor="delay">
              Max errors per category
            </label>
            <input
              className="border border-muted p-0.5 outline-0 text-secondary-light w-30"
              type="number"
              value={settings.maxErrors}
              min={1}
              max={100}
              onChange={(e) => updateSettings("maxErrors", e.target.value)}
            />
          </div>
        </ClosedSection>
      </div>

      {error && <p className="text-danger">{error}</p>}
    </>
  );
};

export default ScraperFilters;
