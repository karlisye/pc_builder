import React, { useEffect, useState } from "react";
import SidePanel from "../Components/Common/SidePanel";
import axios from "axios";
import PaginationControls from "../Components/Common/PaginationControls";
import HistoryCard from "./Components/HistoryCard";
import HistoryFilters from "./Components/HistoryFilters";
import { useTranslation } from "react-i18next";

const History = () => {
  const { t } = useTranslation("admin");
  const [history, setHistory] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("");

  useEffect(() => {
    setPage(1);
    fetchHistory(1);
  }, [filters, sort]);

  useEffect(() => {
    fetchHistory(page);
  }, [page]);

  const fetchHistory = async (pageNum = 1) => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.get("/api/scrape/history", {
        params: {
          page: pageNum,
          sort,
          ...filters,
        },
      });
      setHistory(res.data.historyData.data);
      setPagination({
        currentPage: res.data.historyData.current_page,
        lastPage: res.data.historyData.last_page,
        total: res.data.historyData.total,
      });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error ?? t("history.fetchFailed"));
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="h-full flex">
      <SidePanel title={t("history.sidePanelTitle")}>
        <HistoryFilters
          sort={sort}
          setSort={setSort}
          filters={filters}
          setFilters={setFilters}
        />
      </SidePanel>

      <div className="flex-1 px-4 py-6">
        <h2 className="text-2xl font-semibold text-text">{t("history.title")}</h2>
        {!loading && !error && (
          <div className="mt-4 flex flex-col gap-2">
            {history.length === 0 ? (
              <div className="mx-auto text-center">
                <p className="text-2xl font-semibold text-text">
                  {t("history.emptyTitle")}
                </p>
                <span className="text-muted">{t("history.emptySubtitle")}</span>
              </div>
            ) : (
              history.map((el) => <HistoryCard key={el.id} history={el} />)
            )}
          </div>
        )}
        {pagination && pagination.lastPage > 1 && (
          <PaginationControls pagination={pagination} setPage={setPage} />
        )}
      </div>
    </div>
  );
};

export default History;
