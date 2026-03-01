import React from "react";
import PcComponent from "./PcComponent";
import { useBuild } from "../contexts/BuildContext";

const PcInteractiveView = () => {
    const { build } = useBuild();

    return (
        <div className="bg-primary rounded-lg">
            <div className="relative sm:w-150 sm:min-w-150 w-90 mx-auto">
                <p className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-primary-light">
                    *Image does not contain actual PC parts.
                </p>

                <img
                    className="mx-auto pointer-events-none"
                    src="images/computer.webp"
                    alt="PC with component positions"
                />
                <PcComponent
                    name="FANS"
                    component={build.fans}
                    location={{ xPercent: 65, yPercent: 15 }}
                />
                <PcComponent
                    name="CASE"
                    component={build.case}
                    location={{ xPercent: 70, yPercent: 60 }}
                />
                <PcComponent
                    name="GPU"
                    component={build.gpu}
                    location={{ xPercent: 25, yPercent: 55 }}
                />
                <PcComponent
                    name="CPU"
                    component={build.cpu}
                    location={{ xPercent: 20, yPercent: 25 }}
                />
                <PcComponent
                    name="HSF"
                    component={build.cooler}
                    location={{ xPercent: 20, yPercent: 10 }}
                />
                <PcComponent
                    name="MB"
                    component={build.motherboard}
                    location={{ xPercent: 45, yPercent: 40 }}
                />
                <PcComponent
                    name="PSU"
                    component={build.psu}
                    location={{ xPercent: 20, yPercent: 75 }}
                />
                <PcComponent
                    name="SSD"
                    component={build.ssd}
                    location={{ xPercent: 8, yPercent: 45 }}
                />
                <PcComponent
                    name="RAM"
                    component={build.ram}
                    location={{ xPercent: 40, yPercent: 20 }}
                />
            </div>
        </div>
    );
};

export default PcInteractiveView;
