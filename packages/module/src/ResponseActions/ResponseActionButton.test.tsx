import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { RhUiExportIcon } from '@patternfly/react-icons';
import ResponseActionButton from './ResponseActionButton';

describe('ResponseActionButton', () => {
  it('renders aria-label correctly if not clicked', () => {
    render(<ResponseActionButton icon={<RhUiExportIcon />} ariaLabel="Download" clickedAriaLabel="Downloaded" />);
    expect(screen.getByRole('button', { name: 'Download' })).toBeTruthy();
  });
  it('renders aria-label correctly if clicked', () => {
    render(
      <ResponseActionButton icon={<RhUiExportIcon />} ariaLabel="Download" clickedAriaLabel="Downloaded" isClicked />
    );
    expect(screen.getByRole('button', { name: 'Downloaded' })).toBeTruthy();
  });
  it('renders tooltip correctly if not clicked', async () => {
    render(
      <ResponseActionButton icon={<RhUiExportIcon />} tooltipContent="Download" clickedTooltipContent="Downloaded" />
    );
    expect(screen.getByRole('button', { name: 'Download' })).toBeTruthy();
    // clicking here just triggers the tooltip; in this button, the logic is divorced from whether it is actually clicked
    await userEvent.click(screen.getByRole('button', { name: 'Download' }));
    expect(screen.getByRole('tooltip', { name: 'Download' })).toBeTruthy();
  });
  it('renders tooltip correctly if clicked', async () => {
    render(
      <ResponseActionButton
        icon={<RhUiExportIcon />}
        tooltipContent="Download"
        clickedTooltipContent="Downloaded"
        isClicked
      />
    );
    expect(screen.getByRole('button', { name: 'Downloaded' })).toBeTruthy();
    // clicking here just triggers the tooltip; in this button, the logic is divorced from whether it is actually clicked
    await userEvent.click(screen.getByRole('button', { name: 'Downloaded' }));
    expect(screen.getByRole('tooltip', { name: 'Downloaded' })).toBeTruthy();
  });
  it('if clicked variant for tooltip is not supplied, it uses the default', async () => {
    render(<ResponseActionButton icon={<RhUiExportIcon />} tooltipContent="Download" isClicked />);
    // clicking here just triggers the tooltip; in this button, the logic is divorced from whether it is actually clicked
    await userEvent.click(screen.getByRole('button', { name: 'Download' }));
    expect(screen.getByRole('button', { name: 'Download' })).toBeTruthy();
  });
  it('if clicked variant for aria label is not supplied, it uses the default', async () => {
    render(<ResponseActionButton icon={<RhUiExportIcon />} ariaLabel="Download" isClicked />);
    expect(screen.getByRole('button', { name: 'Download' })).toBeTruthy();
  });
});
