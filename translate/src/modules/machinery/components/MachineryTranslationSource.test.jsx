import React from 'react';

import { MachineryTranslationSource } from './MachineryTranslationSource';
import { render } from '@testing-library/react';

import { MockLocalizationProvider } from '~/test/utils';

const DEFAULT_TRANSLATION = {
  sources: ['translation-memory'],
};
const WrapMachineryTranslationSource = (props) => {
  return (
    <MockLocalizationProvider>
      <MachineryTranslationSource {...props} />
    </MockLocalizationProvider>
  );
};
const TranslationMemoryTitle = 'TRANSLATION MEMORY';
const GoogleTranslationTitle = 'GOOGLE TRANSLATE';
const MicrosoftTranslationTitle = 'MICROSOFT TRANSLATOR';
const MicrosoftTerminologyTitle = 'MICROSOFT';
const CaighdeanTranslationTitle = 'CAIGHDEAN';

describe('<MachineryTranslationSource>', () => {
  for (const [type, component, title] of [
    ['translation-memory', 'TranslationMemory', TranslationMemoryTitle],
    ['google-translate', 'GoogleTranslation', GoogleTranslationTitle],
    ['microsoft-translator', 'MicrosoftTranslation', MicrosoftTranslationTitle],
    [
      'microsoft-terminology',
      'MicrosoftTerminology',
      MicrosoftTerminologyTitle,
    ],
    ['caighdean', 'CaighdeanTranslation', CaighdeanTranslationTitle],
  ]) {
    it(`renders ${type} type for ${component} component correctly`, () => {
      const translation = {
        sources: [type],
      };
      const { getByText } = render(
        <WrapMachineryTranslationSource translation={translation} />,
      );

      getByText(title);
    });
  }

  it('shows several sources', () => {
    const translation = {
      sources: [...DEFAULT_TRANSLATION.sources, 'microsoft-terminology'],
    };
    const { getByText } = render(
      <WrapMachineryTranslationSource translation={translation} />,
    );

    getByText(TranslationMemoryTitle);
    getByText(MicrosoftTerminologyTitle);
  });
});
