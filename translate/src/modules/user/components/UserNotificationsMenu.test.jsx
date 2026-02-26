import React from 'react';

import * as api from '~/api/uxaction';

import { UserNotification } from './UserNotification';
import {
  UserNotificationsMenu,
  UserNotificationsMenuDialog,
} from './UserNotificationsMenu';
import { expect, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import { MockLocalizationProvider } from '../../../test/utils';

const WrapUserNotificationsMenuDialog = (props) => {
  return (
    <MockLocalizationProvider>
      <UserNotificationsMenuDialog {...props} />
    </MockLocalizationProvider>
  );
};

describe('<UserNotificationsMenuDialog>', () => {
  const NoNotificationText = 'No new notifications.';
  it('shows empty notifications menu if user has no notifications', () => {
    const notifications = [];
    const { getByRole, getByText } = render(
      <WrapUserNotificationsMenuDialog notifications={notifications} />,
    );

    getByRole('listitem');
    getByText(NoNotificationText);
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

    const { getByRole, queryByText } = render(
      <WrapUserNotificationsMenuDialog notifications={notifications} />,
    );

    getByRole('listitem');
    expect(queryByText(NoNotificationText)).toBeNull();
  });
});

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
    const { container } = render(<UserNotificationsMenu user={user} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('shows the notifications icon when the user is logged in', () => {
    const user = {
      isAuthenticated: true,
      notifications: {
        notifications: [],
      },
    };
    const { container } = render(<UserNotificationsMenu user={user} />);

    expect(
      container.querySelector('.user-notifications-menu'),
    ).toBeInTheDocument();
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
    const { container } = render(<UserNotificationsMenu user={user} />);

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
    const { getByRole } = render(
      <MockLocalizationProvider>
        <UserNotificationsMenu
          markAllNotificationsAsRead={markAllNotificationsAsRead}
          user={user}
        />
      </MockLocalizationProvider>,
    );

    //useEffect calls the function once
    expect(api.logUXAction).toHaveBeenCalledOnce();

    fireEvent.click(getByRole('button'));
    expect(api.logUXAction).toHaveBeenCalledTimes(2);

    fireEvent.click(getByRole('button'));
    expect(api.logUXAction).toHaveBeenCalledTimes(2);
  });
});
