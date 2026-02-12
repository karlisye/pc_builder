import React, { useState } from 'react';

const PriceSlider = ({ setBudget, budget }) => {
  const handleChange = (e) => {
    setBudget(Number(e.target.value));
  };

  return (
    <div className="flex flex-col w-50">
      <label htmlFor="range-slider">Selected Value: {budget}</label>

      <input
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
