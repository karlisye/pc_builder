import React from "react";

const BudgetSlider = ({
  value,
  onChange,
  min = 500,
  max = 10000,
  step = 100,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-muted text-sm">Budget</span>
        <span className="text-secondary-light font-semibold">
          €{value.toLocaleString()}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
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
