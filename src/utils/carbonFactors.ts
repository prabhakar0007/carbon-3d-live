// src/utils/carbonFactors.ts
import { Activity, EmissionFactors } from '../types';

export const factors: EmissionFactors = {
  car_km: 0.171,
  bus_km: 0.089,
  train_km: 0.041,
  flight_hour: 90,
  electricity_kwh: 0.85,
  meat_meal: 3.2,
  veg_meal: 1.5,
  vegan_meal: 0.8,
};

export const MAX_VALUE = 10000;

export const calculateFootprint = (entries: Activity[]): number => {
  if (!Array.isArray(entries) || entries.length === 0) return 0;
  let total = 0;
  entries.forEach(entry => {
    const { type, value } = entry;
    if (typeof value === 'number' && value > 0 && factors[type]) {
      total += value * factors[type];
    }
  });
  return parseFloat(total.toFixed(2));
};

export const sanitizeValue = (value: any): number => {
  const num = parseFloat(value);
  if (isNaN(num) || num < 0) return 0;
  return Math.min(num, MAX_VALUE);
};

export const getDailyAverage = (total: number, days: number = 1): number => {
  if (days <= 0) return 0;
  return parseFloat((total / days).toFixed(2));
};

export const getTopContributor = (activities: Activity[]) => {
  if (!activities || activities.length === 0) return null;
  let max = 0;
  let topType = '';
  activities.forEach(({ type, value }) => {
    if (factors[type]) {
      const amount = value * factors[type];
      if (amount > max) {
        max = amount;
        topType = type;
      }
    }
  });
  return topType ? { type: topType, amount: max } : null;
};

export const getActivityTypes = (): string[] => Object.keys(factors);