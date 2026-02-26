import React from 'react';

import { UnsavedActions, UnsavedChanges } from '~/context/UnsavedChanges';
import { MockLocalizationProvider } from '~/test/utils';

import { UnsavedChangesPopup } from './UnsavedChangesPopup';
import { vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react';

const mountPopup = (onIgnore, resetUnsavedChanges) =>
  render(
    <MockLocalizationProvider>
      <UnsavedChanges.Provider value={{ onIgnore }}>
        <UnsavedActions.Provider value={{ resetUnsavedChanges }}>
          <UnsavedChangesPopup />
        </UnsavedActions.Provider>
      </UnsavedChanges.Provider>
    </MockLocalizationProvider>,
  );

describe('<UnsavedChangesPopup>', () => {
  it('renders correctly if shown', () => {
    const { container, getByRole, getByText } = mountPopup(() => {});

    expect(container.querySelector('.unsaved-changes')).toBeInTheDocument();
    getByRole('button', { name: /Close/ });
    getByText('YOU HAVE UNSAVED CHANGES');
    getByText(/Are you sure/);
    getByRole('button', { name: 'PROCEED' });
  });

  it('does not render if not shown', () => {
    const { container } = mountPopup(null);

    expect(container.querySelector('.unsaved-changes')).toBeNull();
  });

  it('closes the unsaved changes popup when the Close button is clicked', () => {
    const resetUnsavedChanges = vi.fn();
    const { getByRole } = mountPopup(() => {}, resetUnsavedChanges);

    fireEvent.click(getByRole('button', { name: /Close/ }));
    expect(resetUnsavedChanges).toHaveBeenCalledWith(false);
  });

  it('ignores the unsaved changes popup when the Proceed button is clicked', () => {
    const resetUnsavedChanges = vi.fn();
    const { getByRole } = mountPopup(() => {}, resetUnsavedChanges);

    fireEvent.click(getByRole('button', { name: 'PROCEED' }));
    expect(resetUnsavedChanges).toHaveBeenCalledWith(true);
  });
});
