import { render, screen } from '@testing-library/react';
import Leaderboard from '../components/Leaderboard';

describe('Leaderboard', () => {
  it('displays current user in leaderboard', () => {
    render(<Leaderboard currentUserScore={50} />);
    expect(screen.getByText('You')).toBeInTheDocument();
    expect(screen.getByText('50 kg')).toBeInTheDocument();
  });
});