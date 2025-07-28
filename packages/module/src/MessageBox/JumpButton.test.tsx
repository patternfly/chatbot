import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import JumpButton from './JumpButton';
import userEvent from '@testing-library/user-event';

describe('JumpButton', () => {
  it('should render top button correctly', () => {
    render(<JumpButton position="top" onClick={jest.fn()} />);
    expect(screen.getByRole('button', { name: /Back to top/i })).toBeTruthy();
  });
  it('should render bottom button correctly', () => {
    render(<JumpButton position="bottom" onClick={jest.fn()} />);
    expect(screen.getByRole('button', { name: /Back to bottom/i })).toBeTruthy();
  });
  it('should call onClick appropriately', async () => {
    const spy = jest.fn();
    render(<JumpButton position="bottom" onClick={spy} />);
    await userEvent.click(screen.getByRole('button', { name: /Back to bottom/i }));
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it('should be hidden if isHidden prop is used', async () => {
    render(<JumpButton position="bottom" onClick={jest.fn()} isHidden />);
    expect(screen.queryByRole('button', { name: /Back to bottom/i })).toBeFalsy();
  });
});
