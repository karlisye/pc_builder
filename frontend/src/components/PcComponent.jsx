import React from 'react';
import { useBuild } from '../contexts/BuildContext';

const PcComponent = ({ location, name, component }) => {
  const { setSelectedComponent, setIsModalActive } = useBuild();
  const handleSeeMore = () => {
    if (component) {
      setSelectedComponent(component);
      setIsModalActive(true);
      return;
    }
  };
  return (
    <button
      className={`sm:w-25 sm:h-10 w-10 h-10 rounded-full sm:rounded-md font-semibold border-2 absolute flex items-center justify-center text-sm leading-tight hover:cursor-pointer
        ${component ? 'border-secondary-light bg-secondary hover:bg-secondary-dark' : 'bg-neutral-600 border-neutral-500 hover:bg-neutral-700'}
        `}
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
