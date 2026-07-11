import React from "react";
import { useTranslation } from "react-i18next";

const getPageNumbers = (currentPage, lastPage) => {
  const pages = new Set([1, lastPage]);

  for (let i = currentPage - 2; i <= currentPage + 2; i++) {
    if (i >= 1 && i <= lastPage) pages.add(i);
  }

  return Array.from(pages).sort((a, b) => a - b);
};

const PaginationControls = ({ pagination, setPage, dark = false }) => {
  const { t } = useTranslation("common");
  const { currentPage, lastPage } = pagination;
  const pageNumbers = getPageNumbers(currentPage, lastPage);

  const idleClass = dark
    ? "text-secondary-light hover:text-white"
    : "text-muted hover:text-text";
  const activeClass = dark ? "bg-secondary-light text-primary" : "bg-primary text-white";

  return (
    <div
      className="flex justify-between items-center mt-4 gap-2"
      aria-label={t("page", { current: currentPage, total: lastPage })}
    >
      <button
        disabled={currentPage === 1}
        onClick={() => setPage((p) => p - 1)}
        className={`${idleClass} disabled:opacity-30 transition cursor-pointer`}
      >
        {t("previous")}
      </button>

      <div className="flex items-center gap-1">
        {pageNumbers.map((page, i) => {
          const prevPage = pageNumbers[i - 1];
          const showEllipsis = prevPage !== undefined && page - prevPage > 1;

          return (
            <React.Fragment key={page}>
              {showEllipsis && (
                <span className={`${dark ? "text-secondary-light" : "text-muted"} px-1`}>…</span>
              )}
              <button
                onClick={() => setPage(page)}
                disabled={page === currentPage}
                className={`min-w-8 px-2 py-1 text-sm transition cursor-pointer disabled:cursor-default ${
                  page === currentPage ? activeClass : idleClass
                }`}
              >
                {page}
              </button>
            </React.Fragment>
          );
        })}
      </div>

      <button
        disabled={currentPage === lastPage}
        onClick={() => setPage((p) => p + 1)}
        className={`${idleClass} disabled:opacity-30 transition cursor-pointer`}
      >
        {t("next")}
      </button>
    </div>
  );
};

export default PaginationControls;
