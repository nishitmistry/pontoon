import { fireEvent, render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';

import { LocationProvider } from '~/context/Location';

import { createReduxStore } from '~/test/store';
import { MockLocalizationProvider } from '~/test/utils';

import { ResourceItem } from './ResourceItem';
import { ResourceMenu } from './ResourceMenu';

function createResourceMenu({
  project = 'project',
  resource = 'path/to.file',
} = {}) {
  const store = createReduxStore({
    resource: {
      allResources: {},
      resources: [
        { path: 'resourceAbc' },
        { path: 'resourceBcd' },
        { path: 'resourceCde' },
      ],
    },
  });
  const history = createMemoryHistory({
    initialEntries: [`/locale/${project}/${resource}/`],
  });
  return render(
    <Provider store={store}>
      <LocationProvider history={history}>
        <MockLocalizationProvider>
          <ResourceMenu />
        </MockLocalizationProvider>
      </LocationProvider>
    </Provider>,
  );
}

describe('<ResourceMenu>', () => {
  it('renders resource menu correctly', () => {
    const { container } = createResourceMenu();
    fireEvent.click(container.querySelector('.selector'));

    expect(container.querySelectorAll('.menu .search-wrapper')).toHaveLength(1);
    expect(container.querySelectorAll('.menu > ul')).toHaveLength(2);
    expect(
      container.querySelectorAll('.menu > ul').find(ResourceItem),
    ).toHaveLength(3);
    expect(container.querySelectorAll('.menu .static-links')).toHaveLength(1);
    expect(
      wrapper.find('.menu #resource-ResourceMenu--all-resources'),
    ).toHaveLength(1);
    expect(
      wrapper.find('.menu #resource-ResourceMenu--all-projects'),
    ).toHaveLength(1);
  });

  it('searches resource items correctly', () => {
    const SEARCH = 'bc';
    const { container } = createResourceMenu();
    fireEvent.click(container.querySelector('.selector'));

    act(() => {
      wrapper.find('.menu .search-wrapper input').prop('onChange')({
        currentTarget: { value: SEARCH },
      });
    });

    expect(wrapper.find('.menu .search-wrapper input').prop('value')).toEqual(
      SEARCH,
    );
    expect(
      container.querySelectorAll('.menu > ul').find(ResourceItem),
    ).toHaveLength(2);
  });

  it('hides resource selector for all-projects', () => {
    const { container } = createResourceMenu({ project: 'all-projects' });

    expect(container.querySelectorAll('.resource-menu .selector')).toHaveLength(
      0,
    );
  });

  it('renders resource selector correctly', () => {
    const { container } = createResourceMenu();

    const selector = wrapper.find('.resource-menu .selector');
    expect(selector).toHaveLength(1);
    expect(selector.prop('title')).toEqual('path/to.file');
    expect(selector.find('span:first-child').textContent).toEqual('to.file');
    expect(selector.find('.icon')).toHaveLength(1);
  });

  it('sets a localized resource name correctly for all-resources', () => {
    const { container } = createResourceMenu({ resource: 'all-resources' });

    expect(wrapper.find('#resource-ResourceMenu--all-resources')).toHaveLength(
      1,
    );
  });

  it('renders resource menu correctly', () => {
    const { container } = createResourceMenu();

    expect(wrapper.find('ResourceMenuDialog')).toHaveLength(0);
    fireEvent.click(container.querySelector('.selector'));
    expect(wrapper.find('ResourceMenuDialog')).toHaveLength(1);
  });
});
