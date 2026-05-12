import React, { useEffect, useState } from "react";
import BuildsList from "./BuildsList";
import PaginationControls from "../Common/PaginationControls";
import { router } from "@inertiajs/react";
import BuildCard from "../Common/BuildCard";
import ProfileLayout from "../../../Layouts/ProfileLayout";

const BookmarkedBuilds = ({ buildData }) => {
  const [page, setPage] = useState(1);

  const builds = buildData.data;
  useEffect(() => {
    router.get("/profile/bookmarked", { page: page }, { preserveState: true });
  }, [page]);

  const pagination = {
    currentPage: buildData.current_page,
    lastPage: buildData.last_page,
    total: buildData.total,
  };

  return (
    <>
      <h1 className="text-4xl text-text font-semibold mb-4">
        Bookmarked Builds
      </h1>

      <div className="flex-1">
        {builds.length === 0 ? (
          <span className="text-muted mt-6">No bookmarked builds yet.</span>
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
                <PaginationControls pagination={pagination} setPage={setPage} />
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

BookmarkedBuilds.layout = (page) => <ProfileLayout>{page}</ProfileLayout>;

export default BookmarkedBuilds;
