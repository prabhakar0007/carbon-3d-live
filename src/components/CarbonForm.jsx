import { useState } from 'react';
import { Car, Zap, Utensils, Train, Plane } from 'lucide-react';

const activityTypes = [
  { id: 'car_km', label: 'Car (km)', icon: Car, unit: 'km' },
  { id: 'bus_km', label: 'Bus (km)', icon: Train, unit: 'km' },
  { id: 'flight_hour', label: 'Flight (hours)', icon: Plane, unit: 'hrs' },
  { id: 'electricity_kwh', label: 'Electricity (kWh)', icon: Zap, unit: 'kWh' },
  { id: 'meat_meal', label: 'Non-veg meals', icon: Utensils, unit: 'meals' },
];

export default function CarbonForm({ onAddEntry }) {
  const [selected, setSelected] = useState('car_km');
  const [value, setValue] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value <= 0) return;
    onAddEntry({ type: selected, value: parseFloat(value) });
    setValue(0);
  };

  return (
    <div className="glass p-6 w-full max-w-md">
      <h3 className="text-2xl font-bold mb-4">➕ Log Activity</h3>
      <div className="flex flex-wrap gap-2 mb-4">
        {activityTypes.map((act) => (
          <button
            key={act.id}
            onClick={() => setSelected(act.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
              selected === act.id ? 'bg-green-600 text-white' : 'bg-gray-800/50 text-gray-300'
            }`}
          >
            <act.icon size={18} /> {act.label}
          </button>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm opacity-80">Value ({activityTypes.find(a=>a.id===selected)?.unit})</label>
          <input
            type="number"
            step="0.1"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full bg-gray-900/70 border border-gray-600 rounded-xl px-4 py-2 text-white"
            required
          />
        </div>
        <button type="submit" className="w-full bg-green-600 hover:bg-green-500 py-3 rounded-xl font-semibold transition">
          + Add & Calculate
        </button>
      </form>
    </div>
  );
}