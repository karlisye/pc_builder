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
        Close
      </button>
    </div>
    <span className="text-text font-semibold text-xl">{component.name}</span>
    <ComponentInfo component={component} />
  </div>
);

export default DetailPanel;
