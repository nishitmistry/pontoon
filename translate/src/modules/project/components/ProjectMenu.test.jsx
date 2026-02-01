import { render } from '@testing-library/react';
import React, { useContext } from 'react';

import { ProjectMenu, ProjectMenuDialog } from './ProjectMenu';
import { vi } from 'vitest';
import { fireEvent } from '@testing-library/react';
import { MockLocalizationProvider } from '../../../test/utils';
import { within } from '@testing-library/dom'

beforeAll(() => {
  vi.mock('react', async (importOriginal) => {
    const actual = await importOriginal();
    return {
      ...actual,
      useContext: vi.fn(),
    };
  });

  vi.mock('@fluent/react', async (importOriginal) => {
    const actual = await importOriginal();
    return {
      ...actual,
      Localized: ({ id, children }) => <div data-testid={id}>{children}</div>,
    };
  });

});
afterAll(() => vi.restoreAllMocks());

function createShallowProjectMenuDialog({
  project = {
    slug: 'project',
    name: 'Project',
  },
} = {}) {
  vi.mocked(useContext).mockReturnValue({
    code: 'locale',
    localizations: [{ project }],
  });
  return render(
    <MockLocalizationProvider>
      <ProjectMenuDialog parameters={{ project: project.slug }} />
    </MockLocalizationProvider>
  );
}

describe('<ProjectMenu>', () => {
  it('renders properly', () => {
    const { container } = createShallowProjectMenuDialog();

    expect(container.querySelectorAll('.menu .search-wrapper')).toHaveLength(1);
    expect(container.querySelectorAll('.menu > ul')).toHaveLength(1);
    expect(
      within(container.querySelector('.menu > ul')).queryAllByTestId("project-item"),
    ).toHaveLength(1);
  });

  it('returns no results for non-matching searches', () => {
    const SEARCH_NO_MATCH = 'bc';
    const { container } = createShallowProjectMenuDialog({
      project: ALL_PROJECTS,
    });

    fireEvent.change(container.querySelector('.menu .search-wrapper input'),  { target: { value: SEARCH_NO_MATCH } })

    expect(container.querySelector('.menu .search-wrapper input')).toHaveValue(
      SEARCH_NO_MATCH,
    );
    expect(
      within(container.querySelector('.menu > ul')).queryAllByTestId("project-item"),
    ).toHaveLength(0);
  });

  it('searches project items correctly', () => {
    const SEARCH_MATCH = 'roj';
    const { container } = createShallowProjectMenuDialog({
      project: ALL_PROJECTS,
    });

    fireEvent.change(container.querySelector('.menu .search-wrapper input'),  { target: { value: SEARCH_MATCH } })

    expect(container.querySelector('.menu .search-wrapper input')).toHaveValue(
      SEARCH_MATCH,
    );
    expect(
      within(container.querySelector('.menu > ul')).queryAllByTestId("project-item"),
    ).toHaveLength(1);
  });
});

function createShallowProjectMenu({
  project = {
    slug: 'project',
    name: 'Project',
  },
} = {}) {
  vi.mocked(useContext).mockReturnValue({
    code: 'locale',
    localizations: [{ project }],
  });
  return render(
    <MockLocalizationProvider>

    <ProjectMenu
      parameters={{
        project: project.slug,
      }}
      project={{
        name: project.name,
        slug: project.slug,
      }}
      />
      </MockLocalizationProvider>
  );
}

const ALL_PROJECTS = {
  slug: 'all-projects',
  name: 'All Projects',
};

describe('<ProjectMenuBase>', () => {
  it('shows a link to localization dashboard in regular view', () => {
    const { container } = createShallowProjectMenu();

    expect(container).toHaveTextContent('Project');
    expect(container.querySelector('a')).toHaveAttribute("href",
      '/locale/project/',
    );
  });

  it('shows project selector in all projects view', () => {
    const { container, queryAllByTestId } = createShallowProjectMenu({ project: ALL_PROJECTS });

    expect(container.querySelectorAll('.project-menu .selector')).toHaveLength(
      1,
    );
    expect(
      queryAllByTestId('project-ProjectMenu--all-projects'),
    ).toHaveLength(1);
    expect(
      container.querySelectorAll('.project-menu .selector .icon'),
    ).toHaveLength(1);
  });

  it('renders the project menu upon clicking on all projects', () => {
    const { container, queryAllByTestId } = createShallowProjectMenu({ project: ALL_PROJECTS });
    fireEvent.click(container.querySelector('.selector'));

    expect(queryAllByTestId('project-menu-dialog')).toHaveLength(1);
  });
});
