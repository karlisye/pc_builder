import React from "react";
import { useBuilder } from "../../Contexts/BuilderContext";

const ComponentCard = ({ component, name }) => {
  const { setCurrentCompToAdd } = useBuilder();
  const handleAddComponent = () => {
    setCurrentCompToAdd(name);
  };
  return (
    <div className="w-full xl:w-80 h-100 border flex flex-col border-border shadow hover:bg-background transition">
      {component ? (
        <>
          <div className="bg-primary mt-auto p-2 flex justify-between">
            <span className="text-white">See More</span>
            <span className="text-white">Buy</span>
          </div>
        </>
      ) : (
        <>
          <div className="h-full flex flex-col items-center justify-center gap-4">
            <span className="text-3xl font-semibold text-muted">{name}</span>
            <button
              className="bg-surface p-2 text-muted hover:bg-secondary-light transition cursor-pointer"
              onClick={handleAddComponent}
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
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ComponentCard;
