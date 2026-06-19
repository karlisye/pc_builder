import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { formatDate } from "../../../lib/formatDate";

const HistoryCard = ({ history }) => {
  const { t } = useTranslation("admin");
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className="border border-border p-2 hover:bg-background transition cursor-pointer"
      onClick={() => setExpanded((prev) => !prev)}
    >
      <div className="flex gap-4 items-center">
        <div className="border py-0.5 px-2 border-border bg-surface w-30">
          <span className="text-muted font-medium block">{t("history.card.data")}</span>
          <div className="flex gap-1">
            {history.results.map((result) => (
              <span key={result.id}>{result.category}</span>
            ))}
          </div>
        </div>

        <div className="flex gap-4 justify-between flex-1">
          <div>
            <span className="text-muted font-medium block">{t("history.card.started")}</span>
            <span>
              {formatDate(history.started_at)}{" "}
              {new Date(history.started_at).toLocaleTimeString()}
            </span>
          </div>

          <div>
            <span className="text-muted font-medium block">{t("history.card.finished")}</span>
            <span>
              {formatDate(history.finished_at)}{" "}
              {new Date(history.finished_at).toLocaleTimeString()}
            </span>
          </div>
        </div>

        <span
          className={`capitalize text-center border p-2 ${history.status === "success" ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}
        >
          {history.status === "success"
            ? t("history.filters.statusSuccess")
            : t("history.filters.statusFailed")}
        </span>
      </div>

      {history.results.length > 0 && (
        <div
          className={`grid transition-all overflow-hidden ${expanded ? "grid-rows-[1fr] mt-3" : "grid-rows-[0fr]"}`}
        >
          <div className="overflow-hidden space-y-2 px-px">
            {history.results.map((result) => (
              <div
                className="flex gap-4 justify-between border border-border p-1"
                key={result.id}
              >
                <div>
                  <span className="text-muted font-medium block">{t("history.card.category")}</span>
                  <span>{result.category}</span>
                </div>

                <div>
                  <span className="text-muted font-medium block">{t("history.card.total")}</span>
                  <span>{result.total}</span>
                </div>

                <div>
                  <span className="text-muted font-medium block">{t("history.card.inserted")}</span>
                  <span>{result.inserted}</span>
                </div>

                <div>
                  <span className="text-muted font-medium block">{t("history.card.skipped")}</span>
                  <span>{result.skipped}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryCard;
