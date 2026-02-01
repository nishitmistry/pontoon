import React from 'react';
import { render } from '@testing-library/react';

import { CaighdeanTranslation } from './CaighdeanTranslation';

describe('<CaighdeanTranslation>', () => {
  it('renders the CaighdeanTranslation component properly', () => {
    const { container } = render(<CaighdeanTranslation />);

    expect(container.querySelectorAll('li')).toHaveLength(1);
    expect(wrapper.find('Localized').props().id).toEqual(
      'machinery-CaighdeanTranslation--translation-source',
    );
    expect(wrapper.find('li span').textContent).toEqual('CAIGHDEAN');
  });
});
