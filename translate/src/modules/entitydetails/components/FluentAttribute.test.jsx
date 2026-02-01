import ftl from '@fluent/dedent';
import { render } from '@testing-library/react';
import React from 'react';
import { parseEntry } from '~/utils/message';
import { FluentAttribute } from './FluentAttribute';
import { expect } from 'vitest';
import { MockLocalizationProvider } from '../../../test/utils';

function renderFluentAttribute(entry) {
  return render(
    <MockLocalizationProvider>
      <FluentAttribute entry={entry} />
    </MockLocalizationProvider>,
  );
}

describe('isSimpleSingleAttributeMessage', () => {
  it('renders nonempty for a string with a single attribute', () => {
    const original = ftl`
      my-entry =
          .an-atribute = Hello!
      `;
    const entry = parseEntry('fluent', original);
    const { container } = renderFluentAttribute(entry);
    expect(container).not.toBeEmptyDOMElement();
  });

  it('renders null for string with value', () => {
    const original = ftl`
      my-entry = Something
          .an-atribute = Hello!
      `;
    const entry = parseEntry('fluent', original);
    const { container } = renderFluentAttribute(entry);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders null for string with several attributes', () => {
    const original = ftl`
      my-entry =
          .an-atribute = Hello!
          .two-attrites = World!
      `;
    const entry = parseEntry('fluent', original);
    const { container } = renderFluentAttribute(entry);
    expect(container).toBeEmptyDOMElement();
  });
});
