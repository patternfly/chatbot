import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import ChatbotToggle from './ChatbotToggle';

describe('ChatbotToggle', () => {
  it('should render tooltipLabel correctly', async () => {
    render(<ChatbotToggle tooltipLabel="Tooltip" />);
    await userEvent.click(screen.getByRole('button', { name: /Tooltip toggle/i }));
    expect(screen.getByRole('tooltip', { name: /Tooltip/i })).toBeTruthy();
  });
  it('should render toggleButtonLabel correctly', async () => {
    render(<ChatbotToggle tooltipLabel="Chatbot" toggleButtonLabel="Button" />);
    expect(screen.getByRole('button', { name: /Button/i })).toBeTruthy();
  });
  it('should call onToggleChatbot when clicked', async () => {
    const spy = jest.fn();
    render(<ChatbotToggle tooltipLabel="Chatbot" onToggleChatbot={spy} />);
    await userEvent.click(screen.getByRole('button'));
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it('should handle isChatbotVisible correctly when true', () => {
    render(<ChatbotToggle tooltipLabel="Chatbot" isChatbotVisible openIconTestId="Open" />);
    expect(screen.getByRole('button')).toHaveClass('pf-chatbot__button');
    expect(screen.getByRole('button')).toHaveClass('pf-chatbot__button--active');
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByTestId('Open')).toBeTruthy();
  });
  it('should handle isChatbotVisible correctly when false', () => {
    render(<ChatbotToggle tooltipLabel="Chatbot" isChatbotVisible={false} openIconTestId="Open" />);
    expect(screen.getByRole('button')).toHaveClass('pf-chatbot__button');
    expect(screen.getByRole('button')).not.toHaveClass('pf-chatbot__button--active');
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByTestId('Open')).toBeFalsy();
  });
  it('should handle isRound correctly', () => {
    render(<ChatbotToggle tooltipLabel="Chatbot" isRound />);
    expect(screen.getByRole('button')).toHaveClass('pf-chatbot__button');
    expect(screen.getByRole('button')).toHaveClass('pf-chatbot__button--round');
  });
  it('should handle className correctly', () => {
    render(<ChatbotToggle tooltipLabel="Chatbot" className="test" />);
    expect(screen.getByRole('button')).toHaveClass('pf-chatbot__button');
    expect(screen.getByRole('button')).toHaveClass('test');
  });
  it('should handle colorVariant secondary correctly', () => {
    render(<ChatbotToggle tooltipLabel="Chatbot" colorVariant="secondary" />);
    expect(screen.getByRole('button')).toHaveClass('pf-chatbot__button--secondary');
  });
});
