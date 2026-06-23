import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useBuilder } from "../../../Contexts/BuilderContext";
import { ArrowIcon } from "../Common/Icons";
import ClosedSection from "../Common/ClosedSection";
import { getCheapestPrice } from "../../../lib/componentPrice";

const BuildDesc = () => {
  const { t } = useTranslation(["builder", "common"]);
  const { selectedComponents, warnings, notes, buildIssues, buildId, buildName } =
    useBuilder();

  const filled = Object.values(selectedComponents).filter((v) => v !== null);
  const total = filled.reduce((sum, c) => sum + getCheapestPrice(c), 0);
  const count = filled.length;
  const totalSlots = Object.keys(selectedComponents).length;

  const [warningActive, setWarningActive] = useState(false);
  const [compatibilityActive, setCompatibilityActive] = useState(false);

  return (
    <div className="space-y-4">
      {buildId && (
        <p className="text-secondary-light text-sm">
          {t("buildDesc.currentlyEditing", { name: buildName })}
        </p>
      )}

      <div className="border border-secondary p-4 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-secondary-light text-sm">{t("buildDesc.total")}</span>
          <span className="text-secondary-light font-semibold text-xl">
            €{total.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-secondary-light text-sm">
            {t("buildDesc.components")}
          </span>
          <span className="text-secondary-light text-sm">
            {count}/{totalSlots}
          </span>
        </div>
      </div>

      {Object.keys(buildIssues).length > 0 && (
        <div>
          <ClosedSection title={t("buildDesc.compatibility")}>
            {Object.keys(buildIssues).length > 0 && (
              <div className="space-y-2">
                {Object.entries(buildIssues).map(([slot, issues]) =>
                  issues.map((issue, i) => (
                    <div
                      key={`${slot}-${i}`}
                      className="border border-danger/80 bg-danger/10 p-4 space-y-2"
                    >
                      <p className="text-danger text-sm">
                        <span className="font-medium">
                          {t(`common:components.${slot}`, { defaultValue: slot })}:{" "}
                        </span>
                        {issue}
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
          <ClosedSection title={t("buildDesc.aboutThisBuild")}>
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
                      <p className="text-danger text-sm">
                        <span className="font-medium">
                          {t(`common:components.${slot}`, { defaultValue: slot })}:{" "}
                        </span>
                        {issue}
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
              {t("buildDesc.fullyFunctionalNote")}
            </p>
          </ClosedSection>
        </div>
      )}
    </div>
  );
};

export default BuildDesc;
