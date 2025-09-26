import { render, screen } from '@testing-library/react';
import ChatbotFooter from './ChatbotFooter';
import '@testing-library/jest-dom';

describe('ChatbotFooter', () => {
  it('should render ChatbotFooter with children', () => {
    render(<ChatbotFooter>Chatbot Content</ChatbotFooter>);
    expect(screen.getByText('Chatbot Content')).toBeTruthy();
  });

  it('should render ChatbotFooter with custom classname', () => {
    const { container } = render(<ChatbotFooter className="custom-class">Chatbot Content</ChatbotFooter>);
    expect(container.querySelector('.custom-class')).toBeTruthy();
  });

  it('should handle isCompact', () => {
    render(
      <ChatbotFooter isCompact data-testid="footer">
        Chatbot Content
      </ChatbotFooter>
    );
    expect(screen.getByTestId('footer')).toHaveClass('pf-m-compact');
  });

  it('should handle isPrimary', () => {
    render(
      <ChatbotFooter isPrimary data-testid="footer">
        Chatbot Content
      </ChatbotFooter>
    );
    expect(screen.getByTestId('footer')).toHaveClass('pf-m-primary');
  });
});
