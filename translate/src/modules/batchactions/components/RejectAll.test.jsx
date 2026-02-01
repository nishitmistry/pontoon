import { render } from '@testing-library/react';
import React from 'react';

import { MockLocalizationProvider } from '~/test/utils';

import { RejectAll } from './RejectAll';
import { vi } from 'vitest';
import { fireEvent } from '@testing-library/react';

const DEFAULT_BATCH_ACTIONS = {
  entities: [],
  lastCheckedEntity: null,
  requestInProgress: null,
  response: null,
};

const WrapRejectAll = (props) => (
  <MockLocalizationProvider>
    <RejectAll {...props} />
  </MockLocalizationProvider>
);
vi.mock('@fluent/react', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    Localized: ({ id, children }) => <div data-testid={id}>{children}</div>,
  };
});

describe('<RejectAll>', () => {
  it('renders default button correctly', () => {
    const { container, queryAllByTestId } = render(
      <WrapRejectAll batchactions={DEFAULT_BATCH_ACTIONS} />,
    );

    expect(container.querySelectorAll('.reject-all')).toHaveLength(1);
    expect(queryAllByTestId('batchactions-RejectAll--default')).toHaveLength(1);
    expect(queryAllByTestId('batchactions-RejectAll--error')).toHaveLength(0);
    expect(queryAllByTestId('batchactions-RejectAll--success')).toHaveLength(0);
    expect(queryAllByTestId('batchactions-RejectAll--invalid')).toHaveLength(0);
    expect(container.querySelectorAll('.fas')).toHaveLength(0);
  });

  it('renders error button correctly', () => {
    const { container, queryAllByTestId } = render(
      <WrapRejectAll
        batchactions={{
          ...DEFAULT_BATCH_ACTIONS,
          response: {
            action: 'reject',
            error: true,
          },
        }}
      />,
    );

    expect(container.querySelectorAll('.reject-all')).toHaveLength(1);
    expect(queryAllByTestId('batchactions-RejectAll--default')).toHaveLength(0);
    expect(queryAllByTestId('batchactions-RejectAll--error')).toHaveLength(1);
    expect(queryAllByTestId('batchactions-RejectAll--success')).toHaveLength(0);
    expect(queryAllByTestId('batchactions-RejectAll--invalid')).toHaveLength(0);
    expect(container.querySelectorAll('.fas')).toHaveLength(0);
  });

  it('renders success button correctly', () => {
    const { container, queryAllByTestId } = render(
      <WrapRejectAll
        batchactions={{
          ...DEFAULT_BATCH_ACTIONS,
          response: {
            action: 'reject',
            changedCount: 2,
          },
        }}
      />,
    );

    expect(container.querySelectorAll('.reject-all')).toHaveLength(1);
    expect(queryAllByTestId('batchactions-RejectAll--default')).toHaveLength(0);
    expect(queryAllByTestId('batchactions-RejectAll--error')).toHaveLength(0);
    expect(queryAllByTestId('batchactions-RejectAll--success')).toHaveLength(1);
    expect(queryAllByTestId('batchactions-RejectAll--invalid')).toHaveLength(0);
    expect(container.querySelectorAll('.fas')).toHaveLength(0);
  });

  it('renders success with invalid button correctly', () => {
    const { container, queryAllByTestId } = render(
      <WrapRejectAll
        batchactions={{
          ...DEFAULT_BATCH_ACTIONS,
          response: {
            action: 'reject',
            changedCount: 2,
            invalidCount: 1,
          },
        }}
      />,
    );

    expect(container.querySelectorAll('.reject-all')).toHaveLength(1);
    expect(queryAllByTestId('batchactions-RejectAll--default')).toHaveLength(0);
    expect(queryAllByTestId('batchactions-RejectAll--error')).toHaveLength(0);
    expect(queryAllByTestId('batchactions-RejectAll--success')).toHaveLength(1);
    expect(queryAllByTestId('batchactions-RejectAll--invalid')).toHaveLength(1);
    expect(container.querySelectorAll('.fas')).toHaveLength(0);
  });

  it('raise confirmation warning when Reject All button is clicked', () => {
    const mockRejectAll = vi.fn();

    const { container, queryAllByTestId } = render(
      <WrapRejectAll
        batchactions={DEFAULT_BATCH_ACTIONS}
        rejectAll={mockRejectAll}
      />,
    );

    fireEvent.click(container.querySelector('.reject-all'));
    expect(mockRejectAll).not.toHaveBeenCalled();
    expect(
      queryAllByTestId('batchactions-RejectAll--confirmation'),
    ).toHaveLength(1);
  });

  it('performs reject all action when Reject All button is confirmed', () => {
    const mockRejectAll = vi.fn();

    const { container } = render(
      <WrapRejectAll
        batchactions={DEFAULT_BATCH_ACTIONS}
        rejectAll={mockRejectAll}
      />,
    );

    expect(mockRejectAll).not.toHaveBeenCalled();
    fireEvent.click(container.querySelector('.reject-all'));
    fireEvent.click(container.querySelector('.reject-all'));
    expect(mockRejectAll).toHaveBeenCalled();
  });
});
