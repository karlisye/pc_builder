import React, { useState } from "react";

const BudgetSlider = ({
  value,
  onChange,
  min = 350,
  max = 10000,
  step = 50,
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [isUnlimited, setIsUnlimited] = useState(false);

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
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          className="accent-secondary-light"
          id="unlimited"
          type="checkbox"
          checked={isUnlimited}
          onChange={handleUnlimited}
        />
        <label className="text-sm text-muted" htmlFor="unlimited">
          Any Budget
        </label>
      </div>
      <div
        className={`flex justify-between items-center transition-opacity ${isUnlimited ? "opacity-40 pointer-events-none" : ""}`}
      >
        <span className="text-muted text-sm">Budget</span>
        <div className="flex items-center gap-1">
          <span className="text-muted text-sm">€</span>
          <input
            type="text"
            value={isUnlimited ? "—" : inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={(e) => e.key === "Enter" && e.target.blur()}
            disabled={isUnlimited}
            className="text-secondary-light font-semibold w-13 text-right focus:outline-none"
          />
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={isUnlimited ? min : value}
        onChange={handleSlider}
        disabled={isUnlimited}
        className={`w-full accent-secondary-light transition-opacity ${isUnlimited ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
      />
      <div className="flex justify-between">
        <span className="text-muted text-xs">€{min.toLocaleString()}</span>
        <span className="text-muted text-xs">€{max.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default BudgetSlider;
