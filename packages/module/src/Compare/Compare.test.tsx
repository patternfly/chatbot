import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Compare from './Compare';

const firstChild = (
  <div>
    <h1>Child 1</h1>
  </div>
);

const secondChild = (
  <div>
    <h1>Child 2</h1>
  </div>
);

describe('Compare', () => {
  it('should render compare correctly', () => {
    render(
      <Compare
        firstChildDisplayName="Child 1"
        secondChildDisplayName="Child 2"
        firstChild={firstChild}
        secondChild={secondChild}
      />
    );
    expect(screen.getByRole('heading', { name: /Child 1/i })).toBeTruthy();
    expect(screen.getByRole('heading', { name: /Child 2/i })).toBeTruthy();
  });
});
