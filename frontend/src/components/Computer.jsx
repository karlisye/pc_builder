import React from 'react';
import PcComponent from './PcComponent';

const Computer = ({ components }) => {
  return (
    <div className="relative">
      <p className="absolute text-primary-light">
        The image does not contain the actual components.
      </p>

      <img
        className="w-150 min-w-150 mx-auto pointer-events-none"
        src="images/computer.webp"
        alt=""
      />

      {components.fans && (
        <PcComponent
          name="Fans"
          component={components.fans}
          location={{ xPercent: 80, yPercent: 10 }}
        />
      )}
      {components.case && (
        <PcComponent
          name="Case"
          component={components.case}
          location={{ xPercent: 80, yPercent: 60 }}
        />
      )}
      {components.gpu && (
        <PcComponent
          name="Gpu"
          component={components.gpu}
          location={{ xPercent: 25, yPercent: 40 }}
        />
      )}
      {components.cpu && (
        <PcComponent
          name="Cpu"
          component={components.cpu}
          location={{ xPercent: 35, yPercent: 20 }}
        />
      )}
      {components.motherboard && (
        <PcComponent
          name="Mb"
          component={components.motherboard}
          location={{ xPercent: 45, yPercent: 40 }}
        />
      )}
      {components.psu && (
        <PcComponent
          name="Psu"
          component={components.psu}
          location={{ xPercent: 20, yPercent: 65 }}
        />
      )}
      {components.ssd && (
        <PcComponent
          name="Ssd"
          component={components.ssd}
          location={{ xPercent: 8, yPercent: 45 }}
        />
      )}
      {components.ram && (
        <PcComponent
          name="Ram"
          component={components.ram}
          location={{ xPercent: 8, yPercent: 20 }}
        />
      )}
    </div>
  );
};

export default Computer;
