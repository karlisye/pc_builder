import React, { useState } from 'react';
import { buildService } from '../services/server';
import PriceSlider from '../components/PriceSlider';
import PcInteractiveView from '../components/PcInteractiveView';
import PcListView from '../components/PcListView';
import PcInfo from '../components/PcInfo';
import { BuildContext } from '../contexts/BuildContext';
import PcComponentModal from '../components/PcComponentModal';
import LoadingSpinner from '../components/LoadingSpinner';

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
        <div className="flex-1 p-3 flex items-center flex-col gap-3 bg-primary-light">
          <div className="bg-primary py-2 px-16 rounded-lg">
            <h1 className="font-bold text-5xl text-secondary">BUILD A PC</h1>
          </div>

          <div className="bg-primary p-4 w-full rounded-xl flex flex-col gap-3">
            <span className="text-white font-semibold text-lg text-center">
              Select your PC budget
            </span>

            <PriceSlider setBudget={setBudget} budget={budget} />

            <button
              className="bg-secondary hover:bg-secondary-dark font-semibold h-10 w-35 rounded-lg hover:cursor-pointer flex justify-center items-center mx-auto"
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? <LoadingSpinner /> : build ? 'Regenerate' : 'Generate'}
            </button>
          </div>

          {build && <PcInfo build={build} />}
        </div>

        <div className="flex-2">
          {build ? (
            <>
              <div className="flex justify-between bg-primary-light p-3">
                <div>
                  <button
                    className={`p-2 text-white hover:cursor-pointer rounded-l-md ${isInteractiveViewActive ? 'bg-primary-dark' : 'bg-primary'}`}
                    onClick={() => setIsInteractiveViewActive(true)}
                  >
                    Interactive
                  </button>
                  <button
                    className={`p-2 text-white hover:cursor-pointer rounded-r-md ${isInteractiveViewActive ? 'bg-primary' : 'bg-primary-dark'}`}
                    onClick={() => setIsInteractiveViewActive(false)}
                  >
                    List
                  </button>
                </div>

                <button className="text-danger hover:cursor-pointer" onClick={() => setBuild(null)}>
                  Remove
                </button>
              </div>

              {isInteractiveViewActive ? <PcInteractiveView /> : <PcListView />}
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
