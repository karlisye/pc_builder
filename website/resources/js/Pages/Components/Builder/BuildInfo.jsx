import React, { useState } from "react";
import { useBuilder } from "../../../Contexts/BuilderContext";
import axios from "axios";
import { CloseIcon } from "../Common/Icons";

const BuildInfo = () => {
  const {
    selectedComponents,
    setSelectedComponents,
    setCurrentCompToAdd,
    buildId,
    setBuildId,
    buildName,
    setBuildName,
    buildNotes,
    setBuildNotes,
    buildType,
    setBuildType,
    setWarnings,
    setBuildIssues,
    setNotes,
  } = useBuilder();
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
        .map(([type, component]) => [type, component.dateks_id]),
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
        type: buildType,
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
    setBuildName("");
    setBuildNotes("");
    setBuildType("");
    setWarnings([]);
    setBuildIssues({});
    setNotes([]);
  };

  const hasComponents = Object.values(selectedComponents).some(
    (v) => v !== null,
  );

  return (
    <div className="space-y-4 mt-4">
      {hasComponents ? (
        Object.entries(selectedComponents)
          .filter(([_, value]) => value)
          .map(([key, value]) => (
            <div
              key={key}
              className="flex border border-muted hover:bg-primary-light transition"
            >
              <div className="overflow-hidden flex">
                <span className="capitalize text-secondary-light p-2">
                  {key}:{" "}
                </span>
                <span className="text-surface p-2 truncate">{value.name}</span>
              </div>
              <button
                className="p-2 bg-secondary text-muted hover:bg-danger/50 hover:text-danger/70 cursor-pointer transition border-l border-muted ml-auto"
                onClick={() => handleRemove(key)}
              >
                <CloseIcon />
              </button>
            </div>
          ))
      ) : (
        <p className="text-secondary-light mb-4">Select your components</p>
      )}

      {(buildId || hasComponents) && (
        <div className="space-y-4 pt-4 border-t border-primary-light">
          <div>
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
          </div>

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

          <div className="flex flex-col flex-1">
            <label htmlFor="buildType" className="text-secondary-light">
              Build Type
            </label>
            <select
              onChange={(e) => setBuildType(e.target.value)}
              className="p-2 text-secondary-light text-sm border hover:outline focus:outline outline-surface transition"
              value={buildType}
              id="buildType"
            >
              <option value="">None</option>
              <option value="gaming">Gaming</option>
              <option value="office">Office</option>
              <option value="rendering">Rendering</option>
              <option value="streaming">Streaming</option>
            </select>
          </div>

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
