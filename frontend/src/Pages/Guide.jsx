import React, { useState, useEffect } from "react";
import BuilderSection from "./Components/Guides/BuilderSection";
import AutoSection from "./Components/Guides/AutoSection";
import SavedSection from "./Components/Guides/SavedSection";
import { ArrowIcon, CloseIcon } from "./Components/Common/Icons";
import SidePanel from "./Components/Common/SidePanel";

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
      <SidePanel title={"GUIDE"}>
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActive(section.id)}
            className={`p-4 border border-secondary w-full text-white text-left transition-all cursor-pointer mb-2 hover:bg-secondary ${active === section.id ? "border-l-10" : ""}`}
          >
            {section.label}
          </button>
        ))}
      </SidePanel>

      <div className="flex-1 px-4 pt-6">{contentMap[active]}</div>
    </div>
  );
};

export default Guide;
