import { useState, useEffect } from 'react';
import Earth3D from './Earth3D';
import CarbonForm from './CarbonForm';
import FootprintChart from './FootprintChart';
import Insights from './insights';
import { calculateFootprint } from '../utils/carbonFactors';

export default function Dashboard() {
  const [activities, setActivities] = useState([]);
  const [total, setTotal] = useState(0);
  const [weeklyData, setWeeklyData] = useState([
    { day: 'Mon', co2: 0 }, { day: 'Tue', co2: 0 }, { day: 'Wed', co2: 0 },
    { day: 'Thu', co2: 0 }, { day: 'Fri', co2: 0 }, { day: 'Sat', co2: 0 }, { day: 'Sun', co2: 0 }
  ]);

  useEffect(() => {
    const saved = localStorage.getItem('carbon_activities');
    if (saved) {
      const parsed = JSON.parse(saved);
      setActivities(parsed);
      setTotal(calculateFootprint(parsed));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('carbon_activities', JSON.stringify(activities));
    setTotal(calculateFootprint(activities));
    // update weekly demo data (mock trend)
    const todayIdx = new Date().getDay();
    setWeeklyData(prev => prev.map((day, i) => 
      i === todayIdx ? { ...day, co2: calculateFootprint(activities) } : day
    ));
  }, [activities]);

  const addEntry = (entry) => {
    setActivities([...activities, entry]);
  };

  return (
    <div className="min-h-screen p-6 flex flex-col gap-6">
      <h1 className="text-5xl font-extrabold text-center bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
        Carbon3D Tracker
      </h1>
      <Earth3D footprintTotal={total} />
      <div className="flex flex-col lg:flex-row gap-6">
        <CarbonForm onAddEntry={addEntry} />
        <div className="flex-1 space-y-4">
          <div className="glass p-6 text-center">
            <p className="text-sm uppercase tracking-wider">Your total footprint</p>
            <p className="text-6xl font-black text-green-400">{total} <span className="text-xl">kg CO₂e</span></p>
          </div>
          <Insights footprintTotal={total} />
          <FootprintChart data={weeklyData} />
        </div>
      </div>
    </div>
  );
}