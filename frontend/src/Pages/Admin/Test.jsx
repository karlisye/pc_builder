import React, { useState } from "react";
import SidePanel from "../Components/Common/SidePanel";
import axios from "axios";
import { useTranslation } from "react-i18next";

const Test = () => {
  const { t } = useTranslation("admin");
  const [results, setResults] = useState(null);

  const handlePopulate = async () => {
    try {
      const res = await axios.post("/admin/populate");
      setResults(res.data);
    } catch (err) {
      console.error(err.response?.data);
    }
  };

  return (
    <div className="h-full flex">
      <SidePanel title={t("test.sidePanelTitle")}>
        <div>
          <h2 className="text-2xl font-semibold text-secondary-light">
            {t("test.populateTitle")}
          </h2>
          <p className="text-muted">{t("test.populateDescription")}</p>
        </div>

        <button
          className="p-4 mt-4 w-full bg-secondary-light text-text cursor-pointer hover:bg-secondary-light/50 transition"
          onClick={handlePopulate}
        >
          {t("test.populateButton")}
        </button>
      </SidePanel>

      <div className="flex-1 px-4 py-6">
        <div>
          {results && (
            <div className="border p-2 border-border grid gap-4 grid-cols-2">
              <div className="flex gap-2 items-center">
                <span className="font-medium text-success">{t("test.succeeded")}</span>
                <span className="text-success font-medium">
                  {results.succeeded}
                </span>
              </div>

              <div className="flex gap-2 items-center">
                <span className="font-medium text-danger">{t("test.failed")}</span>
                <span className="text-danger font-medium">
                  {results.failed}
                </span>
              </div>

              <div className="col-span-2">
                <p className="text-text mb-2">{t("test.results")}</p>
                <div className="space-y-2">
                  {results.results.map((result, i) => (
                    <div
                      key={i}
                      className={`p-3 border ${result.success ? "border-success/40 bg-success/5" : "border-danger/40 bg-danger/5"}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text">
                          {result.config.preferences.type ?? t("test.generalType")} |{" "}
                          {result.config.budget
                            ? `€${result.config.budget}`
                            : t("test.unlimited")}
                          {result.config.preferences.gpu &&
                            ` | ${t("test.gpuLabel", { gpu: result.config.preferences.gpu })}`}
                          {result.config.preferences.cpu &&
                            ` | ${t("test.cpuLabel", { cpu: result.config.preferences.cpu })}`}
                        </span>
                        <span
                          className={`text-sm font-medium ${result.success ? "text-success" : "text-danger"}`}
                        >
                          {result.success ? `€${result.total_price}` : t("test.failedLabel")}
                        </span>
                      </div>
                      {!result.success && (
                        <p className="text-danger text-xs mt-1">
                          {result.error}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Test;
