import React from 'react';

import { OtherLocales } from './OtherLocales';
import { render } from '@testing-library/react';
import { createReduxStore, mountComponentWithStore } from '../../../test/store';
import { MockLocalizationProvider } from '../../../test/utils';

describe('<OtherLocales>', () => {
  it('shows the correct number of translations', () => {
    const OtherLocaleTranslationTitle = /Copy Into Translation/;
    const otherlocales = {
      translations: [
        {
          locale: {
            code: 'ar',
          },
        },
        {
          locale: {
            code: 'br',
          },
        },
        {
          locale: {
            code: 'cr',
          },
        },
      ],
    };
    const params = {
      locale: 'kg',
      project: 'tmo',
    };
    const user = {};
    const store = createReduxStore();
    const { getAllByTitle } = mountComponentWithStore(OtherLocales, store, {
      entity: { format: '' },
      otherlocales: otherlocales,
      parameters: params,
      user,
    });

    expect(getAllByTitle(OtherLocaleTranslationTitle)).toHaveLength(3);
  });

  it('returns null while otherlocales are loading', () => {
    const otherlocales = {
      fetching: true,
    };
    const user = {};
    const { container } = render(
      <OtherLocales otherlocales={otherlocales} user={user} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders a no results message if otherlocales is empty', () => {
    const message = 'test-message';
    const otherlocales = {
      fetching: false,
      translations: [],
    };
    const user = {};
    const { getByText } = render(
      <MockLocalizationProvider
        resource={`history-History--no-translations = ${message}`}
      >
        <OtherLocales otherlocales={otherlocales} user={user} />,
      </MockLocalizationProvider>,
    );
    getByText(message);
  });
});
