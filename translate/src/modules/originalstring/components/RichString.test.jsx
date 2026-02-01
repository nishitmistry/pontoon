import ftl from '@fluent/dedent';
import React from 'react';
import { render } from '@testing-library/react';

import { editMessageEntry, parseEntry } from '~/utils/message';
import { RichString } from './RichString';
import { fireEvent } from '@testing-library/react';

const ORIGINAL = ftl`
  song-title = Hello
      .genre = Pop
      .album = Hello and Good Bye
  `;

describe('<RichString>', () => {
  it('renders value and each attribute correctly', () => {
    const message = editMessageEntry(parseEntry('fluent', ORIGINAL));
    const { container } = render(<RichString message={message} terms={{}} />);

    expect(wrapper.find('Highlight')).toHaveLength(3);

    expect(container.querySelector('label')[0].html()).toContain('Value');
    expect(wrapper.find('Highlight')[0].html()).toContain('Hello');

    expect(container.querySelector('label')[1].html()).toContain('genre');
    expect(wrapper.find('Highlight')[1].html()).toContain('Pop');

    expect(container.querySelector('label')[2].html()).toContain('album');
    expect(wrapper.find('Highlight')[2].html()).toContain('Hello and Good Bye');
  });

  it('renders select expression correctly', () => {
    const input = ftl`
      user-entry =
          { PLATFORM() ->
              [variant-1] Hello!
             *[variant-2] Good Bye!
          }
      `;

    const message = editMessageEntry(parseEntry('fluent', input));
    const { container } = render(<RichString message={message} terms={{}} />);

    expect(wrapper.find('Highlight')).toHaveLength(2);

    expect(container.querySelector('label')[0].html()).toContain('variant-1');
    expect(wrapper.find('Highlight')[0].html()).toContain('Hello!');

    expect(container.querySelector('label')[1].html()).toContain('variant-2');
    expect(wrapper.find('Highlight')[1].html()).toContain('Good Bye!');
  });

  it('renders select expression in attributes properly', () => {
    const input = ftl`
      my-entry =
          .label =
              { PLATFORM() ->
                  [macosx] Preferences
                 *[other] Options
              }
          .accesskey =
              { PLATFORM() ->
                  [macosx] e
                 *[other] s
              }
      `;

    const message = editMessageEntry(parseEntry('fluent', input));
    const { container } = render(<RichString message={message} terms={{}} />);

    expect(container.querySelectorAll('label')).toHaveLength(4);
    expect(wrapper.find('td > span')).toHaveLength(4);

    expect(container.querySelector('label')[0].html()).toMatch(/label.*macosx/);
    expect(wrapper.find('td > span')[0].html()).toContain('Preferences');

    expect(container.querySelector('label')[1].html()).toMatch(/label.*other/);
    expect(wrapper.find('td > span')[1].html()).toContain('Options');

    expect(container.querySelector('label')[2].html()).toMatch(
      /accesskey.*macosx/,
    );
    expect(wrapper.find('td > span')[2].html()).toContain('e');

    expect(container.querySelector('label')[3].html()).toMatch(
      /accesskey.*other/,
    );
    expect(wrapper.find('td > span')[3].html()).toContain('s');
  });

  it('calls the onClick function on click on .original', () => {
    const message = editMessageEntry(parseEntry('fluent', ORIGINAL));
    const spy = vi.fn();
    const { container } = render(
      <RichString message={message} onClick={spy} terms={{}} />,
    );

    fireEvent.click(container.querySelector('.original'));
    expect(spy).toHaveBeenCalled();
  });
});
