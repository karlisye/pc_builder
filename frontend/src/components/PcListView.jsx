import React, { useState } from 'react';
import PcPartCard from './PcPartCard';
import { useBuild } from '../contexts/BuildContext';

const PcListView = () => {
  const { build } = useBuild();
  return (
    <div className="border w-full flex flex-col p-4 gap-3 mt-15">
      {build.motherboard && <PcPartCard title="Sistēmplate" part={build.motherboard} />}
      {build.cpu && <PcPartCard title="Procesors" part={build.cpu} />}
      {build.gpu && <PcPartCard title="Grafikas karte" part={build.gpu} />}
      {build.ram && <PcPartCard title="Operatīvā atmiņa" part={build.ram} />}
      {build.psu && <PcPartCard title="Barošanās bloks" part={build.psu} />}
      {build.ssd && <PcPartCard title="SSD" part={build.ssd} />}
      {build.case && <PcPartCard title="Korpuss" part={build.case} />}
      {build.fans && <PcPartCard title="Ventilātori" part={build.fans} />}
    </div>
  );
};

export default PcListView;
