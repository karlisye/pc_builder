import React, { useEffect, useState } from "react";
import axios from "axios";
import PaginationControls from "./Components/Common/PaginationControls";
import SharedBuildsSkeleton from "./Components/Skeletons/SharedBuildsSkeleton";
import BuildFilters from "./Components/Shared/BuildFilters";
import { ArrowIcon } from "./Components/Common/Icons";
import BuildCard from "./Components/Common/BuildCard";

const Shared = () => {
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [builds, setBuilds] = useState([]);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [sort, setSort] = useState("");
  const [filters, setFilters] = useState({});

  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setPage(1);
    fetchBuilds(1);
  }, [debouncedSearch, sort, filters]);

  // debounced search to delay search request until user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

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
          search: search || undefined,
          sort: sort || undefined,
          ...filters,
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
      <div className="w-full lg:w-120.5 bg-primary py-6 px-4">
        <div
          onClick={() => setExpanded((prev) => !prev)}
          className="flex gap-2 justify-between items-center"
        >
          <h1 className="text-4xl font-semibold text-white">SHARED BUILDS</h1>

          <span className="text-surface lg:opacity-0">
            <ArrowIcon active={expanded} size={24} />
          </span>
        </div>

        <BuildFilters
          search={search}
          setSearch={setSearch}
          sort={sort}
          setSort={setSort}
          filters={filters}
          setFilters={setFilters}
          expanded={expanded}
        />
      </div>

      {loading && <SharedBuildsSkeleton />}
      {error && <p className="text-danger mt-6 mx-auto">{error}</p>}

      {!loading && !error && (
        <div className="flex-1">
          {builds.length === 0 ? (
            <div className="mx-auto text-center mt-6">
              <p className="text-2xl font-semibold text-text">
                No Builds Found
              </p>
              <span className="text-muted">Try adjusting your filters</span>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center gap-8 px-4 pt-6">
                {builds &&
                  builds.map((build) => (
                    <BuildCard key={build.id} build={build} />
                  ))}
              </div>

              <div className="w-full px-4 pb-6">
                {pagination && pagination.lastPage > 1 && (
                  <PaginationControls
                    pagination={pagination}
                    setPage={setPage}
                  />
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Shared;
