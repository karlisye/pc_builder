import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PaginationControls from "../Common/PaginationControls";
import BuildCard from "../Common/BuildCard";
import axios from "axios";

const LikedBuilds = () => {
  const { t } = useTranslation("profile");
  const [buildData, setBuildData] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    axios
      .get("/api/profile/liked", { params: { page } })
      .then((res) => setBuildData(res.data));
  }, [page]);

  if (!buildData) return null;

  const builds = buildData.data;
  const pagination = {
    currentPage: buildData.current_page,
    lastPage: buildData.last_page,
    total: buildData.total,
  };

  return (
    <>
      <h1 className="text-4xl text-text font-semibold mb-4">
        {t("liked.heading")}
      </h1>

      <div className="flex-1">
        {builds.length === 0 ? (
          <span className="text-muted mt-6">{t("liked.empty")}</span>
        ) : (
          <>
            <div className="flex flex-col items-center gap-8 px-4 pt-6">
              {builds.map((build) => (
                <BuildCard key={build.id} build={build} />
              ))}
            </div>

            <div className="w-full px-4 pb-6">
              {pagination.lastPage > 1 && (
                <PaginationControls pagination={pagination} setPage={setPage} />
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default LikedBuilds;
