import React from "react";
import ComponentCard from "./Components/ComponentCard";
import BuildDesc from "./Components/BuildDesc";

const Builder = () => {
  return (
    <div className="h-full flex flex-wrap">
      <div className="w-full lg:w-120 bg-primary pt-6">
        <BuildDesc />
      </div>
      <div className="flex-1 flex flex-wrap justify-center gap-8 px-4 pt-6">
        <ComponentCard name="Processor" />
        <ComponentCard name="Motherboard" />
        <ComponentCard name="RAM" />
        <ComponentCard name="Grapics Card" />
        <ComponentCard name="Power Supply" />
        <ComponentCard name="SSD" />
        <ComponentCard name="HDD" />
        <ComponentCard name="Case" />
        <ComponentCard name="Fans" />
      </div>
    </div>
  );
};

export default Builder;
