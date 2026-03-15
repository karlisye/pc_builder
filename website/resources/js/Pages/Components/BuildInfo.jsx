import React from "react";
import { useBuilder } from "../../Contexts/BuilderContext";

const BuildInfo = () => {
  const { selectedComponents, setSelectedComponents, setCurrentCompToAdd } =
    useBuilder();

  const handleRemove = (name) => {
    setSelectedComponents((prev) => ({
      ...prev,
      [name.toLowerCase()]: null,
    }));
    setCurrentCompToAdd(null);
  };
  return (
    <div className="space-y-4 mt-8">
      {Object.values(selectedComponents).some((v) => v !== null) ? (
        Object.entries(selectedComponents)
          .filter(([key, value]) => value)
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
        <p className="text-secondary-light">Select your components</p>
      )}
    </div>
  );
};

export default BuildInfo;
