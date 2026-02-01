import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import { UnsavedActions, UnsavedChanges } from '~/context/UnsavedChanges';
import { MockLocalizationProvider } from '~/test/utils';

import { UnsavedChangesPopup } from './UnsavedChangesPopup';
import { vi } from 'vitest';

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
    const { container } = mountPopup(() => {});

    expect(container.querySelectorAll('.unsaved-changes')).toHaveLength(1);
    expect(container.querySelectorAll('.close')).toHaveLength(1);
    expect(container.querySelectorAll('.title')).toHaveLength(1);
    expect(container.querySelectorAll('.body')).toHaveLength(1);
    expect(container.querySelectorAll('.proceed.anyway')).toHaveLength(1);
  });

  it('does not render if not shown', () => {
    const { container } = mountPopup(null);

    expect(container.querySelectorAll('.unsaved-changes')).toHaveLength(0);
  });

  it('closes the unsaved changes popup when the Close button is clicked', () => {
    const resetUnsavedChanges = vi.fn();
    const { container } = mountPopup(() => {}, resetUnsavedChanges);

    fireEvent.click(container.querySelector('.close'));
    expect(resetUnsavedChanges).toHaveBeenCalledWith(false);
  });

  it('ignores the unsaved changes popup when the Proceed button is clicked', () => {
    const resetUnsavedChanges = vi.fn();
    const { container } = mountPopup(() => {}, resetUnsavedChanges);

    fireEvent.click(container.querySelector('.proceed.anyway'));
    expect(resetUnsavedChanges).toHaveBeenCalledWith(true);
  });
});
