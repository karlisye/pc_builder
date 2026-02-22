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
      className="sm:w-25 sm:h-10 w-10 h-10 rounded-full sm:rounded-md font-semibold border-2 border-secondary-light absolute flex items-center justify-center bg-secondary hover:bg-secondary-dark text-sm leading-tight hover:cursor-pointer"
      style={{
        top: `${location.yPercent}%`,
        left: `${location.xPercent}%`,
      }}
      onClick={handleSeeMore}
      title={`Click to see more about ${name}`}
    >
      {name}
    </button>
  );
};

export default PcComponent;
