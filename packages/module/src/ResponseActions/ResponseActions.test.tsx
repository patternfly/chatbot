import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResponseActions from './ResponseActions';
import userEvent from '@testing-library/user-event';
import { DownloadIcon, InfoCircleIcon, RedoIcon } from '@patternfly/react-icons';
import Message from '../Message';

const ALL_ACTIONS = [
  { type: 'positive', label: 'Good response', clickedLabel: 'Response recorded' },
  { type: 'negative', label: 'Bad response', clickedLabel: 'Response recorded' },
  { type: 'copy', label: 'Copy', clickedLabel: 'Copied' },
  { type: 'share', label: 'Share', clickedLabel: 'Shared' },
  { type: 'listen', label: 'Listen', clickedLabel: 'Listening' }
];

const CUSTOM_ACTIONS = [
  {
    regenerate: {
      ariaLabel: 'Regenerate',
      clickedAriaLabel: 'Regenerated',
      onClick: jest.fn(),
      tooltipContent: 'Regenerate',
      clickedTooltipContent: 'Regenerated',
      icon: <RedoIcon />
    },
    download: {
      ariaLabel: 'Download',
      clickedAriaLabel: 'Downloaded',
      onClick: jest.fn(),
      tooltipContent: 'Download',
      clickedTooltipContent: 'Downloaded',
      icon: <DownloadIcon />
    },
    info: {
      ariaLabel: 'Info',
      onClick: jest.fn(),
      tooltipContent: 'Info',
      icon: <InfoCircleIcon />
    }
  }
];

const ALL_ACTIONS_DATA_TEST = [
  { type: 'positive', label: 'Good response', dataTestId: 'positive' },
  { type: 'negative', label: 'Bad response', dataTestId: 'negative' },
  { type: 'copy', label: 'Copy', dataTestId: 'copy' },
  { type: 'share', label: 'Share', dataTestId: 'share' },
  { type: 'listen', label: 'Listen', dataTestId: 'listen' }
];

describe('ResponseActions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should handle click within group of buttons correctly', async () => {
    render(
      <ResponseActions
        actions={{
          positive: { onClick: jest.fn() },
          negative: { onClick: jest.fn() },
          copy: { onClick: jest.fn() },
          share: { onClick: jest.fn() },
          listen: { onClick: jest.fn() }
        }}
      />
    );
    const goodBtn = screen.getByRole('button', { name: 'Good response' });
    const badBtn = screen.getByRole('button', { name: 'Bad response' });
    const copyBtn = screen.getByRole('button', { name: 'Copy' });
    const shareBtn = screen.getByRole('button', { name: 'Share' });
    const listenBtn = screen.getByRole('button', { name: 'Listen' });
    const buttons = [goodBtn, badBtn, copyBtn, shareBtn, listenBtn];
    buttons.forEach((button) => {
      expect(button).toBeTruthy();
    });
    await userEvent.click(goodBtn);
    expect(screen.getByRole('button', { name: 'Response recorded' })).toHaveClass(
      'pf-chatbot__button--response-action-clicked'
    );
    let unclickedButtons = buttons.filter((button) => button !== goodBtn);
    unclickedButtons.forEach((button) => {
      expect(button).not.toHaveClass('pf-chatbot__button--response-action-clicked');
    });
    await userEvent.click(badBtn);
    expect(screen.getByRole('button', { name: 'Response recorded' })).toHaveClass(
      'pf-chatbot__button--response-action-clicked'
    );
    unclickedButtons = buttons.filter((button) => button !== badBtn);
    unclickedButtons.forEach((button) => {
      expect(button).not.toHaveClass('pf-chatbot__button--response-action-clicked');
    });
  });
  it('should handle click outside of group of buttons correctly', async () => {
    // using message just so we have something outside the group that's rendered
    render(
      <Message
        name="Bot"
        role="bot"
        avatar=""
        content="I updated your account with those settings. You're ready to set up your first dashboard!"
        actions={{
          positive: {},
          negative: {}
        }}
      />
    );
    const goodBtn = screen.getByRole('button', { name: 'Good response' });
    const badBtn = screen.getByRole('button', { name: 'Bad response' });
    expect(goodBtn).toBeTruthy();
    expect(badBtn).toBeTruthy();

    await userEvent.click(goodBtn);
    expect(screen.getByRole('button', { name: 'Response recorded' })).toHaveClass(
      'pf-chatbot__button--response-action-clicked'
    );
    expect(badBtn).not.toHaveClass('pf-chatbot__button--response-action-clicked');

    await userEvent.click(badBtn);
    expect(screen.getByRole('button', { name: 'Response recorded' })).toHaveClass(
      'pf-chatbot__button--response-action-clicked'
    );
    expect(goodBtn).not.toHaveClass('pf-chatbot__button--response-action-clicked');
    await userEvent.click(
      screen.getByText("I updated your account with those settings. You're ready to set up your first dashboard!")
    );
    expect(goodBtn).not.toHaveClass('pf-chatbot__button--response-action-clicked');
    expect(badBtn).not.toHaveClass('pf-chatbot__button--response-action-clicked');
  });
  it('should render buttons correctly', () => {
    ALL_ACTIONS.forEach(({ type, label }) => {
      render(<ResponseActions actions={{ [type]: { onClick: jest.fn() } }} />);
      expect(screen.getByRole('button', { name: label })).toBeTruthy();
    });
  });

  it('should be able to call onClick correctly', async () => {
    ALL_ACTIONS.forEach(async ({ type, label }) => {
      const spy = jest.fn();
      render(<ResponseActions actions={{ [type]: { onClick: spy } }} />);
      await userEvent.click(screen.getByRole('button', { name: label }));
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  it('should swap clicked and non-clicked aria labels on click', async () => {
    ALL_ACTIONS.forEach(async ({ type, label, clickedLabel }) => {
      render(<ResponseActions actions={{ [type]: { onClick: jest.fn() } }} />);
      expect(screen.getByRole('button', { name: label })).toBeTruthy();
      await userEvent.click(screen.getByRole('button', { name: label }));
      expect(screen.getByRole('button', { name: clickedLabel })).toBeTruthy();
    });
  });

  it('should swap clicked and non-clicked tooltips on click', async () => {
    ALL_ACTIONS.forEach(async ({ type, label, clickedLabel }) => {
      render(<ResponseActions actions={{ [type]: { onClick: jest.fn() } }} />);
      expect(screen.getByRole('button', { name: label })).toBeTruthy();
      await userEvent.click(screen.getByRole('button', { name: label }));
      expect(screen.getByRole('tooltip', { name: clickedLabel })).toBeTruthy();
    });
  });

  it('should be able to change aria labels', () => {
    const actions = [
      { type: 'positive', ariaLabel: 'Thumbs up' },
      { type: 'negative', ariaLabel: 'Thumbs down' },
      { type: 'copy', ariaLabel: 'Copy the message' },
      { type: 'share', ariaLabel: 'Share it with friends' },
      { type: 'listen', ariaLabel: 'Listen up' }
    ];
    actions.forEach(({ type, ariaLabel }) => {
      render(<ResponseActions actions={{ [type]: { onClick: jest.fn(), ariaLabel } }} />);
      expect(screen.getByRole('button', { name: ariaLabel })).toBeTruthy();
    });
  });

  it('should be able to disable buttons', () => {
    ALL_ACTIONS.forEach(({ type, label }) => {
      render(<ResponseActions actions={{ [type]: { onClick: jest.fn(), isDisabled: true } }} />);
      expect(screen.getByRole('button', { name: label })).toBeDisabled();
    });
  });

  it('should be able to add class to buttons', () => {
    ALL_ACTIONS.forEach(({ type, label }) => {
      render(<ResponseActions actions={{ [type]: { onClick: jest.fn(), className: 'test' } }} />);
      expect(screen.getByRole('button', { name: label })).toHaveClass('test');
    });
  });

  it('should be able to add custom attributes to buttons', () => {
    ALL_ACTIONS_DATA_TEST.forEach(({ type, dataTestId }) => {
      render(<ResponseActions actions={{ [type]: { onClick: jest.fn(), 'data-testid': dataTestId } }} />);
      expect(screen.getByTestId(dataTestId)).toBeTruthy();
    });
  });

  it('should be able to add custom actions', () => {
    CUSTOM_ACTIONS.forEach((action) => {
      const key = Object.keys(action)[0];
      render(
        <ResponseActions
          actions={{
            [key]: {
              tooltipContent: action[key].tooltipContent,
              onClick: action[key].onClick,
              // doing this just because it's easier to test without a regex for the button name
              ariaLabel: action[key].ariaLabel.toLowerCase(),
              icon: action[key].icon,
              'data-testid': action[key]
            }
          }}
        />
      );
      expect(screen.getByRole('button', { name: key })).toBeTruthy();
      expect(screen.getByTestId(action[key])).toBeTruthy();
    });
  });
});
