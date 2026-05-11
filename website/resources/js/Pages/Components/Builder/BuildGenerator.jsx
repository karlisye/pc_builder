import axios from "axios";
import React, { useState } from "react";
import { useBuilder } from "../../../Contexts/BuilderContext";
import BudgetSlider from "./BudgetSlider";
import { Link } from "@inertiajs/react";
import { ArrowIcon } from "../Common/Icons";

const BuildGenerator = () => {
  const {
    selectedComponents,
    setSelectedComponents,
    setCurrentCompToAdd,
    setBuildType,
  } = useBuilder();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [budget, setBudget] = useState(1500);
  const [preferences, setPreferences] = useState({
    gpu: null,
    cpu: null,
    type: null,
  });
  const [note, setNote] = useState("");

  const recommendedBudget =
    {
      gaming: 1000,
      office: 600,
      streaming: 1200,
      rendering: 1500,
    }[preferences.type] ?? 600;

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
        setBuildType(res.data.type);
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

  const updateBudget = (value) => {
    if (recommendedBudget > value)
      setNote("We recommend increasing your budget for this type of build.");
    else setNote("");

    setBudget(value);
  };

  return (
    <div className="pt-4 border-t mt-4 border-secondary">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex justify-between items-center text-secondary-light hover:text-surface transition cursor-pointer"
      >
        <span className="text-sm">Auto Generate Build</span>
        <ArrowIcon active={open} />
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

          <BudgetSlider
            value={budget}
            onChange={updateBudget}
            recommended={recommendedBudget}
          />

          {note && (
            <div className="p-2 border border-secondary">
              <p className="text-secondary-light text-sm">{note}</p>
            </div>
          )}

          <p className="text-muted text-sm mb-1">Preferences</p>

          <div className="flex gap-2">
            <div className="flex flex-col flex-1">
              <label className="text-sm text-muted" htmlFor="gpu">
                GPU
              </label>
              <select
                onChange={(e) => updatePref("gpu", e.target.value)}
                className="p-1 text-muted text-sm border hover:outline focus:outline outline-secondary-light"
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
                className="p-1 text-muted text-sm border hover:outline focus:outline outline-secondary-light"
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
              className="p-1 text-muted text-sm border hover:outline focus:outline outline-secondary-light"
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
