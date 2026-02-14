import React, { useState } from 'react';
import { buildService } from '../services/server';
import PriceSlider from '../components/PriceSlider';

const Build = () => {
  const [loading, setLoading] = useState(false);
  const [budget, setBudget] = useState(1000);
  const [build, setBuild] = useState(null);

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
    <div className="p-4">
      <div>
        <h1 className="font-semibold text-2xl">Build A PC</h1>
      </div>

      <div className="space-y-4">
        <PriceSlider setBudget={setBudget} budget={budget} />
        <button
          className="bg-linear-to-b from-success-light to-success-dark text-white font-bold text-base py-3 px-6 rounded-xl hover:cursor-pointer"
          onClick={handleGenerate}
        >
          Generate
        </button>
      </div>
    </div>
  );
};

export default Build;
