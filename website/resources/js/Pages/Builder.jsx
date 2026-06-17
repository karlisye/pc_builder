import React, { useEffect, useState } from "react";
import ComponentCard from "./Components/Builder/ComponentCard";
import BuildDesc from "./Components/Builder/BuildDesc";
import { BuilderContext } from "../Contexts/BuilderContext";
import AddComponent from "./Components/Builder/AddComponent";
import ComponentFilters from "./Components/Builder/ComponentFilters";
import BuildInfo from "./Components/Builder/BuildInfo";
import { Link, useSearchParams } from "react-router-dom";
import BuildGenerator from "./Components/Builder/BuildGenerator";
import ComponentGenerator from "./Components/Builder/ComponentGenerator";
import SidePanel from "./Components/Common/SidePanel";
import axios from "axios";

const Builder = () => {
  const [searchParams] = useSearchParams();
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
  const [buildId, setBuildId] = useState(undefined);
  const [buildName, setBuildName] = useState("");
  const [buildNotes, setBuildNotes] = useState("");
  const [warnings, setWarnings] = useState([]);
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [buildIssues, setBuildIssues] = useState({});
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("price_asc");
  const [buildType, setBuildType] = useState("");

  useEffect(() => {
    const buildParam = searchParams.get("build");
    const sharedParam = searchParams.get("shared");
    if (buildParam) {
      axios
        .get("/api/builder", {
          params: { build: buildParam, shared: sharedParam },
        })
        .then((res) => {
          const build = res.data.build;
          if (!build) return;
          setSelectedComponents({
            cpu: build.cpu ?? null,
            motherboard: build.motherboard ?? null,
            ram: build.ram ?? null,
            gpu: build.gpu ?? null,
            psu: build.psu ?? null,
            ssd: build.ssd ?? null,
            hdd: build.hdd ?? null,
            case: build.pc_case ?? null,
            fan: build.fan ?? null,
            cooler: build.cooler ?? null,
          });
          setBuildId(build.id);
          setBuildName(build.name ?? "");
          setBuildNotes(build.notes ?? "");
          setBuildType(build.type ?? "");
        });
    }
  }, []);

  useEffect(() => {
    validateCompatibility();
  }, [selectedComponents]);

  const validateCompatibility = async () => {
    const selected = Object.fromEntries(
      Object.entries(selectedComponents)
        .filter(([_, c]) => c !== null)
        .map(([type, c]) => [type, c.dateks_id]),
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
        buildName,
        setBuildName,
        buildNotes,
        setBuildNotes,
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
            buildId && (
              <Link
                className="px-6 py-2 border text-secondary-light cursor-pointer hover:text-muted transition text-sm"
                to="/builder"
              >
                New Build
              </Link>
            )
          }
        >
          {currentCompToAdd ? <ComponentFilters /> : <BuildDesc />}

          <BuildInfo />

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
