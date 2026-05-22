import React, { useState } from "react";
import { useBuilder } from "../../../Contexts/BuilderContext";
import { ArrowIcon } from "../Common/Icons";
import ClosedSection from "../Common/ClosedSection";

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
          <ClosedSection title={"Compatibility"}>
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
          </ClosedSection>
        </div>
      )}

      {(warnings?.length > 0 || notes?.length > 0) && (
        <div>
          <ClosedSection title={"About This Build"}>
            <div className="space-y-2">
              {notes.map((note, i) => (
                <div key={i} className="border border-info/80 bg-info/10 p-4">
                  <p className="text-info text-sm">{note}</p>
                </div>
              ))}
            </div>

            {Object.keys(buildIssues).length > 0 && (
              <div className="space-y-2">
                {Object.entries(buildIssues).map(([slot, issues]) =>
                  issues.map((issue, i) => (
                    <div
                      key={`${slot}-${i}`}
                      className="border border-danger/80 bg-danger/10 p-4"
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
              <div key={i} className="border border-danger/80 bg-danger/10 p-4">
                <p className="text-danger text-sm">{warning}</p>
              </div>
            ))}

            <p className="text-sm text-muted border-l pl-4">
              Your build is fully functional. These are just recommendations to
              get the best experience.
            </p>
          </ClosedSection>
        </div>
      )}
    </div>
  );
};

export default BuildDesc;
