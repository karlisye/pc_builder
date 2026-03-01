import React from 'react';

const PcInfo = ({ build }) => {
  return (
    <div className="space-y-4 bg-primary w-full rounded-lg p-4">
      <h2 className="text-2xl font-bold text-secondary">EXTRA BUILD INFO</h2>

      {build.component_notes &&
        Object.entries(build.component_notes).map(([key, value]) => {
          if (!value) return null;

          return (
            <div key={key}>
              <span className="font-semibold">{key}: </span>
              <span>{value}</span>
            </div>
          );
        })}

      <div>
        <span className="font-semibold text-white">TOTAL: </span>
        <span className='text-white'>{Number(build.total).toFixed(2)}€</span>
      </div>

      {build.adjustments && (
        <div>
          <p className='text-secondary-light'><span className='font-semibold text-white'>Notes: </span>{build.adjustments.message}</p>
          <div>
            <span className="font-semibold text-white">Original budget: </span>
            <span className='text-white'>{build.original_budget}€</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PcInfo;
