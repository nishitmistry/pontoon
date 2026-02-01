import React from 'react';

import { TranslationMemory } from './TranslationMemory';
import { render } from '@testing-library/react';

describe('<TranslationMemory>', () => {
  it('renders the component without number of occurrences properly', () => {
    const { container } = render(<TranslationMemory />);

    expect(container.querySelectorAll('li')).toHaveLength(1);
    expect(wrapper.find('Localized')).toHaveLength(1);

    expect(wrapper.find('Localized')[0].props().id).toEqual(
      'machinery-TranslationMemory--translation-source',
    );
    expect(wrapper.find('li .translation-source').textContent).toEqual(
      'TRANSLATION MEMORY',
    );
  });

  it('renders the component with number of occurrences properly', () => {
    const { container } = render(<TranslationMemory itemCount={2} />);

    expect(container.querySelectorAll('li')).toHaveLength(1);
    expect(wrapper.find('Localized')).toHaveLength(2);

    expect(wrapper.find('Localized')[1].props().id).toEqual(
      'machinery-TranslationMemory--number-occurrences',
    );
    expect(container.querySelector('sup').props().title).toEqual(
      'Number of translation occurrences',
    );
    expect(container.querySelector('sup')).toHaveTextContent('2');
  });
});
