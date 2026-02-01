import React from 'react';
import { render } from '@testing-library/react';

import { ResourcePercent } from './ResourcePercent';
import { MockLocalizationProvider } from '../../../test/utils';

describe('<ResourcePercent>', () => {
  const RESOURCE = {
    approvedStrings: 2,
    pretranslatedStrings: 1,
    stringsWithWarnings: 2,
    totalStrings: 10,
  };

  it('renders correctly', () => {
    const { container } = render(
      <MockLocalizationProvider>
        <ResourcePercent resource={RESOURCE} />
      </MockLocalizationProvider>,
    );
    expect(container.querySelector('.percent')).toHaveTextContent('50%');
  });
});
