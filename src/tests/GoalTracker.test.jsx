import { render, screen, fireEvent } from '@testing-library/react';
import GoalTracker from '../components/GoalTracker';

describe('GoalTracker', () => {
  it('shows progress bar correctly', () => {
    render(<GoalTracker current={30} goal={100} onGoalChange={() => {}} />);
    const progress = screen.getByRole('progressbar');
    expect(progress).toHaveStyle('width: 30%');
  });
});