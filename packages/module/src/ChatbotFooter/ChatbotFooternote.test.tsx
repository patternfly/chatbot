import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import ChatbotFootnote from './ChatbotFootnote';

const POPOVER_CLOSE_ERROR =
  'ChatbotFootnote: You must provide either the popover.cta or popover.showClose props in order to render a button that can close the popover.';

describe('ChatbotFooternote', () => {
  const onClick = jest.fn();
  const popoverProps = {
    title: 'Verify accuracy',
    description: 'description',
    bannerImage: {
      src: 'src',
      alt: 'alt'
    },
    cta: {
      label: 'Got it',
      onClick
    },
    link: {
      label: 'label',
      url: 'url'
    }
  };

  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(jest.fn());
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should render ChatbotFooternote', () => {
    render(<ChatbotFootnote label="Chatbot footer" />);
    expect(screen.getByText('Chatbot footer')).toBeTruthy();
  });

  it('should not log a console error when no popover is provided', () => {
    render(<ChatbotFootnote label="Chatbot footer" />);
    expect(consoleErrorSpy).not.toHaveBeenCalledWith(POPOVER_CLOSE_ERROR);
  });

  it('should not log a console error when popover has a cta', () => {
    render(<ChatbotFootnote label="Chatbot footer" popover={popoverProps} />);
    expect(consoleErrorSpy).not.toHaveBeenCalledWith(POPOVER_CLOSE_ERROR);
  });

  it('should not log a console error when popover has showClose', () => {
    render(
      <ChatbotFootnote
        label="Chatbot footer"
        popover={{
          title: 'Verify accuracy',
          description: 'description',
          showClose: true
        }}
      />
    );
    expect(consoleErrorSpy).not.toHaveBeenCalledWith(POPOVER_CLOSE_ERROR);
  });

  it('should log a console error when popover is provided without cta or showClose', () => {
    render(
      <ChatbotFootnote
        label="Chatbot footer"
        popover={{
          title: 'Verify accuracy',
          description: 'description'
        }}
      />
    );
    expect(consoleErrorSpy).toHaveBeenCalledWith(POPOVER_CLOSE_ERROR);
  });

  it('should render ChatbotFooternote with popover', async () => {
    render(<ChatbotFootnote label="Chatbot footer" popover={popoverProps} />);

    // click on the footer button
    act(() => {
      fireEvent.click(screen.getByRole('button'));
    });

    await waitFor(() => {
      // Check if the popover is visible and click on the cta button
      screen.getByLabelText('More information');
      screen.getByText('Verify accuracy');
      fireEvent.click(screen.getByRole('button', { name: 'Got it' }));
      expect(onClick).toHaveBeenCalled();
    });
  });
  it('should call onClick handler when popover cta button is clicked', async () => {
    render(<ChatbotFootnote label="Chatbot footer" popover={popoverProps} />);

    // click on the footer button
    act(() => {
      fireEvent.click(screen.getByRole('button'));
    });

    await waitFor(() => {
      // Check if the popover is visible and click on the cta button
      screen.getByLabelText('More information');
      screen.getByText('Verify accuracy');
      fireEvent.click(screen.getByRole('button', { name: 'Got it' }));
      expect(onClick).toHaveBeenCalled();
    });
  });
  it('should close the popover when escape is pressed', async () => {
    render(<ChatbotFootnote label="Chatbot footer" popover={popoverProps} />);

    // click on the footer button
    act(() => {
      fireEvent.click(screen.getByRole('button'));
    });

    await waitFor(() => {
      // Check if the popover is visible and click on the cta button
      screen.getByLabelText('More information');
      screen.getByText('Verify accuracy');
    });

    act(() => {
      // trigger escape to close the popover
      fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    });

    await waitFor(() => {
      expect(screen.queryByText('Verify accuracy')).toBeFalsy();
    });
  });
});
