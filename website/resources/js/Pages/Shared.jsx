import React, { useEffect, useState } from "react";
import axios from "axios";
import PaginationControls from "./Components/Common/PaginationControls";
import SharedBuildsSkeleton from "./Components/Skeletons/SharedBuildsSkeleton";
import { ArrowIcon, CloseIcon } from "./Components/Common/Icons";
import BuildCard from "./Components/Common/BuildCard";
import BuildFilters from "./Components/Common/BuildFilters";

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
    if (expanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [expanded]);

  useEffect(() => {
    setPage(1);
    fetchBuilds(1);
  }, [debouncedSearch, sort, filters]);

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
    <div className="h-full flex">
      <div className="lg:hidden fixed left-0 top-1/2 -translate-y-1/2 transition-transform -translate-x-4 hover:translate-x-0">
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="bg-primary text-white w-15 px-2 py-8 flex justify-end cursor-pointer hover:bg-primary-light transition"
        >
          <span className="rotate-270">
            <ArrowIcon size={32} />
          </span>
        </button>
      </div>

      <div
        className={`bg-primary flex flex-col fixed top-14 bottom-0 left-0 right-0 overflow-y-auto overscroll-contain transition-transform lg:static lg:w-120.5 lg:translate-x-0
          ${expanded ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex justify-between items-center pt-6 px-4">
          <h1 className="text-4xl font-semibold text-white">SHARED BUILDS</h1>
          <button
            className="w-10 h-10 lg:hidden text-secondary-light hover:cursor-pointer bg-primary hover:bg-primary-light transition p-2"
            onClick={() => setExpanded(false)}
          >
            <CloseIcon />
          </button>
        </div>

        <div className="px-4">
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

        <div className="mt-auto pt-6 lg:hidden">
          <div className="p-4 border-t border-primary-light flex">
            <h2 className="text-6xl p-2 font-bold text-surface border border-secondary-light">
              PC BUILDER
            </h2>
          </div>
        </div>
      </div>

      <div className="flex-1">
        {loading && <SharedBuildsSkeleton />}
        {error && <p className="text-danger mt-6 mx-auto">{error}</p>}

        {!loading && !error && (
          <>
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
                  {builds.map((build) => (
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
          </>
        )}
      </div>
    </div>
  );
};

export default Shared;
