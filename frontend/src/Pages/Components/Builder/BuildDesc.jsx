import React from "react";
import { useTranslation } from "react-i18next";
import { useBuilder, useBuildMeta } from "../../../Contexts/BuilderContext";
import ClosedSection from "../Common/ClosedSection";
import { getCheapestPrice } from "../../../lib/componentPrice";

const BuildDesc = () => {
  const { t } = useTranslation(["builder", "common"]);
  const { selectedComponents, warnings, notes, buildIssues, buildWarnings, validateFailed } =
    useBuilder();
  const { buildId, buildName } = useBuildMeta();

  const filled = Object.values(selectedComponents).filter((v) => v !== null);
  const total = filled.reduce((sum, c) => sum + getCheapestPrice(c), 0);
  const count = filled.length;
  const totalSlots = Object.keys(selectedComponents).length;

  const manualCheckSlots = Object.entries(selectedComponents).filter(
    ([, component]) => component?.needs_manual_check === true,
  );

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

      {validateFailed && (
        <div className="border border-alert/80 bg-alert/10 p-4">
          <p className="text-alert text-sm">{t("buildDesc.validateFailed")}</p>
        </div>
      )}

      {(Object.keys(buildIssues).length > 0 ||
        Object.keys(buildWarnings).length > 0 ||
        manualCheckSlots.length > 0) && (
        <ClosedSection title={t("buildDesc.compatibility")}>
          <div className="space-y-2">
            {Object.entries(buildIssues).map(([slot, issues]) =>
              issues.map((issue, i) => (
                <div key={`issue-${slot}-${i}`} className="border border-danger/80 bg-danger/10 p-4">
                  <p className="text-danger text-sm">
                    <span className="font-medium">
                      {t(`common:components.${slot}`, { defaultValue: slot })}:{" "}
                    </span>
                    {issue}
                  </p>
                </div>
              )),
            )}
            {Object.entries(buildWarnings).map(([slot, warningList]) =>
              warningList.map((warning, i) => (
                <div key={`warn-${slot}-${i}`} className="border border-alert/80 bg-alert/10 p-4">
                  <p className="text-alert text-sm">
                    <span className="font-medium">
                      {t(`common:components.${slot}`, { defaultValue: slot })}:{" "}
                    </span>
                    {warning}
                  </p>
                </div>
              )),
            )}
            {manualCheckSlots.map(([slot]) => (
              <div key={`manual-check-${slot}`} className="border border-alert/80 bg-alert/10 p-4">
                <p className="text-alert text-sm">
                  <span className="font-medium">
                    {t(`common:components.${slot}`, { defaultValue: slot })}:{" "}
                  </span>
                  {t("componentCard.checkManually")}
                </p>
              </div>
            ))}
          </div>
        </ClosedSection>
      )}

      {(warnings?.length > 0 || notes?.length > 0) && (
        <ClosedSection title={t("buildDesc.aboutThisBuild")}>
          <div className="space-y-2">
            {notes.map((note, i) => (
              <div key={i} className="border border-info/80 bg-info/10 p-4">
                <p className="text-info text-sm">{note}</p>
              </div>
            ))}
            {warnings.map((warning, i) => (
              <div key={i} className="border border-alert/80 bg-alert/10 p-4">
                <p className="text-alert text-sm">{warning}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted border-l pl-4 mt-2">
            {t("buildDesc.fullyFunctionalNote")}
          </p>
        </ClosedSection>
      )}
    </div>
  );
};

export default BuildDesc;
