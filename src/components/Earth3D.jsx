import React from 'react';

// Simplified Earth3D component - placeholder
export default function Earth3D({ footprintTotal }) {
  return (
    <div className="w-full h-96 bg-gradient-to-b from-blue-900 to-blue-700 rounded-lg flex items-center justify-center border-2 border-blue-500 shadow-lg">
      <div className="text-center text-white">
        <div className="text-6xl mb-4">🌍</div>
        <p className="text-xl font-bold">Global Carbon Footprint Tracker</p>
        <p className="text-sm mt-2 mb-4">Monitoring worldwide emissions</p>
        <p className="text-lg font-semibold text-green-300">Your CO₂: {footprintTotal || 0} kg CO₂e</p>
      </div>
    </div>
  );
}