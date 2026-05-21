import React, { useState } from "react";
import { usePage } from "@inertiajs/react";
import { ArrowIcon, CloseIcon } from "../Components/Common/Icons";
import ScraperLogs from "./Components/ScraperLogs";
import ComponentCheckbox from "./Components/ComponentCheckbox";
import ScraperFilters from "./Components/ScraperFilters";
import axios from "axios";

const Scraper = () => {
  const { csrf_token } = usePage().props.auth;

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
      setFilterError("Please select at least 1 category to scrape.");
      setLoading(false);
      return;
    }

    let latestMeta = {};

    try {
      // axios doesnt support streamed responses
      const res = await fetch("/admin/scrape", {
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
          setSuccess("Scrape complete.");

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
      setError("Failed to scrape.");
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
        {" "}
        <div className="flex justify-between items-center pt-6 px-4">
          <h1 className="text-4xl font-semibold text-white">SCRAPER</h1>
          <button
            className="w-10 h-10 lg:hidden text-secondary-light hover:cursor-pointer bg-primary hover:bg-primary-light transition p-2"
            onClick={() => setExpanded(false)}
          >
            <CloseIcon />
          </button>
        </div>
        <div className="space-y-4 mt-4 px-4">
          <ScraperFilters
            categories={categories}
            updateCategories={updateCategories}
            settings={settings}
            setSettings={setSettings}
            error={filterError}
          />

          <button
            className="p-4 w-full bg-secondary-light text-text cursor-pointer hover:bg-secondary-light/50 transition disabled:opacity-50"
            onClick={() => handleScrape(categories)}
            disabled={loading}
          >
            {loading ? "Scraping..." : "Scrape"}
          </button>
        </div>
      </div>

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
