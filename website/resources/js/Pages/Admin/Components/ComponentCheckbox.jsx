import React from "react";

const ComponentCheckbox = ({
  component,
  checked,
  onChange,
  disabled = false,
}) => {
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
        {component}
      </label>
    </div>
  );
};

export default ComponentCheckbox;
