import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="w-5 h-5 border-2 border-success-light border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingSpinner;
