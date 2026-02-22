import React from 'react';
import PcPartCard from './PcPartCard';
import { useBuild } from '../contexts/BuildContext';

const PcListView = () => {
  const { build } = useBuild();

  return (
    <div className='bg-primary-light px-3 pt-6 pb-3 rounded-br-lg'>
      <div className="w-full flex p-4 flex-wrap justify-center bg-primary rounded-lg">
        {build.motherboard && <PcPartCard title="Motherboard" part={build.motherboard} />}
        {build.cpu && <PcPartCard title="CPU" part={build.cpu} />}
        {build.cooler && <PcPartCard title="Cooler" part={build.cooler} />}
        {build.gpu && <PcPartCard title="Graphics Card" part={build.gpu} />}
        {build.ram && <PcPartCard title="RAM" part={build.ram} />}
        {build.psu && <PcPartCard title="Power Supply" part={build.psu} />}
        {build.ssd && <PcPartCard title="SSD" part={build.ssd} />}
        {build.case && <PcPartCard title="Case" part={build.case} />}
        {build.fans && <PcPartCard title="Fans" part={build.fans} />}
      </div>
    </div>
  );
};

export default PcListView;
