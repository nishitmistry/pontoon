import React from 'react';
import { render } from '@testing-library/react';

import { MicrosoftTranslation } from './MicrosoftTranslation';

describe('<MicrosoftTranslation>', () => {
  it('renders the MicrosoftTranslation component properly', () => {
    const { container } = render(<MicrosoftTranslation />);

    expect(container.querySelectorAll('li')).toHaveLength(1);
    expect(wrapper.find('Localized').props().id).toEqual(
      'machinery-MicrosoftTranslation--translation-source',
    );
    expect(wrapper.find('li span').textContent).toEqual('MICROSOFT TRANSLATOR');
  });
});
