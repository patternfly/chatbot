import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SourcesCard from './SourcesCard';

describe('SourcesCard', () => {
  it('should render sources correctly if one source is passed in', () => {
    render(<SourcesCard sources={[{ title: 'How to make an apple pie', link: '' }]} />);
    expect(screen.getByText('1 source')).toBeTruthy();
    expect(screen.getByText('How to make an apple pie')).toBeTruthy();
  });

  it('should render sources correctly when there is more than one', () => {
    render(
      <SourcesCard
        sources={[
          { title: 'How to make an apple pie', link: '' },
          { title: 'How to make cookies', link: '' }
        ]}
      />
    );
    expect(screen.getByText('2 sources')).toBeTruthy();
    expect(screen.getByText('How to make an apple pie')).toBeTruthy();
    expect(screen.getByText('1/2')).toBeTruthy();
    screen.getByRole('button', { name: /Go to previous page/i });
    screen.getByRole('button', { name: /Go to next page/i });
  });
});
