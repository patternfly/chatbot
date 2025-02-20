import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChatbotDisplayMode } from '../Chatbot/Chatbot';
import ChatbotHeaderTitle from './ChatbotHeaderTitle';

describe('ChatbotHeaderTitle', () => {
  it('should render ChatbotHeaderTitle with children', () => {
    render(<ChatbotHeaderTitle>Chatbot Header Title</ChatbotHeaderTitle>);
    expect(screen.getByText('Chatbot Header Title')).toBeTruthy();
  });

  it('should render ChatbotHeaderTitle with custom classname', () => {
    const { container } = render(
      <ChatbotHeaderTitle className="custom-header-class">Chatbot Header Title</ChatbotHeaderTitle>
    );
    expect(container.querySelector('.custom-header-class')).toBeTruthy();
  });

  it('should render title for default display mode', () => {
    render(<ChatbotHeaderTitle displayMode={ChatbotDisplayMode.default} showOnDefault="Default header title" />);
    expect(screen.getByText('Default header title')).toBeTruthy();
  });

  it('should render title for docked display mode', () => {
    render(<ChatbotHeaderTitle displayMode={ChatbotDisplayMode.docked} showOnDocked="Docked header title" />);
    expect(screen.getByText('Docked header title')).toBeTruthy();
  });

  it('should fallback to default title when docked display mode title is not configured', () => {
    render(<ChatbotHeaderTitle displayMode={ChatbotDisplayMode.docked} showOnDefault="Default header title" />);
    expect(screen.getByText('Default header title')).toBeTruthy();
  });

  it('should render title for embedded display mode', () => {
    render(<ChatbotHeaderTitle displayMode={ChatbotDisplayMode.embedded} showOnEmbedded="Embedded header title" />);
    expect(screen.getByText('Embedded header title')).toBeTruthy();
  });

  it('should fallback to default title when embedded display mode title is not configured', () => {
    render(<ChatbotHeaderTitle displayMode={ChatbotDisplayMode.embedded} showOnDefault="Default header title" />);
    expect(screen.getByText('Default header title')).toBeTruthy();
  });

  it('should render title for fullscreen display mode', () => {
    render(
      <ChatbotHeaderTitle
        displayMode={ChatbotDisplayMode.fullscreen}
        showOnFullScreen="Fullscreen header title"
        className="custom-header-class"
      />
    );
    expect(screen.getByText('Fullscreen header title')).toBeTruthy();
  });

  it('should fallback to default title when fullscreen display mode title is not configured', () => {
    render(<ChatbotHeaderTitle displayMode={ChatbotDisplayMode.fullscreen} showOnDefault="Default header title" />);
    expect(screen.getByText('Default header title')).toBeTruthy();
  });

  it('should render title for drawer display mode', () => {
    render(
      <ChatbotHeaderTitle
        displayMode={ChatbotDisplayMode.drawer}
        showOnDrawer="Drawer header title"
        className="custom-header-class"
      />
    );
    expect(screen.getByText('Drawer header title')).toBeTruthy();
  });

  it('should fallback to default title when drawer display mode title is not configured', () => {
    render(<ChatbotHeaderTitle displayMode={ChatbotDisplayMode.drawer} showOnDefault="Default header title" />);
    expect(screen.getByText('Default header title')).toBeTruthy();
  });
});
