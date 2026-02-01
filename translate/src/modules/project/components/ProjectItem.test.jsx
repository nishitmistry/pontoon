import React from 'react';
import { render } from '@testing-library/react';

import { ProjectItem } from './ProjectItem';

function createShallowProjectItem({ slug = 'slug' } = {}) {
  return render(
    <ProjectItem
      location={{
        locale: 'locale',
        project: 'project',
        resource: 'resource',
      }}
      localization={{
        project: { slug, name: 'Project' },
        approvedStrings: 2,
        stringsWithWarnings: 3,
        totalStrings: 10,
      }}
    />,
  );
}

describe('<ProjectItem>', () => {
  it('renders correctly', () => {
    const { container } = createShallowProjectItem();
    expect(container.querySelectorAll('li')).toHaveLength(1);
    expect(container.querySelectorAll('a')).toHaveLength(1);
    expect(wrapper.find('span.project')).toHaveLength(1);
    expect(wrapper.find('span.percent')).toHaveLength(1);
    expect(container.querySelector('a').prop('href')).toEqual(
      '/locale/slug/all-resources/',
    );
  });

  it('sets the className for the current project', () => {
    const { container } = createShallowProjectItem({ slug: 'project' });
    expect(wrapper.find('li.current')).toHaveLength(1);
  });

  it('sets the className for another project', () => {
    const { container } = createShallowProjectItem();
    expect(wrapper.find('li.current')).toHaveLength(0);
  });

  it('renders completion percentage correctly', () => {
    const { container } = createShallowProjectItem();
    expect(wrapper.find('.percent').textContent).toEqual('50%');
  });
});
