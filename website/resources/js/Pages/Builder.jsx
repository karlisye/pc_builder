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

  return (
    <BuilderContext
      value={{
        currentCompToAdd,
        setCurrentCompToAdd,
        selectedComponents,
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
        </div>
        <div className="flex-1 flex flex-wrap justify-center gap-8 px-4 pt-6">
          {currentCompToAdd ? (
            <AddComponent />
          ) : (
            <>
              <ComponentCard name="CPU" />
              <ComponentCard name="Motherboard" />
              <ComponentCard name="RAM" />
              <ComponentCard name="GPU" />
              <ComponentCard name="PSU" />
              <ComponentCard name="SSD" />
              <ComponentCard name="HDD" />
              <ComponentCard name="Case" />
              <ComponentCard name="Fan" />
              <ComponentCard name="Cooler" />
            </>
          )}
        </div>
      </div>
    </BuilderContext>
  );
};

export default Builder;
