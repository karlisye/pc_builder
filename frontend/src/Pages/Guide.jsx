import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import BuilderSection from "./Components/Guides/BuilderSection";
import AutoSection from "./Components/Guides/AutoSection";
import SavedSection from "./Components/Guides/SavedSection";
import { ArrowIcon, CloseIcon } from "./Components/Common/Icons";
import SidePanel from "./Components/Common/SidePanel";
import Seo from "./Components/Common/Seo";

const sectionIds = ["builder", "auto", "saved"];

const contentMap = {
  builder: <BuilderSection />,
  auto: <AutoSection />,
  saved: <SavedSection />,
};

const Guide = () => {
  const { t } = useTranslation("pages");
  const [active, setActive] = useState(sectionIds[0]);
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
      <Seo title={t("seo.guide.title")} description={t("seo.guide.description")} />
      <SidePanel title={t("guide.sidePanelTitle")}>
        {sectionIds.map((id) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className={`p-4 border border-secondary w-full text-white text-left transition-all cursor-pointer mb-2 hover:bg-secondary ${active === id ? "border-l-10" : ""}`}
          >
            {t(`guide.sections.${id}`)}
          </button>
        ))}
      </SidePanel>

      <div className="flex-1 px-4 pt-6">{contentMap[active]}</div>
    </div>
  );
};

export default Guide;
