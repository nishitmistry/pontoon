import { render } from '@testing-library/react';
import React from 'react';

import * as Hooks from '~/hooks';
import * as Actions from '../actions';
import { BATCHACTIONS } from '../reducer';

import { ApproveAll } from './ApproveAll';
import { BatchActions } from './BatchActions';
import { RejectAll } from './RejectAll';
import { ReplaceAll } from './ReplaceAll';
import { vi } from 'vitest';
import { fireEvent } from '@testing-library/react';
import { MockLocalizationProvider } from '../../../test/utils';

const DEFAULT_BATCH_ACTIONS = {
  entities: [],
  lastCheckedEntity: null,
  requestInProgress: null,
  response: null,
};
function renderBatchAction() {
  return render(
    <MockLocalizationProvider>
      <BatchActions />
    </MockLocalizationProvider>,
  );
}

describe('<BatchActions>', () => {
  beforeAll(() => {
    vi.mock('~/hooks', () => ({
      useAppDispatch: vi.fn(() => vi.fn()),
      useAppSelector: vi.fn((selector) =>
        selector({ [BATCHACTIONS]: DEFAULT_BATCH_ACTIONS }),
      ),
    }));
    vi.mock('@fluent/react', async (importOriginal) => {
      const actual = await importOriginal();
      return {
        ...actual,
        Localized: ({ id, children }) => <div data-testid={id}>{children}</div>,
      };
    });

    vi.mock('../actions', () => ({
      resetSelection: vi.fn(() => ({ type: 'whatever' })),
      selectAll: vi.fn(() => ({ type: 'whatever' })),
    }));
  });

  afterAll(() => {
    Hooks.useAppDispatch.mockRestore();
    Hooks.useAppSelector.mockRestore();
    Actions.resetSelection.mockRestore();
    Actions.selectAll.mockRestore();
  });

  it('renders correctly', () => {
    const { container, queryAllByTestId } = renderBatchAction();

    expect(container.querySelectorAll('.batch-actions')).toHaveLength(1);

    expect(container.querySelectorAll('.topbar')).toHaveLength(1);
    expect(container.querySelectorAll('.selected-count')).toHaveLength(1);
    expect(container.querySelectorAll('.select-all')).toHaveLength(1);

    expect(container.querySelectorAll('.actions-panel')).toHaveLength(1);

    expect(queryAllByTestId('batchactions-BatchActions--warning')).toHaveLength(
      1,
    );

    expect(
      queryAllByTestId('batchactions-BatchActions--review-heading'),
    ).toHaveLength(1);
    expect(queryAllByTestId('approve-all')).toHaveLength(1);
    expect(queryAllByTestId('reject-all')).toHaveLength(1);

    expect(
      queryAllByTestId('batchactions-BatchActions--find-replace-heading'),
    ).toHaveLength(1);
    expect(queryAllByTestId('batchactions-BatchActions--find')).toHaveLength(1);
    expect(
      queryAllByTestId('batchactions-BatchActions--replace-with'),
    ).toHaveLength(1);
    expect(queryAllByTestId('replace-all')).toHaveLength(1);
  });

  it('closes batch actions panel when the Close button with selected count is clicked', () => {
    const { container } = renderBatchAction();

    fireEvent.click(container.querySelector('.selected-count'));
    expect(Actions.resetSelection).toHaveBeenCalled();
  });

  it('selects all entities when the Select All button is clicked', () => {
    const { container } = renderBatchAction();

    fireEvent.click(container.querySelector('.select-all'));
    expect(Actions.selectAll).toHaveBeenCalled();
  });
});
