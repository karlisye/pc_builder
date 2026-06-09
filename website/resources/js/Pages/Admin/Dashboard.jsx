import React from "react";

const Dashboard = ({ data }) => {
  console.log(data);
  return (
    <div className="overflow-y-auto h-full">
      <div className="flex xl:flex-row flex-col h-full">
        <div className="xl:w-1/2 bg-primary px-6 py-10 text-text">
          <h1 className="sm:text-4xl text-7xl font-bold text-surface mb-4 flex flex-wrap">
            OVERVIEW
          </h1>
          <div className="grid grid-cols-2 gap-4">
            <p className="text-lg text-surface">
              Total registered users: {data.userCount}
            </p>
            <p className="text-lg text-surface">
              Total builds created: {data.buildCount}
            </p>
            <p className="text-lg text-surface">
              Available component count: {data.componentCount}
            </p>
            <p className="text-lg text-surface">
              Last scrape: {new Date(data.lastScrape).toLocaleDateString()}{" "}
              {new Date(data.lastScrape).toLocaleTimeString()}
            </p>
            <p className="text-lg text-surface">
              Times scraped: {data.scrapeCount}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
