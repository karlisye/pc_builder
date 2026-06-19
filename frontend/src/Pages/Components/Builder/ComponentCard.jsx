import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ComponentInfo from "../Common/ComponentInfo";
import { useBuilder } from "../../../Contexts/BuilderContext";
import { AddIcon, InfoIcon } from "../Common/Icons";
import ComponentPopup from "./ComponentPopup";

const ComponentCard = ({ component, name }) => {
  const { t } = useTranslation(["builder", "common"]);
  const {
    setCurrentCompToAdd,
    setFilters,
    setSearch,
    setSort,
    setSelectedComponents,
    buildIssues,
  } = useBuilder();
  const [isSeeMoreActive, setIsSeeMoreActive] = useState(false);
  const [popup, setPopup] = useState(null);

  const handleAddComponent = () => {
    setCurrentCompToAdd(name);
    setFilters({});
    setSearch("");
    setSort("price_asc");
  };

  const handleSeeMore = () => {
    setIsSeeMoreActive((p) => !p);
  };

  const handleRemove = () => {
    setSelectedComponents((prev) => ({
      ...prev,
      [name.toLowerCase()]: null,
    }));
    setCurrentCompToAdd(null);
  };

  const handlePopup = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPopup({ component: name, x: rect.left, y: rect.bottom });
  };

  const hasIssues = buildIssues[name.toLowerCase()]?.length > 0;
  const displayName = t(`common:components.${name.toLowerCase()}`);

  return (
    <div className="w-full xl:w-80 h-100 border flex flex-col border-border shadow hover:bg-background transition relative">
      <>
        {component ? (
          <>
            <div className="relative group p-2">
              <h3 className="text-xl text-muted">{displayName}</h3>
              <h2 className="text-text font-semibold text-3xl line-clamp-1">
                {component.name}
              </h2>
              <div className="absolute left-0 mb-1 hidden group-hover:block bg-primary text-white text-xs p-1 whitespace-nowrap z-10">
                {component.name}
              </div>
            </div>

            {isSeeMoreActive ? (
              <div className="max-h-55 p-2">
                <div className="overflow-auto h-full">
                  <ComponentInfo component={component} />
                </div>
              </div>
            ) : (
              <div className="p-2 flex flex-col">
                {!component.out_of_stock && (
                  <span className="text-muted">
                    {t("componentCard.price", { price: component.price })}
                  </span>
                )}
                <span className="text-muted">
                  {t("componentCard.availability", {
                    status:
                      component.stock_status === "in_stock"
                        ? t("componentCard.inStockWithQty", {
                            count: component.stock_quantity,
                          })
                        : component.stock_status === "orderable"
                          ? t("componentCard.orderableWithQty", {
                              count: component.stock_quantity,
                            })
                          : t("componentCard.outOfStock"),
                  })}
                </span>
              </div>
            )}
            <button
              className="text-info cursor-pointer flex p-2"
              onClick={handleSeeMore}
            >
              {isSeeMoreActive
                ? t("componentCard.showLess")
                : t("componentCard.showMore")}
            </button>

            <div className="bg-primary mt-auto flex">
              <button
                className="text-white px-8 py-4 flex-1 text-left hover:bg-danger/50 cursor-pointer transition"
                onClick={handleRemove}
              >
                {t("componentCard.remove")}
              </button>
              <a
                href={component.url}
                target="_blank"
                className="text-white py-4 px-8 hover:bg-success/50 transition"
              >
                {t("componentCard.buy")}
              </a>
            </div>

            {hasIssues && (
              <div className="bg-danger/10 absolute w-full h-full pointer-events-none border-2 border-danger/20"></div>
            )}
          </>
        ) : (
          <>
            <div className="h-full flex flex-col items-center justify-center gap-4 relative">
              <span className="text-3xl font-semibold text-muted">
                {displayName}
              </span>
              <button
                className="bg-surface p-2 text-muted hover:bg-secondary-light transition cursor-pointer"
                onClick={handleAddComponent}
              >
                <AddIcon />
              </button>
            </div>
          </>
        )}

        <div
          className="absolute top-0 right-0 m-2 text-border hover:text-muted transition"
          onMouseEnter={handlePopup}
          onMouseLeave={() => setPopup(null)}
        >
          <InfoIcon />
        </div>
        {popup && <ComponentPopup {...popup} />}
      </>
    </div>
  );
};

export default ComponentCard;
