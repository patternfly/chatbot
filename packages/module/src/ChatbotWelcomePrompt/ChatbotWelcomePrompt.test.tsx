import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatbotWelcomePrompt from './ChatbotWelcomePrompt';
import userEvent from '@testing-library/user-event';

describe('ChatbotWelcomePrompt', () => {
  it('should render welcome prompt', () => {
    const { container } = render(
      <ChatbotWelcomePrompt title="Hi, ChatBot User!" description="How can I help you today?" />
    );
    expect(container).toMatchSnapshot();
  });

  it('should render correctly', () => {
    render(<ChatbotWelcomePrompt title="Hi, ChatBot User!" description="How can I help you today?" />);
    expect(screen.getByText('Hi, ChatBot User!')).toBeTruthy();
    expect(screen.getByText('How can I help you today?')).toBeTruthy();
  });
  it('should render prompts with titles correctly', () => {
    render(
      <ChatbotWelcomePrompt
        title="Hi, ChatBot User!"
        description="How can I help you today?"
        prompts={[{ title: 'Set up account' }]}
      />
    );
    expect(screen.getByText('Set up account')).toBeTruthy();
  });
  it('should render prompts with messages correctly', () => {
    render(
      <ChatbotWelcomePrompt
        title="Hi, ChatBot User!"
        description="How can I help you today?"
        prompts={[
          { title: 'Set up account', message: 'Choose the necessary settings and preferences for your account.' }
        ]}
      />
    );
    expect(screen.getByText('Choose the necessary settings and preferences for your account.')).toBeTruthy();
  });
  it('should render prompts with onClick correctly', async () => {
    const spy = jest.fn();
    render(
      <ChatbotWelcomePrompt
        title="Hi, ChatBot User!"
        description="How can I help you today?"
        prompts={[
          {
            title: 'Set up account',
            message: 'Choose the necessary settings and preferences for your account.',
            onClick: spy
          }
        ]}
      />
    );
    await userEvent.click(screen.getByRole('button', { name: /Set up account/i }));
    expect(spy).toHaveBeenCalled();
  });
  it('should apply className appropriately', () => {
    render(
      <ChatbotWelcomePrompt
        title="Hi, ChatBot User!"
        description="How can I help you today?"
        className="test"
        testId="welcome-prompt"
      />
    );
    const element = screen.getByTestId('welcome-prompt');
    expect(element).toHaveClass('test');
  });
});
