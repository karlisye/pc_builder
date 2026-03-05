import React from "react";
import PcListView from "../components/PcListView";
import CustomPartCard from "../components/custom-build/CustomPartCard";

const Custom = () => {
  const build = {
    cpu: "",
    motherboard: "",
    ram: "",
    cooler: "",
    gpu: "",
    ssd: "",
    psu: "",
    case: "",
    fans: "",
  };
  return (
    <div className="w-full flex p-4 flex-wrap justify-center bg-primary rounded-lg">
      <CustomPartCard
        title="Motherboard"
        component={build.motherboard}
        build={build}
      />
      <CustomPartCard title="Processor" component={build.cpu} build={build} />
      <CustomPartCard title="Cooler" component={build.cooler} build={build} />
      <CustomPartCard
        title="Graphics Card"
        component={build.gpu}
        build={build}
      />
      <CustomPartCard title="RAM" component={build.ram} build={build} />
      <CustomPartCard
        title="Power Supply"
        component={build.psu}
        build={build}
      />
      <CustomPartCard title="SSD" component={build.ssd} build={build} />
      <CustomPartCard title="Case" component={build.case} build={build} />
      <CustomPartCard title="Fans" component={build.fans} build={build} />
    </div>
  );
};

export default Custom;
