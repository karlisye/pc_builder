import React from "react";
import PcPartCard from "./PcPartCard";
import { useBuild } from "../contexts/BuildContext";

const PcListView = () => {
  const { build, locked } = useBuild();

  const source = build || locked || {};

  return (
    <div className="w-full flex p-4 flex-wrap justify-center bg-primary rounded-lg">
      <PcPartCard title="Motherboard" component={source.motherboard} />
      <PcPartCard title="Processor" component={source.cpu} />
      <PcPartCard title="Cooler" component={source.cooler} />
      <PcPartCard title="Graphics Card" component={source.gpu} />
      <PcPartCard title="RAM" component={source.ram} />
      <PcPartCard title="Power Supply" component={source.psu} />
      <PcPartCard title="SSD" component={source.ssd} />
      <PcPartCard title="Case" component={source.case} />
      <PcPartCard title="Fans" component={source.fans} />
    </div>
  );
};

export default PcListView;
