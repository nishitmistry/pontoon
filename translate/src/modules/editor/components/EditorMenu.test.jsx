import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';

import { EntityView } from '~/context/EntityView';
import { LocationProvider } from '~/context/Location';

import { createDefaultUser, createReduxStore } from '~/test/store';
import { MockLocalizationProvider } from '~/test/utils';

import { EditorMenu } from './EditorMenu';
import { EditorSettings } from './EditorSettings';
import { KeyboardShortcuts } from './KeyboardShortcuts';
import { TranslationLength } from './TranslationLength';
import { expect } from 'vitest';

const SELECTED_ENTITY = {
  pk: 1,
  original: 'le test',
  translation: { string: 'test' },
};

function createEditorMenu({
  isAuthenticated = true,
  entity = SELECTED_ENTITY,
} = {}) {
  const store = createReduxStore();
  createDefaultUser(store, {
    is_authenticated: isAuthenticated,
    settings: { force_suggestions: true },
  });

  const history = createMemoryHistory({
    initialEntries: ['/kg/firefox/all-resources/'],
  });

  const wrapper = render(
    <Provider store={store}>
      <LocationProvider history={history}>
        <MockLocalizationProvider>
          <EntityView.Provider value={{ entity }}>
            <EditorMenu />
          </EntityView.Provider>
        </MockLocalizationProvider>
      </LocationProvider>
    </Provider>,
  );

  act(() => history.push(`?string=1`));

  return wrapper;
}

function expectHiddenSettingsAndActions(wrapper) {
  expect(wrapper.container.querySelectorAll('button')).toHaveLength(0);
  expect(wrapper.queryAllByTestId('editor-settings')).toHaveLength(0);
  expect(wrapper.queryAllByTestId('keyboard-shortcuts')).toHaveLength(0);
  expect(wrapper.queryAllByTestId('translation-lenght')).toHaveLength(0);
  expect(
    wrapper.queryAllByTestId('editor-EditorMenu--button-copy'),
  ).toHaveLength(0);
}

describe('<EditorMenu>', () => {
  beforeAll(() => {

  vi.mock('@fluent/react', async (importOriginal) => {
    const actual = await importOriginal();
    return {
      ...actual,
      Localized: ({ id, children }) => <div data-testid={id}>{children}</div>,
    };
  });

});
  it('does not render while loading', () => {
    const { queryByTestId } = createEditorMenu({ isAuthenticated: null });
    expect(queryByTestId('editor-menu')).toBeEmptyDOMElement();
  });

  it('renders correctly', () => {
    const { container } = createEditorMenu();

    // 3 buttons to control the editor.
    expect(container.querySelector('.action-copy')).toBeInTheDocument();
    expect(container.querySelector('.action-clear')).toBeInTheDocument();
    expect(wrapper.find('EditorMainAction')).toHaveLength(1);
  });

  it('hides the settings and actions when the user is logged out', () => {
    const wrapper = createEditorMenu({ isAuthenticated: false });

    expectHiddenSettingsAndActions(wrapper);

    expect(
      wrapper.queryAllByTestId('editor-EditorMenu--sign-in-to-translate'),
    ).toHaveLength(1);
  });

  it('hides the settings and actions when the entity is read-only', () => {
    const entity = { ...SELECTED_ENTITY, readonly: true };
    const wrapper= createEditorMenu({ entity });

    expectHiddenSettingsAndActions(wrapper);

    expect(
      wrapper.queryAllByTestId('editor-EditorMenu--read-only-localization'),
    ).toHaveLength(1);
  });
});
