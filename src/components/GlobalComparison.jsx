// src/components/GlobalComparison.jsx
import React from 'react';
import PropTypes from 'prop-types';

const GLOBAL_AVG_DAILY = 4.5; // kg CO₂e per person per day (approx)

export default function GlobalComparison({ total, days = 1 }) {
  const daily = days > 0 ? total / days : 0;
  const diff = daily - GLOBAL_AVG_DAILY;
  const status = diff > 0 ? 'higher' : 'lower';
  const color = diff > 0 ? 'text-red-400' : 'text-green-400';
  const absDiff = Math.abs(diff).toFixed(1);

  return (
    <div className="glass p-4 w-full mt-2">
      <p className="text-sm">🌍 Global average: <strong>{GLOBAL_AVG_DAILY} kg CO₂e/day</strong></p>
      <p className={`font-bold ${color}`}>
        You are {absDiff} kg {status} than the global average.
      </p>
      {diff < 0 && <p className="text-green-300 text-sm">🌟 Great job! You're below average.</p>}
      {diff > 0 && <p className="text-yellow-300 text-sm">📈 Try our action plan to reduce your footprint.</p>}
    </div>
  );
}

GlobalComparison.propTypes = {
  total: PropTypes.number.isRequired,
  days: PropTypes.number,
};