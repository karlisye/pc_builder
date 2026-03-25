import React, { useState } from "react";
import { useBuilder } from "../../../Contexts/BuilderContext";
import axios from "axios";

const BuildInfo = ({ currBuildInfo }) => {
  const {
    selectedComponents,
    setSelectedComponents,
    setCurrentCompToAdd,
    buildId,
    setBuildId,
  } = useBuilder();
  const [buildName, setBuildName] = useState(currBuildInfo?.name ?? "");
  const [buildNotes, setBuildNotes] = useState(currBuildInfo?.notes ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRemove = (name) => {
    setSelectedComponents((prev) => ({
      ...prev,
      [name.toLowerCase()]: null,
    }));
    setCurrentCompToAdd(null);
  };

  const handleSave = async (asNew = false) => {
    if (!buildName.trim()) {
      setError("Please enter a build name");
      return;
    }

    const components = Object.fromEntries(
      Object.entries(selectedComponents)
        .filter(([_, component]) => component !== null)
        .map(([type, component]) => [type, component.id]),
    );

    if (Object.keys(components).length === 0) {
      setError("Please select at least one component");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post("/api/builds", {
        build_id: asNew ? undefined : buildId,
        name: buildName,
        notes: buildNotes,
        components,
      });
      setBuildId(res.data.id);
      setSuccess(asNew ? "Saved as new build!" : "Build saved successfully");
      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      setError(err.response?.data?.error ?? "Failed to save build");
    } finally {
      setSaving(false);
    }
  };

  const handleClear = () => {
    setSelectedComponents((prev) =>
      Object.fromEntries(Object.keys(prev).map((key) => [key, null])),
    );
  };

  const hasComponents = Object.values(selectedComponents).some(
    (v) => v !== null,
  );

  return (
    <div className="space-y-4 mt-8">
      {hasComponents ? (
        Object.entries(selectedComponents)
          .filter(([_, value]) => value)
          .map(([key, value]) => (
            <div key={key} className="flex border border-secondary-light">
              <div className="overflow-hidden flex">
                <span className="capitalize text-secondary-light p-2">
                  {key}:{" "}
                </span>
                <span className="text-surface p-2 truncate">{value.name}</span>
              </div>
              <button
                className="p-2 bg-secondary text-secondary-light hover:bg-danger/50 hover:text-danger/70 cursor-pointer transition border-l border-secondary-light ml-auto"
                onClick={() => handleRemove(key)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="5" x2="19" y2="19" />
                  <line x1="19" y1="5" x2="5" y2="19" />
                </svg>
              </button>
            </div>
          ))
      ) : (
        <p className="text-secondary-light mb-4">Select your components</p>
      )}

      {(buildId || hasComponents) && (
        <div className="space-y-4 pt-4 border-t border-secondary-light">
          <label className="text-secondary-light" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            value={buildName}
            onChange={(e) => setBuildName(e.target.value)}
            id="name"
            placeholder="build name..."
            className="bg-secondary-light focus:outline-1 outline-border text-text p-2 w-full"
          />

          {error && <p className="text-danger text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}

          <label className="text-secondary-light" htmlFor="notes">
            Notes
          </label>
          <textarea
            className="bg-secondary-light focus:outline-1 outline-border text-text p-2 w-full"
            value={buildNotes}
            placeholder="build notes..."
            onChange={(e) => setBuildNotes(e.target.value)}
            id="notes"
          ></textarea>

          <div className="flex">
            <button
              onClick={() => handleSave()}
              disabled={saving}
              className="py-4 px-8 bg-secondary text-left text-white hover:bg-success/50 cursor-pointer disabled:opacity-50 transition flex-1"
            >
              {saving ? "Saving..." : "Save Build"}
            </button>

            <button
              className="py-4 px-8 bg-secondary text-white hover:bg-danger/50 cursor-pointer disabled:opacity-50 transition"
              onClick={handleClear}
            >
              Clear Build
            </button>
          </div>

          {buildId && (
            <button
              className="text-secondary-light hover:text-muted transition cursor-pointer border px-4 py-2 text-sm"
              onClick={() => handleSave(true)}
            >
              Save as New Build
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BuildInfo;
