import React, { useState } from "react";
import { ArrowIcon, CloseIcon } from "../Components/Common/Icons";
import ScraperLogs from "./Components/ScraperLogs";
import ComponentCheckbox from "./Components/ComponentCheckbox";
import ScraperFilters from "./Components/ScraperFilters";
import axios from "axios";
import SidePanel from "../Components/Common/SidePanel";
import { useTranslation } from "react-i18next";

const Scraper = () => {
  const { t } = useTranslation("admin");
  const csrf_token = decodeURIComponent(
    document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] ?? ""
  );

  const [output, setOutput] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [meta, setMeta] = useState({});
  const [settings, setSettings] = useState({
    delay: 1,
    maxErrors: 10,
  });
  const [filterError, setFilterError] = useState("");
  const [scrapeDuration, setScrapeDuration] = useState(0);

  const [expanded, setExpanded] = useState(false);

  const handleScrape = async (categories) => {
    setError("");
    setFilterError("");
    setLoading(true);
    setOutput([]);
    setMeta({});

    if (categories.length < 1) {
      setFilterError(t("scraper.selectAtLeastOneCategory"));
      setLoading(false);
      return;
    }

    let latestMeta = {};

    try {
      // axios doesnt support streamed responses
      const res = await fetch("/api/admin/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrf_token,
        },
        body: JSON.stringify({
          category: categories.join(","),
          max_errors: settings.maxErrors,
          page_delay: settings.delay,
        }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          setLoading(false);
          setSuccess(t("scraper.scrapeComplete"));

          await handleStore(latestMeta);
          break;
        }
        const lines = decoder
          .decode(value)
          .split("\n")
          .filter((line) => line.trim() !== "");

        lines.forEach((line) => {
          if (line.startsWith("[META]")) {
            const pairs = line.replace("[META] ", "").split(" ");
            const data = Object.fromEntries(pairs.map((p) => p.split("=")));

            latestMeta = {
              ...latestMeta,
              ...data,
            };

            setMeta(latestMeta);
          } else {
            setOutput((prev) => [...prev, line]);
          }
        });
      }
    } catch (err) {
      console.error(err);
      setError(t("scraper.scrapeFailed"));
    }
  };

  const handleStore = async (metaData) => {
    try {
      const categories = metaData.categories?.split(",") ?? [];

      const results = categories.map((category) => ({
        category,
        total: Number(metaData[`total_${category}`] ?? 0),
        inserted: Number(metaData[`inserted_${category}`] ?? 0),
        skipped: Number(metaData[`skipped_${category}`] ?? 0),
      }));

      await axios.post("/api/scrape", {
        started_at: metaData.start_time.replace("_", "T"),
        finished_at: metaData.finished_at.replace("_", "T"),
        status: metaData.done === "true" ? "success" : "failed",
        duration: scrapeDuration,
        results,
      });
    } catch (err) {
      console.error("Failed to store scrape:", err?.response?.data);
    }
  };

  const updateCategories = (category, checked) => {
    if (category === "all") {
      setCategories(checked ? ["all"] : []);
      return;
    }

    if (checked) {
      setCategories((prev) => [...prev.filter((c) => c !== "all"), category]);
    } else {
      setCategories((prev) => prev.filter((c) => c !== category));
    }
  };

  return (
    <div className="h-full flex">
      <SidePanel title={t("scraper.sidePanelTitle")}>
        <ScraperFilters
          categories={categories}
          updateCategories={updateCategories}
          settings={settings}
          setSettings={setSettings}
          error={filterError}
        />

        <button
          className="p-4 mt-4 w-full bg-secondary-light text-text cursor-pointer hover:bg-secondary-light/50 transition disabled:opacity-50"
          onClick={() => handleScrape(categories)}
          disabled={loading}
        >
          {loading ? t("scraper.scrapingButton") : t("scraper.scrapeButton")}
        </button>
      </SidePanel>

      <div className="flex-1 px-4 pt-6 min-w-0">
        <ScraperLogs
          output={output}
          loading={loading}
          error={error}
          success={success}
          meta={meta}
          scrapeDuration={scrapeDuration}
          setScrapeDuration={setScrapeDuration}
        />
      </div>
    </div>
  );
};

export default Scraper;
