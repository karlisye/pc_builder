import React, { useState } from 'react';
import { buildService } from '../services/server';
import PriceSlider from '../components/PriceSlider';
import PcInteractiveView from '../components/PcInteractiveView';
import PcListView from '../components/PcListView';
import PcInfo from '../components/PcInfo';
import { BuildContext } from '../contexts/BuildContext';

const Build = () => {
  const [loading, setLoading] = useState(false);
  const [budget, setBudget] = useState(1000);
  const [build, setBuild] = useState(null);
  const [isInteractiveViewActive, setIsInteractiveViewActive] = useState(true);

  const handleGenerate = async () => {
    setLoading(true);

    try {
      const data = await buildService.generateBuild(budget);
      console.log(data);
      setBuild(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BuildContext value={{ build }}>
      <div className="p-4 flex flex-wrap">
        <div className="flex-1 border p-2 flex items-center flex-col gap-4">
          <div>
            <h1 className="font-semibold text-2xl">Uzbūvē datoru</h1>
          </div>

          <span>Izvēlies datora budžetu</span>

          <PriceSlider setBudget={setBudget} budget={budget} />

          <button
            className="bg-linear-to-b from-success-light to-success-dark text-white font-bold text-base py-3 px-6 rounded-xl hover:cursor-pointer"
            onClick={handleGenerate}
          >
            {build ? 'Regenerate' : 'Generate'}
          </button>

          {build && <PcInfo build={build} />}
        </div>

        <div className="flex-2 border flex items-center justify-center relative">
          {build ? (
            <>
              {isInteractiveViewActive ? <PcInteractiveView /> : <PcListView />}
              <button className="absolute top-0 right-0 text-danger" onClick={() => setBuild(null)}>
                Noņemt
              </button>

              <div className="absolute top-0 left-0 m-2">
                <p className="font-semibold">Skats</p>
                <button
                  className={`p-2 text-white hover:cursor-pointer rounded-l-md ${isInteractiveViewActive ? 'bg-primary-dark' : 'bg-primary-light'}`}
                  onClick={() => setIsInteractiveViewActive(true)}
                >
                  Interaktīvs
                </button>
                <button
                  className={`p-2 text-white hover:cursor-pointer rounded-r-md ${isInteractiveViewActive ? 'bg-primary-light' : 'bg-primary-dark'}`}
                  onClick={() => setIsInteractiveViewActive(false)}
                >
                  Saraksts
                </button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <h2 className="text-xl font-semibold">Ģenerē datoru, lai redzētu tā komponentes</h2>
              <p>Izvēlies cenu un uzspied uz pogas Ģenerēt</p>
            </div>
          )}
        </div>
      </div>
    </BuildContext>
  );
};

export default Build;
