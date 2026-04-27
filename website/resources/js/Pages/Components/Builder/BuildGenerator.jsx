import axios from "axios";
import React, { useState } from "react";
import { useBuilder } from "../../../Contexts/BuilderContext";
import BudgetSlider from "./BudgetSlider";
import { Link } from "@inertiajs/react";

const BuildGenerator = () => {
  const { selectedComponents, setSelectedComponents, setCurrentCompToAdd } =
    useBuilder();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [budget, setBudget] = useState(1500);
  const [preferences, setPreferences] = useState({
    gpu: null,
    cpu: null,
    type: null,
  });

  const updatePref = (key, value) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const selected = Object.fromEntries(
        Object.entries(selectedComponents)
          .filter(([_, component]) => component !== null)
          .map(([type, component]) => [type, component.id]),
      );

      const res = await axios.post("/api/builder", {
        selected,
        budget,
        preferences,
      });

      if (res.data.success) {
        setSelectedComponents((prev) => ({
          ...prev,
          ...res.data.build,
        }));
        setOpen(false);
        setCurrentCompToAdd(null);
      } else {
        setError(res.data.error);
      }
    } catch (err) {
      setError(err.response?.data?.error ?? "Something went wrong");
    } finally {
      setLoading(false);

      // clear preferences
      setPreferences((prev) =>
        Object.fromEntries(Object.keys(prev).map((k) => [k, null])),
      );
    }
  };

  return (
    <div className="pt-4 border-t border-secondary">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex justify-between items-center text-secondary-light hover:text-surface transition cursor-pointer"
      >
        <span className="text-sm">Auto Generate Build</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <div
        className={`grid transition-all overflow-hidden ${open ? "grid-rows-[1fr] mt-3" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden space-y-4">
          <p className="text-muted text-sm">
            Not sure where to start? Let us pick the best compatible components
            for your budget. For more information visit{" "}
            <Link
              className="text-info/80 cursor-pointer hover:underline"
              href="/guide"
            >
              Automatic Builder
            </Link>{" "}
            guide .
          </p>

          <BudgetSlider value={budget} onChange={setBudget} />

          <p className="text-muted text-sm mb-1">Preferences</p>

          <div className="flex gap-2">
            <div className="flex flex-col flex-1">
              <label className="text-sm text-muted" htmlFor="gpu">
                GPU
              </label>
              <select
                onChange={(e) => updatePref("gpu", e.target.value)}
                className="p-1 text-muted text-sm border focus:outline outline-secondary-light"
                value={preferences.gpu ?? ""}
              >
                <option value="">Any</option>
                <option value="nvidia">NVIDIA</option>
                <option value="amd">AMD</option>
                <option value="intel">INTEL</option>
              </select>
            </div>

            <div className="flex flex-col flex-1">
              <label className="text-sm text-muted" htmlFor="gpu">
                CPU
              </label>
              <select
                onChange={(e) => updatePref("cpu", e.target.value)}
                className="p-1 text-muted text-sm border focus:outline outline-secondary-light"
                value={preferences.cpu ?? ""}
              >
                <option value="">Any</option>
                <option value="amd">AMD</option>
                <option value="intel">INTEL</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col flex-1">
            <label className="text-sm text-muted" htmlFor="gpu">
              Usage
            </label>
            <select
              onChange={(e) => updatePref("type", e.target.value)}
              className="p-1 text-muted text-sm border focus:outline outline-secondary-light"
              value={preferences.type ?? ""}
            >
              <option value="">Any</option>
              <option value="gaming">Gaming</option>
              <option value="office">Office</option>
              <option value="rendering">Rendering</option>
              <option value="streaming">Streaming</option>
            </select>
          </div>

          {error && <p className="text-danger text-sm mb-2">{error}</p>}

          <button
            className="p-4 w-full bg-secondary-light text-text cursor-pointer hover:bg-secondary-light/50 transition disabled:opacity-50"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? <p>Generating...</p> : "Generate"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuildGenerator;
