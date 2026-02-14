import React, { useState } from 'react';

const PriceSlider = ({ setBudget, budget }) => {
  const handleChange = (e) => {
    setBudget(Number(e.target.value));
  };

  return (
    <div className="flex flex-col w-50">
      <label className="text-center" htmlFor="range-slider">
        Price: {budget} €
      </label>

      <input
        className="accent-primary"
        id="range-slider"
        type="range"
        min={500}
        max={5000}
        value={budget}
        onChange={handleChange}
      />
    </div>
  );
};

export default PriceSlider;
