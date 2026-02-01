import React from 'react';
import { render } from '@testing-library/react';

import { MockLocalizationProvider } from '~/test/utils';

import { ReplaceAll } from './ReplaceAll';
import { vi } from 'vitest';
import { fireEvent } from '@testing-library/react';

const DEFAULT_BATCH_ACTIONS = {
  entities: [],
  lastCheckedEntity: null,
  requestInProgress: null,
  response: null,
};

const WrapReplaceAll = (props) => (
  <MockLocalizationProvider>
    <ReplaceAll {...props} />
  </MockLocalizationProvider>
);
vi.mock('@fluent/react', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    Localized: ({ id, children }) => <div data-testid={id}>{children}</div>,
  };
});

describe('<ReplaceAll>', () => {
  it('renders default button correctly', () => {
    const { container, queryAllByTestId } = render(
      <WrapReplaceAll batchactions={DEFAULT_BATCH_ACTIONS} />,
    );

    expect(container.querySelectorAll('.replace-all')).toHaveLength(1);
    expect(queryAllByTestId('batchactions-ReplaceAll--default')).toHaveLength(
      1,
    );
    expect(queryAllByTestId('batchactions-ReplaceAll--error')).toHaveLength(0);
    expect(queryAllByTestId('batchactions-ReplaceAll--success')).toHaveLength(
      0,
    );
    expect(queryAllByTestId('batchactions-ReplaceAll--invalid')).toHaveLength(
      0,
    );
    expect(container.querySelectorAll('.fas')).toHaveLength(0);
  });

  it('renders error button correctly', () => {
    const { container, queryAllByTestId } = render(
      <WrapReplaceAll
        batchactions={{
          ...DEFAULT_BATCH_ACTIONS,
          response: {
            action: 'replace',
            error: true,
          },
        }}
      />,
    );

    expect(container.querySelectorAll('.replace-all')).toHaveLength(1);
    expect(queryAllByTestId('batchactions-ReplaceAll--default')).toHaveLength(
      0,
    );
    expect(queryAllByTestId('batchactions-ReplaceAll--error')).toHaveLength(1);
    expect(queryAllByTestId('batchactions-ReplaceAll--success')).toHaveLength(
      0,
    );
    expect(queryAllByTestId('batchactions-ReplaceAll--invalid')).toHaveLength(
      0,
    );
    expect(container.querySelectorAll('.fas')).toHaveLength(0);
  });

  it('renders success button correctly', () => {
    const { container, queryAllByTestId } = render(
      <WrapReplaceAll
        batchactions={{
          ...DEFAULT_BATCH_ACTIONS,
          response: {
            action: 'replace',
            changedCount: 2,
          },
        }}
      />,
    );

    expect(container.querySelectorAll('.replace-all')).toHaveLength(1);
    expect(queryAllByTestId('batchactions-ReplaceAll--default')).toHaveLength(
      0,
    );
    expect(queryAllByTestId('batchactions-ReplaceAll--error')).toHaveLength(0);
    expect(queryAllByTestId('batchactions-ReplaceAll--success')).toHaveLength(
      1,
    );
    expect(queryAllByTestId('batchactions-ReplaceAll--invalid')).toHaveLength(
      0,
    );
    expect(container.querySelectorAll('.fas')).toHaveLength(0);
  });

  it('renders success with invalid button correctly', () => {
    const { container, queryAllByTestId } = render(
      <WrapReplaceAll
        batchactions={{
          ...DEFAULT_BATCH_ACTIONS,
          response: {
            action: 'replace',
            changedCount: 2,
            invalidCount: 1,
          },
        }}
      />,
    );

    expect(container.querySelectorAll('.replace-all')).toHaveLength(1);
    expect(queryAllByTestId('batchactions-ReplaceAll--default')).toHaveLength(
      0,
    );
    expect(queryAllByTestId('batchactions-ReplaceAll--error')).toHaveLength(0);
    expect(queryAllByTestId('batchactions-ReplaceAll--success')).toHaveLength(
      1,
    );
    expect(queryAllByTestId('batchactions-ReplaceAll--invalid')).toHaveLength(
      1,
    );
    expect(container.querySelectorAll('.fas')).toHaveLength(0);
  });

  it('performs replace all action when Replace All button is clicked', () => {
    const mockReplaceAll = vi.fn();

    const { container } = render(
      <WrapReplaceAll
        batchactions={DEFAULT_BATCH_ACTIONS}
        replaceAll={mockReplaceAll}
      />,
    );

    expect(mockReplaceAll).not.toHaveBeenCalled();
    fireEvent.click(container.querySelector('.replace-all'));
    expect(mockReplaceAll).toHaveBeenCalled();
  });
});
