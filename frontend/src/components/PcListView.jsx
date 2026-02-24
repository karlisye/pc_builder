import React from 'react';
import PcPartCard from './PcPartCard';
import { useBuild } from '../contexts/BuildContext';

const PcListView = () => {
  const { build } = useBuild();

  return (
    <div className="bg-primary-light px-3 pt-6 pb-3 rounded-br-lg">
      <div className="w-full flex p-4 flex-wrap justify-center bg-primary rounded-lg">
        <PcPartCard title="Motherboard" component={build.motherboard} />
        <PcPartCard title="CPU" component={build.cpu} />
        <PcPartCard title="Cooler" component={build.cooler} />
        <PcPartCard title="Graphics Card" component={build.gpu} />
        <PcPartCard title="RAM" component={build.ram} />
        <PcPartCard title="Power Supply" component={build.psu} />
        <PcPartCard title="SSD" component={build.ssd} />
        <PcPartCard title="Case" component={build.case} />
        <PcPartCard title="Fans" component={build.fans} />
      </div>
    </div>
  );
};

export default PcListView;
