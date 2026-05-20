import React, { useState } from "react";
import { ArrowIcon } from "../../Components/Common/Icons";
import Timer from "./Timer";

const ScraperLogs = ({
  output,
  loading,
  success,
  error,
  meta,
  scrapeDuration,
  setScrapeDuration,
}) => {
  const [open, setOpen] = useState(false);
  const categories = meta?.categories?.split(",") ?? [];

  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-semibold text-text">Logs</h2>
      <div className="w-full border h-60 border-border p-2 overflow-x-auto overflow-y-auto relative">
        <div className="w-max min-w-full">
          {output.length > 0 ? (
            output.map((line, i) => (
              <p key={i} className="text-secondary-light whitespace-nowrap">
                {line}
              </p>
            ))
          ) : (
            <p className="text-secondary-light whitespace-nowrap">
              Logs will appear here...
            </p>
          )}
        </div>
      </div>

      {(loading || success) && (
        <div
          className={`flex gap-4 p-2 border transition ${loading ? "border-border bg-surface text-muted" : "border-success/50 bg-success/10 text-success"}`}
        >
          <span>Scrape status: </span>
          <span>{loading ? "Scrape in progress..." : success}</span>
          <span className="ml-auto">
            <Timer
              seconds={scrapeDuration}
              setSeconds={setScrapeDuration}
              running={loading}
            />
          </span>
        </div>
      )}
      {error && <p className="text-danger">{error}</p>}

      {meta.done === "true" && (
        <div>
          <div
            className="flex gap-4 justify-between items-center hover:text-text transition text-muted cursor-pointer"
            onClick={() => setOpen((prev) => !prev)}
          >
            <span className="">Summary</span>
            <span>
              <ArrowIcon active={open} />
            </span>
          </div>

          <div
            className={`grid transition-all overflow-hidden ${open ? "grid-rows-[1fr] mt-3" : "grid-rows-[0fr]"}`}
          >
            <div className="overflow-hidden grid grid-cols-2 gap-2 p-px mb-6">
              <div>
                <span className="text-sm text-muted">Scrape started at: </span>
                <span className="text-sm text-text">
                  {new Date(meta.start_time.split("_")[0]).toDateString()}
                </span>{" "}
                <span className="text-sm text-text">
                  {meta.start_time.split("_")[1]}
                </span>
              </div>

              <div>
                <span className="text-sm text-muted">Scraped categories: </span>
                <span className="text-sm text-text">
                  {meta.categories.replace(",", ", ")}
                </span>
              </div>

              {categories.length > 0 &&
                categories.map((category, i) => {
                  const total_key = `total_${category}`;
                  const inserted_key = `inserted_${category}`;
                  const skipped_key = `skipped_${category}`;

                  return (
                    <div key={i} className="col-span-2">
                      <p className="text-muted">{category}s</p>
                      <div className="grid grid-cols-3 gap-2 border p-2 border-border bg-surface">
                        <div>
                          <span className="text-sm text-muted">
                            Total {category}s to scrape:{" "}
                          </span>
                          <span className="text-sm text-text">
                            {meta?.[total_key] ?? 0}
                          </span>
                        </div>

                        <div>
                          <span className="text-sm text-muted">
                            Total {category}s inserted:{" "}
                          </span>
                          <span className="text-sm text-text">
                            {meta?.[inserted_key] ?? 0}
                          </span>
                        </div>

                        <div>
                          <span className="text-sm text-muted">
                            {category}s skipped:{" "}
                          </span>
                          <span className="text-sm text-text">
                            {meta?.[skipped_key] ?? 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScraperLogs;
