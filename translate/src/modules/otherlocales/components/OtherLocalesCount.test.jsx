import React from 'react';
import { render } from '@testing-library/react';

import { OtherLocalesCount } from './OtherLocalesCount';

describe('<OtherLocalesCount>', () => {
  it('shows the correct number of preferred translations', () => {
    const otherlocales = {
      translations: [
        {
          locale: {
            code: 'ab',
          },
          is_preferred: true,
        },
        {
          locale: {
            code: 'cd',
          },
          is_preferred: true,
        },
      ],
    };
    const { container } = render(
      <OtherLocalesCount otherlocales={otherlocales} />,
    );

    // There are only preferred results.
    expect(container.querySelectorAll('.count > span')).toHaveLength(1);

    // And there are two of them.
    expect(wrapper.find('.preferred')).toHaveTextContent('2');

    expect(wrapper.textContent).not.toContain('+');
  });

  it('shows the correct number of other translations', () => {
    const otherlocales = {
      translations: [
        {
          locale: {
            code: 'ef',
          },
        },
        {
          locale: {
            code: 'gh',
          },
        },
        {
          locale: {
            code: 'ij',
          },
        },
      ],
    };
    const { container } = render(
      <OtherLocalesCount otherlocales={otherlocales} />,
    );

    // There are only remaining results.
    expect(container.querySelectorAll('.count > span')).toHaveLength(1);
    expect(container.querySelectorAll('.preferred')).toHaveLength(0);

    // And there are three of them.
    expect(wrapper.find('.count > span')).toHaveTextContent('3');

    expect(wrapper.textContent).not.toContain('+');
  });

  it('shows the correct numbers of preferred and other translations', () => {
    const otherlocales = {
      translations: [
        {
          locale: {
            code: 'ab',
          },
          is_preferred: true,
        },
        {
          locale: {
            code: 'cd',
          },
          is_preferred: true,
        },
        {
          locale: {
            code: 'ef',
          },
        },
        {
          locale: {
            code: 'gh',
          },
        },
        {
          locale: {
            code: 'ij',
          },
        },
      ],
    };
    const { container } = render(
      <OtherLocalesCount otherlocales={otherlocales} />,
    );

    // There are both preferred and remaining, and the '+' sign.
    expect(container.querySelectorAll('.count > span')).toHaveLength(3);

    // And each count is correct.
    expect(wrapper.find('.preferred')).toHaveTextContent('2');
    expect(wrapper.find('.count > span').last()).toHaveTextContent('3');

    // And the final display is correct as well.
    expect(wrapper.textContent).toEqual('2+3');
  });
});
