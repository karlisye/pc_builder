import React, { useState } from "react";

const BudgetSlider = ({
  value,
  onChange,
  min = 500,
  max = 10000,
  step = 100,
}) => {
  const [inputValue, setInputValue] = useState(value);

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

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-muted text-sm">Budget</span>
        <div className="flex items-center gap-1">
          <span className="text-muted text-sm">€</span>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={(e) => e.key === "Enter" && e.target.blur()}
            className="text-secondary-light font-semibold w-13 text-right focus:outline-none"
          />
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleSlider}
        className="cursor-pointer w-full accent-secondary-light"
      />
      <div className="flex justify-between">
        <span className="text-muted text-xs">€{min.toLocaleString()}</span>
        <span className="text-muted text-xs">€{max.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default BudgetSlider;
