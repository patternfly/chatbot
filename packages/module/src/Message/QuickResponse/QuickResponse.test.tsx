import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import QuickResponse from './QuickResponse';

test('Renders with quick responses', () => {
  const quickResponses = [
    { id: '1', content: 'Response 1' },
    { id: '2', content: 'Response 2' },
    { id: '3', content: 'Response 3' }
  ];
  render(<QuickResponse quickResponses={quickResponses} />);

  expect(screen.getByText('Response 1')).toBeVisible();
  expect(screen.getByText('Response 2')).toBeVisible();
  expect(screen.getByText('Response 3')).toBeVisible();
});

test('Renders with compact styling', () => {
  const quickResponses = [{ id: '1', content: 'Compact response' }];
  render(<QuickResponse quickResponses={quickResponses} isCompact />);

  expect(screen.getByText('Compact response').closest('.pf-v6-c-label')).toHaveClass('pf-m-compact');
});

test('Renders with custom className on response', () => {
  const quickResponses = [{ id: '1', content: 'Custom class response', className: 'custom-response-class' }];
  render(<QuickResponse quickResponses={quickResponses} />);

  expect(screen.getByText('Custom class response').closest('.pf-v6-c-label')).toHaveClass('custom-response-class');
});

test('Renders with custom container className', () => {
  const quickResponses = [
    { id: '1', content: 'Response 1' },
    { id: '2', content: 'Response 2' }
  ];
  render(
    <QuickResponse
      quickResponses={quickResponses}
      quickResponseContainerProps={{ className: 'custom-container-class' }}
    />
  );

  expect(screen.getByText('Response 1').closest('.pf-v6-c-label-group')).toHaveClass('custom-container-class');
});

test('Spreads additional custom container props', () => {
  const quickResponses = [
    { id: '1', content: 'Response 1' },
    { id: '2', content: 'Response 2' }
  ];
  render(<QuickResponse quickResponses={quickResponses} quickResponseContainerProps={{ id: 'custom-container-id' }} />);

  expect(screen.getByText('Response 1').closest('.pf-v6-c-label-group__list')).toHaveAttribute(
    'id',
    'custom-container-id'
  );
});

test('Renders with pf-chatbot__message-quick-response--selected class after click', async () => {
  const user = userEvent.setup();
  const quickResponses = [
    { id: '1', content: 'Response 1' },
    { id: '2', content: 'Response 2' }
  ];
  render(<QuickResponse quickResponses={quickResponses} />);

  await user.click(screen.getByText('Response 1'));

  expect(screen.getByText('Response 1').closest('.pf-v6-c-label')).toHaveClass(
    'pf-chatbot__message-quick-response--selected'
  );
});

test('Does not calls onClick handler when not passed', async () => {
  const user = userEvent.setup();
  const handleClick = jest.fn();
  const quickResponses = [{ id: '1', content: 'Clickable response' }];
  render(<QuickResponse quickResponses={quickResponses} />);

  await user.click(screen.getByText('Clickable response'));

  expect(handleClick).not.toHaveBeenCalled();
});

test('Calls onClick handler when passed', async () => {
  const user = userEvent.setup();
  const handleClick = jest.fn();
  const quickResponses = [{ id: '1', content: 'Clickable response', onClick: handleClick }];
  render(<QuickResponse quickResponses={quickResponses} />);

  await user.click(screen.getByText('Clickable response'));

  expect(handleClick).toHaveBeenCalled();
});

test('Does not call onSelect when not passed', async () => {
  const user = userEvent.setup();
  const handleSelect = jest.fn();
  const quickResponses = [
    { id: '1', content: 'Response 1' },
    { id: '2', content: 'Response 2' }
  ];
  render(<QuickResponse quickResponses={quickResponses} />);

  await user.click(screen.getByText('Response 2'));

  expect(handleSelect).not.toHaveBeenCalled();
});

test('Calls onSelect when passed', async () => {
  const user = userEvent.setup();
  const handleSelect = jest.fn();
  const quickResponses = [
    { id: '1', content: 'Response 1' },
    { id: '2', content: 'Response 2' }
  ];
  render(<QuickResponse quickResponses={quickResponses} onSelect={handleSelect} />);

  await user.click(screen.getByText('Response 2'));

  expect(handleSelect).toHaveBeenCalledWith('2');
});

test('Spreads additional response props', () => {
  const quickResponses = [{ id: '1', content: 'Response with props', isCompact: true, 'aria-label': 'Test label' }];
  render(<QuickResponse quickResponses={quickResponses} />);

  expect(screen.getByText('Response with props').closest('.pf-v6-c-label')).toHaveAttribute('aria-label', 'Test label');
});
