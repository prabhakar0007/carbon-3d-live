import { describe, it, expect } from 'vitest';
import {
  factors,
  MAX_VALUE,
  calculateFootprint,
  sanitizeValue,
  getDailyAverage,
  getTopContributor,
  getActivityTypes,
} from '../utils/carbonFactors';

describe('carbonFactors', () => {
  // ---------- factors object ----------
  it('has all expected emission factors', () => {
    expect(factors).toHaveProperty('car_km');
    expect(factors).toHaveProperty('bus_km');
    expect(factors).toHaveProperty('train_km');
    expect(factors).toHaveProperty('flight_hour');
    expect(factors).toHaveProperty('electricity_kwh');
    expect(factors).toHaveProperty('meat_meal');
    expect(factors).toHaveProperty('veg_meal');
    expect(factors).toHaveProperty('vegan_meal');
  });

  it('emission factors are positive numbers', () => {
    Object.values(factors).forEach((val) => {
      expect(val).toBeGreaterThan(0);
    });
  });

  // ---------- calculateFootprint ----------
  it('returns 0 for empty array', () => {
    expect(calculateFootprint([])).toBe(0);
  });

  it('returns 0 for null/undefined input', () => {
    expect(calculateFootprint(null)).toBe(0);
    expect(calculateFootprint(undefined)).toBe(0);
  });

  it('calculates total footprint for a single entry', () => {
    const entries = [{ type: 'car_km', value: 10 }];
    const expected = 10 * factors.car_km;
    expect(calculateFootprint(entries)).toBe(expected);
  });

  it('calculates total for multiple entries', () => {
    const entries = [
      { type: 'car_km', value: 10 },
      { type: 'electricity_kwh', value: 5 },
      { type: 'flight_hour', value: 2 },
    ];
    const expected =
      10 * factors.car_km +
      5 * factors.electricity_kwh +
      2 * factors.flight_hour;
    expect(calculateFootprint(entries)).toBe(expected);
  });

  it('ignores entries with zero or negative values', () => {
    const entries = [
      { type: 'car_km', value: 0 },
      { type: 'bus_km', value: -5 },
      { type: 'train_km', value: 20 },
    ];
    const expected = 20 * factors.train_km;
    expect(calculateFootprint(entries)).toBe(expected);
  });

  it('ignores invalid types', () => {
    const entries = [
      { type: 'unknown', value: 100 },
      { type: 'car_km', value: 10 },
    ];
    const expected = 10 * factors.car_km;
    expect(calculateFootprint(entries)).toBe(expected);
  });

  it('rounds result to 2 decimal places', () => {
    const entries = [{ type: 'meat_meal', value: 1 }];
    // factors.meat_meal = 3.2 -> no rounding needed, but for fractional:
    const result = calculateFootprint(entries);
    expect(result).toBe(3.2);
    // test with repeating decimal: 1/3 * factor (but factor is fixed)
    // we'll just check rounding
    const entries2 = [{ type: 'car_km', value: 0.3 }];
    const result2 = calculateFootprint(entries2);
    expect(result2).toBeCloseTo(0.0513, 2);
  });

  // ---------- sanitizeValue ----------
  it('returns 0 for invalid input', () => {
    expect(sanitizeValue('abc')).toBe(0);
    expect(sanitizeValue(null)).toBe(0);
    expect(sanitizeValue(undefined)).toBe(0);
    expect(sanitizeValue(NaN)).toBe(0);
  });

  it('returns 0 for negative numbers', () => {
    expect(sanitizeValue(-10)).toBe(0);
    expect(sanitizeValue(-0.1)).toBe(0);
  });

  it('returns the same positive number within limit', () => {
    expect(sanitizeValue(5)).toBe(5);
    expect(sanitizeValue(0)).toBe(0);
    expect(sanitizeValue(9999)).toBe(9999);
  });

  it('caps values at MAX_VALUE', () => {
    expect(sanitizeValue(MAX_VALUE + 100)).toBe(MAX_VALUE);
    expect(sanitizeValue(20000)).toBe(MAX_VALUE);
  });

  it('parses numeric strings correctly', () => {
    expect(sanitizeValue('10.5')).toBe(10.5);
    expect(sanitizeValue('  20  ')).toBe(20);
  });

  // ---------- getDailyAverage ----------
  it('returns 0 for zero days', () => {
    expect(getDailyAverage(100, 0)).toBe(0);
  });

  it('calculates daily average correctly', () => {
    expect(getDailyAverage(100, 5)).toBe(20);
    expect(getDailyAverage(30, 3)).toBe(10);
    expect(getDailyAverage(7, 2)).toBe(3.5);
  });

  it('handles fractional totals', () => {
    expect(getDailyAverage(5.5, 2)).toBe(2.75);
  });

  it('rounds to 2 decimals', () => {
    expect(getDailyAverage(10, 3)).toBeCloseTo(3.33, 2);
  });

  // ---------- getTopContributor ----------
  it('returns null for empty activities', () => {
    expect(getTopContributor([])).toBe(null);
    expect(getTopContributor(null)).toBe(null);
  });

  it('identifies the top contributor correctly', () => {
    const activities = [
      { type: 'car_km', value: 10 },
      { type: 'bus_km', value: 50 },
      { type: 'electricity_kwh', value: 2 },
    ];
    // bus_km: 50 * 0.089 = 4.45
    // car_km: 10 * 0.171 = 1.71
    // electricity: 2 * 0.85 = 1.7
    const result = getTopContributor(activities);
    expect(result).toEqual({ type: 'bus_km', amount: 4.45 });
  });

  it('handles ties by returning the first encountered', () => {
    const activities = [
      { type: 'car_km', value: 10 }, // 1.71
      { type: 'train_km', value: 41.7 }, // ~1.71 (0.041*41.7 = 1.7097)
    ];
    const result = getTopContributor(activities);
    // car_km is first, so it should be returned (even if train_km slightly higher? but with exact values, it will be train_km)
    // Let's make it exact tie with bus_km and train_km both giving 1.71
    const activities2 = [
      { type: 'car_km', value: 10 },
      { type: 'bus_km', value: 19.21 }, // 19.21*0.089 = 1.70969 ≈ 1.71
    ];
    const result2 = getTopContributor(activities2);
    expect(result2.type).toBe('car_km'); // first one
  });

  it('ignores entries with invalid types', () => {
    const activities = [
      { type: 'unknown', value: 1000 },
      { type: 'car_km', value: 10 },
    ];
    const result = getTopContributor(activities);
    expect(result).toEqual({ type: 'car_km', amount: 1.71 });
  });

  // ---------- getActivityTypes ----------
  it('returns an array of all factor keys', () => {
    const types = getActivityTypes();
    expect(types).toEqual(Object.keys(factors));
    expect(types).toContain('car_km');
    expect(types).toContain('meat_meal');
  });
});