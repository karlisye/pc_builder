import React from "react";
import { useBuilder } from "../../Contexts/BuilderContext";

const BuildDesc = () => {
  const { selectedComponents } = useBuilder();

  const filled = Object.values(selectedComponents).filter((v) => v !== null);
  const total = filled.reduce((sum, c) => sum + parseFloat(c.price ?? 0), 0);
  const count = filled.length;
  const totalSlots = Object.keys(selectedComponents).length;

  return (
    <div className="border border-secondary p-4 space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-secondary-light text-sm">Total</span>
        <span className="text-secondary-light font-semibold text-xl">
          €{total.toFixed(2)}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-secondary-light text-sm">Components</span>
        <span className="text-secondary-light text-sm">
          {count}/{totalSlots}
        </span>
      </div>
    </div>
  );
};

export default BuildDesc;
