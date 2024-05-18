import React from 'react';

const LoadingModalDots = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-80 bg-black">
      <span className="loading loading-dots loading-lg"></span>
    </div>
  );
};

export default LoadingModalDots;
