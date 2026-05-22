import React, { useState } from "react";

const HistoryCard = ({ history }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className="border border-border p-2 hover:bg-background transition cursor-pointer"
      onClick={() => setExpanded((prev) => !prev)}
    >
      <div className="flex gap-4 items-center">
        <div className="border py-0.5 px-2 border-border bg-surface w-30">
          <span className="text-muted font-medium block">Data</span>
          <div className="flex gap-1">
            {history.results.map((result) => (
              <span key={result.id}>{result.category}</span>
            ))}
          </div>
        </div>

        <div className="flex gap-4 justify-between flex-1">
          <div>
            <span className="text-muted font-medium block">Started</span>
            <span>
              {new Date(history.started_at).toDateString()}{" "}
              {new Date(history.started_at).toLocaleTimeString()}
            </span>
          </div>

          <div>
            <span className="text-muted font-medium block">Finished</span>
            <span>
              {new Date(history.finished_at).toDateString()}{" "}
              {new Date(history.finished_at).toLocaleTimeString()}
            </span>
          </div>
        </div>

        <span
          className={`capitalize text-center border p-2 ${history.status === "success" ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}
        >
          {history.status}
        </span>
      </div>

      {history.results.length > 0 && (
        <div
          className={`grid transition-all overflow-hidden ${expanded ? "grid-rows-[1fr] mt-3" : "grid-rows-[0fr]"}`}
        >
          <div className="overflow-hidden space-y-2 px-px">
            {history.results.map((result) => (
              <div
                className="flex gap-4 justify-between border border-border p-1"
                key={result.id}
              >
                <div>
                  <span className="text-muted font-medium block">Category</span>
                  <span>{result.category}</span>
                </div>

                <div>
                  <span className="text-muted font-medium block">Total</span>
                  <span>{result.total}</span>
                </div>

                <div>
                  <span className="text-muted font-medium block">Inserted</span>
                  <span>{result.inserted}</span>
                </div>

                <div>
                  <span className="text-muted font-medium block">Skipped</span>
                  <span>{result.skipped}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryCard;
