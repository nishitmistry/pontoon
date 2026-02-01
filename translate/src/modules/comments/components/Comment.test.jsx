import React from 'react';
import { render } from '@testing-library/react';

import { Comment } from './Comment';
import { vi } from 'vitest';
import { MockLocalizationProvider } from '../../../test/utils';

describe('<Comment>', () => {
  vi.mock('react-linkify', async (importOriginal) => {
    const actual = await importOriginal();
    return {
      ...actual,
      Linkify: ({ children }) => <div data-testid='Linkify'>{children}</div>,
    };
  });
  vi.mock('react-time-ago', () => {
    return {
      default: () => null,
    };
  });

  const DEFAULT_COMMENT = {
    author: '',
    username: '',
    userGravatarUrlSmall: '',
    createdAt: '',
    dateIso: '',
    userBanner: [],
    content:
      "What I hear when I'm being yelled at is people caring loudly at me.",
    translation: 0,
    id: 1,
  };

  const DEFAULT_USER = {
    username: 'Leslie_Knope',
  };

  const DEFAULT_ISTRANSLATOR = {
    isTranslator: true,
  };

  it('renders the correct text', () => {
    const deleteMock = vi.fn();
    const { queryByTestId, debug } = render(
      <MockLocalizationProvider>
        <Comment
          comment={DEFAULT_COMMENT}
          key={DEFAULT_COMMENT.id}
          user={DEFAULT_USER}
          isTranslator={DEFAULT_ISTRANSLATOR}
          deleteComment={deleteMock}
        />
      </MockLocalizationProvider>,
    );

    // Comments are hidden in a Linkify component.
    const content = queryByTestId('Linkify').querySelector('span').textContent;
    expect(content).toEqual(
      "What I hear when I'm being yelled at is people caring loudly at me.",
    );
  });

  it('renders a link for the author', () => {
    const deleteMock = vi.fn();
    const comments = {
      ...DEFAULT_COMMENT,
      ...{ username: 'Leslie_Knope', author: 'LKnope' },
    };
    const { container } = render(
      <MockLocalizationProvider>
        <Comment
          comment={comments}
          key={comments.id}
          user={DEFAULT_USER}
          isTranslator={DEFAULT_ISTRANSLATOR}
          deleteComment={deleteMock}
        />
      </MockLocalizationProvider>,
    );

    const link = container.querySelectorAll('a');
    expect(link).toHaveLength(1);
    expect(link[0]).toHaveTextContent('LKnope');
    expect(link[0]).toHaveAttribute('href', '/contributors/Leslie_Knope');
  });
});
