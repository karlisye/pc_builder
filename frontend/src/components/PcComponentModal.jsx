import React from 'react';

const PcComponentModal = ({ component }) => {
  console.log(component);
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 backdrop-blur-xs">
      <div className="fixed top-1/2 left-1/2 transform -translate-1/2 bg-white p-4 shadow-lg rounded-lg">
        {Object.entries(component).map(([key, value]) => {
          if (!value) return null;

          return (
            <div key={key}>
              <span className="font-semibold">{key}: </span>
              <span>{value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PcComponentModal;
