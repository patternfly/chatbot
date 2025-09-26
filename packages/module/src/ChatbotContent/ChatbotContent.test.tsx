import { render, screen } from '@testing-library/react';
import ChatbotContent from './ChatbotContent';

describe('ChatbotContent', () => {
  it('should render ChatbotContent with children', () => {
    render(<ChatbotContent>Chatbot Content</ChatbotContent>);
    expect(screen.getByText('Chatbot Content')).toBeTruthy();
  });

  it('should render ChatbotContent with custom classname', () => {
    const { container } = render(<ChatbotContent className="custom-class">Chatbot Content</ChatbotContent>);
    expect(container.querySelector('.custom-class')).toBeTruthy();
  });

  it('should render ChatbotContent with primary class', () => {
    const { container } = render(<ChatbotContent isPrimary>Chatbot Content</ChatbotContent>);
    expect(container.querySelector('.pf-m-primary')).toBeTruthy();
  });
});
