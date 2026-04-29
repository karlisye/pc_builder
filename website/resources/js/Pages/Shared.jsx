import React, { useState } from "react";
import BuildCard from "./Components/Shared/BuildCard";

const Shared = ({ buildData }) => {
  console.log(buildData);
  const builds = buildData.data;

  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  return (
    <div className="h-full flex flex-wrap">
      <div className="w-full lg:w-120.5 bg-primary py-6 px-4"></div>
      <div className="flex-1 flex flex-col items-center gap-8 px-4 py-6">
        {builds.map((build) => (
          <BuildCard key={build.id} build={build} />
        ))}
      </div>
    </div>
  );
};

export default Shared;
