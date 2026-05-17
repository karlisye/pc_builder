import React, { useState, useEffect } from "react";
import BuilderSection from "./Components/Guides/BuilderSection";
import AutoSection from "./Components/Guides/AutoSection";
import SavedSection from "./Components/Guides/SavedSection";
import { ArrowIcon, CloseIcon } from "./Components/Common/Icons";

const sections = [
  { id: "builder", label: "Building a PC" },
  { id: "auto", label: "Automatic Builder" },
  { id: "saved", label: "Managing Saved Builds" },
];

const contentMap = {
  builder: <BuilderSection />,
  auto: <AutoSection />,
  saved: <SavedSection />,
};

const Guide = () => {
  const [active, setActive] = useState(sections[0].id);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (expanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [expanded]);

  return (
    <div className="h-full flex">
      <div className="lg:hidden fixed left-0 top-1/2 -translate-y-1/2 transition-transform -translate-x-4 hover:translate-x-0">
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="bg-primary text-white w-15 px-2 py-8 flex justify-end cursor-pointer hover:bg-primary-light transition"
        >
          <span className="rotate-270">
            <ArrowIcon size={32} />
          </span>
        </button>
      </div>

      <div
        className={`bg-primary flex flex-col fixed top-14 bottom-0 left-0 right-0 overflow-y-auto overscroll-contain transition-transform lg:static lg:w-120.5 lg:translate-x-0
          ${expanded ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex justify-between items-center pt-6 px-4">
          <h1 className="text-4xl font-semibold text-white">GUIDE</h1>
          <button
            className="w-10 h-10 lg:hidden text-secondary-light hover:cursor-pointer bg-primary hover:bg-primary-light transition p-2"
            onClick={() => setExpanded(false)}
          >
            <CloseIcon />
          </button>
        </div>

        <div className="space-y-4 mt-4 px-4">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActive(section.id)}
              className={`p-4 border border-secondary w-full text-white text-left transition-all cursor-pointer hover:bg-secondary ${active === section.id ? "border-l-10" : ""}`}
            >
              {section.label}
            </button>
          ))}
        </div>

        <div className="mt-auto pt-6 lg:hidden">
          <div className="p-4 border-t border-primary-light flex">
            <h2 className="text-6xl p-2 font-bold text-surface border border-secondary-light">
              PC BUILDER
            </h2>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 pt-6">{contentMap[active]}</div>
    </div>
  );
};

export default Guide;
