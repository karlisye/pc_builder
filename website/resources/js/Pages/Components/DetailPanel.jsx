import React from "react";
import ComponentInfo from "./ComponentInfo";

const DetailPanel = ({ component, slot, setExpandedSlot }) => (
  <div className="border border-border bg-background p-4">
    <div className="flex justify-between items-center mb-3">
      <span className="text-muted">{slot}</span>
      <button
        onClick={() => setExpandedSlot(null)}
        className="text-muted hover:text-text transition text-sm cursor-pointer"
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
    <span className="text-text font-semibold text-xl">{component.name}</span>
    <ComponentInfo component={component} />
  </div>
);

export default DetailPanel;
