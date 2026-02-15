import React from 'react';

const PcComponent = ({ location, name, component }) => {
  return (
    <button
      className="w-20 h-20 rounded-full border-2 absolute flex items-center justify-center bg-white"
      style={{
        top: `${location.yPercent}%`,
        left: `${location.xPercent}%`,
      }}
      onClick={() => console.log(component)}
    >
      {name}
    </button>
  );
};

export default PcComponent;
