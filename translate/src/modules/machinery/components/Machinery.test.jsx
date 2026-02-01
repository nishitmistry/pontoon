import React from 'react';
import { render } from '@testing-library/react';

import { MachineryTranslations } from '~/context/MachineryTranslations';
import { SearchData } from '~/context/SearchData';
import { MockLocalizationProvider } from '~/test/utils';

import { Machinery } from './Machinery';
import { vi } from 'vitest';

vi.mock('~/hooks', () => ({
  useAppDispatch: () => () => {},
  useAppSelector: () => {},
}));

const mountMachinery = (translations, search) =>
  render(
    <MockLocalizationProvider>
      <MachineryTranslations.Provider
        value={{ source: 'source', translations }}
      >
        <SearchData.Provider
          value={{
            input: '',
            query: '',
            page: 1,
            fetching: false,
            results: [],
            hasMore: false,
            setInput: () => {},
            getResults: () => {},
            ...search,
          }}
        >
          <Machinery entity={{ pk: 42 }} />
        </SearchData.Provider>
      </MachineryTranslations.Provider>
    </MockLocalizationProvider>,
  );

describe('<Machinery>', () => {
  it('shows a search form', () => {
    const { container } = mountMachinery([], {});

    expect(container.querySelectorAll('.search-wrapper')).toHaveLength(1);
    expect(container.querySelectorAll('#machinery-search')).toHaveLength(1);
  });

  it('shows the correct number of translations', () => {
    const { container } = mountMachinery(
      [
        { original: '1', sources: [] },
        { original: '2', sources: [] },
        { original: '3', sources: [] },
      ],
      {
        results: [
          { original: '4', sources: [] },
          { original: '5', sources: [] },
        ],
      },
    );

    expect(container.find('MachineryTranslationComponent')).toHaveLength(5);
  });

  it('renders a reset button if a search query is present', () => {
    const { container } = mountMachinery([], { input: 'test', query: 'test' });

    expect(container.querySelectorAll('button')).toHaveLength(1);
  });
});
