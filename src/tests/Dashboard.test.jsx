import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Dashboard from '../components/Dashboard';

describe('Dashboard Integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('loads saved activities from localStorage', () => {
    const activities = [{ type: 'car_km', value: 10 }];
    localStorage.setItem('carbon_activities', JSON.stringify(activities));
    render(<Dashboard />);
    expect(screen.getByText('1.71 kg CO₂e')).toBeInTheDocument(); // 10*0.171=1.71
  });

  it('adds new activity and updates total', async () => {
    render(<Dashboard />);
    const input = screen.getByLabelText(/value/i);
    fireEvent.change(input, { target: { value: '5' } });
    const addBtn = screen.getByText(/add & calculate/i);
    fireEvent.click(addBtn);
    await waitFor(() => {
      expect(screen.getByText(/0.85 kg CO₂e/)).toBeInTheDocument(); // 5*0.171=0.855
    });
  });

  it('updates goal and persists', () => {
    render(<Dashboard />);
    const changeGoalBtn = screen.getByText('Change');
    fireEvent.click(changeGoalBtn);
    const goalInput = screen.getByDisplayValue('100');
    fireEvent.change(goalInput, { target: { value: '50' } });
    const saveBtn = screen.getByText('Save');
    fireEvent.click(saveBtn);
    expect(localStorage.getItem('carbon_goal')).toBe('50');
  });
});