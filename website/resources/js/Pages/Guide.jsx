import React, { useState } from "react";
import GuideSidebar from "./Components/Guide/GuideSidebar";
import BuilderSection from "./Components/Guide/Sections/BuilderSection";
import AutoSection from "./Components/Guide/Sections/AutoSection";
import SavedSection from "./Components/Guide/Sections/SavedSection";

const SECTIONS = [
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
  const [active, setActive] = useState(SECTIONS[0].id);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <GuideSidebar sections={SECTIONS} active={active} onSelect={setActive} />
      <div className="flex-1 px-4 pt-6">{contentMap[active]}</div>
    </div>
  );
};

export default Guide;
