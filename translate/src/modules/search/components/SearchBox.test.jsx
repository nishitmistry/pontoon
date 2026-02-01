import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { expect, vi } from 'vitest';

import { createReduxStore, mountComponentWithStore } from '~/test/store';

import { FILTERS_EXTRA, FILTERS_STATUS } from '../constants';
import { SearchBox, SearchBoxBase } from './SearchBox';
import { fireEvent } from '@testing-library/react';

const PROJECT = {
  tags: [],
};

const SEARCH_AND_FILTERS = {
  authors: [],
  countsPerMinute: [],
};

describe('<SearchBoxBase>', () => {
  it('shows a search input', () => {
    const params = {
      search: '',
    };
    const { container } = render(
      <SearchBoxBase
        parameters={params}
        project={PROJECT}
        searchAndFilters={SEARCH_AND_FILTERS}
      />,
    );

    expect(container.querySelectorAll('input#search')).toHaveLength(1);
  });

  it('has the correct placeholder based on parameters', () => {
    for (const { name, slug } of FILTERS_STATUS) {
      const { container } = render(
        <SearchBoxBase
          parameters={{ status: slug }}
          project={PROJECT}
          searchAndFilters={SEARCH_AND_FILTERS}
        />,
      );

      expect(container.querySelector('input#search')).toHaveAttribute(
        'placeholder',
        expect.stringContaining(name),
      );
    }

    for (const { name, slug } of FILTERS_EXTRA) {
      const { container } = render(
        <SearchBoxBase
          parameters={{ extra: slug }}
          project={PROJECT}
          searchAndFilters={SEARCH_AND_FILTERS}
        />,
      );
      expect(container.querySelector('input#search')).toHaveAttribute(
        'placeholder',
        expect.stringContaining(name),
      );
    }
  });

  it('empties the search field after navigation parameter "search" gets removed', () => {
    const { container, rerender } = render(
      <SearchBoxBase
        parameters={{ search: 'search' }}
        project={PROJECT}
        searchAndFilters={SEARCH_AND_FILTERS}
      />,
    );

    expect(container.querySelector('input')).toHaveValue('search');

    rerender(
      <SearchBoxBase
        parameters={{ search: null }}
        project={PROJECT}
        searchAndFilters={SEARCH_AND_FILTERS}
      />,
    );

    expect(container.querySelector('input')).toHaveValue('');
  });

  it('toggles a filter', () => {
    const { container } = render(
      <SearchBoxBase
        parameters={{}}
        project={PROJECT}
        searchAndFilters={SEARCH_AND_FILTERS}
      />,
    );

    expect(wrapper.find('FiltersPanel').prop('filters').statuses).toEqual([]);

    act(() => {
      wrapper.find('FiltersPanel').prop('toggleFilter')('missing', 'statuses');
    });

    expect(wrapper.find('FiltersPanel').prop('filters').statuses).toEqual([
      'missing',
    ]);
  });

  it('sets a single filter', () => {
    const { container } = render(
      <SearchBoxBase
        dispatch={() => {}}
        parameters={{ push() {} }}
        project={PROJECT}
        searchAndFilters={SEARCH_AND_FILTERS}
        store={{ getState: () => ({ unsavedchanges: {} }) }}
      />,
    );

    act(() => {
      const { toggleFilter, applySingleFilter } = wrapper
        .find('FiltersPanel')
        .props();
      toggleFilter('missing', 'statuses');
      applySingleFilter('warnings', 'statuses');
    });

    expect(wrapper.find('FiltersPanel').prop('filters').statuses).toEqual([
      'warnings',
    ]);
  });

  it('sets multiple & resets to initial statuses', () => {
    const { container } = render(
      <SearchBoxBase
        parameters={{}}
        project={PROJECT}
        searchAndFilters={SEARCH_AND_FILTERS}
      />,
    );

    act(() => {
      const toggle = wrapper.find('FiltersPanel').prop('toggleFilter');
      toggle('warnings', 'statuses');
      toggle('rejected', 'extras');
    });

    act(() => {
      const toggle = wrapper.find('FiltersPanel').prop('toggleFilter');
      toggle('errors', 'statuses');
    });

    expect(wrapper.find('FiltersPanel').prop('filters')).toMatchObject({
      extras: ['rejected'],
      statuses: ['warnings', 'errors'],
    });

    act(() => {
      wrapper.find('FiltersPanel').prop('resetFilters')();
    });

    expect(wrapper.find('FiltersPanel').prop('filters')).toMatchObject({
      extras: [],
      statuses: [],
    });
  });

  it('sets status to null when "all" is selected', () => {
    const push = vi.fn();
    const { container } = render(
      <SearchBoxBase
        dispatch={(a) => (typeof a === 'function' ? a() : {})}
        parameters={{ push }}
        project={PROJECT}
        searchAndFilters={SEARCH_AND_FILTERS}
        store={{ getState: () => ({ unsavedchanges: {} }) }}
      />,
    );

    act(() => {
      const apply = wrapper.find('FiltersPanel').prop('applySingleFilter');
      apply('all', 'statuses');
    });

    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenNthCalledWith(1, {
      author: '',
      extra: '',
      list: null,
      search: '',
      status: null,
      tag: '',
      time: null,
      entity: 0,
    });
  });

  it('sets correct status', () => {
    const push = vi.fn();
    const { container } = render(
      <SearchBoxBase
        dispatch={(a) => (typeof a === 'function' ? a() : {})}
        parameters={{ push }}
        project={PROJECT}
        searchAndFilters={SEARCH_AND_FILTERS}
        store={{ getState: () => ({ unsavedchanges: {} }) }}
      />,
    );

    act(() => {
      const panel = wrapper.find('FiltersPanel');
      const toggle = panel.prop('toggleFilter');
      const setTimeRange = panel.prop('setTimeRange');
      toggle('missing', 'statuses');
      toggle('unchanged', 'extras');
      toggle('browser', 'tags');
      toggle('user@example.com', 'authors');
      setTimeRange('111111111111-111111111111');
    });

    act(() => {
      const toggle = wrapper.find('FiltersPanel').prop('toggleFilter');
      toggle('warnings', 'statuses');
    });

    const apply = wrapper.find('FiltersPanel').prop('applyFilters');
    apply();

    expect(push).toHaveBeenCalledWith({
      author: 'user@example.com',
      extra: 'unchanged',
      search: '',
      status: 'missing,warnings',
      tag: 'browser',
      time: '111111111111-111111111111',
      entity: 0,
      list: null,
    });
  });
});

describe('<SearchBox>', () => {
  it('updates the search text after a delay', () => {
    const history = createMemoryHistory({
      initialEntries: ['/kg/firefox/all-resources/'],
    });
    const spy = vi.fn();
    history.listen(spy);

    const store = createReduxStore();
    const { container } = mountComponentWithStore(
      SearchBox,
      store,
      {},
      history,
    );

    act(() => {
      fireEvent.change(container.querySelector('input#search'), {
        target: { value: 'test' },
      });
    });

    // The state has been updated correctly...
    expect(container.querySelector('input#search')).toHaveValue('test');

    // ... but it wasn't propagated to the global redux store yet.
    expect(spy).not.toHaveBeenCalled();

    // Wait until Enter is pressed.
    fireEvent.keyDown(container.querySelector('input#search'), {
      key: 'Enter',
      code: 'Enter',
    });

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenNthCalledWith(
      1,
      {
        key: expect.anything(),
        pathname: '/kg/firefox/all-resources/',
        search: '?search=test',
        hash: '',
        state: undefined,
      },
      'PUSH',
    );
  });

  it('puts focus on the search input on Ctrl + Shift + F', () => {
    const { container } = render(
      <SearchBoxBase
        parameters={{ search: '' }}
        project={PROJECT}
        searchAndFilters={SEARCH_AND_FILTERS}
      />,
    );

    const focusMock = vi.spyOn(
      container.querySelector('input#search'),
      'focus',
    );
    document.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'F',
        ctrlKey: true,
        shiftKey: true,
      }),
    );

    expect(focusMock).toHaveBeenCalledOnce();
  });
});
