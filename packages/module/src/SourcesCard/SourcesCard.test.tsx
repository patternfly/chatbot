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

  it('should render with wrap layout when layout is set to wrap', () => {
    render(
      <SourcesCard
        layout="wrap"
        sources={[
          { title: 'How to make an apple pie', link: '' },
          { title: 'How to make cookies', link: '' },
          { title: 'How to make a sandwich', link: '' }
        ]}
      />
    );

    expect(screen.getByText('How to make an apple pie')).toBeVisible();
    expect(screen.getByText('How to make cookies')).toBeVisible();
    expect(screen.getByText('How to make a sandwich')).toBeVisible();

    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    expect(screen.queryByText('1/3')).not.toBeInTheDocument();
  });

  it('should pass listProps to SourcesCardBase when using wrap layout', () => {
    render(
      <SourcesCard
        layout="wrap"
        sources={[
          { title: 'How to make an apple pie', link: '' },
          { title: 'How to make cookies', link: '' }
        ]}
        listProps={{ className: 'custom-list-class' }}
      />
    );
    const listElement = screen.getByRole('list');
    expect(listElement).toHaveClass('custom-list-class');
  });

  it('should pass listItemProps to SourcesCardBase when using wrap layout', () => {
    render(
      <SourcesCard
        layout="wrap"
        sources={[
          { title: 'How to make an apple pie', link: '' },
          { title: 'How to make cookies', link: '' }
        ]}
        listItemProps={{ className: 'custom-list-item-class' }}
      />
    );
    const listItemElements = screen.getAllByRole('listitem');
    listItemElements.forEach((listItem) => {
      expect(listItem).toHaveClass('custom-list-item-class');
    });
  });
});
