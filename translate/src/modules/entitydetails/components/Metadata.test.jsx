import { render } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';

import { Locale } from '~/context/Locale';
import { createReduxStore } from '~/test/store';
import { MockLocalizationProvider } from '~/test/utils';

import { Metadata } from './Metadata';

const SRC_LOC = 'file_source.rs:31';

const ENTITY = {
  pk: 42,
  key: [],
  original: 'le test',
  comment: 'my comment',
  path: 'path/to/RESOURCE',
  meta: [['reference', SRC_LOC]],
  translation: { string: 'the test' },
  project: {
    slug: 'callme',
    name: 'CallMe',
  },
  date_created: new Date().toISOString(),
};

const LOCALE = {
  code: 'kg',
  cldrPlurals: [1, 3, 5],
};

const TERMS = {
  fetching: false,
  sourceString: '',
  terms: [],
};

const USER = {
  user: 'A_Ludgate',
};

function createMetadata(entity = ENTITY) {
  const store = createReduxStore({ user: USER });
  return render(
    <Provider store={store}>
      <MockLocalizationProvider>
        <Locale.Provider value={LOCALE}>
          <Metadata entity={entity} terms={TERMS} user={USER} />
        </Locale.Provider>
      </MockLocalizationProvider>
    </Provider>,
  );
}

vi.mock('@fluent/react', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    Localized: ({ id, children }) => <div data-testid={id}>{children}</div>,
  };
});

describe('<Metadata>', () => {
  it('renders correctly', () => {
    const { container, queryByTestId } = createMetadata();

    expect(container).toHaveTextContent(SRC_LOC);
    expect(queryByTestId('entitydetails-Metadata--comment')).toHaveTextContent(
      ENTITY.comment,
    );

    expect(
      queryByTestId('entitydetails-Metadata--context').querySelector(
        'a.resource-path',
      ).textContent,
    ).toContain(ENTITY.path);
  });

  it('does not require a comment', () => {
    const { container, queryAllByTestId } = createMetadata({
      ...ENTITY,
      comment: '',
    });
    expect(container).toHaveTextContent(SRC_LOC);
    expect(queryAllByTestId('entitydetails-Metadata--comment')).toHaveLength(0);
  });

  it('does not require a source', () => {
    const { container, queryByTestId } = createMetadata({
      ...ENTITY,
      meta: [],
    });
    expect(container.textContent).not.toContain(SRC_LOC);
    expect(queryByTestId('entitydetails-Metadata--comment')).toHaveTextContent(
      ENTITY.comment,
    );
  });

  it('finds examples for placeholders with source', () => {
    const { container } = createMetadata({
      ...ENTITY,
      format: 'webext',
      original: `
        .local $MAXIMUM = {$arg2 @source=|$2| @example=5}
        .local $REMAINING = {$arg1 @source=|$1| @example=1}
        {{{$REMAINING @source=|$REMAINING$|}/{$MAXIMUM @source=|$MAXIMUM$|} masks available.}}`,
    });

    expect(
      container.querySelector('div.placeholder .content').textContent,
    ).toBe('$MAXIMUM$: 5, $REMAINING$: 1');
  });

  it('only shows examples for placeholders with source and example', () => {
    const { container } = createMetadata({
      ...ENTITY,
      format: 'webext',
      original: `
        .local $MAXIMUM = {$arg2 @source=|$2|}
        .local $REMAINING = {$arg1 @source=|$1| @example=1}
        {{{$REMAINING}/{$MAXIMUM @source=|$MAXIMUM$|} masks available.}}`,
    });

    expect(container.querySelectorAll('div.placeholder')).toHaveLength(0);
  });
});
