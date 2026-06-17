import React from "react";
import ComponentInfo from "../Common/ComponentInfo";
import { CloseIcon } from "../Common/Icons";

const DetailPanel = ({ component, slot, setExpandedSlot }) => (
  <div className="border border-border bg-background p-4 relative">
    <div className="lg:flex justify-between items-center mb-8 lg:mb-4 mr-14">
      <div className="mb-6">
        <span className="text-muted block">{slot}</span>
        <span className="text-text font-semibold text-xl block">
          {component.name}
        </span>
      </div>

      <a
        className="bg-surface py-4 px-8 hover:bg-success/50 transition cursor-pointer text-nowrap mb-6"
        target="_blank"
        href={component.url}
      >
        See In Store
      </a>
    </div>
    <ComponentInfo component={component} />
    <button
      onClick={() => setExpandedSlot(null)}
      className="w-10 h-10 text-muted hover:cursor-pointer bg-surface hover:bg-secondary-light transition p-2 absolute top-4 right-4"
    >
      <CloseIcon />
    </button>
  </div>
);

export default DetailPanel;
