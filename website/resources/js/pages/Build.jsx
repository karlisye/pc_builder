import React, { useState } from "react";
import { buildService } from "../services/server";
import PriceSlider from "../components/PriceSlider";
import PcListView from "../components/PcListView";
import PcInfo from "../components/PcInfo";
import { BuildContext } from "../contexts/BuildContext";
import PcComponentModal from "../components/PcComponentModal";
import LoadingSpinner from "../components/LoadingSpinner";
import AddCurrComp from "../components/AddCurrComp";

const INITIAL_LOCKED = {
  cpu: null,
  motherboard: null,
  ram: null,
  cooler: null,
  gpu: null,
  ssd: null,
  psu: null,
  case: null,
  fans: null,
};

const Build = () => {
  const [loading, setLoading] = useState(false);
  const [budget, setBudget] = useState(1000);
  const [build, setBuild] = useState(null);
  const [locked, setLocked] = useState(INITIAL_LOCKED);
  const [activePicker, setActivePicker] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [isComponentModalActive, setIsComponentModalActive] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);

    try {
      const lockedIds = Object.entries(locked).reduce((acc, [key, value]) => {
        if (value && value.id) {
          acc[key] = value.id;
        }
        return acc;
      }, {});

      const data = await buildService.generateBuild(budget, lockedIds);
      setBuild(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearBuild = () => {
    setBuild(null);
    setLocked(INITIAL_LOCKED);
  };

  return (
    <BuildContext
      value={{
        build,
        setBuild,
        locked,
        setLocked,
        activePicker,
        setActivePicker,
        setSelectedComponent,
        setIsComponentModalActive,
      }}
    >
      <div className="p-4 flex flex-wrap bg-primary-dark">
        <div className="flex-1 p-3 flex items-center flex-col gap-3 rounded-l-lg">
          <div className="bg-primary py-2 px-16 rounded-lg">
            <h1 className="font-bold text-5xl text-secondary text-nowrap">
              BUILD A PC
            </h1>
          </div>

          <div className="bg-primary p-4 w-full rounded-xl flex flex-col gap-3">
            <span className="text-white font-semibold text-lg text-center">
              Select your PC budget
            </span>

            <PriceSlider setBudget={setBudget} budget={budget} />

            <button
              className="bg-secondary hover:bg-secondary-dark border-secondary-light border-2 font-semibold h-10 w-35 rounded-lg hover:cursor-pointer flex justify-center items-center mx-auto"
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? <LoadingSpinner /> : build ? "Regenerate" : "Generate"}
            </button>
          </div>

          {build && <PcInfo build={build} />}
        </div>

        <div className="flex-2 max-w-full flex flex-col">
          <div className="flex justify-end items-center p-3 rounded-tr-lg mb-6">
            {build && (
              <button
                className="text-white hover:cursor-pointer bg-danger-darker hover:bg-danger-darker/90 px-6 py-1 rounded-md border-2 border-danger-dark text-sm"
                onClick={handleClearBuild}
              >
                Clear build
              </button>
            )}
          </div>

          {activePicker ? <AddCurrComp /> : <PcListView />}
        </div>
      </div>

      {isComponentModalActive && (
        <PcComponentModal component={selectedComponent} />
      )}
    </BuildContext>
  );
};

export default Build;
