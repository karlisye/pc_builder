import React, { useEffect, useState } from "react";
import SidePanel from "../Components/Common/SidePanel";
import axios from "axios";
import PaginationControls from "../Components/Common/PaginationControls";
import HistoryCard from "./Components/HistoryCard";

const History = () => {
  const [history, setHistory] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");

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
      setError(err.response?.data?.error ?? "Failed to fetch scrape history.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="h-full flex">
      <SidePanel title={"SCRAPE HISTORY"}></SidePanel>

      <div className="flex-1 px-4 py-6">
        <h2 className="text-2xl font-semibold text-text">History</h2>
        {!loading && !error && (
          <div className="mt-4 flex flex-col gap-2">
            {history.length === 0 ? (
              <div className="mx-auto text-center">
                <p className="text-2xl font-semibold text-text">
                  No Scrape history
                </p>
                <span className="text-muted">Try adjusting your filters</span>
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
