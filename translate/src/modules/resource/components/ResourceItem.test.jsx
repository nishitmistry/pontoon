import React from 'react';
import { render } from '@testing-library/react';

import { ResourceItem } from './ResourceItem';
import { ResourcePercent } from './ResourcePercent';

function createShallowResourceItem({ path = 'path' } = {}) {
  return render(
    <ResourceItem
      location={{
        locale: 'locale',
        project: 'project',
        resource: 'resource',
      }}
      resource={{
        path: path,
      }}
    />,
  );
}

describe('<ResourceItem>', () => {
  it('renders correctly', () => {
    const { container } = createShallowResourceItem();
    expect(container.querySelectorAll('li')).toHaveLength(1);
    expect(container.querySelectorAll('a')).toHaveLength(1);
    expect(container.querySelectorAll('span')).toHaveLength(1);
    expect(wrapper.find(ResourcePercent)).toHaveLength(1);
    expect(container.querySelector('a')).toHaveAttribute(
      'href',
      '/locale/project/path/',
    );
  });

  it('sets the className correctly', () => {
    let { container } = createShallowResourceItem();
    expect(container.querySelectorAll('li.current')).toHaveLength(0);

    wrapper = createShallowResourceItem({ path: 'resource' });
    expect(container.querySelectorAll('li.current')).toHaveLength(1);
  });
});
