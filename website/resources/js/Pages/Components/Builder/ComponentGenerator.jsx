import React, { useState } from "react";
import { ArrowIcon } from "../Common/Icons";
import { Link } from "@inertiajs/react";
import BudgetSlider from "./BudgetSlider";
import { useBuilder } from "../../../Contexts/BuilderContext";
import axios from "axios";

const ComponentGenerator = () => {
  const {
    currentCompToAdd,
    selectedComponents,
    setSelectedComponents,
    setCurrentCompToAdd,
  } = useBuilder();

  const [open, setOpen] = useState(false);
  const [budget, setBudget] = useState(150);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const selected = Object.fromEntries(
        Object.entries(selectedComponents)
          .filter(([_, component]) => component !== null)
          .map(([type, component]) => [type, component.id]),
      );

      const res = await axios.post(
        `/api/builder/${currentCompToAdd.toLowerCase()}`,
        {
          budget,
          selected,
        },
      );

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

      console.log(res);
    } catch (err) {
      setError(err.response?.data?.error ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-4 border-t mt-4 border-secondary">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex justify-between items-center text-secondary-light hover:text-surface transition cursor-pointer"
      >
        <span className="text-sm">Auto Generate Component</span>
        <ArrowIcon active={open} />
      </button>

      <div
        className={`grid transition-all overflow-hidden ${open ? "grid-rows-[1fr] mt-3" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden space-y-4">
          <p className="text-muted text-sm">
            Not sure what component to choose? Let us pick the best compatible
            component for your budget. For more information visit{" "}
            <Link
              className="text-info/80 cursor-pointer hover:underline"
              href="/guide"
            >
              Automatic Builder
            </Link>{" "}
            guide .
          </p>

          <BudgetSlider
            min={5}
            max={1000}
            step={5}
            showRemaining={false}
            value={budget}
            onChange={setBudget}
          />

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

export default ComponentGenerator;
