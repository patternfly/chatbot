import React from 'react';
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
    expect(screen.queryByText('1 of 1')).toBeFalsy();
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
    expect(screen.getByText('1 of 2')).toBeTruthy();
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
    expect(screen.getByText('1 of 2')).toBeTruthy();
    expect(screen.getByRole('button', { name: /Go to previous page/i })).toBeDisabled();
    await userEvent.click(screen.getByRole('button', { name: /Go to next page/i }));
    expect(screen.queryByText('How to make an apple pie')).toBeFalsy();
    expect(screen.getByText('How to make cookies')).toBeTruthy();
    expect(screen.getByText('2 of 2')).toBeTruthy();
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

  it('should change ofWord appropriately', () => {
    render(
      <SourcesCard
        sources={[
          { title: 'How to make an apple pie', link: '' },
          { title: 'How to make cookies', link: '' }
        ]}
        ofWord={'de'}
      />
    );
    expect(screen.getByText('1 de 2')).toBeTruthy();
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
});
