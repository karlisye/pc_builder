import React from 'react';

const PcInfo = ({ build }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">PC Information</h2>

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
        <span className="font-semibold">Total: </span>
        <span>{Number(build.total).toFixed(2)}€</span>
      </div>

      {build.adjustments && (
        <div>
          <div>
            <span className="font-semibold">Original budget: </span>
            <span>{build.original_budget}€</span>
          </div>
          <p>{build.adjustments.message}</p>
        </div>
      )}
    </div>
  );
};

export default PcInfo;
