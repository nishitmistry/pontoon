import { render } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';

import * as api from '~/api/l10n';

import { AppLocalizationProvider } from './AppLocalizationProvider';
import { vi } from 'vitest';

describe('<AppLocalizationProvider>', () => {
  beforeAll(() => {
    vi.mock('~/api/l10n', () => ({ fetchL10n: vi.fn() }));
  });
  afterEach(() => api.fetchL10n.mockClear());
  afterAll(() => api.fetchL10n.mockRestore());

  it('fetches a locale when the component mounts', async () => {
    api.fetchL10n.mockResolvedValue('');
    render(
      <AppLocalizationProvider>
        <div />
      </AppLocalizationProvider>,
    );
    await act(() => new Promise((resolve) => setTimeout(resolve)));

    expect(api.fetchL10n).toHaveBeenCalledOnce();
  });

  it('renders messages and children when loaded', async () => {
    api.fetchL10n.mockResolvedValue('key = message\n');
    const { container } = render(
      <AppLocalizationProvider>
        <div id='test' />
      </AppLocalizationProvider>,
    );
    await act(() => new Promise((resolve) => setTimeout(resolve)));

    const localization = wrapper.find('LocalizationProvider').prop('l10n');
    expect(localization.getString('key')).toEqual('message');
    expect(container.querySelectorAll('#test')).toHaveLength(1);
  });
});
