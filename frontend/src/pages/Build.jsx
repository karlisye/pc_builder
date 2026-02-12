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
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <h1>Build A PC</h1>
      </div>

      <div>
        {/* <label htmlFor="price"></label>
        <input
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          id="price"
          type="number"
        />
        <button onClick={handleGenerate}>Generate</button> */}
        <PriceSlider setBudget={setBudget} budget={budget} />
        <button onClick={handleGenerate}>Generate</button>
      </div>
    </div>
  );
};

export default Build;
