import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Chatbot from './Chatbot';

describe('Chatbot', () => {
  it('should render Chatbot with default display mode', () => {
    render(<Chatbot>Chatbot Content</Chatbot>);
    expect(screen.getByText('Chatbot Content')).toBeTruthy();
  });

  it('should render Chatbot with custom ariaLabel', () => {
    render(<Chatbot ariaLabel="Chatbot">Chatbot Content</Chatbot>);
    expect(screen.getByLabelText('Chatbot')).toBeTruthy();
  });

  it('should render Chatbot with custom className', () => {
    const { container } = render(
      <Chatbot ariaLabel="Chatbot" className="custom-class">
        Chatbot Content
      </Chatbot>
    );
    const chatbotElement = container.querySelector('.custom-class');
    expect(chatbotElement).toBeInTheDocument();
  });

  it('should not render Chatbot', () => {
    render(<Chatbot isVisible={false}>Chatbot Content</Chatbot>);
    expect(screen.queryByLabelText('Chatbot')).toBeFalsy();
  });

  it('should handle isCompact', () => {
    render(
      <Chatbot data-testid="chatbot" isVisible={true} isCompact>
        Chatbot Content
      </Chatbot>
    );
    expect(screen.getByTestId('chatbot')).toHaveClass('pf-m-compact');
  });

  it('should render docked navigation and apply the docked navigation class', () => {
    render(
      <Chatbot data-testid="chatbot" dockedNav={<nav aria-label="Chatbot navigation">Navigation</nav>}>
        Chatbot Content
      </Chatbot>
    );

    expect(screen.getByTestId('chatbot')).toHaveClass('pf-chatbot--docked-nav');
    expect(screen.getByRole('navigation', { name: 'Chatbot navigation' })).toBeInTheDocument();
  });
});
