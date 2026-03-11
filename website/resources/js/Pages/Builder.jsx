import React, { useState } from "react";
import ComponentCard from "./Components/ComponentCard";
import BuildDesc from "./Components/BuildDesc";
import { BuilderContext } from "../Contexts/BuilderContext";
import AddComponent from "./Components/AddComponent";

const Builder = () => {
  const [currentCompToAdd, setCurrentCompToAdd] = useState(null);

  return (
    <BuilderContext value={{ currentCompToAdd, setCurrentCompToAdd }}>
      <div className="h-full flex flex-wrap">
        <div className="w-full lg:w-120 bg-primary pt-6">
          <BuildDesc />
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
