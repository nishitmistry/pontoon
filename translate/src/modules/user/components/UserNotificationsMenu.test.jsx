import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import * as api from '~/api/uxaction';

import {
  UserNotificationsMenu,
  UserNotificationsMenuDialog,
} from './UserNotificationsMenu';
import { MockLocalizationProvider } from '~/test/utils';
import { vi } from 'vitest';

function WrapUserNotificationsMenuDialog({ notifications }) {
  return (
    <MockLocalizationProvider>
      <UserNotificationsMenuDialog notifications={notifications} />
    </MockLocalizationProvider>
  );
}

describe('<UserNotificationsMenuDialog>', () => {
  it('shows empty notifications menu if user has no notifications', () => {
    const notifications = [];
    const { container } = render(
      <WrapUserNotificationsMenuDialog notifications={notifications} />,
    );

    expect(
      container.querySelectorAll('.notification-list .user-notification'),
    ).toHaveLength(0);
    expect(container.querySelectorAll('.notification-list .no')).toHaveLength(
      1,
    );
  });

  it('shows a notification in the notifications menu', () => {
    const notifications = [
      {
        id: 0,
        level: 'level',
        unread: false,
        description: 'description',
        verb: 'verb',
        date: 'Jan 31, 2000 10:20',
        date_iso: '2019-01-31T10:20:00+00:00',
        actor: {
          anchor: 'actor_anchor',
          url: 'actor_url',
        },
        target: {
          anchor: 'target_anchor',
          url: 'target_url',
        },
      },
    ];

    const { container, queryAllByTestId } = render(
      <WrapUserNotificationsMenuDialog notifications={notifications} />,
    );

    expect(container.querySelectorAll('.notification-list .no')).toHaveLength(
      0,
    );
    expect(queryAllByTestId('user-notification')).toHaveLength(1);
  });
});

function WrapUserNotificationsMenu({ user, markAllNotificationsAsRead }) {
  return (
    <MockLocalizationProvider>
      <UserNotificationsMenu
        user={user}
        markAllNotificationsAsRead={markAllNotificationsAsRead}
      />
    </MockLocalizationProvider>
  );
}

describe('<UserNotificationsMenu>', () => {
  beforeEach(() => vi.spyOn(api, 'logUXAction'));
  afterEach(() => vi.restoreAllMocks());

  it('hides the notifications icon when the user is logged out', () => {
    const user = {
      isAuthenticated: false,
      notifications: {
        has_unread: false,
      },
    };
    const { container } = render(<WrapUserNotificationsMenu user={user} />);

    expect(container.querySelectorAll('.user-notifications-menu')).toHaveLength(
      0,
    );
  });

  it('shows the notifications icon when the user is logged in', () => {
    const user = {
      isAuthenticated: true,
      notifications: {
        notifications: [],
      },
    };
    const { container } = render(<WrapUserNotificationsMenu user={user} />);

    expect(container.querySelectorAll('.user-notifications-menu')).toHaveLength(
      1,
    );
  });

  it('shows the notifications badge when the user has unread notifications and call logUxAction', () => {
    const user = {
      isAuthenticated: true,
      notifications: {
        has_unread: true,
        notifications: [],
        unread_count: '5',
      },
    };
    const { container } = render(<WrapUserNotificationsMenu user={user} />);

    expect(
      container.querySelector('.user-notifications-menu .badge'),
    ).toHaveTextContent('5');
    expect(api.logUXAction).toHaveBeenCalled();
  });

  it('calls the logUxAction function on click on the icon if menu not visible', () => {
    const markAllNotificationsAsRead = vi.fn();
    const user = {
      isAuthenticated: true,
      notifications: {
        has_unread: true,
        notifications: [],
      },
    };
    const { container } = render(
      <WrapUserNotificationsMenu
        markAllNotificationsAsRead={markAllNotificationsAsRead}
        user={user}
      />,
    );

    // render() does handle useEffect()
    expect(api.logUXAction).toHaveBeenCalled();

    fireEvent.click(container.querySelector('.selector'));
    expect(api.logUXAction).toHaveBeenCalledTimes(2);

    fireEvent.click(container.querySelector('.selector'));
    expect(api.logUXAction).toHaveBeenCalledTimes(2);
  });
});
