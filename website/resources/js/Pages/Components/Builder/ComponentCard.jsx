import React, { useState } from "react";
import ComponentInfo from "../ComponentInfo";
import { useBuilder } from "../../../Contexts/BuilderContext";
import { AddIcon } from "../Common/Icons";

const ComponentCard = ({ component, name }) => {
  const {
    setCurrentCompToAdd,
    setFilters,
    setSearch,
    setSort,
    setSelectedComponents,
  } = useBuilder();
  const [isSeeMoreActive, setIsSeeMoreActive] = useState(false);

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

  return (
    <div className="w-full xl:w-80 h-100 border flex flex-col border-border shadow hover:bg-background transition">
      {component ? (
        <>
          <div className="relative group p-2">
            <h3 className="text-xl text-muted">{name}</h3>
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
              <span className="text-muted">Price: €{component.price}</span>
              <span className="text-muted">
                Availability:{" "}
                {component.in_stock
                  ? `In Stock (${component.stock_quantity})`
                  : "Out of Stock"}
              </span>
            </div>
          )}
          <button
            className="text-info cursor-pointer flex p-2"
            onClick={handleSeeMore}
          >
            {isSeeMoreActive ? "Show less" : "Show more"}
          </button>

          <div className="bg-primary mt-auto flex">
            <button
              className="text-white px-8 py-4 flex-1 text-left hover:bg-danger/50 cursor-pointer transition"
              onClick={handleRemove}
            >
              Remove
            </button>
            <a
              href={component.url}
              target="_blank"
              className="text-white py-4 px-8 hover:bg-success/50 transition"
            >
              Buy
            </a>
          </div>
        </>
      ) : (
        <>
          <div className="h-full flex flex-col items-center justify-center gap-4">
            <span className="text-3xl font-semibold text-muted">{name}</span>
            <button
              className="bg-surface p-2 text-muted hover:bg-secondary-light transition cursor-pointer"
              onClick={handleAddComponent}
            >
              <AddIcon />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ComponentCard;
