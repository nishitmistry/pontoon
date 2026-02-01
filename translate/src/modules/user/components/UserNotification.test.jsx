import { render } from '@testing-library/react';
import React from 'react';
import { UserNotification } from './UserNotification';
import { vi } from 'vitest';

vi.mock('react-time-ago', () => {
  return {
    default: () => null,
  };
});

const notificationBase = {
  id: 0,
  level: 'level',
  unread: false,
  description: null,
  verb: 'verb',
  date: 'Jan 31, 2000 10:20',
  date_iso: '2019-01-31T10:20:00+00:00',
  actor: { anchor: 'actor_anchor', url: 'actor_url' },
  target: { anchor: 'target_anchor', url: 'target_url' },
};

describe('<UserNotification>', () => {
  it('shows an "Unreviewed suggestions" notification', () => {
    const notification = {
      ...notificationBase,
      description: { content: 'Unreviewed suggestions: <b id="foo">foo</b>' },
    };
    const { container } = render(
      <UserNotification notification={notification} />,
    );

    const desc = container.querySelector('span.description');
    expect(desc.querySelectorAll('b#foo')).toHaveLength(1);
  });

  it('shows a "has reviewed suggestions" notification', () => {
    const notification = {
      ...notificationBase,
      description: { content: 'Reviewed: <b id="bar">bar</b>' },
      verb: 'has reviewed suggestions',
    };
    const { container } = render(
      <UserNotification notification={notification} />,
    );

    const desc = container.querySelector('span.description');
    expect(desc.querySelectorAll('b#bar')).toHaveLength(1);
  });

  it('shows a comment notification', () => {
    const notification = {
      ...notificationBase,
      description: {
        content: 'Comment: <b id="baz">baz</b>',
        is_comment: true,
      },
    };
    const { container } = render(
      <UserNotification notification={notification} />,
    );

    expect(container.querySelectorAll('.message.trim b#baz')).toHaveLength(1);
  });

  it('shows other notification with description', () => {
    const notification = {
      ...notificationBase,
      description: { content: 'Other: <b id="fuzz">fuzz</b>' },
    };
    const { container } = render(
      <UserNotification notification={notification} />,
    );

    const desc = container.querySelector('.message');
    expect(desc.querySelectorAll('b#fuzz')).toHaveLength(1);
  });

  it('shows other notification without description', () => {
    const notification = {
      ...notificationBase,
      description: { content: null },
      verb: 'is Other',
    };
    const { container } = render(
      <UserNotification notification={notification} />,
    );

    expect(container.querySelector('.message')).toHaveTextContent('');
    expect(container.querySelector('.verb')).toHaveTextContent('is Other');
  });
});
