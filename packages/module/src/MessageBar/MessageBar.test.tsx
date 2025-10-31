import '@testing-library/jest-dom';
import {
  DropdownGroup,
  DropdownItem,
  DropdownList,
  MenuSearchInputProps,
  MenuSearchProps
} from '@patternfly/react-core';
import { BellIcon, CalendarAltIcon, ClipboardIcon, CodeIcon } from '@patternfly/react-icons';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import SourceDetailsMenuItem from '../SourceDetailsMenuItem';
import { MessageBar } from './MessageBar';

const ATTACH_MENU_ITEMS = [
  <DropdownList key="list-1">
    <DropdownItem className="pf-chatbot-source-details-dropdown-item" value="auth-operator Pod" id="0">
      <SourceDetailsMenuItem
        icon={
          <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 12.5C0 5.87258 5.37258 0.5 12 0.5C18.6274 0.5 24 5.87258 24 12.5C24 19.1274 18.6274 24.5 12 24.5C5.37258 24.5 0 19.1274 0 12.5Z"
              fill="currentColor"
            />
            <g clipPath="url(#clip0_3280_27488)">
              <path
                d="M8.25 8.75C8.25 7.92266 8.92266 7.25 9.75 7.25H12C14.0719 7.25 15.75 8.92812 15.75 11C15.75 13.0719 14.0719 14.75 12 14.75H9.75V17C9.75 17.4148 9.41484 17.75 9 17.75C8.58516 17.75 8.25 17.4148 8.25 17V14V8.75ZM9.75 13.25H12C13.2422 13.25 14.25 12.2422 14.25 11C14.25 9.75781 13.2422 8.75 12 8.75H9.75V13.25Z"
                fill="white"
              />
            </g>
            <defs>
              <clipPath id="clip0_3280_27488">
                <rect width="7.5" height="12" fill="white" transform="translate(8.25 6.5)" />
              </clipPath>
            </defs>
          </svg>
        }
        name="auth-operator"
        type="Pod"
      />
    </DropdownItem>
  </DropdownList>,
  <DropdownGroup key="group2">
    <DropdownList>
      <DropdownItem value="Alerts" id="1" icon={<BellIcon />}>
        Alerts
      </DropdownItem>
      <DropdownItem value="Events" id="2" icon={<CalendarAltIcon />}>
        Events
      </DropdownItem>
      <DropdownItem value="Logs" id="3" icon={<ClipboardIcon />}>
        Logs
      </DropdownItem>
      <DropdownItem value="YAML - Status" id="4" icon={<CodeIcon />}>
        YAML - Status
      </DropdownItem>
      <DropdownItem value="YAML - All contents" id="5" icon={<CodeIcon />}>
        YAML - All contents
      </DropdownItem>
    </DropdownList>
  </DropdownGroup>
];

const originalSpeechRecognition = window.SpeechRecognition;

const mockSpeechRecognition = () => {
  const MockSpeechRecognition = jest.fn().mockImplementation(() => ({
    start: jest.fn(),
    stop: jest.fn()
  }));
  (MockSpeechRecognition as any).prototype = {};
  window.SpeechRecognition = MockSpeechRecognition as any;
};

describe('Message bar', () => {
  afterAll(() => {
    window.SpeechRecognition = originalSpeechRecognition;
  });
  it('should render correctly', () => {
    render(<MessageBar onSendMessage={jest.fn} />);
    expect(screen.getByRole('button', { name: 'Attach' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Send' })).toBeFalsy();
    expect(screen.queryByRole('button', { name: 'Use microphone' })).toBeFalsy();
    expect(screen.getByRole('textbox', { name: /Send a message.../i })).toBeTruthy();
  });
  it('can send via enter key', async () => {
    const spy = jest.fn();
    render(<MessageBar onSendMessage={spy} />);
    const input = screen.getByRole('textbox', { name: /Send a message.../i });
    await userEvent.type(input, 'Hello world');
    expect(input).toHaveTextContent('Hello world');
    await userEvent.type(input, '[Enter]');
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it('calls onChange callback appropriately', async () => {
    const spy = jest.fn();
    render(<MessageBar onSendMessage={jest.fn} onChange={spy} />);
    const input = screen.getByRole('textbox', { name: /Send a message.../i });
    await userEvent.type(input, 'A');
    expect(input).toHaveTextContent('A');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(expect.any(Object), 'A');
  });
  it('can use specified placeholder text', async () => {
    render(<MessageBar onSendMessage={jest.fn} placeholder="test placeholder" />);
    const input = screen.getByRole('textbox', { name: /test placeholder/i });
    await userEvent.type(input, 'Hello world');
    expect(input).toHaveTextContent('Hello world');
  });

  // Send button
  // --------------------------------------------------------------------------
  it('shows send button when text is input', async () => {
    render(<MessageBar onSendMessage={jest.fn} />);
    const input = screen.getByRole('textbox', { name: /Send a message.../i });
    await userEvent.type(input, 'Hello world');
    expect(input).toHaveTextContent('Hello world');
    expect(screen.getByRole('button', { name: 'Send' })).toBeTruthy();
  });
  it('can disable send button shown when text is input', async () => {
    render(<MessageBar onSendMessage={jest.fn} isSendButtonDisabled />);
    const input = screen.getByRole('textbox', { name: /Send a message.../i });
    await userEvent.type(input, 'Hello world');
    expect(input).toHaveTextContent('Hello world');
    expect(screen.getByRole('button', { name: 'Send' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled();
  });
  it('can click send button', async () => {
    const spy = jest.fn();
    render(<MessageBar onSendMessage={spy} />);
    const input = screen.getByRole('textbox', { name: /Send a message.../i });
    await userEvent.type(input, 'Hello world');
    expect(input).toHaveTextContent('Hello world');
    const sendButton = screen.getByRole('button', { name: 'Send' });
    expect(sendButton).toBeTruthy();
    await userEvent.click(sendButton);
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it('can always show send button', () => {
    render(<MessageBar onSendMessage={jest.fn} alwayShowSendButton />);
    expect(screen.getByRole('button', { name: 'Send' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Send' })).toBeEnabled();
  });
  it('can disable send button if always showing', () => {
    render(<MessageBar onSendMessage={jest.fn} alwayShowSendButton isSendButtonDisabled />);
    expect(screen.getByRole('button', { name: 'Send' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled();
  });
  it('can handle buttonProps tooltipContent  appropriately for send', async () => {
    render(
      <MessageBar onSendMessage={jest.fn} alwayShowSendButton buttonProps={{ send: { tooltipContent: 'Test' } }} />
    );
    await userEvent.click(screen.getByRole('button', { name: 'Send' }));
    expect(screen.getByRole('tooltip', { name: 'Test' })).toBeTruthy();
  });
  it('can handle buttonProps tooltipProps  appropriately for send', () => {
    render(
      <MessageBar
        onSendMessage={jest.fn}
        alwayShowSendButton
        buttonProps={{ send: { tooltipProps: { isVisible: true } } }}
      />
    );
    // isVisible, so no need for click
    expect(screen.getByRole('tooltip', { name: 'Send' })).toBeTruthy();
  });
  it('can handle buttonProps props appropriately for send', async () => {
    render(
      <MessageBar
        onSendMessage={jest.fn}
        alwayShowSendButton
        buttonProps={{ send: { props: { 'aria-label': 'Test' } } }}
      />
    );
    await userEvent.click(screen.getByRole('button', { name: 'Test' }));
  });

  // Attach button
  // --------------------------------------------------------------------------
  it('can show attach menu', async () => {
    render(
      <MessageBar
        onSendMessage={jest.fn}
        attachMenuProps={{
          isAttachMenuOpen: true,
          setIsAttachMenuOpen: jest.fn(),
          onAttachMenuToggleClick: jest.fn(),
          onAttachMenuInputChange: jest.fn(),
          attachMenuItems: ATTACH_MENU_ITEMS
        }}
      />
    );
    expect(screen.getByRole('textbox', { name: /Filter menu items/i })).toBeTruthy();
    expect(screen.getByRole('menuitem', { name: /auth-operator/i })).toBeTruthy();
    expect(screen.getByRole('menuitem', { name: /Alerts/i })).toBeTruthy();
    expect(screen.getByRole('menuitem', { name: /Events/i })).toBeTruthy();
    expect(screen.getByRole('menuitem', { name: /Logs/i })).toBeTruthy();
    expect(screen.getByRole('menuitem', { name: /YAML - Status/i })).toBeTruthy();
    expect(screen.getByRole('menuitem', { name: /YAML - All contents/i })).toBeTruthy();
  });
  it('can toggle attach menu', async () => {
    const attachToggleClickSpy = jest.fn();
    render(
      <MessageBar
        onSendMessage={jest.fn}
        attachMenuProps={{
          isAttachMenuOpen: false,
          setIsAttachMenuOpen: jest.fn(),
          onAttachMenuToggleClick: attachToggleClickSpy,
          onAttachMenuInputChange: jest.fn(),
          attachMenuItems: ATTACH_MENU_ITEMS
        }}
      />
    );
    expect(screen.queryByRole('textbox', { name: /Filter menu items/i })).toBeFalsy();
    expect(screen.queryByRole('menuitem', { name: /auth-operator/i })).toBeFalsy();
    expect(screen.queryByRole('menuitem', { name: /Alerts/i })).toBeFalsy();
    expect(screen.queryByRole('menuitem', { name: /Events/i })).toBeFalsy();
    expect(screen.queryByRole('menuitem', { name: /Logs/i })).toBeFalsy();
    expect(screen.queryByRole('menuitem', { name: /YAML - Status/i })).toBeFalsy();
    expect(screen.queryByRole('menuitem', { name: /YAML - All contents/i })).toBeFalsy();
    const attachButton = screen.getByRole('button', { name: 'Attach' });
    await userEvent.click(attachButton);
    expect(attachToggleClickSpy).toHaveBeenCalledTimes(1);
  });
  it('can pass searchInputProps to search input in AttachMenu', () => {
    render(
      <MessageBar
        onSendMessage={jest.fn}
        value="test"
        attachMenuProps={{
          isAttachMenuOpen: true,
          setIsAttachMenuOpen: jest.fn(),
          onAttachMenuToggleClick: jest.fn(),
          onAttachMenuInputChange: jest.fn(),
          attachMenuItems: ATTACH_MENU_ITEMS,
          searchInputProps: { isDisabled: true }
        }}
      />
    );
    expect(screen.getByRole('textbox', { name: /Filter menu items/i })).toBeDisabled();
  });
  it('can pass menuSearchProps to search input in AttachMenu', () => {
    render(
      <MessageBar
        onSendMessage={jest.fn}
        value="test"
        attachMenuProps={{
          isAttachMenuOpen: true,
          setIsAttachMenuOpen: jest.fn(),
          onAttachMenuToggleClick: jest.fn(),
          onAttachMenuInputChange: jest.fn(),
          attachMenuItems: ATTACH_MENU_ITEMS,
          menuSearchProps: { 'data-testid': 'menu-search' } as MenuSearchProps
        }}
      />
    );
    expect(screen.getByTestId('menu-search')).toBeTruthy();
  });
  it('can pass menuSearchInputProps to search input in AttachMenu', () => {
    render(
      <MessageBar
        onSendMessage={jest.fn}
        value="test"
        attachMenuProps={{
          isAttachMenuOpen: true,
          setIsAttachMenuOpen: jest.fn(),
          onAttachMenuToggleClick: jest.fn(),
          onAttachMenuInputChange: jest.fn(),
          attachMenuItems: ATTACH_MENU_ITEMS,
          menuSearchInputProps: { 'data-testid': 'menu-search-input' } as MenuSearchInputProps
        }}
      />
    );
    expect(screen.getByTestId('menu-search-input')).toBeTruthy();
  });
  it('can remove input from attach menu', async () => {
    render(
      <MessageBar
        onSendMessage={jest.fn}
        attachMenuProps={{
          isAttachMenuOpen: true,
          setIsAttachMenuOpen: jest.fn(),
          onAttachMenuToggleClick: jest.fn(),
          attachMenuItems: ATTACH_MENU_ITEMS
        }}
      />
    );
    expect(screen.queryByRole('textbox', { name: /Filter menu items/i })).not.toBeInTheDocument();
  });
  it('can hide attach button', () => {
    render(<MessageBar onSendMessage={jest.fn} hasAttachButton={false} />);
    expect(screen.queryByRole('button', { name: 'Attach' })).toBeFalsy();
  });
  // Based on this because I had no idea how to do this and was looking around: https://stackoverflow.com/a/75562651
  // See also https://developer.mozilla.org/en-US/docs/Web/API/File/File for what that file variable is doing
  it('can handle handleAttach', async () => {
    const spy = jest.fn();
    render(
      <MessageBar
        onSendMessage={jest.fn}
        hasAttachButton
        handleAttach={spy}
        buttonProps={{ attach: { inputTestId: 'input' } }}
      />
    );
    expect(screen.getByRole('button', { name: 'Attach' })).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: 'Attach' }));
    const file = new File(['test'], 'test.json');
    const input = screen.getByTestId('input') as HTMLInputElement;
    await userEvent.upload(input, file);
    expect(input.files).toHaveLength(1);
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it('can handle buttonProps tooltipContent appropriately for attach', async () => {
    render(<MessageBar onSendMessage={jest.fn} hasAttachButton buttonProps={{ attach: { tooltipContent: 'Test' } }} />);
    await userEvent.click(screen.getByRole('button', { name: 'Attach' }));
    expect(screen.getByRole('tooltip', { name: 'Test' })).toBeTruthy();
  });
  it('can handle buttonProps tooltipProps  appropriately for attach', () => {
    render(
      <MessageBar
        onSendMessage={jest.fn}
        alwayShowSendButton
        buttonProps={{ attach: { tooltipProps: { isVisible: true } } }}
      />
    );
    // isVisible, so no need for click
    expect(screen.getByRole('tooltip', { name: 'Attach' })).toBeTruthy();
  });
  it('can handle buttonProps props appropriately for attach', async () => {
    render(
      <MessageBar
        onSendMessage={jest.fn}
        hasAttachButton
        buttonProps={{ attach: { props: { 'aria-label': 'Test' } } }}
      />
    );
    await userEvent.click(screen.getByRole('button', { name: 'Test' }));
  });
  it('can change attach button icon', () => {
    render(
      <MessageBar
        onSendMessage={jest.fn}
        hasAttachButton
        buttonProps={{
          attach: {
            icon: <img alt="" src="" />
          }
        }}
      />
    );
    expect(screen.getByRole('img')).toBeVisible();
  });

  // Stop button
  // --------------------------------------------------------------------------
  it('can show stop button', () => {
    render(<MessageBar onSendMessage={jest.fn} hasStopButton handleStopButton={jest.fn} />);
    expect(screen.getByRole('button', { name: 'Stop' })).toBeTruthy();
  });
  it('can call handleStopButton', async () => {
    const spy = jest.fn();
    render(<MessageBar onSendMessage={jest.fn} hasStopButton handleStopButton={spy} />);
    await userEvent.click(screen.getByRole('button', { name: 'Stop' }));
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it('can handle buttonProps tooltipContent appropriately for stop', async () => {
    render(
      <MessageBar
        onSendMessage={jest.fn}
        hasStopButton
        handleStopButton={jest.fn}
        buttonProps={{ stop: { tooltipContent: 'Test' } }}
      />
    );
    await userEvent.click(screen.getByRole('button', { name: 'Stop' }));
    expect(screen.getByRole('tooltip', { name: 'Test' })).toBeTruthy();
  });
  it('can handle buttonProps tooltipProps  appropriately for stop', () => {
    render(
      <MessageBar
        onSendMessage={jest.fn}
        hasStopButton
        handleStopButton={jest.fn}
        buttonProps={{ stop: { tooltipProps: { isVisible: true } } }}
      />
    );
    // isVisible, so no need for click
    expect(screen.getByRole('tooltip', { name: 'Stop' })).toBeTruthy();
  });
  it('can handle buttonProps props appropriately for stop', async () => {
    render(
      <MessageBar
        onSendMessage={jest.fn}
        hasStopButton
        handleStopButton={jest.fn}
        buttonProps={{ stop: { props: { 'aria-label': 'Test' } } }}
      />
    );
    await userEvent.click(screen.getByRole('button', { name: 'Test' }));
  });

  // Microphone button
  // --------------------------------------------------------------------------
  it('can hide microphone button when window.SpeechRecognition is not there', () => {
    render(<MessageBar onSendMessage={jest.fn} hasMicrophoneButton />);
    expect(screen.queryByRole('button', { name: 'Use microphone' })).toBeFalsy();
  });
  it('can show microphone button', () => {
    mockSpeechRecognition();
    render(<MessageBar onSendMessage={jest.fn} hasMicrophoneButton />);
    expect(screen.getByRole('button', { name: 'Use microphone' })).toBeTruthy();
  });
  it('can handle buttonProps appropriately for microphone', async () => {
    mockSpeechRecognition();
    render(
      <MessageBar
        onSendMessage={jest.fn}
        hasMicrophoneButton
        buttonProps={{
          microphone: { tooltipContent: { active: 'Currently listening', inactive: 'Not currently listening' } }
        }}
      />
    );
    await userEvent.click(screen.getByRole('button', { name: 'Use microphone' }));
    expect(screen.getByRole('tooltip', { name: 'Currently listening' })).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: 'Stop listening' }));
    expect(screen.getByRole('tooltip', { name: 'Not currently listening' })).toBeTruthy();
  });
  it('can customize the listening placeholder', async () => {
    mockSpeechRecognition();
    render(<MessageBar onSendMessage={jest.fn} hasMicrophoneButton listeningText="I am listening" />);
    await userEvent.click(screen.getByRole('button', { name: 'Use microphone' }));
    const input = screen.getByRole('textbox', { name: /I am listening/i });
    expect(input).toBeTruthy();
  });
  it('can handle buttonProps tooltipProps  appropriately for microphone', () => {
    render(
      <MessageBar
        onSendMessage={jest.fn}
        hasMicrophoneButton
        buttonProps={{ microphone: { tooltipProps: { isVisible: true } } }}
      />
    );
    // isVisible, so no need for click
    expect(screen.getByRole('tooltip', { name: 'Use microphone' })).toBeTruthy();
  });
  it('can handle buttonProps props appropriately for microphone', async () => {
    mockSpeechRecognition();
    render(
      <MessageBar
        onSendMessage={jest.fn}
        hasMicrophoneButton
        buttonProps={{ microphone: { props: { 'aria-label': 'Test' } } }}
      />
    );
    await userEvent.click(screen.getByRole('button', { name: 'Test' }));
  });
  it('can be controlled', () => {
    render(<MessageBar onSendMessage={jest.fn} value="test" />);
    expect(screen.getByRole('button', { name: 'Attach' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Send' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Use microphone' })).toBeFalsy();
    expect(screen.getByRole('textbox', { name: /Send a message.../i })).toBeTruthy();
    expect(screen.getByRole('textbox', { name: /Send a message.../i })).toHaveValue('test');
  });
  it('should focus textarea when using a custom ref', () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<MessageBar onSendMessage={jest.fn} innerRef={ref} />);
    ref.current?.focus();
    expect(document.activeElement).toBe(screen.getByRole('textbox'));
  });
  it('should handle isPrimary', () => {
    const { container } = render(<MessageBar isPrimary onSendMessage={jest.fn} />);
    expect(container.querySelector('.pf-m-primary')).toBeTruthy();
  });
});
