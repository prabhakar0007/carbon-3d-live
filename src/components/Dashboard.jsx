// src/components/Dashboard.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import CarbonForm from './CarbonForm';
import FootprintChart from './FootprintChart';
import Insights from './Insights';
import GoalTracker from './GoalTracker';
import Leaderboard from './Leaderboard';
import ShareButton from './ShareButton';
import ActionPlan from './ActionPlan';
import GlobalComparison from './GlobalComparison';
import DataPicker from './DataPicker';
import Earth3D from './Earth3D';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { calculateFootprint } from '../utils/carbonFactors';

export default function Dashboard() {
  const [activities, setActivities] = useLocalStorage('carbon_activities', []);
  const [total, setTotal] = useState(0);
  const [goal, setGoal] = useLocalStorage('carbon_goal', 100);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Memoize footprint calculation
  const footprint = useMemo(() => calculateFootprint(activities), [activities]);

  // Update total when footprint changes
  useEffect(() => {
    setTotal(footprint);
  }, [footprint]);

  // Weekly chart data (mocked for demo)
  const weeklyData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const todayIdx = new Date().getDay();
    return days.map((day, i) => ({
      day,
      co2: i === todayIdx ? footprint : Math.floor(Math.random() * 50) + 10, // mock
    }));
  }, [footprint]);

  // Add entry with date
  const addEntry = useCallback((entry) => {
    setActivities(prev => [...prev, { ...entry, date: selectedDate }]);
  }, [selectedDate, setActivities]);

  return (
    <div className="min-h-screen p-6 flex flex-col gap-6" role="main" aria-labelledby="main-title">
      <h1 id="main-title" className="text-5xl font-extrabold text-center bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
        Carbon3D Tracker
      </h1>

      <Earth3D footprintTotal={total} />

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full max-w-md">
          <DataPicker onDateChange={setSelectedDate} />
          <CarbonForm onAddEntry={addEntry} />
        </div>

        <div className="flex-1 space-y-4">
          <div className="glass p-6 text-center">
            <p className="text-sm uppercase tracking-wider">Your total footprint</p>
            <p className="text-6xl font-black text-green-400" role="status" aria-live="polite">
              {total} <span className="text-xl">kg CO₂e</span>
            </p>
            <GoalTracker current={total} goal={goal} onGoalChange={setGoal} />
            <ShareButton total={total} />
            <GlobalComparison total={total} days={activities.length || 1} />
          </div>

          <Insights footprintTotal={total} activities={activities} />
          <ActionPlan activities={activities} />
          <Leaderboard currentUserScore={total} />
          <FootprintChart data={weeklyData} />
        </div>
      </div>
    </div>
  );
}