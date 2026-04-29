import React from "react";

const SharedBuildsSkeleton = () => {
  return (
    <div className="flex flex-col items-center gap-8 px-4 pt-6 flex-1">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="w-full h-100 border flex flex-col border-border shadow bg-surface transition animate-pulse"
        >
          <div className="flex justify-between">
            <div className="m-2 w-50 h-10 bg-background"></div>
            <div className="m-2 w-20 h-10 bg-background"></div>
          </div>

          <div className="flex flex-1 gap-2 m-2">
            <div className="bg-background flex-1 flex">
              <div className="bg-surface h-20 mt-auto w-full m-2"></div>
            </div>
            <div className="bg-background flex-2"></div>
          </div>

          <div className="h-15 bg-primary mt-auto"></div>
        </div>
      ))}
    </div>
  );
};

export default SharedBuildsSkeleton;
