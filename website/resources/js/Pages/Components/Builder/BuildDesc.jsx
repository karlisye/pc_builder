import React, { useState } from "react";
import { useBuilder } from "../../../Contexts/BuilderContext";
import { ArrowIcon } from "../Common/Icons";

const BuildDesc = () => {
  const { selectedComponents, warnings } = useBuilder();

  const filled = Object.values(selectedComponents).filter((v) => v !== null);
  const total = filled.reduce((sum, c) => sum + parseFloat(c.price ?? 0), 0);
  const count = filled.length;
  const totalSlots = Object.keys(selectedComponents).length;

  const [warningActive, setWarningActive] = useState(false);

  return (
    <div className="space-y-4">
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

      {warnings?.length > 0 && (
        <div>
          <div
            className={`flex gap-2 justify-between items-center ${warningActive ? "text-danger/80" : "text-secondary-light"} hover:text-danger cursor-pointer transition`}
            onClick={() => setWarningActive((prev) => !prev)}
          >
            <h2 className="text-medium">Warnings</h2>

            <span className="">
              <ArrowIcon active={warningActive} />
            </span>
          </div>

          <div
            className={`grid transition-all ${warningActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
          >
            <div className="space-y-2 overflow-hidden">
              {warnings.map((warning, i) => (
                <div
                  key={i}
                  className="border border-danger/80 bg-danger/10 p-4 space-y-2"
                >
                  <p className="text-danger text-sm">{warning}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuildDesc;
