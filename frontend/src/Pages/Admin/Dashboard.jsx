import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { formatDate } from "../../lib/formatDate";

const Dashboard = () => {
  const { t } = useTranslation("admin");
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get("/api/admin").then((res) => setData(res.data));
  }, []);

  if (!data) return null;

  return (
    <div className="overflow-y-auto h-full">
      <div className="flex xl:flex-row flex-col h-full">
        <div className="xl:w-1/2 bg-primary px-6 py-10 text-text">
          <h1 className="sm:text-4xl text-7xl font-bold text-surface mb-4 flex flex-wrap">
            {t("dashboard.title")}
          </h1>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
            <p className="text-lg text-surface">
              {t("dashboard.totalUsers", { count: data.userCount })}
            </p>
            <p className="text-lg text-surface">
              {t("dashboard.totalBuilds", { count: data.buildCount })}
            </p>
            <p className="text-lg text-surface">
              {t("dashboard.componentCount", { count: data.componentCount })}
            </p>
            <p className="text-lg text-surface">
              {t("dashboard.lastScrape", {
                date: `${formatDate(data.lastScrape)} ${new Date(data.lastScrape).toLocaleTimeString()}`,
              })}
            </p>
            <p className="text-lg text-surface">
              {t("dashboard.timesScraped", { count: data.scrapeCount })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
