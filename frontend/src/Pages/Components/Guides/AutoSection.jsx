import React, { useRef } from "react";
import { Trans, useTranslation } from "react-i18next";
import Note from "./Note";

const BUDGET_COLUMNS = [
  { budget: "budgetLow", type: "general" },
  { budget: "budgetLow", type: "office" },
  { budget: "budgetMid", type: "general" },
  { budget: "budgetMid", type: "gaming" },
  { budget: "budgetMid", type: "office" },
  { budget: "budgetMid", type: "streaming" },
  { budget: "budgetHigh", type: "general" },
  { budget: "budgetHigh", type: "gaming" },
  { budget: "budgetHigh", type: "office" },
  { budget: "budgetHigh", type: "rendering" },
  { budget: "budgetHigh", type: "streaming" },
];

const BUDGET_ROWS = [
  { key: "gpu", values: [null, null, "24%", "27%", null, "20%", "25%", "27%", null, "25%", "22%"] },
  { key: "cpu", values: ["26%", "28%", "16%", "14%", "25%", "20%", "14%", "12%", "22%", "15%", "20%"] },
  { key: "motherboard", values: ["20%", "22%", "10%", "10%", "18%", "10%", "10%", "10%", "16%", "10%", "10%"] },
  { key: "ram", values: ["24%", "25%", "20%", "20%", "30%", "20%", "22%", "23%", "35%", "28%", "22%"] },
  { key: "cooler", values: [null, null, "3%", "3%", "3%", "3%", "2%", "2%", "2%", "2%", "2%"] },
  { key: "case", values: ["10%", "9%", "7%", "7%", "8%", "7%", "6%", "6%", "6%", "5%", "6%"] },
  { key: "psu", values: ["10%", "9%", "7%", "7%", "8%", "7%", "6%", "6%", "6%", "5%", "6%"] },
  { key: "ssd", values: ["10%", "7%", "13%", "12%", "8%", "13%", "15%", "14%", "13%", "10%", "12%"] },
];

const AutoSection = () => {
  const { t } = useTranslation("pages");
  const tableRef = useRef(null);

  const scrollToTable = () => {
    tableRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="max-w-4xl mx-auto px-6 pb-10">
      <h1 className="text-4xl font-semibold mb-8 text-text">
        {t("guides.autoSection.title")}
      </h1>
      <div className="space-y-5">
        <h2 className="text-2xl font-semibold text-text">
          {t("guides.autoSection.selectingComponentsHeading")}
        </h2>

        <div>
          <p className="text-text">{t("guides.autoSection.step1")}</p>
          <Note>{t("guides.autoSection.step1Note")}</Note>
        </div>

        <h2 className="text-2xl font-semibold text-text">
          {t("guides.autoSection.selectingBudgetHeading")}
        </h2>

        <p className="text-text">
          <Trans
            t={t}
            i18nKey="guides.autoSection.step2"
            components={{ autoBuilderText: <span /> }}
          />
        </p>

        <div>
          <p className="text-text">{t("guides.autoSection.step3")}</p>
          <Note>{t("guides.autoSection.step3Note")}</Note>

          <p className="text-text">{t("guides.autoSection.step4")}</p>
          <Note>{t("guides.autoSection.step4Note")}</Note>
        </div>

        <h2 className="text-2xl font-semibold text-text">
          {t("guides.autoSection.generatingHeading")}
        </h2>

        <div>
          <p className="text-text">{t("guides.autoSection.step5")}</p>

          <Note>
            <Trans
              t={t}
              i18nKey="guides.autoSection.step5Note"
              components={{
                link: (
                  <button
                    onClick={scrollToTable}
                    className="text-info hover:underline font-medium cursor-pointer"
                  />
                ),
              }}
            />
          </Note>
        </div>

        <div>
          <p className="text-text">{t("guides.autoSection.step6")}</p>

          <Note>{t("guides.autoSection.step6Note")}</Note>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-text my-5">
          {t("guides.autoSection.budgetAllocationsHeading")}
        </h2>

        <div ref={tableRef}>
        <div className="sm:hidden space-y-4">
          {BUDGET_COLUMNS.map(({ budget, type }) => (
            <div key={`${budget}-${type}`} className="border border-secondary-light">
              <p className="p-2 bg-secondary-light/50 font-semibold text-text">
                {t(`guides.autoSection.table.${budget}`)} - {t(`guides.autoSection.table.${type}`)}
              </p>
              <table className="w-full text-left text-text">
                <tbody>
                  {BUDGET_ROWS.map(({ key, values }, i) => {
                    const value = values[BUDGET_COLUMNS.findIndex(
                      (c) => c.budget === budget && c.type === type,
                    )];
                    if (value == null) return null;
                    return (
                      <tr key={key} className={i % 2 === 0 ? "bg-background" : ""}>
                        <td className="p-2 border-t border-secondary-light">
                          {t(`guides.autoSection.table.${key}`)}
                        </td>
                        <td className="p-2 border-t border-secondary-light text-right">{value}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))}
        </div>

        <div className="hidden sm:block overflow-x-auto max-w-4xl">
          <table className="text-left text-text">
            <thead className="bg-secondary-light/50">
              <tr>
                <th className="p-2 border border-secondary-light">{t("guides.autoSection.table.component")}</th>
                <th className="p-2 border border-secondary-light" colSpan={2}>
                  {t("guides.autoSection.table.budgetLow")}
                </th>
                <th className="p-2 border border-secondary-light" colSpan={4}>
                  {t("guides.autoSection.table.budgetMid")}
                </th>
                <th className="p-2 border border-secondary-light" colSpan={5}>
                  {t("guides.autoSection.table.budgetHigh")}
                </th>
              </tr>
              <tr>
                <th className="p-2 border border-secondary-light"></th>
                <th className="p-2 border border-secondary-light">{t("guides.autoSection.table.general")}</th>
                <th className="p-2 border border-secondary-light">{t("guides.autoSection.table.office")}</th>
                <th className="p-2 border border-secondary-light">{t("guides.autoSection.table.general")}</th>
                <th className="p-2 border border-secondary-light">{t("guides.autoSection.table.gaming")}</th>
                <th className="p-2 border border-secondary-light">{t("guides.autoSection.table.office")}</th>
                <th className="p-2 border border-secondary-light">{t("guides.autoSection.table.streaming")}</th>
                <th className="p-2 border border-secondary-light">{t("guides.autoSection.table.general")}</th>
                <th className="p-2 border border-secondary-light">{t("guides.autoSection.table.gaming")}</th>
                <th className="p-2 border border-secondary-light">{t("guides.autoSection.table.office")}</th>
                <th className="p-2 border border-secondary-light">{t("guides.autoSection.table.rendering")}</th>
                <th className="p-2 border border-secondary-light">{t("guides.autoSection.table.streaming")}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border border-border">{t("guides.autoSection.table.gpu")}</td>
                <td className="p-2 border border-border">—</td>
                <td className="p-2 border border-border">—</td>
                <td className="p-2 border border-border">24%</td>
                <td className="p-2 border border-border">27%</td>
                <td className="p-2 border border-border">—</td>
                <td className="p-2 border border-border">20%</td>
                <td className="p-2 border border-border">25%</td>
                <td className="p-2 border border-border">27%</td>
                <td className="p-2 border border-border">—</td>
                <td className="p-2 border border-border">25%</td>
                <td className="p-2 border border-border">22%</td>
              </tr>
              <tr>
                <td className="p-2 border border-border">{t("guides.autoSection.table.cpu")}</td>
                <td className="p-2 border border-border">26%</td>
                <td className="p-2 border border-border">28%</td>
                <td className="p-2 border border-border">16%</td>
                <td className="p-2 border border-border">14%</td>
                <td className="p-2 border border-border">25%</td>
                <td className="p-2 border border-border">20%</td>
                <td className="p-2 border border-border">14%</td>
                <td className="p-2 border border-border">12%</td>
                <td className="p-2 border border-border">22%</td>
                <td className="p-2 border border-border">15%</td>
                <td className="p-2 border border-border">20%</td>
              </tr>
              <tr>
                <td className="p-2 border border-border">{t("guides.autoSection.table.motherboard")}</td>
                <td className="p-2 border border-border">20%</td>
                <td className="p-2 border border-border">22%</td>
                <td className="p-2 border border-border">10%</td>
                <td className="p-2 border border-border">10%</td>
                <td className="p-2 border border-border">18%</td>
                <td className="p-2 border border-border">10%</td>
                <td className="p-2 border border-border">10%</td>
                <td className="p-2 border border-border">10%</td>
                <td className="p-2 border border-border">16%</td>
                <td className="p-2 border border-border">10%</td>
                <td className="p-2 border border-border">10%</td>
              </tr>
              <tr>
                <td className="p-2 border border-border">{t("guides.autoSection.table.ram")}</td>
                <td className="p-2 border border-border">24%</td>
                <td className="p-2 border border-border">25%</td>
                <td className="p-2 border border-border">20%</td>
                <td className="p-2 border border-border">20%</td>
                <td className="p-2 border border-border">30%</td>
                <td className="p-2 border border-border">20%</td>
                <td className="p-2 border border-border">22%</td>
                <td className="p-2 border border-border">23%</td>
                <td className="p-2 border border-border">35%</td>
                <td className="p-2 border border-border">28%</td>
                <td className="p-2 border border-border">22%</td>
              </tr>
              <tr>
                <td className="p-2 border border-border">{t("guides.autoSection.table.cooler")}</td>
                <td className="p-2 border border-border">—</td>
                <td className="p-2 border border-border">—</td>
                <td className="p-2 border border-border">3%</td>
                <td className="p-2 border border-border">3%</td>
                <td className="p-2 border border-border">3%</td>
                <td className="p-2 border border-border">3%</td>
                <td className="p-2 border border-border">2%</td>
                <td className="p-2 border border-border">2%</td>
                <td className="p-2 border border-border">2%</td>
                <td className="p-2 border border-border">2%</td>
                <td className="p-2 border border-border">2%</td>
              </tr>
              <tr>
                <td className="p-2 border border-border">{t("guides.autoSection.table.case")}</td>
                <td className="p-2 border border-border">10%</td>
                <td className="p-2 border border-border">9%</td>
                <td className="p-2 border border-border">7%</td>
                <td className="p-2 border border-border">7%</td>
                <td className="p-2 border border-border">8%</td>
                <td className="p-2 border border-border">7%</td>
                <td className="p-2 border border-border">6%</td>
                <td className="p-2 border border-border">6%</td>
                <td className="p-2 border border-border">6%</td>
                <td className="p-2 border border-border">5%</td>
                <td className="p-2 border border-border">6%</td>
              </tr>
              <tr>
                <td className="p-2 border border-border">{t("guides.autoSection.table.psu")}</td>
                <td className="p-2 border border-border">10%</td>
                <td className="p-2 border border-border">9%</td>
                <td className="p-2 border border-border">7%</td>
                <td className="p-2 border border-border">7%</td>
                <td className="p-2 border border-border">8%</td>
                <td className="p-2 border border-border">7%</td>
                <td className="p-2 border border-border">6%</td>
                <td className="p-2 border border-border">6%</td>
                <td className="p-2 border border-border">6%</td>
                <td className="p-2 border border-border">5%</td>
                <td className="p-2 border border-border">6%</td>
              </tr>
              <tr>
                <td className="p-2 border border-border">{t("guides.autoSection.table.ssd")}</td>
                <td className="p-2 border border-border">10%</td>
                <td className="p-2 border border-border">7%</td>
                <td className="p-2 border border-border">13%</td>
                <td className="p-2 border border-border">12%</td>
                <td className="p-2 border border-border">8%</td>
                <td className="p-2 border border-border">13%</td>
                <td className="p-2 border border-border">15%</td>
                <td className="p-2 border border-border">14%</td>
                <td className="p-2 border border-border">13%</td>
                <td className="p-2 border border-border">10%</td>
                <td className="p-2 border border-border">12%</td>
              </tr>
            </tbody>
          </table>
        </div>
        </div>
      </div>
    </div>
  );
};

export default AutoSection;
