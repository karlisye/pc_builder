import React from "react";

const AddComponentSkeleton = () => {
  return (
    <div className="mt-4 flex flex-col gap-2">
      {Array.from({ length: 15 }).map((_, index) => (
        <div
          key={index}
          className="flex justify-between items-center p-3 border border-border bg-surface hover:bg-secondary-light cursor-pointer transition animate-pulse"
        >
          <span className="w-60 h-5 bg-muted"></span>
          <span className="w-10 h-5 bg-muted"></span>
        </div>
      ))}
    </div>
  );
};

export default AddComponentSkeleton;
