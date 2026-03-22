import React, { useState } from "react";
import ComponentCard from "./Components/ComponentCard";
import BuildDesc from "./Components/BuildDesc";
import { BuilderContext } from "../Contexts/BuilderContext";
import AddComponent from "./Components/AddComponent";
import ComponentFilters from "./Components/ComponentFilters";
import BuildInfo from "./Components/BuildInfo";
import { Link } from "@inertiajs/react";
import BuildGenerator from "./Components/BuildGenerator";

const Builder = ({ build }) => {
  const [currentCompToAdd, setCurrentCompToAdd] = useState(null);
  const [selectedComponents, setSelectedComponents] = useState({
    cpu: build?.cpu ?? null,
    motherboard: build?.motherboard ?? null,
    ram: build?.ram ?? null,
    gpu: build?.gpu ?? null,
    psu: build?.psu ?? null,
    ssd: build?.ssd ?? null,
    hdd: build?.hdd ?? null,
    case: build?.pc_case ?? null,
    fan: build?.fan ?? null,
    cooler: build?.cooler ?? null,
  });
  const [buildId, setBuildId] = useState(build?.id ?? undefined);

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("price_asc");

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
        buildId,
        setBuildId,
      }}
    >
      <div className="h-full flex flex-wrap">
        <div className="w-full lg:w-120 bg-primary pt-6 px-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-semibold text-white">BUILDER</h1>
            {(build || buildId) && (
              <Link
                className="px-6 py-2 border text-secondary-light cursor-pointer hover:text-muted transition text-sm"
                href="builder"
              >
                New Build
              </Link>
            )}
          </div>

          {currentCompToAdd ? <ComponentFilters /> : <BuildDesc />}
          <BuildInfo
            currBuildInfo={{
              id: build?.id,
              name: build?.name,
              notes: build?.notes,
            }}
          />

          <BuildGenerator />
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
