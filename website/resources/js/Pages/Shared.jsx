import React, { useEffect, useState } from "react";
import BuildCard from "./Components/Shared/BuildCard";
import axios from "axios";
import PaginationControls from "./Components/Common/PaginationControls";

const Shared = () => {
  // const builds = buildData.data;

  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [builds, setBuilds] = useState([]);

  useEffect(() => {
    fetchBuilds(page);
  }, [page]);

  const fetchBuilds = async (pageNum = 1) => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.get(`/api/shared`, {
        params: {
          page: pageNum,
        },
      });

      setBuilds(res.data.data);
      setPagination({
        currentPage: res.data.current_page,
        lastPage: res.data.last_page,
        total: res.data.total,
      });
    } catch (err) {
      setError(err.response?.data?.error ?? "Failed to fetch builds");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-wrap">
      <div className="w-full lg:w-120.5 bg-primary py-6 px-4"></div>
      <div className="flex-1">
        <div className="flex flex-col items-center gap-8 px-4 pt-6">
          {builds &&
            builds.map((build) => <BuildCard key={build.id} build={build} />)}
        </div>

        <div className="w-full px-4 pb-6">
          {pagination && pagination.lastPage > 1 && (
            <PaginationControls pagination={pagination} setPage={setPage} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Shared;
