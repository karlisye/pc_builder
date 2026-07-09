import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import BuilderSection from "./Components/Guides/BuilderSection";
import AutoSection from "./Components/Guides/AutoSection";
import SavedSection from "./Components/Guides/SavedSection";
import SidePanel from "./Components/Common/SidePanel";
import { useLocalePath } from "../lib/localePath";

const sectionIds = ["builder", "auto", "saved"];

const contentMap = {
  builder: <BuilderSection />,
  auto: <AutoSection />,
  saved: <SavedSection />,
};

const sectionPath = (id) => (id === "builder" ? "/guide" : `/guide/${id}`);

const Guide = ({ section = "builder" }) => {
  const { t } = useTranslation("pages");
  const lp = useLocalePath();
  const active = section;

  return (
    <div className="h-full flex">
      <SidePanel title={t("guide.sidePanelTitle")}>
        {sectionIds.map((id) => (
          <Link
            key={id}
            to={lp(sectionPath(id))}
            className={`block p-4 border border-secondary w-full text-white text-left transition-all cursor-pointer mb-2 hover:bg-secondary ${active === id ? "border-l-10" : ""}`}
          >
            {t(`guide.sections.${id}`)}
          </Link>
        ))}
      </SidePanel>

      <div className="flex-1 px-4 pt-6">{contentMap[active]}</div>
    </div>
  );
};

export default Guide;
