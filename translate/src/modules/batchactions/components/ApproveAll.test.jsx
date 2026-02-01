import React from 'react';
import { render } from '@testing-library/react';

import { MockLocalizationProvider } from '~/test/utils';

import { ApproveAll } from './ApproveAll';
import { vi } from 'vitest';
import { fireEvent } from '@testing-library/react';

const DEFAULT_BATCH_ACTIONS = {
  entities: [],
  lastCheckedEntity: null,
  requestInProgress: null,
  response: null,
};

const WrapApproveAll = (props) => (
  <MockLocalizationProvider>
    <ApproveAll {...props} />
  </MockLocalizationProvider>
);

vi.mock('@fluent/react', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    Localized: ({ id, children }) => <div data-testid={id}>{children}</div>,
  };
});

describe('<ApproveAll>', () => {
  it('renders default button correctly', () => {
    const { container, queryAllByTestId } = render(
      <WrapApproveAll batchactions={DEFAULT_BATCH_ACTIONS} />,
    );

    expect(container.querySelectorAll('.approve-all')).toHaveLength(1);
    expect(queryAllByTestId('batchactions-ApproveAll--default')).toHaveLength(
      1,
    );
    expect(queryAllByTestId('batchactions-ApproveAll--error')).toHaveLength(0);
    expect(queryAllByTestId('batchactions-ApproveAll--success')).toHaveLength(
      0,
    );
    expect(queryAllByTestId('batchactions-ApproveAll--invalid')).toHaveLength(
      0,
    );
    expect(container.querySelectorAll('.fas')).toHaveLength(0);
  });

  it('renders error button correctly', () => {
    const { container, queryAllByTestId } = render(
      <WrapApproveAll
        batchactions={{
          ...DEFAULT_BATCH_ACTIONS,
          response: {
            action: 'approve',
            error: true,
          },
        }}
      />,
    );

    expect(container.querySelectorAll('.approve-all')).toHaveLength(1);
    expect(queryAllByTestId('batchactions-ApproveAll--default')).toHaveLength(
      0,
    );
    expect(queryAllByTestId('batchactions-ApproveAll--error')).toHaveLength(1);
    expect(queryAllByTestId('batchactions-ApproveAll--success')).toHaveLength(
      0,
    );
    expect(queryAllByTestId('batchactions-ApproveAll--invalid')).toHaveLength(
      0,
    );
    expect(container.querySelectorAll('.fas')).toHaveLength(0);
  });

  it('renders success button correctly', () => {
    const { container, queryAllByTestId } = render(
      <WrapApproveAll
        batchactions={{
          ...DEFAULT_BATCH_ACTIONS,
          response: {
            action: 'approve',
            changedCount: 2,
          },
        }}
      />,
    );

    expect(container.querySelectorAll('.approve-all')).toHaveLength(1);
    expect(queryAllByTestId('batchactions-ApproveAll--default')).toHaveLength(
      0,
    );
    expect(queryAllByTestId('batchactions-ApproveAll--error')).toHaveLength(0);
    expect(queryAllByTestId('batchactions-ApproveAll--success')).toHaveLength(
      1,
    );
    expect(queryAllByTestId('batchactions-ApproveAll--invalid')).toHaveLength(
      0,
    );
    expect(container.querySelectorAll('.fas')).toHaveLength(0);
  });

  it('renders success with invalid button correctly', () => {
    const { container, queryAllByTestId } = render(
      <WrapApproveAll
        batchactions={{
          ...DEFAULT_BATCH_ACTIONS,
          response: {
            action: 'approve',
            changedCount: 2,
            invalidCount: 1,
          },
        }}
      />,
    );

    expect(container.querySelectorAll('.approve-all')).toHaveLength(1);
    expect(queryAllByTestId('batchactions-ApproveAll--default')).toHaveLength(
      0,
    );
    expect(queryAllByTestId('batchactions-ApproveAll--error')).toHaveLength(0);
    expect(queryAllByTestId('batchactions-ApproveAll--success')).toHaveLength(
      1,
    );
    expect(queryAllByTestId('batchactions-ApproveAll--invalid')).toHaveLength(
      1,
    );
    expect(container.querySelectorAll('.fas')).toHaveLength(0);
  });

  it('performs approve all action when Approve All button is clicked', () => {
    const mockApproveAll = vi.fn();

    const { container } = render(
      <WrapApproveAll
        batchactions={DEFAULT_BATCH_ACTIONS}
        approveAll={mockApproveAll}
      />,
    );

    expect(mockApproveAll).not.toHaveBeenCalled();
    fireEvent.click(container.querySelector('.approve-all'));
    expect(mockApproveAll).toHaveBeenCalled();
  });
});
