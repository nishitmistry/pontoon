import React from 'react';
import { render } from '@testing-library/react';

import { GoogleTranslation } from './GoogleTranslation';

describe('<GoogleTranslation>', () => {
  it('renders the GoogleTranslation component properly', () => {
    const { container } = render(<GoogleTranslation />);

    expect(container.querySelectorAll('li')).toHaveLength(1);
    expect(wrapper.find('Localized').props().id).toEqual(
      'machinery-GoogleTranslation--translation-source',
    );
    expect(wrapper.find('li span').textContent).toEqual('GOOGLE TRANSLATE');
  });

  it('renders the GoogleTranslation LLM features properly', () => {
    const mockTranslation = {
      translation: 'Translated text here',
      original: 'Original text here',
    };

    const { container } = render(
      <GoogleTranslation
        isOpenAIChatGPTSupported={true}
        translation={mockTranslation}
      />,
    );

    expect(container.querySelectorAll('li')).toHaveLength(1);
    expect(wrapper.find('.selector Localized').first().props().id).toEqual(
      'machinery-GoogleTranslation--translation-source',
    );
    expect(wrapper.find('span.translation-source')).toHaveLength(1);
    expect(wrapper.find('.selector').props().onClick).toBeDefined();
    expect(wrapper.find('span.translation-source').textContent).toEqual(
      'GOOGLE TRANSLATE',
    );
  });
});
