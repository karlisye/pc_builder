import axios from "axios";
import React, { useState } from "react";
import { useBuilder } from "../../../Contexts/BuilderContext";
import BudgetSlider from "./BudgetSlider";
import { Link } from "@inertiajs/react";
import { ArrowIcon } from "../Common/Icons";
import ClosedSection from "../Common/ClosedSection";

const BuildGenerator = () => {
  const {
    selectedComponents,
    setSelectedComponents,
    setCurrentCompToAdd,
    setBuildType,
    setWarnings,
    setNotes,
    buildIssues,
  } = useBuilder();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [budget, setBudget] = useState(1500);
  const [preferences, setPreferences] = useState({
    gpu: null,
    cpu: null,
    type: null,
    include_orderable: true,
  });
  const [info, setInfo] = useState("");

  const recommendedBudget =
    {
      gaming: 1000,
      office: 600,
      streaming: 1200,
      rendering: 1500,
    }[preferences.type] ?? 600;

  const updatePref = (key, value) => {
    const newPrefs = { ...preferences, [key]: value };
    setPreferences(newPrefs);

    const newRecommended =
      {
        gaming: 1000,
        office: 600,
        streaming: 1200,
        rendering: 1500,
      }[newPrefs.type] ?? 600;

    if (budget && budget < newRecommended) {
      setInfo("We recommend increasing your budget for this type of build.");
    } else {
      setInfo("");
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setWarnings([]);
    setNotes([]);
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
        setCurrentCompToAdd(null);
        setWarnings(res.data.warnings);
        setNotes(res.data.notes);
      } else {
        setError(res.data.error);
      }
    } catch (err) {
      setError(err.response?.data?.error ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const updateBudget = (value) => {
    setBudget(value);
    if (value && recommendedBudget > value) {
      setInfo("We recommend increasing your budget for this type of build.");
    } else {
      setInfo("");
    }
  };

  // check if one of the selected components is incompatible
  const hasIncompatible = Object.values(selectedComponents).some(
    (component) => component !== null && component.compatible === false,
  );

  return (
    <div className="pt-4 border-t mt-4 border-secondary">
      <ClosedSection title={"Auto Generate Build"}>
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

        {info && (
          <div className="p-2 border bg-alert/10 border-alert/80">
            <p className="text-alert text-sm">{info}</p>
          </div>
        )}

        <p className="text-secondary-light text-sm mb-1 mt-4">Preferences</p>

        <div className={`flex ${budget >= 500 || !budget ? "gap-2" : ""}`}>
          <div
            className={`flex flex-col transition-all overflow-hidden ${budget >= 500 || !budget ? "flex-1" : "w-0"}`}
          >
            <label className="text-sm text-secondary-light" htmlFor="gpu">
              GPU
            </label>
            <select
              onChange={(e) => updatePref("gpu", e.target.value)}
              className="p-1 text-secondary-light text-sm border border-muted hover:outline focus:outline outline-secondary-light"
              value={preferences.gpu ?? ""}
            >
              <option value="">Any</option>
              <option value="nvidia">NVIDIA</option>
              <option value="amd">AMD</option>
              <option value="intel">INTEL</option>
            </select>
          </div>

          <div className="flex flex-col flex-1">
            <label className="text-sm text-secondary-light" htmlFor="gpu">
              CPU
            </label>
            <select
              onChange={(e) => updatePref("cpu", e.target.value)}
              className="p-1 text-secondary-light text-sm border border-muted hover:outline focus:outline outline-secondary-light"
              value={preferences.cpu ?? ""}
            >
              <option value="">Any</option>
              <option value="amd">AMD</option>
              <option value="intel">INTEL</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col flex-1">
          <label className="text-sm text-secondary-light" htmlFor="gpu">
            Usage
          </label>
          <select
            onChange={(e) => updatePref("type", e.target.value)}
            className="p-1 text-secondary-light text-sm border border-muted hover:outline focus:outline outline-secondary-light"
            value={preferences.type ?? ""}
          >
            <option value="">Any</option>
            {(budget > 500 || !budget) && (
              <option value="gaming">Gaming</option>
            )}
            <option value="office">Office</option>
            {(budget > 1500 || !budget) && (
              <option value="rendering">Rendering</option>
            )}
            {(budget > 500 || !budget) && (
              <option value="streaming">Streaming</option>
            )}
          </select>
        </div>

        <div className="flex gap-2 items-center">
          <input
            className="accent-secondary-light"
            id="include_orderable"
            type="checkbox"
            checked={preferences.include_orderable}
            onChange={(e) => updatePref("include_orderable", e.target.checked)}
          />
          <label
            className="text-secondary-light text-sm"
            htmlFor="include_orderable"
          >
            Include Only Orderable Items
          </label>
        </div>

        {error && <p className="text-danger text-sm mb-2">{error}</p>}

        {hasIncompatible && (
          <div className="p-2 border bg-alert/10 border-alert/80">
            <p className="text-alert text-sm">
              One or more components in your current build are incompatible.
              Please change or remove them to generate.
            </p>
          </div>
        )}

        <button
          className="p-4 mt-4 w-full bg-secondary-light text-text cursor-pointer hover:bg-secondary-light/50 transition disabled:opacity-50"
          onClick={handleGenerate}
          disabled={loading || hasIncompatible}
        >
          {loading ? <p>Generating...</p> : "Generate"}
        </button>
      </ClosedSection>
    </div>
  );
};

export default BuildGenerator;
