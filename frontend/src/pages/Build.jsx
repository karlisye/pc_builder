import React, { useState } from 'react';
import { buildService } from '../services/server';
import PriceSlider from '../components/PriceSlider';
import PcInteractiveView from '../components/PcInteractiveView';
import PcListView from '../components/PcListView';
import PcInfo from '../components/PcInfo';
import { BuildContext } from '../contexts/BuildContext';
import PcComponentModal from '../components/PcComponentModal';

const Build = () => {
  const [loading, setLoading] = useState(false);
  const [budget, setBudget] = useState(1000);
  const [build, setBuild] = useState(null);
  const [isInteractiveViewActive, setIsInteractiveViewActive] = useState(true);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [isModalActive, setIsModalActive] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);

    try {
      const data = await buildService.generateBuild(budget);
      setBuild(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BuildContext value={{ build, setSelectedComponent, setIsModalActive }}>
      <div className="p-4 flex flex-wrap">
        <div className="flex-1 p-2 flex items-center flex-col gap-4">
          <div>
            <h1 className="font-semibold text-2xl">Build a PC</h1>
          </div>

          <span>Select your PC budget</span>

          <PriceSlider setBudget={setBudget} budget={budget} />

          <button
            className="bg-linear-to-b from-success-light to-success-dark text-white font-bold text-base py-3 px-6 rounded-xl hover:cursor-pointer"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? 'Generating...' : build ? 'Regenerate' : 'Generate'}
          </button>

          {build && <PcInfo build={build} />}
        </div>

        <div className="flex-2 flex items-center justify-center relative">
          {build ? (
            <>
              {isInteractiveViewActive ? <PcInteractiveView /> : <PcListView />}
              <button
                className="absolute m-2 top-8 right-3 text-danger hover:cursor-pointer"
                onClick={() => setBuild(null)}
              >
                Remove
              </button>

              <div className="absolute top-0 left-2 m-2">
                <p className="font-semibold">View</p>
                <button
                  className={`p-2 text-white hover:cursor-pointer rounded-l-md ${isInteractiveViewActive ? 'bg-primary-dark' : 'bg-primary-light'}`}
                  onClick={() => setIsInteractiveViewActive(true)}
                >
                  Interactive
                </button>
                <button
                  className={`p-2 text-white hover:cursor-pointer rounded-r-md ${isInteractiveViewActive ? 'bg-primary-light' : 'bg-primary-dark'}`}
                  onClick={() => setIsInteractiveViewActive(false)}
                >
                  List
                </button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <h2 className="text-xl font-semibold">Generate a PC to see its components</h2>
              <p>Select price and click Generate button</p>
            </div>
          )}
        </div>
      </div>

      {isModalActive && <PcComponentModal component={selectedComponent} />}
    </BuildContext>
  );
};

export default Build;
