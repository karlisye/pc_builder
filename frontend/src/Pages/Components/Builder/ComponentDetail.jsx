import React from "react";
import { useTranslation } from "react-i18next";
import { useBuilder } from "../../../Contexts/BuilderContext";
import ComponentInfo from "../Common/ComponentInfo";
import { CloseIcon } from "../Common/Icons";

const ComponentDetail = () => {
  const { t } = useTranslation(["builder", "common"]);
  const { viewingComponent, setViewingComponent } = useBuilder();
  const { component, name } = viewingComponent;

  const displayName = t(`common:components.${name.toLowerCase()}`);

  return (
    <div className="border border-border w-full hover:bg-background transition p-4 mb-auto">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl text-muted">{displayName}</h3>
          <h2 className="text-text font-semibold text-3xl">{component.name}</h2>
        </div>
        <button
          className="w-10 h-10 text-muted hover:cursor-pointer bg-surface hover:bg-secondary-light transition p-2"
          onClick={() => setViewingComponent(null)}
        >
          <CloseIcon />
        </button>
      </div>

      <div className="mt-4">
        <ComponentInfo component={component} />
      </div>

      <a
        href={component.url}
        target="_blank"
        className="inline-block mt-6 text-white py-4 px-8 bg-primary hover:bg-success/50 transition"
      >
        {t("componentCard.seeInStore")}
      </a>
    </div>
  );
};

export default ComponentDetail;
