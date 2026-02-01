import React from 'react';
import { render } from '@testing-library/react';

import { TranslationDiff } from './TranslationDiff';

describe('<TranslationDiff>', () => {
  it('returns the correct diff for provided strings', () => {
    const { container } = render(
      <TranslationDiff base={'abcdef'} target={'cdefgh'} />,
    );

    expect(container.querySelectorAll('ins')).toHaveLength(1);
    expect(container.querySelectorAll('del')).toHaveLength(1);
    expect(container.childNodes[1]).toHaveTextContent('cdef');
  });

  it('returns the same string if provided strings are equal', () => {
    const { container } = render(
      <TranslationDiff base={'abcdef'} target={'abcdef'} />,
    );

    expect(container.querySelectorAll('ins')).toHaveLength(0);
    expect(container.querySelectorAll('del')).toHaveLength(0);
    expect(container).toHaveTextContent('abcdef');
  });
});
