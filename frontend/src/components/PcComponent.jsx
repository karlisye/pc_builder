import React from 'react';
import { useBuild } from '../contexts/BuildContext';

const PcComponent = ({ location, name, component }) => {
  const { setSelectedComponent, setIsModalActive } = useBuild();
  const handleSeeMore = () => {
    setSelectedComponent(component);
    setIsModalActive(true);
  };
  return (
    <button
      className="w-25 h-10 rounded-md border-2 absolute flex items-center justify-center bg-white text-sm leading-tight hover:cursor-pointer"
      style={{
        top: `${location.yPercent}%`,
        left: `${location.xPercent}%`,
      }}
      onClick={handleSeeMore}
    >
      {name}
    </button>
  );
};

export default PcComponent;
