import { Link } from "@inertiajs/react";
import axios from "axios";
import React, { useState } from "react";

const BuildCard = ({ build }) => {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSave = async () => {
    const components = Object.fromEntries(
      Object.entries(build.components)
        .filter(([_, component]) => component !== null)
        .map(([type, component]) => [type, component.id]),
    );

    try {
      await axios.post("/api/builds", {
        name: build.name + " (copy)",
        notes: build.notes,
        components,
      });
      setSuccess("Build saved successfully");
      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      setError(err.response?.data?.error ?? "Failed to save build");
    }
  };

  return (
    <div className="w-full border flex flex-col border-border shadow hover:bg-background transition overflow-hidden">
      <div className="flex gap-2 items-center justify-between">
        <h1 className="text-2xl uppercase m-2 text-text font-semibold">
          {build.name}
        </h1>
        <p className="text-text font-semibold text-xl m-2">
          €{build.total_price}
        </p>
      </div>

      <div className="flex">
        <div className="flex-1 m-2">
          <span className="text-muted font-medium">Notes</span>
          <p className="text-text mt-4">{build.notes}</p>
        </div>

        <div className="flex-2 m-2">
          <span className="text-muted font-medium">Components</span>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {build.components &&
              Object.entries(build.components).map(([key, component]) => {
                if (!component) return null;

                return (
                  <div key={key}>
                    <span className="text-muted uppercase text-sm">{key}</span>
                    <p className="text-text text-sm truncate">
                      {component.name}
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {success && <p className="text-success ml-auto px-2">{success}</p>}
      {error && <p className="text-danger ml-auto px-2">{error}</p>}

      <div className="bg-primary mt-auto flex">
        <Link
          className="text-white px-8 py-4 flex-1 text-center hover:bg-primary-light cursor-pointer transition"
          href={`/builder?build=${build.id}`}
        >
          Continue
        </Link>

        <button
          className="text-white px-8 py-4 flex-1 hover:bg-primary-light cursor-pointer transition"
          onClick={handleSave}
        >
          Save as a copy
        </button>
      </div>
    </div>
  );
};

export default BuildCard;
