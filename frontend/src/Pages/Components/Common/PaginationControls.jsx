import React from "react";
import { useTranslation } from "react-i18next";

const PaginationControls = ({ pagination, setPage }) => {
  const { t } = useTranslation("common");
  return (
    <div className="flex justify-between items-center mt-4">
      <button
        disabled={pagination.currentPage === 1}
        onClick={() => setPage((p) => p - 1)}
        className="text-muted hover:text-text disabled:opacity-30 transition cursor-pointer"
      >
        {t("previous")}
      </button>
      <span className="text-muted text-sm">
        {t("page", { current: pagination.currentPage, total: pagination.lastPage })}
      </span>
      <button
        disabled={pagination.currentPage === pagination.lastPage}
        onClick={() => setPage((p) => p + 1)}
        className="text-muted hover:text-text disabled:opacity-30 transition cursor-pointer"
      >
        {t("next")}
      </button>
    </div>
  );
};

export default PaginationControls;
