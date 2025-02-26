// LoadingSpinner.tsx
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] w-full">
      <div className="animate-spin h-12 w-12 border-4 border-t-4 border-black border-t-transparent rounded-full"></div>
    </div>
  );
};

export default LoadingSpinner;
