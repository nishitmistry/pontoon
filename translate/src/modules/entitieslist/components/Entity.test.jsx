import { render } from '@testing-library/react';
import React from 'react';

import * as hookModule from '~/hooks/useTranslator';
import { Entity } from './Entity';
import { vitest } from 'vitest';
import { fireEvent } from '@testing-library/react';

beforeAll(() => {
  vitest.mock('~/hooks/useTranslator', () => ({
    useTranslator: vi.fn(() => false),
  }));
});
afterAll(() => hookModule.useTranslator.mockRestore());

describe('<Entity>', () => {
  const ENTITY_A = {
    original: 'string a',
    translation: {
      string: 'chaine a',
      approved: true,
      errors: [],
      warnings: [],
    },
  };

  const ENTITY_B = {
    original: 'string b',
    translation: {
      string: 'chaine b',
      pretranslated: true,
      errors: [],
      warnings: [],
    },
  };

  const ENTITY_C = {
    original: 'string c',
    translation: {
      string: 'chaine c',
      errors: [],
      warnings: [],
    },
  };

  const ENTITY_D = {
    original: 'string d',
    translation: {
      string: 'chaine d',
      approved: true,
      errors: ['error'],
      warnings: [],
    },
  };

  const ENTITY_E = {
    original: 'string e',
    translation: {
      string: 'chaine e',
      pretranslated: true,
      errors: [],
      warnings: ['warning'],
    },
  };

  it('renders the source string and the first translation', () => {
    const { container } = render(<Entity entity={ENTITY_A} parameters={{}} />);

    const contents = wrapper.find('Translation');
    expect(contents.first().props().content).toContain(ENTITY_A.original);
    expect(contents.last().props().content).toContain(
      ENTITY_A.translation.string,
    );
  });

  it('shows the correct status class', () => {
    let wrapper = render(<Entity entity={ENTITY_A} parameters={{}} />);
    expect(container.querySelectorAll('.approved')).toHaveLength(1);

    wrapper = render(<Entity entity={ENTITY_B} parameters={{}} />);
    expect(container.querySelectorAll('.pretranslated')).toHaveLength(1);

    wrapper = render(<Entity entity={ENTITY_C} parameters={{}} />);
    expect(container.querySelectorAll('.missing')).toHaveLength(1);

    wrapper = render(<Entity entity={ENTITY_D} parameters={{}} />);
    expect(container.querySelectorAll('.errors')).toHaveLength(1);

    wrapper = render(<Entity entity={ENTITY_E} parameters={{}} />);
    expect(container.querySelectorAll('.warnings')).toHaveLength(1);
  });

  it('calls the selectEntity function on click on li', () => {
    const selectEntityFn = vi.fn();
    const { container } = render(
      <Entity
        entity={ENTITY_A}
        selectEntity={selectEntityFn}
        parameters={{}}
      />,
    );
    fireEvent.click(container.querySelector('li'));
    expect(selectEntityFn).toHaveBeenCalledOnce();
  });

  it('calls the toggleForBatchEditing function on click on .status', () => {
    hookModule.useTranslator.mockReturnValue(true);
    const toggleForBatchEditingFn = vi.fn();
    const { container } = render(
      <Entity
        entity={ENTITY_A}
        isReadOnlyEditor={false}
        toggleForBatchEditing={toggleForBatchEditingFn}
        parameters={{}}
      />,
    );
    fireEvent.click(container.querySelector('.status'));
    expect(toggleForBatchEditingFn).toHaveBeenCalledOnce();
  });

  it('does not call the toggleForBatchEditing function if user not translator', () => {
    const toggleForBatchEditingFn = vi.fn();
    const selectEntityFn = vi.fn();
    const { container } = render(
      <Entity
        entity={ENTITY_A}
        isReadOnlyEditor={false}
        toggleForBatchEditing={toggleForBatchEditingFn}
        selectEntity={selectEntityFn}
        parameters={{}}
      />,
    );
    fireEvent.click(container.querySelector('.status'));
    expect(toggleForBatchEditingFn).not.toHaveBeenCalled();
  });

  it('does not call the toggleForBatchEditing function if read-only editor', () => {
    const toggleForBatchEditingFn = vi.fn();
    const selectEntityFn = vi.fn();
    const { container } = render(
      <Entity
        entity={ENTITY_A}
        isReadOnlyEditor={true}
        toggleForBatchEditing={toggleForBatchEditingFn}
        selectEntity={selectEntityFn}
        parameters={{}}
      />,
    );
    fireEvent.click(container.querySelector('.status'));
    expect(toggleForBatchEditingFn).not.toHaveBeenCalled();
  });
});
