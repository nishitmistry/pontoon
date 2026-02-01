import { render } from '@testing-library/react';
import React from 'react';

import { Locale } from '~/context/Locale';

import { MockLocalizationProvider } from '~/test/utils';

import { MicrosoftTerminology } from './MicrosoftTerminology';

const LOCALE = { msTerminologyCode: 'en-US' };
const PROPS = {
  original: 'A horse, a horse! My kingdom for a horse',
};

describe('<MicrosoftTerminology>', () => {
  it('renders the MicrosoftTerminology component properly', () => {
    const { container } = render(
      <Locale.Provider value={LOCALE}>
        <MockLocalizationProvider>
          <MicrosoftTerminology original={PROPS.original} />
        </MockLocalizationProvider>
      </Locale.Provider>,
    );

    expect(container.querySelectorAll('li')).toHaveLength(1);
    // expect(container.find('Localized').props().id).toEqual(
    //   'machinery-MicrosoftTerminology--translation-source',
    // );
    expect(container.querySelector('li span')).toHaveTextContent('MICROSOFT');
  });
});
