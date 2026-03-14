import React, { useState } from "react";
import ComponentCard from "./Components/ComponentCard";
import BuildDesc from "./Components/BuildDesc";
import { BuilderContext } from "../Contexts/BuilderContext";
import AddComponent from "./Components/AddComponent";
import ComponentFilters from "./Components/ComponentFilters";

const Builder = () => {
  const [currentCompToAdd, setCurrentCompToAdd] = useState(null);
  const [selectedComponents, setSelectedComponents] = useState({
    cpu: null,
    motherboard: null,
    ram: null,
    gpu: null,
    psu: null,
    ssd: null,
    hdd: null,
    case: null,
    fan: null,
    cooler: null,
  });

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("price_asc");

  const handleRemove = (name) => {
    setSelectedComponents((prev) => ({
      ...prev,
      [name.toLowerCase()]: null,
    }));
    setCurrentCompToAdd(null);
  };

  return (
    <BuilderContext
      value={{
        currentCompToAdd,
        setCurrentCompToAdd,
        selectedComponents,
        setSelectedComponents,
        search,
        setSearch,
        filters,
        setFilters,
        sort,
        setSort,
      }}
    >
      <div className="h-full flex flex-wrap">
        <div className="w-full lg:w-120 bg-primary pt-6 px-4">
          <h1 className="text-4xl font-semibold text-white mb-4">BUILDER</h1>
          {currentCompToAdd ? <ComponentFilters /> : <BuildDesc />}

          <div className="space-y-4 mt-8">
            {Object.values(selectedComponents).some((v) => v !== null) ? (
              Object.entries(selectedComponents)
                .filter(([key, value]) => value)
                .map(([key, value]) => (
                  <div key={key} className="flex border border-secondary-light">
                    <div className="overflow-hidden flex">
                      <span className="capitalize text-secondary-light p-2">
                        {key}:{" "}
                      </span>
                      <span className="text-surface p-2 truncate">
                        {value.name}
                      </span>
                    </div>
                    <button
                      className="p-2 bg-secondary text-secondary-light hover:bg-danger/50 hover:text-danger/70 cursor-pointer transition border-l border-secondary-light ml-auto"
                      onClick={() => handleRemove(key)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="5" y1="5" x2="19" y2="19" />
                        <line x1="19" y1="5" x2="5" y2="19" />
                      </svg>
                    </button>
                  </div>
                ))
            ) : (
              <p className="text-secondary-light">Select your components</p>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-wrap justify-center gap-8 px-4 pt-6">
          {currentCompToAdd ? (
            <AddComponent />
          ) : (
            <>
              <ComponentCard name="CPU" component={selectedComponents.cpu} />
              <ComponentCard
                name="Motherboard"
                component={selectedComponents.motherboard}
              />
              <ComponentCard name="RAM" component={selectedComponents.ram} />
              <ComponentCard name="GPU" component={selectedComponents.gpu} />
              <ComponentCard name="PSU" component={selectedComponents.psu} />
              <ComponentCard name="SSD" component={selectedComponents.ssd} />
              <ComponentCard name="HDD" component={selectedComponents.hdd} />
              <ComponentCard name="Case" component={selectedComponents.case} />
              <ComponentCard name="Fan" component={selectedComponents.fan} />
              <ComponentCard
                name="Cooler"
                component={selectedComponents.cooler}
              />
            </>
          )}
        </div>
      </div>
    </BuilderContext>
  );
};

export default Builder;
