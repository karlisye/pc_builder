import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useBuilder } from "../../../Contexts/BuilderContext";
import { getCheapestPrice } from "../../../lib/componentPrice";

const BudgetSlider = ({
  value,
  onChange,
  min = 350,
  max = 10000,
  recommended = 1,
  step = 50,
  showRemaining = true,
}) => {
  const { t } = useTranslation("builder");
  const { selectedComponents } = useBuilder();
  const [inputValue, setInputValue] = useState(value);
  const [isUnlimited, setIsUnlimited] = useState(false);

  const filled = Object.values(selectedComponents).filter((v) => v !== null);
  const total = filled.reduce((sum, c) => sum + getCheapestPrice(c), 0);
  const remaining = value - total;

  const percentage = (((isUnlimited ? min : value) - min) / (max - min)) * 100;
  const reccomendedPercentage = ((recommended - min) / (max - min)) * 100;

  const clamp = (val) => {
    const num = parseInt(val);
    if (isNaN(num)) return min;
    return Math.min(Math.max(num, min), max);
  };

  const handleBlur = () => {
    const clamped = clamp(inputValue);
    setInputValue(clamped);
    onChange(clamped);
  };

  const handleSlider = (e) => {
    const val = parseInt(e.target.value);
    setInputValue(val);
    onChange(val);
  };

  const handleUnlimited = (e) => {
    const checked = e.target.checked;
    setIsUnlimited(checked);
    if (checked) {
      onChange(null);
    } else {
      const restored = clamp(inputValue);
      onChange(restored);
    }
  };

  return (
    <div className="space-y-2 my-2 mt-4">
      <div className="flex gap-2">
        <input
          className="accent-secondary-light"
          id="unlimited"
          type="checkbox"
          checked={isUnlimited}
          onChange={handleUnlimited}
        />
        <label className="text-sm text-secondary-light" htmlFor="unlimited">
          {t("budgetSlider.anyBudget")}
        </label>
      </div>
      <div
        className={`flex justify-between items-center transition-opacity ${isUnlimited ? "opacity-40 pointer-events-none" : ""}`}
      >
        <span className="text-secondary-light text-sm">
          {t("budgetSlider.totalBudget")}
        </span>
        <div className="flex items-center gap-1">
          <span className="text-muted text-sm">€</span>
          <input
            type="text"
            value={isUnlimited ? "-" : inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={(e) => e.key === "Enter" && e.target.blur()}
            disabled={isUnlimited}
            aria-label={t("budgetSlider.totalBudget")}
            className="text-secondary-light font-semibold w-13 text-right focus:outline-none"
          />
        </div>
      </div>
      {showRemaining && (
        <div
          className={`flex justify-between items-center transition-opacity ${isUnlimited ? "opacity-40 pointer-events-none" : ""}`}
        >
          <span className="text-secondary-light text-sm">
            {t("budgetSlider.remainingBudget")}
          </span>
          <div className="space-x-2">
            <span className="text-muted text-sm">€</span>
            <span className="text-secondary-light font-semibold">
              {isUnlimited ? "-" : remaining.toFixed(2)}
            </span>
          </div>
        </div>
      )}

      <div className="relative">
        {!isUnlimited && (
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-2 rounded-full bg-danger/50 pointer-events-none z-15"
            style={{ width: `${reccomendedPercentage}%` }}
          />
        )}

        <div className="absolute w-full left-0 top-1/2 -translate-y-1/2 h-2 rounded-full bg-secondary pointer-events-none z-5" />

        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-2 rounded-full bg-secondary-light pointer-events-none z-10"
          style={{ width: `${percentage}%` }}
        />

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={isUnlimited ? min : value}
          onChange={handleSlider}
          disabled={isUnlimited}
          aria-label={t("budgetSlider.totalBudget")}
          className={`relative z-20 w-full h-2 appearance-none bg-transparent transition-opacity 
            ${isUnlimited ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
            ${value <= recommended ? "accent-danger/80" : "accent-secondary-light"}
          `}
        />
      </div>

      <div className="flex justify-between">
        <span className="text-muted text-xs">€{min.toLocaleString()}</span>
        <span className="text-muted text-xs">€{max.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default BudgetSlider;
