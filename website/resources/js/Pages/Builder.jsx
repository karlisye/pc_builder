import React, { useEffect, useState } from "react";
import ComponentCard from "./Components/Builder/ComponentCard";
import BuildDesc from "./Components/Builder/BuildDesc";
import { BuilderContext } from "../Contexts/BuilderContext";
import AddComponent from "./Components/Builder/AddComponent";
import ComponentFilters from "./Components/Builder/ComponentFilters";
import BuildInfo from "./Components/Builder/BuildInfo";
import { Link } from "@inertiajs/react";
import BuildGenerator from "./Components/Builder/BuildGenerator";
import ComponentGenerator from "./Components/Builder/ComponentGenerator";
import SidePanel from "./Components/Common/SidePanel";
import axios from "axios";

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
  const [warnings, setWarnings] = useState([]);
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [buildIssues, setBuildIssues] = useState({});
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("price_asc");
  const [buildType, setBuildType] = useState(build?.type ?? "");

  useEffect(() => {
    validateCompatibility();
  }, [selectedComponents]);

  const validateCompatibility = async () => {
    const selected = Object.fromEntries(
      Object.entries(selectedComponents)
        .filter(([_, c]) => c !== null)
        .map(([type, c]) => [type, c.id]),
    );

    if (Object.keys(selected).length === 0) {
      setBuildIssues({});
      return;
    }

    try {
      const res = await axios.post("/api/builder/validate", { selected });
      setBuildIssues(res.data.issues);
    } catch (err) {
      setBuildIssues({});
      console.error(err);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

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
        debouncedSearch,
        setDebouncedSearch,
        warnings,
        setWarnings,
        notes,
        setNotes,
        buildIssues,
        setBuildIssues,
      }}
    >
      <div className="h-full flex">
        <SidePanel
          title="BUILDER"
          headerRight={
            (build || buildId) && (
              <Link
                className="px-6 py-2 border text-secondary-light cursor-pointer hover:text-muted transition text-sm"
                href="builder"
              >
                New Build
              </Link>
            )
          }
        >
          {currentCompToAdd ? <ComponentFilters /> : <BuildDesc />}

          <BuildInfo
            currBuildInfo={{
              id: build?.id,
              name: build?.name,
              notes: build?.notes,
            }}
          />

          {currentCompToAdd ? <ComponentGenerator /> : <BuildGenerator />}
        </SidePanel>

        <div className="flex-1 flex px-4 py-6">
          {currentCompToAdd ? (
            <AddComponent />
          ) : (
            <div className="flex flex-wrap mb-auto gap-8 justify-center">
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
            </div>
          )}
        </div>
      </div>
    </BuilderContext>
  );
};

export default Builder;
