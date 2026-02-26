import React from 'react';

import { MachineryTranslations } from '~/context/MachineryTranslations';
import { SearchData } from '~/context/SearchData';
import { MockLocalizationProvider } from '~/test/utils';

import { Machinery } from './Machinery';
import { vi } from 'vitest';
import { render } from '@testing-library/react';

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

    expect(container.querySelector('.search-wrapper')).toBeInTheDocument();
    expect(container.querySelector('#machinery-search')).toBeInTheDocument();
  });

  it('shows the correct number of translations', () => {
    const { getAllByRole, getAllByTitle } = mountMachinery(
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

    expect(getAllByRole('listitem')).toHaveLength(5);
    expect(getAllByTitle(/Copy Into Translation/)).toHaveLength(5);
  });

  it('renders a reset button if a search query is present', () => {
    const { getByRole } = mountMachinery([], { input: 'test', query: 'test' });
    getByRole('button');
  });
});
