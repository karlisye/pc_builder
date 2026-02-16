import React, { useState } from 'react';

const PriceSlider = ({ setBudget, budget }) => {
  const [error, setError] = useState('');

  const handleSlider = (e) => {
    setBudget(Number(e.target.value));
  };

  const handleInput = (e) => {
    if (e.target.value < 500 || e.target.value > 5000) {
      console.log('a');
      setError('Please enter a number between 500 and 5000');
    } else {
      setError('');
    }

    setBudget(e.target.value);
  };

  return (
    <div className="flex flex-col items-center">
      <label className="text-center flex" htmlFor="budget">
        Cena:{' '}
        <input
          className={`w-15 text-center rounded-md ${error ? 'outline-red-500 outline-2' : ''}`}
          type="number"
          value={budget}
          id="budget"
          onChange={handleInput}
        />{' '}
        €
      </label>

      {error && <p className="text-red-500">{error}</p>}

      <input
        className="accent-primary w-60"
        type="range"
        min={500}
        max={5000}
        value={budget}
        onChange={handleSlider}
      />
    </div>
  );
};

export default PriceSlider;
