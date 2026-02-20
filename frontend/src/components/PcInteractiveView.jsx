import React from 'react';
import PcComponent from './PcComponent';
import { useBuild } from '../contexts/BuildContext';

const PcInteractiveView = () => {
  const { build } = useBuild();
  return (
    <div className="relative">
      <p className="absolute text-primary-light">Attēls nesatur īstās datora detaļas.</p>

      <img
        className="w-150 min-w-150 mx-auto pointer-events-none"
        src="images/computer.webp"
        alt=""
      />

      {build.fans && (
        <PcComponent name="Fans" component={build.fans} location={{ xPercent: 65, yPercent: 15 }} />
      )}
      {build.case && (
        <PcComponent name="Case" component={build.case} location={{ xPercent: 80, yPercent: 60 }} />
      )}
      {build.gpu && (
        <PcComponent name="Gpu" component={build.gpu} location={{ xPercent: 25, yPercent: 55 }} />
      )}
      {build.cpu && (
        <PcComponent name="Cpu" component={build.cpu} location={{ xPercent: 20, yPercent: 25 }} />
      )}
      {build.motherboard && (
        <PcComponent
          name="Mb"
          component={build.motherboard}
          location={{ xPercent: 45, yPercent: 40 }}
        />
      )}
      {build.psu && (
        <PcComponent name="Psu" component={build.psu} location={{ xPercent: 20, yPercent: 75 }} />
      )}
      {build.ssd && (
        <PcComponent name="Ssd" component={build.ssd} location={{ xPercent: 8, yPercent: 45 }} />
      )}
      {build.ram && (
        <PcComponent name="Ram" component={build.ram} location={{ xPercent: 40, yPercent: 20 }} />
      )}
    </div>
  );
};

export default PcInteractiveView;
