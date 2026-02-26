import React from 'react';

import { ResourceItem } from './ResourceItem';
import { render } from '@testing-library/react';

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
    const { getByRole, container } = createShallowResourceItem();
    getByRole('listitem');
    expect(getByRole('link')).toHaveAttribute('href', '/locale/project/path/');
    expect(container.querySelector('span.path')).toBeInTheDocument();
    expect(container.querySelector('span.percent')).toBeInTheDocument();
  });

  it('sets the className correctly', () => {
    let { container } = createShallowResourceItem();
    expect(container.querySelector('li.current')).toBeNull();

    container = createShallowResourceItem({ path: 'resource' }).container;
    expect(container.querySelector('li.current')).toBeInTheDocument();
  });
});
