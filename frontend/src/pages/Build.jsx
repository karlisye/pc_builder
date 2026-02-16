import React, { useState } from 'react';
import { buildService } from '../services/server';
import PriceSlider from '../components/PriceSlider';
import PcInteractiveView from '../components/PcInteractiveView';

const Build = () => {
  const [loading, setLoading] = useState(false);
  const [budget, setBudget] = useState(1000);
  const [build, setBuild] = useState(null);
  const [isComputerViewActive, setIsComputerViewActive] = useState(true);

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
    <div className="p-4 flex flex-wrap">
      <div className="flex-1 border p-2 flex items-center flex-col gap-4">
        <div>
          <h1 className="font-semibold text-2xl">Build A PC</h1>
        </div>

        <span>Pick a budget for your PC</span>

        <PriceSlider setBudget={setBudget} budget={budget} />

        <button
          className="bg-linear-to-b from-success-light to-success-dark text-white font-bold text-base py-3 px-6 rounded-xl hover:cursor-pointer"
          onClick={handleGenerate}
        >
          {build ? 'Regenerate' : 'Generate'}
        </button>
      </div>

      <div className="flex-2 border flex items-center justify-center relative">
        {build ? (
          <>
            {isComputerViewActive ? <PcInteractiveView components={build} /> : <PcListView />}
            <button className="absolute top-0 right-0 text-danger" onClick={() => setBuild(null)}>
              Remove
            </button>

            <div className="absolute top-0 left-0 m-1 bg-primary-light">
              <button className={`border p-1 text-white`}>Interactive</button>
              <button className="border p-1 text-white">List</button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-xl font-semibold">Generate a PC to view the parts</h2>
            <p>Pick a price and press the generate button</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Build;
