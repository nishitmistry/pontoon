import { render } from '@testing-library/react';
import React from 'react';

import { EntityView } from '~/context/EntityView';
import { Location } from '~/context/Location';
import * as Translator from '~/hooks/useTranslator';

import { MockLocalizationProvider } from '~/test/utils';

import { UserMenu, UserMenuDialog } from './UserMenu';
import { expect, vi } from 'vitest';
import { fireEvent } from '@testing-library/react';

describe('<UserMenuDialog>', () => {
  beforeAll(() => {
    vi.mock('~/hooks/useTranslator', () => ({ useTranslator: vi.fn() }));
    vi.mock('@fluent/react', async (importOriginal) => {
      const actual = await importOriginal();
      return {
        ...actual,
        Localized: ({ id, children }) => <div data-testid={id}>{children}</div>,
      };
    });
  });
  afterAll(() => {
    Translator.useTranslator.mockRestore();
  });

  const LOCATION = {
    locale: 'my',
    project: 'proj',
    resource: 'res',
    entity: 42,
  };

  function createUserMenu({
    isPM = false,
    isReadOnly = false,
    isTranslator = true,
    isAuthenticated = true,
    location = LOCATION,
  } = {}) {
    Translator.useTranslator.mockReturnValue(isTranslator);
    return render(
      <Location.Provider value={location}>
        <MockLocalizationProvider>
          <EntityView.Provider
            value={{ entity: { pk: 42, readonly: isReadOnly } }}
          >
            <UserMenuDialog user={{ isAuthenticated, isPM }} />
          </EntityView.Provider>
        </MockLocalizationProvider>
      </Location.Provider>,
    );
  }

  it('shows the right menu items when the user is logged in', () => {
    const { container, queryAllByTestId } = createUserMenu();

    expect(container.querySelectorAll('.details')).toHaveLength(1);
    expect(container.querySelectorAll('a[href="/settings/"]')).toHaveLength(1);
    expect(queryAllByTestId('sign-in-out-form')).toHaveLength(1);
  });

  it('hides the right menu items when the user is logged out', () => {
    const { container, queryAllByTestId } = createUserMenu({
      isAuthenticated: false,
    });

    expect(container.querySelectorAll('.details')).toHaveLength(0);
    expect(container.querySelectorAll('a[href="/settings/"]')).toHaveLength(0);
    expect(queryAllByTestId('sign-in-out-form')).toHaveLength(0);
  });

  it('shows upload & download menu items', () => {
    const { queryAllByTestId } = createUserMenu();

    expect(queryAllByTestId('file-upload')).toHaveLength(1);
    expect(
      queryAllByTestId('user-UserMenu--download-translations'),
    ).toHaveLength(1);
  });

  it('hides upload & download menu items when translating all projects', () => {
    const { queryAllByTestId } = createUserMenu({
      location: { ...LOCATION, project: 'all-projects' },
    });

    expect(queryAllByTestId('file-upload')).toHaveLength(0);
    expect(
      queryAllByTestId('user-UserMenu--download-translations'),
    ).toHaveLength(0);
  });

  it('hides admin · current project menu item when translating all projects', () => {
    const { container } = createUserMenu({
      location: { ...LOCATION, project: 'all-projects' },
      isPM: true,
    });

    expect(
      container.querySelectorAll('a[href="/admin/projects/all-projects/"]'),
    ).toHaveLength(0);
  });

  it('shows admin · current project menu item when translating a project', () => {
    const { container } = createUserMenu({ isPM: true });

    expect(
      container.querySelectorAll('a[href="/admin/projects/proj/"]'),
    ).toHaveLength(1);
  });

  it('hides upload & download menu items when translating all resources', () => {
    const { queryAllByTestId } = createUserMenu({
      location: { ...LOCATION, resource: 'all-resources' },
    });

    expect(queryAllByTestId('file-upload')).toHaveLength(0);
    expect(
      queryAllByTestId('user-UserMenu--download-translations'),
    ).toHaveLength(0);
  });

  it('hides upload menu item for users without permission to review translations', () => {
    const { queryAllByTestId } = createUserMenu({ isTranslator: false });

    expect(queryAllByTestId('file-upload')).toHaveLength(0);
  });

  it('hides upload menu for read-only strings', () => {
    const { queryAllByTestId } = createUserMenu({ isReadOnly: true });

    expect(queryAllByTestId('file-upload')).toHaveLength(0);
  });

  it('shows the admin menu items when the user is an admin', () => {
    const { container } = createUserMenu({ isPM: true });

    expect(container.querySelectorAll('a[href="/admin/"]')).toHaveLength(1);
    expect(
      container.querySelectorAll('a[href="/admin/projects/proj/"]'),
    ).toHaveLength(1);
  });
});

describe('<UserMenu>', () => {
  function createShallowUserMenuBase({ isAuthenticated = true } = {}) {
    return render(
      <MockLocalizationProvider>
        <UserMenu user={{ isAuthenticated }} />
      </MockLocalizationProvider>,
    );
  }

  it('shows the user avatar when the user is logged in', () => {
    const { container } = createShallowUserMenuBase();

    expect(container.querySelectorAll('img')).toHaveLength(1);
    expect(container.querySelectorAll('.menu-icon')).toHaveLength(0);
  });

  it('shows the general menu icon when the user is logged out', () => {
    const { container } = createShallowUserMenuBase({ isAuthenticated: false });

    expect(container.querySelectorAll('img')).toHaveLength(0);
    expect(container.querySelectorAll('.menu-icon')).toHaveLength(1);
  });

  it('toggles the user menu when clicking the user avatar', () => {
    const { container, queryAllByTestId } = createShallowUserMenuBase();
    expect(queryAllByTestId('user-menu-dialog')).toHaveLength(0);

    fireEvent.click(container.querySelector('.selector'));
    expect(queryAllByTestId('user-menu-dialog')).toHaveLength(1);

    fireEvent.click(container.querySelector('.selector'));
    expect(queryAllByTestId('user-menu-dialog')).toHaveLength(0);
  });
});
