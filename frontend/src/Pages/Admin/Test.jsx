import React, { useState } from "react";
import SidePanel from "../Components/Common/SidePanel";
import axios from "axios";

const Test = () => {
  const [results, setResults] = useState(null);

  const handlePopulate = async () => {
    try {
      const res = await axios.post("/admin/populate");
      setResults(res.data);
    } catch (err) {
      console.error(err.response?.data);
    }
  };

  return (
    <div className="h-full flex">
      <SidePanel title={"TESTING"}>
        <div>
          <h2 className="text-2xl font-semibold text-secondary-light">
            Populate
          </h2>
          <p className="text-muted">Populate builds table with test data.</p>
        </div>

        <button
          className="p-4 mt-4 w-full bg-secondary-light text-text cursor-pointer hover:bg-secondary-light/50 transition"
          onClick={handlePopulate}
        >
          Populate
        </button>
      </SidePanel>

      <div className="flex-1 px-4 py-6">
        <div>
          {results && (
            <div className="border p-2 border-border grid gap-4 grid-cols-2">
              <div className="flex gap-2 items-center">
                <span className="font-medium text-success">Succeeded:</span>
                <span className="text-success font-medium">
                  {results.succeeded}
                </span>
              </div>

              <div className="flex gap-2 items-center">
                <span className="font-medium text-danger">Failed:</span>
                <span className="text-danger font-medium">
                  {results.failed}
                </span>
              </div>

              <div className="col-span-2">
                <p className="text-text mb-2">Results</p>
                <div className="space-y-2">
                  {results.results.map((result, i) => (
                    <div
                      key={i}
                      className={`p-3 border ${result.success ? "border-success/40 bg-success/5" : "border-danger/40 bg-danger/5"}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text">
                          {result.config.preferences.type ?? "general"} |{" "}
                          {result.config.budget
                            ? `€${result.config.budget}`
                            : "Unlimited"}
                          {result.config.preferences.gpu &&
                            ` | GPU: ${result.config.preferences.gpu}`}
                          {result.config.preferences.cpu &&
                            ` | CPU: ${result.config.preferences.cpu}`}
                        </span>
                        <span
                          className={`text-sm font-medium ${result.success ? "text-success" : "text-danger"}`}
                        >
                          {result.success ? `€${result.total_price}` : "Failed"}
                        </span>
                      </div>
                      {!result.success && (
                        <p className="text-danger text-xs mt-1">
                          {result.error}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Test;
