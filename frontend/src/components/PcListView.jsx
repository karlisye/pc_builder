import React from 'react';
import PcPartCard from './PcPartCard';

const PcListView = ({ components }) => {
  return (
    <div className="border w-full flex flex-col p-4 gap-3 mt-15">
      {components.motherboard && <PcPartCard title="Sistēmplate" part={components.motherboard} />}
      {components.cpu && <PcPartCard title="Procesors" part={components.cpu} />}
      {components.gpu && <PcPartCard title="Grafikas karte" part={components.gpu} />}
      {components.ram && <PcPartCard title="Operatīvā atmiņa" part={components.ram} />}
      {components.psu && <PcPartCard title="Barošanās bloks" part={components.psu} />}
      {components.ssd && <PcPartCard title="SSD" part={components.ssd} />}
      {components.case && <PcPartCard title="Korpuss" part={components.case} />}
      {components.fans && <PcPartCard title="Ventilātori" part={components.fans} />}
    </div>
  );
};

export default PcListView;
