import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import PaginationControls from "./Components/Common/PaginationControls";
import SharedBuildsSkeleton from "./Components/Skeletons/SharedBuildsSkeleton";
import { ArrowIcon, CloseIcon } from "./Components/Common/Icons";
import BuildCard from "./Components/Common/BuildCard";
import BuildFilters from "./Components/Common/BuildFilters";
import SidePanel from "./Components/Common/SidePanel";

const Shared = () => {
  const { t } = useTranslation("pages");
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
      setError(err.response?.data?.error ?? t("shared.fetchError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex">
      <SidePanel title={t("shared.sidePanelTitle")}>
        <BuildFilters
          search={search}
          setSearch={setSearch}
          sort={sort}
          setSort={setSort}
          filters={filters}
          setFilters={setFilters}
          expanded={expanded}
        />
      </SidePanel>

      <div className="flex-1">
        {loading && <SharedBuildsSkeleton />}
        {error && <p className="text-danger mt-6 mx-auto">{error}</p>}

        {!loading && !error && (
          <>
            {builds.length === 0 ? (
              <div className="mx-auto text-center mt-6">
                <p className="text-2xl font-semibold text-text">
                  {t("shared.noBuildsFound")}
                </p>
                <span className="text-muted">{t("shared.tryAdjustingFilters")}</span>
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
