import React from "react";

const BuildCard = ({ build }) => {
  return (
    <div className="w-full border flex flex-col border-border shadow hover:bg-background transition overflow-hidden">
      <div className="flex gap-2 items-center justify-between">
        <h1 className="text-2xl uppercase m-2 text-text font-semibold">
          {build.name}
        </h1>
        <p className="text-text font-semibold text-xl m-2">
          €{build.total_price}
        </p>
      </div>

      <div className="flex">
        <div className="flex-1 m-2">
          <span className="text-muted font-medium">Notes</span>
          <p className="text-text mt-4">{build.notes}</p>
        </div>

        <div className="flex-2 m-2">
          <span className="text-muted font-medium">Components</span>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {build.components &&
              Object.entries(build.components).map(([key, component]) => {
                if (!component) return null;

                return (
                  <div key={key}>
                    <span className="text-muted uppercase text-sm">{key}</span>
                    <p className="text-text text-sm truncate">
                      {component.name}
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      <div className="bg-primary mt-auto flex">
        <button className="text-white px-8 py-4 flex-1 hover:bg-primary-light cursor-pointer transition">
          Continue
        </button>

        <button className="text-white px-8 py-4 flex-1 hover:bg-primary-light cursor-pointer transition">
          Save
        </button>
      </div>
    </div>
  );
};

export default BuildCard;
