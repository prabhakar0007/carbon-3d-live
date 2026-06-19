// src/components/ActionPlan.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { getTopContributor } from '../utils/carbonFactors';

const actionMap = {
  car_km: [
    '🚌 Use public transport 2 days/week – saves ~15 kg CO₂/month',
    '👥 Carpool with colleagues – cuts emissions by 50%',
    '🔋 Switch to an electric vehicle – zero tailpipe emissions',
  ],
  bus_km: [
    '🚍 Combine bus trips to reduce total km',
    '🚲 Bike for short distances instead of bus',
  ],
  train_km: [
    '🚆 Choose trains over flights for medium distances',
    '📉 Reduce unnecessary train travel',
  ],
  flight_hour: [
    '✈️ Reduce one short flight per year – saves ~90 kg CO₂',
    '🔄 Choose direct flights (takeoff/landing cause most emissions)',
    '🌳 Offset flights with certified carbon credits',
  ],
  electricity_kwh: [
    '💡 Replace all bulbs with LEDs – saves 40 kg CO₂/year',
    '🔌 Unplug devices when not in use – saves 10% on bill',
    '☀️ Install solar panels – long-term zero emissions',
  ],
  meat_meal: [
    '🌱 Go vegan one day per week – saves ~50 kg CO₂/year',
    '🥩 Reduce meat portion size by half',
    '🍽️ Choose locally sourced food – cuts transport emissions',
  ],
  veg_meal: [
    '🥗 Continue plant-based – already low impact!',
    '🌾 Avoid food waste – plan meals carefully',
  ],
  vegan_meal: [
    '🌿 Excellent! Keep it up – vegan diet has the lowest footprint',
  ],
};

export default function ActionPlan({ activities }) {
  const top = getTopContributor(activities);
  if (!top) {
    return (
      <div className="glass p-6 text-center text-gray-400">
        📝 Log some activities to get your personalized action plan.
      </div>
    );
  }
  const tips = actionMap[top.type] || ['🌍 Reduce overall consumption – every bit helps!'];
  const impact = Math.round(top.amount * 0.2); // 20% reduction potential

  return (
    <div className="glass p-6 w-full">
      <h4 className="text-xl font-bold mb-3">🌱 Your Action Plan</h4>
      <p className="text-sm opacity-80 mb-2">
        Based on your top contributor: <strong>{top.type.replace('_', ' ')}</strong> ({top.amount.toFixed(1)} kg CO₂e)
      </p>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        {tips.map((tip, i) => (
          <li key={i}>{tip}</li>
        ))}
      </ul>
      <div className="mt-3 p-2 bg-green-900/30 rounded-lg text-green-300">
        💪 If you follow these, you can save <strong>~{impact} kg CO₂e/month</strong>!
      </div>
    </div>
  );
}

ActionPlan.propTypes = {
  activities: PropTypes.array.isRequired,
};