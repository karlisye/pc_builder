import React, { useState } from "react";
import { useBuilder } from "../../../Contexts/BuilderContext";
import { ArrowIcon } from "../Common/Icons";

const BuildDesc = () => {
  const { selectedComponents, warnings, notes, buildIssues } = useBuilder();

  const filled = Object.values(selectedComponents).filter((v) => v !== null);
  const total = filled.reduce((sum, c) => sum + parseFloat(c.price ?? 0), 0);
  const count = filled.length;
  const totalSlots = Object.keys(selectedComponents).length;

  const [warningActive, setWarningActive] = useState(false);
  const [compatibilityActive, setCompatibilityActive] = useState(false);

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

      {Object.keys(buildIssues).length > 0 && (
        <div>
          <div
            className={`flex gap-2 justify-between items-center text-secondary-light hover:text-surface cursor-pointer transition`}
            onClick={() => setCompatibilityActive((prev) => !prev)}
          >
            <h2 className="text-medium">Compatibility</h2>

            <span className="">
              <ArrowIcon active={compatibilityActive} />
            </span>
          </div>

          <div
            className={`grid transition-all ${compatibilityActive ? "grid-rows-[1fr] border-b pb-4 border-b-primary-light mt-2" : "grid-rows-[0fr]"}`}
          >
            <div className="space-y-2 overflow-hidden">
              {Object.keys(buildIssues).length > 0 && (
                <div className="space-y-2">
                  {Object.entries(buildIssues).map(([slot, issues]) =>
                    issues.map((issue, i) => (
                      <div
                        key={`${slot}-${i}`}
                        className="border border-danger/80 bg-danger/10 p-4 space-y-2"
                      >
                        <p className="text-danger text-sm capitalize">
                          {slot}: {issue}
                        </p>
                      </div>
                    )),
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {(warnings?.length > 0 || notes?.length > 0) && (
        <div>
          <div
            className={`flex gap-2 justify-between items-center text-secondary-light hover:text-surface cursor-pointer transition`}
            onClick={() => setWarningActive((prev) => !prev)}
          >
            <h2 className="text-medium">About This Build</h2>

            <span className="">
              <ArrowIcon active={warningActive} />
            </span>
          </div>

          <div
            className={`grid transition-all ${warningActive ? "grid-rows-[1fr] border-b pb-4 border-b-primary-light mt-2" : "grid-rows-[0fr]"}`}
          >
            <div className="space-y-2 overflow-hidden">
              {notes.map((note, i) => (
                <div
                  key={i}
                  className="border border-info/80 bg-info/10 p-4 space-y-2"
                >
                  <p className="text-info text-sm">{note}</p>
                </div>
              ))}

              {Object.keys(buildIssues).length > 0 && (
                <div className="space-y-2">
                  {Object.entries(buildIssues).map(([slot, issues]) =>
                    issues.map((issue, i) => (
                      <div
                        key={`${slot}-${i}`}
                        className="border border-danger/80 bg-danger/10 p-4 space-y-2"
                      >
                        <p className="text-danger text-sm capitalize">
                          {slot}: {issue}
                        </p>
                      </div>
                    )),
                  )}
                </div>
              )}

              {warnings.map((warning, i) => (
                <div
                  key={i}
                  className="border border-danger/80 bg-danger/10 p-4 space-y-2"
                >
                  <p className="text-danger text-sm">{warning}</p>
                </div>
              ))}

              <p className="text-sm text-muted border-l pl-4">
                Your build is fully functional. These are just recommendations
                to get the best experience.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuildDesc;
