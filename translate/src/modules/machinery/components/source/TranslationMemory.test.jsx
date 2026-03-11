import React from 'react';

import { TranslationMemory } from './TranslationMemory';
import { render } from '@testing-library/react';
import { expect } from 'vitest';
import { MockLocalizationProvider } from '~/test/utils';

describe('<TranslationMemory>', () => {
  it('renders the component without number of occurrences properly', () => {
    const message = 'test-message';
    const { getByRole } = render(
      <MockLocalizationProvider
        resources={`machinery-TranslationMemory--translation-source = ${message}`}
      >
        <TranslationMemory />
      </MockLocalizationProvider>,
    );

    getByRole('listitem');
    expect(
      getByRole('listitem').querySelector('span.translation-source'),
    ).toHaveTextContent(message);
  });

  it('renders the component with number of occurrences properly', () => {
    const message = 'test-title';
    const { getByRole, getByText, container, getByTitle } = render(
      <MockLocalizationProvider
        resources={`machinery-TranslationMemory--number-occurrences = 
                    .title = ${message}`}
      >
        <TranslationMemory itemCount={2} />
      </MockLocalizationProvider>,
    );

    getByRole('listitem');
    getByText('TRANSLATION MEMORY');

    expect(container.querySelector('sup')).toHaveTextContent('2');
    getByTitle(message);
  });
});
