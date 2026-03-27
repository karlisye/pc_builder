import axios from "axios";
import React, { useState } from "react";
import { useBuilder } from "../../../Contexts/BuilderContext";
import BudgetSlider from "./BudgetSlider";
import { Link } from "@inertiajs/react";

const BuildGenerator = () => {
  const { selectedComponents, setSelectedComponents } = useBuilder();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [budget, setBudget] = useState(1500);

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
      });

      if (res.data.success) {
        setSelectedComponents((prev) => ({
          ...prev,
          ...res.data.build,
        }));
        setOpen(false);
      } else {
        setError(res.data.error);
      }
    } catch (err) {
      setError(err.response?.data?.error ?? "Something went wrong");
    } finally {
      setLoading(false);
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
