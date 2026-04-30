import React, { useState } from "react";
import ComponentCard from "./Components/Builder/ComponentCard";
import BuildDesc from "./Components/Builder/BuildDesc";
import { BuilderContext } from "../Contexts/BuilderContext";
import AddComponent from "./Components/Builder/AddComponent";
import ComponentFilters from "./Components/Builder/ComponentFilters";
import BuildInfo from "./Components/Builder/BuildInfo";
import { Link } from "@inertiajs/react";
import BuildGenerator from "./Components/Builder/BuildGenerator";
import ComponentGenerator from "./Components/Builder/ComponentGenerator";

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

  const [buildType, setBuildType] = useState(build?.type ?? "");

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
        buildType,
        setBuildType,
      }}
    >
      <div className="h-full flex flex-wrap">
        <div className="w-full lg:w-120.5 bg-primary py-6 px-4">
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

          {currentCompToAdd ? <ComponentGenerator /> : <BuildGenerator />}
        </div>

        <div className="flex-1 flex flex-wrap justify-center gap-8 px-4 py-6">
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
