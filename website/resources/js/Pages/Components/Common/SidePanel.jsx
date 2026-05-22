import React, { useState } from "react";
import { ArrowIcon, CloseIcon } from "./Icons";

const SidePanel = ({
  children,
  title = null,
  width = "lg:w-120.5",
  headerRight = null,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <div className="lg:hidden fixed left-0 top-1/2 -translate-y-1/2 transition-transform -translate-x-4 hover:translate-x-0 z-10">
        <button
          onClick={() => setExpanded((prev) => !prev)}
          aria-label="Open side panel"
          className="bg-primary text-white w-15 px-2 py-8 flex justify-end cursor-pointer hover:bg-primary-light transition"
        >
          <span className="rotate-270">
            <ArrowIcon size={32} />
          </span>
        </button>
      </div>

      <div
        className={`bg-primary flex flex-col fixed left-0 right-0 bottom-0 top-14 transition-transform lg:static ${width} lg:translate-x-0 overflow-y-auto z-10 pb-6
          ${expanded ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {(title || headerRight) && (
          <div className="flex justify-between items-center pt-6 px-4">
            {title && (
              <h1 className="text-4xl font-semibold text-white">{title}</h1>
            )}

            {headerRight && (
              <div className="ml-auto flex items-center gap-2">
                {headerRight}
              </div>
            )}

            <button
              className="w-10 h-10 lg:hidden text-secondary-light hover:cursor-pointer bg-primary hover:bg-primary-light transition p-2 ml-4"
              onClick={() => setExpanded(false)}
              aria-label="Close side panel"
            >
              <CloseIcon />
            </button>
          </div>
        )}

        <div className="mt-4 px-4 flex flex-col flex-1">{children}</div>

        <div className="mt-auto pt-6 lg:hidden">
          <div className="p-4 border-t border-primary-light flex">
            <h2 className="text-6xl p-2 font-bold text-surface border border-secondary-light">
              PC BUILDER
            </h2>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidePanel;
