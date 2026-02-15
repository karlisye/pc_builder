import React, { useState } from 'react';

const PriceSlider = ({ setBudget, budget }) => {
  const handleSlider = (e) => {
    setBudget(Number(e.target.value));
  };

  return (
    <div className="flex flex-col w-50 items-center">
      <label className="text-center flex" htmlFor="budget">
        Price:{' '}
        <input
          className="w-15 text-center"
          type="text"
          value={budget}
          id="budget"
          onChange={(e) => setBudget(e.target.value)}
        />{' '}
        €
      </label>

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
