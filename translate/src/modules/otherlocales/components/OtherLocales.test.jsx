import React from 'react';
import { render } from '@testing-library/react';

import { OtherLocales } from './OtherLocales';

describe('<OtherLocales>', () => {
  it('shows the correct number of translations', () => {
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
    const { container } = render(
      <OtherLocales
        otherlocales={otherlocales}
        parameters={params}
        user={user}
      />,
    );

    expect(wrapper.find('OtherLocaleTranslationComponent')).toHaveLength(3);
  });

  it('returns null while otherlocales are loading', () => {
    const otherlocales = {
      fetching: true,
    };
    const user = {};
    const { container } = render(
      <OtherLocales otherlocales={otherlocales} user={user} />,
    );

    expect(wrapper.type()).toBeNull();
  });

  it('renders a no results message if otherlocales is empty', () => {
    const otherlocales = {
      fetching: false,
      translations: [],
    };
    const user = {};
    const { container } = render(
      <OtherLocales otherlocales={otherlocales} user={user} />,
    );

    expect(
      container.querySelectorAll('#history-history-no-translations'),
    ).toHaveLength(1);
  });
});
