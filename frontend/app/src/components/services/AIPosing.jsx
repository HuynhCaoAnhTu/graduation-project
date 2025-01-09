import React, { useState } from 'react';

const AIPosing = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleStartPose = () => {
    setIsAnalyzing(true);
    // Gọi đến API AI Posing hoặc tích hợp OpenCV tại đây.
    setTimeout(() => {
      setIsAnalyzing(false);
      alert('Analysis complete!');
    }, 3000);
  };

  return (
    <div className="p-4 bg-gray-100 rounded shadow">
      <p className="mb-4">Use AI to analyze your fitness posture in real-time!</p>
      <button
        onClick={handleStartPose}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        disabled={isAnalyzing}
      >
        {isAnalyzing ? 'Analyzing...' : 'Start AI Posing'}
      </button>
    </div>
  );
};

export default AIPosing;
