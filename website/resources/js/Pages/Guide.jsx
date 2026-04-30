import React, { useState } from "react";
import BuilderSection from "./Components/Guides/BuilderSection";
import AutoSection from "./Components/Guides/AutoSection";
import SavedSection from "./Components/Guides/SavedSection";

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

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="w-full lg:w-120.5 bg-primary py-6 px-4 shrink-0">
        <h1 className="text-4xl font-semibold text-white">GUIDE</h1>
        <div className="space-y-4 mt-4">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActive(section.id)}
              className={`
              p-4 border border-secondary w-full text-white text-left
              transition-all cursor-pointer hover:bg-secondary
              ${active === section.id ? "border-l-10" : ""}
            `}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 px-4 pt-6">{contentMap[active]}</div>
    </div>
  );
};

export default Guide;
