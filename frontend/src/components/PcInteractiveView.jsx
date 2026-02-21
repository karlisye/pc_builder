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
        <PcComponent
          name="Ventilātori"
          component={build.fans}
          location={{ xPercent: 65, yPercent: 15 }}
        />
      )}
      {build.case && (
        <PcComponent
          name="Korpuss"
          component={build.case}
          location={{ xPercent: 80, yPercent: 60 }}
        />
      )}
      {build.gpu && (
        <PcComponent
          name="Grafikas karte"
          component={build.gpu}
          location={{ xPercent: 25, yPercent: 55 }}
        />
      )}
      {build.cpu && (
        <PcComponent
          name="Procesors"
          component={build.cpu}
          location={{ xPercent: 20, yPercent: 25 }}
        />
      )}
      {build.motherboard && (
        <PcComponent
          name="Sistēmplate"
          component={build.motherboard}
          location={{ xPercent: 45, yPercent: 40 }}
        />
      )}
      {build.psu && (
        <PcComponent
          name="Barošanās bloks"
          component={build.psu}
          location={{ xPercent: 20, yPercent: 75 }}
        />
      )}
      {build.ssd && (
        <PcComponent name="Atmiņa" component={build.ssd} location={{ xPercent: 8, yPercent: 45 }} />
      )}
      {build.ram && (
        <PcComponent
          name="Operatīvā atmiņa"
          component={build.ram}
          location={{ xPercent: 40, yPercent: 20 }}
        />
      )}
    </div>
  );
};

export default PcInteractiveView;
