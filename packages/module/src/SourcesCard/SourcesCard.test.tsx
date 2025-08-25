import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import SourcesCard from './SourcesCard';

describe('SourcesCard', () => {
  it('should render card correctly if one source with only a link is passed in', () => {
    render(<SourcesCard sources={[{ link: '' }]} />);
    expect(screen.getByText('1 source')).toBeTruthy();
    expect(screen.getByText('Source 1')).toBeTruthy();
    // no buttons or navigation when there is only 1 source
    expect(screen.queryByRole('button')).toBeFalsy();
    expect(screen.queryByText('1/1')).toBeFalsy();
  });

  it('should render card correctly if one source with a title is passed in', () => {
    render(<SourcesCard sources={[{ title: 'How to make an apple pie', link: '' }]} />);
    expect(screen.getByText('1 source')).toBeTruthy();
    expect(screen.getByText('How to make an apple pie')).toBeTruthy();
  });

  it('should render card correctly if one source with a body is passed in', () => {
    render(<SourcesCard sources={[{ link: '', body: 'To make an apple pie, you must first...' }]} />);
    expect(screen.getByText('1 source')).toBeTruthy();
    expect(screen.getByText('To make an apple pie, you must first...')).toBeTruthy();
  });

  it('should render card correctly if one source with a title and body is passed in', () => {
    render(
      <SourcesCard
        sources={[{ title: 'How to make an apple pie', link: '', body: 'To make an apple pie, you must first...' }]}
      />
    );
    expect(screen.getByText('1 source')).toBeTruthy();
    expect(screen.getByText('How to make an apple pie')).toBeTruthy();
    expect(screen.getByText('To make an apple pie, you must first...')).toBeTruthy();
  });

  it('should render multiple cards correctly', () => {
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

  it('should navigate between cards correctly', async () => {
    render(
      <SourcesCard
        sources={[
          { title: 'How to make an apple pie', link: '' },
          { title: 'How to make cookies', link: '' }
        ]}
      />
    );
    expect(screen.getByText('How to make an apple pie')).toBeTruthy();
    expect(screen.getByText('1/2')).toBeTruthy();
    expect(screen.getByRole('button', { name: /Go to previous page/i })).toBeDisabled();
    await userEvent.click(screen.getByRole('button', { name: /Go to next page/i }));
    expect(screen.queryByText('How to make an apple pie')).toBeFalsy();
    expect(screen.getByText('How to make cookies')).toBeTruthy();
    expect(screen.getByText('2/2')).toBeTruthy();
    expect(screen.getByRole('button', { name: /Go to previous page/i })).toBeEnabled();
    expect(screen.getByRole('button', { name: /Go to next page/i })).toBeDisabled();
  });

  it('should apply className appropriately', () => {
    render(
      <SourcesCard
        sources={[
          { title: 'How to make an apple pie', link: '' },
          { title: 'How to make cookies', link: '' }
        ]}
        className="test"
      />
    );
    const element = screen.getByRole('navigation');
    expect(element).toHaveClass('test');
  });

  it('should disable pagination appropriately', () => {
    render(
      <SourcesCard
        sources={[
          { title: 'How to make an apple pie', link: '' },
          { title: 'How to make cookies', link: '' }
        ]}
        isDisabled
      />
    );
    expect(screen.getByRole('button', { name: /Go to previous page/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /Go to next page/i })).toBeDisabled();
  });

  it('should render navigation aria label appropriately', () => {
    render(
      <SourcesCard
        sources={[
          { title: 'How to make an apple pie', link: '' },
          { title: 'How to make cookies', link: '' }
        ]}
      />
    );
    expect(screen.getByRole('navigation', { name: /Pagination/i })).toBeTruthy();
  });

  it('should change paginationAriaLabel appropriately', () => {
    render(
      <SourcesCard
        sources={[
          { title: 'How to make an apple pie', link: '' },
          { title: 'How to make cookies', link: '' }
        ]}
        paginationAriaLabel="Navegación"
      />
    );
    expect(screen.getByRole('navigation', { name: /Navegación/i })).toBeTruthy();
  });

  it('should change sourceWord appropriately', () => {
    render(<SourcesCard sources={[{ title: 'How to make an apple pie', link: '' }]} sourceWord={'fuente'} />);
    expect(screen.getByText('1 fuente')).toBeTruthy();
  });

  it('should sourceWordPlural appropriately', () => {
    render(
      <SourcesCard
        sources={[
          { title: 'How to make an apple pie', link: '' },
          { title: 'How to make cookies', link: '' }
        ]}
        sourceWordPlural={'fuentes'}
      />
    );
    expect(screen.getByText('2 fuentes')).toBeTruthy();
  });

  it('should change toNextPageAriaLabel appropriately', () => {
    render(
      <SourcesCard
        sources={[
          { title: 'How to make an apple pie', link: '' },
          { title: 'How to make cookies', link: '' }
        ]}
        toNextPageAriaLabel="Pase a la siguiente página"
      />
    );
    expect(screen.getByRole('button', { name: /Pase a la siguiente página/i })).toBeTruthy();
  });

  it('should change toPreviousPageAriaLabel appropriately', () => {
    render(
      <SourcesCard
        sources={[
          { title: 'How to make an apple pie', link: '' },
          { title: 'How to make cookies', link: '' }
        ]}
        toPreviousPageAriaLabel="Presione para regresar a la página anterior"
      />
    );
    expect(screen.getByRole('button', { name: /Presione para regresar a la página anterior/i })).toBeTruthy();
  });

  it('should call onNextClick appropriately', async () => {
    const spy = jest.fn();
    render(
      <SourcesCard
        sources={[
          { title: 'How to make an apple pie', link: '' },
          { title: 'How to make cookies', link: '' }
        ]}
        onNextClick={spy}
      />
    );
    await userEvent.click(screen.getByRole('button', { name: /Go to next page/i }));
    expect(spy).toHaveBeenCalled();
  });

  it('should call onPreviousClick appropriately', async () => {
    const spy = jest.fn();
    render(
      <SourcesCard
        sources={[
          { title: 'How to make an apple pie', link: '' },
          { title: 'How to make cookies', link: '' }
        ]}
        onPreviousClick={spy}
      />
    );
    await userEvent.click(screen.getByRole('button', { name: /Go to next page/i }));
    await userEvent.click(screen.getByRole('button', { name: /Go to previous page/i }));
    expect(spy).toHaveBeenCalled();
  });

  it('should call onSetPage appropriately', async () => {
    const spy = jest.fn();
    render(
      <SourcesCard
        sources={[
          { title: 'How to make an apple pie', link: '' },
          { title: 'How to make cookies', link: '' }
        ]}
        onSetPage={spy}
      />
    );
    await userEvent.click(screen.getByRole('button', { name: /Go to next page/i }));
    expect(spy).toHaveBeenCalledTimes(1);
    await userEvent.click(screen.getByRole('button', { name: /Go to previous page/i }));
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should handle showMore appropriately', async () => {
    render(
      <SourcesCard
        sources={[
          {
            title: 'Getting started with Red Hat OpenShift',
            link: '#',
            body: 'Red Hat OpenShift on IBM Cloud is a managed offering to create your own cluster of compute hosts where you can deploy and manage containerized apps on IBM Cloud ...',
            hasShowMore: true
          },
          {
            title: 'Azure Red Hat OpenShift documentation',
            link: '#',
            body: 'Microsoft Azure Red Hat OpenShift allows you to deploy a production ready Red Hat OpenShift cluster in Azure ...'
          },
          {
            title: 'OKD Documentation: Home',
            link: '#',
            body: 'OKD is a distribution of Kubernetes optimized for continuous application development and multi-tenant deployment. OKD also serves as the upstream code base upon ...'
          }
        ]}
      />
    );
    expect(screen.getByRole('region')).toHaveAttribute('class', 'pf-v6-c-expandable-section__content');
  });

  it('should call onClick appropriately', async () => {
    const spy = jest.fn();
    render(<SourcesCard sources={[{ title: 'How to make an apple pie', link: '', onClick: spy }]} />);
    await userEvent.click(screen.getByRole('link', { name: /How to make an apple pie/i }));
    expect(spy).toHaveBeenCalled();
  });

  it('should apply titleProps appropriately', () => {
    render(
      <SourcesCard sources={[{ title: 'How to make an apple pie', link: '', titleProps: { className: 'test' } }]} />
    );
    expect(screen.getByRole('link', { name: /How to make an apple pie/i })).toHaveClass('test');
  });

  it('should apply cardTitleProps appropriately', () => {
    render(
      <SourcesCard
        cardTitleProps={{ 'data-testid': 'card-title', className: 'test' } as any}
        sources={[{ title: 'How to make an apple pie', link: '' }]}
      />
    );
    expect(screen.getByTestId('card-title')).toHaveClass('test');
  });

  it('should apply cardBodyProps appropriately', () => {
    render(
      <SourcesCard
        cardBodyProps={
          { 'data-testid': 'card-body', body: 'To make an apple pie, you must first...', className: 'test' } as any
        }
        sources={[{ title: 'How to make an apple pie', link: '', body: 'To make an apple pie, you must first...' }]}
      />
    );
    expect(screen.getByTestId('card-body')).toHaveClass('test');
  });

  it('should apply cardFooterProps appropriately', () => {
    render(
      <SourcesCard
        cardFooterProps={{ 'data-testid': 'card-footer', className: 'test' } as any}
        sources={[
          { title: 'How to make an apple pie', link: '' },
          { title: 'How to make cookies', link: '' }
        ]}
      />
    );
    expect(screen.getByTestId('card-footer')).toHaveClass('test');
  });

  it('should apply truncateProps appropriately', () => {
    render(
      <SourcesCard
        sources={[
          {
            title: 'How to make an apple pie',
            link: '',
            truncateProps: { 'data-testid': 'card-truncate', className: 'test' } as any
          }
        ]}
      />
    );
    expect(screen.getByTestId('card-truncate')).toHaveClass('test');
  });

  it('should apply custom footer appropriately when there is one source', () => {
    render(
      <SourcesCard sources={[{ title: 'How to make an apple pie', link: '', footer: <>I am a custom footer</> }]} />
    );
    expect(screen.getByText('I am a custom footer'));
    expect(screen.queryByText('1/1')).toBeFalsy();
  });

  it('should apply custom footer appropriately when are multiple sources', () => {
    render(
      <SourcesCard
        sources={[
          { title: 'How to make an apple pie', link: '', footer: <>I am a custom footer</> },
          { title: 'How to bake bread', link: '' }
        ]}
      />
    );
    expect(screen.getByText('I am a custom footer'));
    // does not show navigation bar
    expect(screen.queryByText('1/2')).toBeFalsy();
  });

  it('should apply footer props to custom footer appropriately', () => {
    render(
      <SourcesCard
        cardFooterProps={{ 'data-testid': 'card-footer', className: 'test' } as any}
        sources={[{ title: 'How to make an apple pie', link: '', footer: <>I am a custom footer</> }]}
      />
    );
    expect(screen.getByText('I am a custom footer'));
    expect(screen.getByTestId('card-footer')).toHaveClass('test');
  });

  it('should apply subtitle appropriately', () => {
    render(
      <SourcesCard
        sources={[{ title: 'How to make an apple pie', link: '', subtitle: 'You must first create the universe' }]}
      />
    );
    expect(screen.getByText('How to make an apple pie'));
    expect(screen.getByText('You must first create the universe'));
  });
});
