import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResponseActions, { ActionProps } from './ResponseActions';
import userEvent from '@testing-library/user-event';
import { DownloadIcon, InfoCircleIcon, RedoIcon } from '@patternfly/react-icons';
import Message from '../Message';

// Mock the icon components
jest.mock('@patternfly/react-icons', () => ({
  OutlinedThumbsUpIcon: () => <div>OutlinedThumbsUpIcon</div>,
  ThumbsUpIcon: () => <div>ThumbsUpIcon</div>,
  OutlinedThumbsDownIcon: () => <div>OutlinedThumbsDownIcon</div>,
  ThumbsDownIcon: () => <div>ThumbsDownIcon</div>,
  OutlinedCopyIcon: () => <div>OutlinedCopyIcon</div>,
  DownloadIcon: () => <div>DownloadIcon</div>,
  InfoCircleIcon: () => <div>InfoCircleIcon</div>,
  RedoIcon: () => <div>RedoIcon</div>,
  ExternalLinkAltIcon: () => <div>ExternalLinkAltIcon</div>,
  VolumeUpIcon: () => <div>VolumeUpIcon</div>,
  PencilAltIcon: () => <div>PencilAltIcon</div>
}));

const ALL_ACTIONS = [
  { type: 'positive', label: 'Good response', clickedLabel: 'Good response recorded' },
  { type: 'negative', label: 'Bad response', clickedLabel: 'Bad response recorded' },
  { type: 'copy', label: 'Copy', clickedLabel: 'Copied' },
  { type: 'edit', label: 'Edit', clickedLabel: 'Editing' },
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
  { type: 'edit', label: 'Edit', dataTestId: 'edit' },
  { type: 'share', label: 'Share', dataTestId: 'share' },
  { type: 'download', label: 'Download', dataTestId: 'download' },
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
          edit: { onClick: jest.fn() },
          share: { onClick: jest.fn() },
          download: { onClick: jest.fn() },
          listen: { onClick: jest.fn() }
        }}
      />
    );
    const goodBtn = screen.getByRole('button', { name: 'Good response' });
    const badBtn = screen.getByRole('button', { name: 'Bad response' });
    const copyBtn = screen.getByRole('button', { name: 'Copy' });
    const editBtn = screen.getByRole('button', { name: 'Edit' });
    const shareBtn = screen.getByRole('button', { name: 'Share' });
    const downloadBtn = screen.getByRole('button', { name: 'Download' });
    const listenBtn = screen.getByRole('button', { name: 'Listen' });
    const buttons = [goodBtn, badBtn, copyBtn, editBtn, shareBtn, downloadBtn, listenBtn];
    buttons.forEach((button) => {
      expect(button).toBeTruthy();
    });
    await userEvent.click(goodBtn);
    expect(screen.getByRole('button', { name: 'Good response recorded' })).toHaveClass(
      'pf-chatbot__button--response-action-clicked'
    );
    let unclickedButtons = buttons.filter((button) => button !== goodBtn);
    unclickedButtons.forEach((button) => {
      expect(button).not.toHaveClass('pf-chatbot__button--response-action-clicked');
    });
    await userEvent.click(badBtn);
    expect(screen.getByRole('button', { name: 'Bad response recorded' })).toHaveClass(
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
    expect(screen.getByRole('button', { name: 'Good response recorded' })).toHaveClass(
      'pf-chatbot__button--response-action-clicked'
    );
    expect(badBtn).not.toHaveClass('pf-chatbot__button--response-action-clicked');

    await userEvent.click(badBtn);
    expect(screen.getByRole('button', { name: 'Bad response recorded' })).toHaveClass(
      'pf-chatbot__button--response-action-clicked'
    );
    expect(goodBtn).not.toHaveClass('pf-chatbot__button--response-action-clicked');
    await userEvent.click(
      screen.getByText("I updated your account with those settings. You're ready to set up your first dashboard!")
    );
    expect(goodBtn).not.toHaveClass('pf-chatbot__button--response-action-clicked');
    expect(badBtn).not.toHaveClass('pf-chatbot__button--response-action-clicked');
  });

  it('should handle isClicked prop within group of buttons correctly', async () => {
    render(
      <ResponseActions
        actions={
          {
            positive: { 'data-testid': 'positive-btn', onClick: jest.fn(), isClicked: true },
            negative: { 'data-testid': 'negative-btn', onClick: jest.fn() }
          } as Record<string, ActionProps>
        }
      />
    );

    expect(screen.getByTestId('positive-btn')).toHaveClass('pf-chatbot__button--response-action-clicked');
    expect(screen.getByTestId('negative-btn')).not.toHaveClass('pf-chatbot__button--response-action-clicked');
  });

  it('should set "listen" button as active if its `isClicked` is true', async () => {
    render(
      <ResponseActions
        actions={
          {
            positive: { 'data-testid': 'positive-btn', onClick: jest.fn(), isClicked: false },
            negative: { 'data-testid': 'negative-btn', onClick: jest.fn(), isClicked: false },
            listen: { 'data-testid': 'listen-btn', onClick: jest.fn(), isClicked: true }
          } as Record<string, ActionProps>
        }
      />
    );
    expect(screen.getByTestId('listen-btn')).toHaveClass('pf-chatbot__button--response-action-clicked');

    expect(screen.getByTestId('positive-btn')).not.toHaveClass('pf-chatbot__button--response-action-clicked');
    expect(screen.getByTestId('negative-btn')).not.toHaveClass('pf-chatbot__button--response-action-clicked');
  });

  it('should prioritize "positive" when both "positive" and "negative" are set to clicked', async () => {
    render(
      <ResponseActions
        actions={
          {
            positive: { 'data-testid': 'positive-btn', onClick: jest.fn(), isClicked: true },
            negative: { 'data-testid': 'negative-btn', onClick: jest.fn(), isClicked: true }
          } as Record<string, ActionProps>
        }
      />
    );
    // Positive button should take precendence
    expect(screen.getByTestId('positive-btn')).toHaveClass('pf-chatbot__button--response-action-clicked');
    expect(screen.getByTestId('negative-btn')).not.toHaveClass('pf-chatbot__button--response-action-clicked');
  });

  it('should set an additional action button as active if it is initially clicked and no predefined are clicked', async () => {
    const [additionalActions] = CUSTOM_ACTIONS;
    const customActions = {
      positive: { 'data-testid': 'positive', onClick: jest.fn(), isClicked: false },
      negative: { 'data-testid': 'negative', onClick: jest.fn(), isClicked: false },
      ...Object.keys(additionalActions).reduce((acc, actionKey) => {
        acc[actionKey] = {
          ...additionalActions[actionKey],
          'data-testid': actionKey,
          isClicked: actionKey === 'regenerate'
        };
        return acc;
      }, {})
    };
    render(<ResponseActions actions={customActions} />);

    Object.keys(customActions).forEach((actionKey) => {
      if (actionKey === 'regenerate') {
        expect(screen.getByTestId(actionKey)).toHaveClass('pf-chatbot__button--response-action-clicked');
      } else {
        // Other actions should not have clicked class
        expect(screen.getByTestId(actionKey)).not.toHaveClass('pf-chatbot__button--response-action-clicked');
      }
    });
  });

  it('should activate the clicked button and deactivate any previously active button', async () => {
    const actions = {
      positive: { 'data-testid': 'positive', onClick: jest.fn(), isClicked: false },
      negative: { 'data-testid': 'negative', onClick: jest.fn(), isClicked: true }
    };
    render(<ResponseActions actions={actions} />);

    const negativeBtn = screen.getByTestId('negative');
    const positiveBtn = screen.getByTestId('positive');
    // negative button is initially clicked
    expect(negativeBtn).toHaveClass('pf-chatbot__button--response-action-clicked');
    expect(positiveBtn).not.toHaveClass('pf-chatbot__button--response-action-clicked');

    await userEvent.click(positiveBtn);

    // positive button should now have the clicked class
    expect(positiveBtn).toHaveClass('pf-chatbot__button--response-action-clicked');
    expect(negativeBtn).not.toHaveClass('pf-chatbot__button--response-action-clicked');
  });

  it('should render buttons correctly', () => {
    ALL_ACTIONS.forEach(({ type, label }) => {
      render(<ResponseActions actions={{ [type]: { onClick: jest.fn() } }} />);
      expect(screen.getByRole('button', { name: label })).toBeTruthy();
    });
  });

  it('should be able to call onClick correctly', async () => {
    for (const { type, label } of ALL_ACTIONS) {
      const spy = jest.fn();
      render(<ResponseActions actions={{ [type]: { onClick: spy } }} />);
      await userEvent.click(screen.getByRole('button', { name: label }));
      expect(spy).toHaveBeenCalledTimes(1);
    }
  });

  it('should swap clicked and non-clicked aria labels on click', async () => {
    for (const { type, label, clickedLabel } of ALL_ACTIONS) {
      render(<ResponseActions actions={{ [type]: { onClick: jest.fn() } }} />);
      expect(screen.getByRole('button', { name: label })).toBeTruthy();
      await userEvent.click(screen.getByRole('button', { name: label }));
      expect(screen.getByRole('button', { name: clickedLabel })).toBeTruthy();
    }
  });

  it('should swap clicked and non-clicked tooltips on click', async () => {
    for (const { type, label, clickedLabel } of ALL_ACTIONS) {
      render(<ResponseActions actions={{ [type]: { onClick: jest.fn() } }} />);
      expect(screen.getByRole('button', { name: label })).toBeTruthy();
      await userEvent.click(screen.getByRole('button', { name: label }));
      expect(screen.getByRole('tooltip', { name: clickedLabel })).toBeTruthy();
    }
  });

  it('should be able to change aria labels', () => {
    const actions = [
      { type: 'positive', ariaLabel: 'Thumbs up' },
      { type: 'negative', ariaLabel: 'Thumbs down' },
      { type: 'copy', ariaLabel: 'Copy the message' },
      { type: 'edit', ariaLabel: 'Edit this message' },
      { type: 'share', ariaLabel: 'Share it with friends' },
      { type: 'download', ariaLabel: 'Download your cool message' },
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

  // we are testing for the reverse case already above
  it('should not deselect when clicking outside when persistActionSelection is true', async () => {
    render(
      <Message
        name="Bot"
        role="bot"
        avatar=""
        content="Test content"
        actions={{
          positive: {},
          negative: {}
        }}
        persistActionSelection
      />
    );
    const goodBtn = screen.getByRole('button', { name: 'Good response' });

    await userEvent.click(goodBtn);
    expect(screen.getByRole('button', { name: 'Good response recorded' })).toHaveClass(
      'pf-chatbot__button--response-action-clicked'
    );

    await userEvent.click(screen.getByText('Test content'));

    expect(screen.getByRole('button', { name: 'Good response recorded' })).toHaveClass(
      'pf-chatbot__button--response-action-clicked'
    );
  });

  it('should switch selection to another button when persistActionSelection is true', async () => {
    render(
      <Message
        name="Bot"
        role="bot"
        avatar=""
        content="Test content"
        actions={{
          positive: {},
          negative: {}
        }}
        persistActionSelection
      />
    );
    const goodBtn = screen.getByRole('button', { name: 'Good response' });
    const badBtn = screen.getByRole('button', { name: 'Bad response' });

    await userEvent.click(goodBtn);
    expect(goodBtn).toHaveClass('pf-chatbot__button--response-action-clicked');

    await userEvent.click(badBtn);
    expect(badBtn).toHaveClass('pf-chatbot__button--response-action-clicked');
    expect(goodBtn).not.toHaveClass('pf-chatbot__button--response-action-clicked');
  });

  it('should toggle off when clicking the same button when persistActionSelection is true', async () => {
    render(
      <Message
        name="Bot"
        role="bot"
        avatar=""
        content="Test content"
        actions={{
          positive: {},
          negative: {}
        }}
        persistActionSelection
      />
    );
    const goodBtn = screen.getByRole('button', { name: 'Good response' });

    await userEvent.click(goodBtn);
    expect(goodBtn).toHaveClass('pf-chatbot__button--response-action-clicked');

    await userEvent.click(goodBtn);
    expect(goodBtn).not.toHaveClass('pf-chatbot__button--response-action-clicked');
  });

  it('should work with custom actions when persistActionSelection is true', async () => {
    const actions = {
      positive: { 'data-testid': 'positive', onClick: jest.fn() },
      negative: { 'data-testid': 'negative', onClick: jest.fn() },
      custom: {
        'data-testid': 'custom',
        onClick: jest.fn(),
        ariaLabel: 'Custom',
        tooltipContent: 'Custom action',
        icon: <DownloadIcon />
      }
    };
    render(<ResponseActions actions={actions} persistActionSelection />);

    const customBtn = screen.getByTestId('custom');
    await userEvent.click(customBtn);
    expect(customBtn).toHaveClass('pf-chatbot__button--response-action-clicked');

    await userEvent.click(customBtn);
    expect(customBtn).not.toHaveClass('pf-chatbot__button--response-action-clicked');
  });

  it('should apply pf-m-visible-interaction class when showActionsOnInteraction is true', () => {
    render(
      <ResponseActions
        data-testid="test-id"
        actions={{
          positive: { onClick: jest.fn() },
          negative: { onClick: jest.fn() }
        }}
        showActionsOnInteraction
      />
    );

    expect(screen.getByTestId('test-id')).toHaveClass('pf-m-visible-interaction');
  });

  it('should not apply pf-m-visible-interaction class when showActionsOnInteraction is false', () => {
    render(
      <ResponseActions
        data-testid="test-id"
        actions={{
          positive: { onClick: jest.fn() },
          negative: { onClick: jest.fn() }
        }}
        showActionsOnInteraction={false}
      />
    );

    expect(screen.getByTestId('test-id')).not.toHaveClass('pf-m-visible-interaction');
  });

  it('should not apply pf-m-visible-interaction class by default', () => {
    render(
      <ResponseActions
        data-testid="test-id"
        actions={{
          positive: { onClick: jest.fn() },
          negative: { onClick: jest.fn() }
        }}
      />
    );

    expect(screen.getByTestId('test-id')).not.toHaveClass('pf-m-visible-interaction');
  });

  it('should render with custom className', () => {
    render(
      <ResponseActions
        data-testid="test-id"
        actions={{
          positive: { onClick: jest.fn() },
          negative: { onClick: jest.fn() }
        }}
        className="custom-class"
      />
    );

    expect(screen.getByTestId('test-id')).toHaveClass('custom-class');
  });

  describe('icon swapping with useFilledIconsOnClick', () => {
    it('should render outline icons by default', () => {
      render(
        <ResponseActions
          actions={{
            positive: { onClick: jest.fn() },
            negative: { onClick: jest.fn() }
          }}
        />
      );

      expect(screen.getByText('OutlinedThumbsUpIcon')).toBeInTheDocument();
      expect(screen.getByText('OutlinedThumbsDownIcon')).toBeInTheDocument();

      expect(screen.queryByText('ThumbsUpIcon')).not.toBeInTheDocument();
      expect(screen.queryByText('ThumbsDownIcon')).not.toBeInTheDocument();
    });

    describe('positive actions', () => {
      it('should not swap positive icon when clicked and useFilledIconsOnClick is false', async () => {
        const user = userEvent.setup();

        render(
          <ResponseActions
            actions={{
              positive: { onClick: jest.fn() }
            }}
            useFilledIconsOnClick={false}
          />
        );

        await user.click(screen.getByRole('button', { name: 'Good response' }));

        expect(screen.getByText('OutlinedThumbsUpIcon')).toBeInTheDocument();
        expect(screen.queryByText('ThumbsUpIcon')).not.toBeInTheDocument();
      });

      it('should swap positive icon from outline to filled when clicked with useFilledIconsOnClick', async () => {
        const user = userEvent.setup();

        render(
          <ResponseActions
            actions={{
              positive: { onClick: jest.fn() }
            }}
            useFilledIconsOnClick
          />
        );

        await user.click(screen.getByRole('button', { name: 'Good response' }));

        expect(screen.getByText('ThumbsUpIcon')).toBeInTheDocument();
        expect(screen.queryByText('OutlinedThumbsUpIcon')).not.toBeInTheDocument();
      });

      it('should revert positive icon to outline icon when clicking outside', async () => {
        const user = userEvent.setup();

        render(
          <div>
            <ResponseActions
              actions={{
                positive: { onClick: jest.fn() }
              }}
              useFilledIconsOnClick
            />
            <div data-testid="outside">Outside</div>
          </div>
        );

        await user.click(screen.getByRole('button', { name: 'Good response' }));
        expect(screen.getByText('ThumbsUpIcon')).toBeInTheDocument();

        await user.click(screen.getByTestId('outside'));
        expect(screen.getByText('OutlinedThumbsUpIcon')).toBeInTheDocument();
      });

      it('should not revert positive icon to outline icon when clicking outside if persistActionSelection is true', async () => {
        const user = userEvent.setup();

        render(
          <div>
            <ResponseActions
              actions={{
                positive: { onClick: jest.fn() }
              }}
              persistActionSelection
              useFilledIconsOnClick
            />
            <div data-testid="outside">Outside</div>
          </div>
        );

        await user.click(screen.getByRole('button', { name: 'Good response' }));
        expect(screen.getByText('ThumbsUpIcon')).toBeInTheDocument();

        await user.click(screen.getByTestId('outside'));
        expect(screen.getByText('ThumbsUpIcon')).toBeInTheDocument();
      });

      describe('negative actions', () => {
        it('should not swap negative icon when clicked and useFilledIconsOnClick is false', async () => {
          const user = userEvent.setup();

          render(
            <ResponseActions
              actions={{
                negative: { onClick: jest.fn() }
              }}
              useFilledIconsOnClick={false}
            />
          );

          await user.click(screen.getByRole('button', { name: 'Bad response' }));

          expect(screen.getByText('OutlinedThumbsDownIcon')).toBeInTheDocument();
          expect(screen.queryByText('ThumbsDownIcon')).not.toBeInTheDocument();
        });

        it('should swap negative icon from outline to filled when clicked with useFilledIconsOnClick', async () => {
          const user = userEvent.setup();

          render(
            <ResponseActions
              actions={{
                negative: { onClick: jest.fn() }
              }}
              useFilledIconsOnClick
            />
          );

          await user.click(screen.getByRole('button', { name: 'Bad response' }));

          expect(screen.getByText('ThumbsDownIcon')).toBeInTheDocument();
          expect(screen.queryByText('OutlinedThumbsDownIcon')).not.toBeInTheDocument();
        });

        it('should revert negative icon to outline when clicking outside', async () => {
          const user = userEvent.setup();

          render(
            <div>
              <ResponseActions
                actions={{
                  negative: { onClick: jest.fn() }
                }}
                useFilledIconsOnClick
              />
              <div data-testid="outside">Outside</div>
            </div>
          );

          await user.click(screen.getByRole('button', { name: 'Bad response' }));
          expect(screen.getByText('ThumbsDownIcon')).toBeInTheDocument();

          await user.click(screen.getByTestId('outside'));
          expect(screen.getByText('OutlinedThumbsDownIcon')).toBeInTheDocument();
        });

        it('should not revert negative icon to outline icon when clicking outside if persistActionSelection is true', async () => {
          const user = userEvent.setup();

          render(
            <div>
              <ResponseActions
                actions={{
                  negative: { onClick: jest.fn() }
                }}
                persistActionSelection
                useFilledIconsOnClick
              />
              <div data-testid="outside">Outside</div>
            </div>
          );

          await user.click(screen.getByRole('button', { name: 'Bad response' }));
          expect(screen.getByText('ThumbsDownIcon')).toBeInTheDocument();

          await user.click(screen.getByTestId('outside'));
          expect(screen.getByText('ThumbsDownIcon')).toBeInTheDocument();
        });
      });
    });
  });
});
