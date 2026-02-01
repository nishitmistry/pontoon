import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import * as hookModule from '~/hooks/useTranslator';
import { HistoryTranslationBase } from './HistoryTranslation';
import { MockLocalizationProvider } from '../../../test/utils';

beforeAll(() => {
  vitest.mock('~/hooks/useTranslator', () => ({
    useTranslator: vi.fn(() => false),
  }));

  vi.mock('react-time-ago', () => {
    return {
      default: () => null,
    };
  });
  vi.mock('@fluent/react', async (importOriginal) => {
    const actual = await importOriginal();
    return {
      ...actual,
      Localized: ({ id, children }) => <div data-testid={id}>{children}</div>,
    };
  });
});

afterAll(() => {
  hookModule.useTranslator.mockRestore();
});

describe('<HistoryTranslationComponent>', () => {
  const DEFAULT_TRANSLATION = {
    approved: false,
    approvedUser: '',
    pretranslated: false,
    date: '',
    fuzzy: false,
    pk: 1,
    rejected: false,
    string: 'The storm approaches. We speak no more.',
    uid: 0,
    rejectedUser: '',
    user: '',
    username: 'michel',
    comments: [],
    userBanner: [],
  };

  const DEFAULT_USER = {
    username: 'michel',
  };

  const DEFAULT_ENTITY = {
    format: 'gettext',
  };
  function renderHistoryTranslationBase(
    translation,
    entity,
    user,
    activeTranslation,
    index,
  ) {
    return render(
      <MockLocalizationProvider>
        <HistoryTranslationBase
          translation={translation}
          entity={entity}
          user={user}
          activeTranslation={activeTranslation}
          index={index}
        />
        ,
      </MockLocalizationProvider>,
    );
  }

  describe('getStatus', () => {
    it('returns the correct status for approved translations', () => {
      const translation = {
        ...DEFAULT_TRANSLATION,
        ...{ approved: true },
      };
      const { container } = renderHistoryTranslationBase(
        translation,
        DEFAULT_ENTITY,
        DEFAULT_USER,
      );

      expect(container.querySelectorAll('.approved')).toHaveLength(1);
    });

    it('returns the correct status for rejected translations', () => {
      const translation = {
        ...DEFAULT_TRANSLATION,
        ...{ rejected: true },
      };
      const { container } = renderHistoryTranslationBase(
        translation,
        DEFAULT_ENTITY,
        DEFAULT_USER,
      );

      expect(container.querySelectorAll('.rejected')).toHaveLength(1);
    });

    it('returns the correct status for pretranslated translations', () => {
      const translation = {
        ...DEFAULT_TRANSLATION,
        ...{ pretranslated: true },
      };
      const { container } = renderHistoryTranslationBase(
        translation,
        DEFAULT_ENTITY,
        DEFAULT_USER,
      );

      expect(container.querySelectorAll('.pretranslated')).toHaveLength(1);
    });

    it('returns the correct status for fuzzy translations', () => {
      const translation = {
        ...DEFAULT_TRANSLATION,
        ...{ fuzzy: true },
      };
      const { container } = renderHistoryTranslationBase(
        translation,
        DEFAULT_ENTITY,
        DEFAULT_USER,
      );

      expect(container.querySelectorAll('.fuzzy')).toHaveLength(1);
    });

    it('returns the correct status for unreviewed translations', () => {
      const { container } = renderHistoryTranslationBase(
        DEFAULT_TRANSLATION,
        DEFAULT_ENTITY,
        DEFAULT_USER,
      );

      expect(container.querySelectorAll('.unreviewed')).toHaveLength(1);
    });
  });

  describe('review title', () => {
    it('returns the correct review title when approved and approved user is available', () => {
      const translation = {
        ...DEFAULT_TRANSLATION,
        ...{ approved: true, approvedUser: 'Cespenar' },
      };
      const { queryAllByTestId } = renderHistoryTranslationBase(
        translation,
        DEFAULT_ENTITY,
        DEFAULT_USER,
      );

      expect(queryAllByTestId('history-translation--approved')).toHaveLength(2);
    });

    it('returns the correct review title when approved and approved user is not available', () => {
      const translation = {
        ...DEFAULT_TRANSLATION,
        ...{ approved: true },
      };
      const { queryAllByTestId } = renderHistoryTranslationBase(
        translation,
        DEFAULT_ENTITY,
        DEFAULT_USER,
      );

      expect(
        queryAllByTestId('history-translation--approved-anonymous'),
      ).toHaveLength(2);
    });

    it('returns the correct review title when rejected and rejected user is available', () => {
      const translation = {
        ...DEFAULT_TRANSLATION,
        ...{ rejected: true, rejectedUser: 'Bhaal' },
      };
      const { queryAllByTestId } = renderHistoryTranslationBase(
        translation,
        DEFAULT_ENTITY,
        DEFAULT_USER,
      );

      expect(queryAllByTestId('history-translation--rejected')).toHaveLength(2);
    });

    it('returns the correct review title when rejected and rejected user is not available', () => {
      const translation = {
        ...DEFAULT_TRANSLATION,
        ...{ rejected: true },
      };
      const { queryAllByTestId } = renderHistoryTranslationBase(
        translation,
        DEFAULT_ENTITY,
        DEFAULT_USER,
      );

      expect(
        queryAllByTestId('history-translation--rejected-anonymous'),
      ).toHaveLength(2);
    });

    it('returns the correct approver title when neither approved or rejected', () => {
      const { container, queryAllByTestId } = renderHistoryTranslationBase(
        DEFAULT_TRANSLATION,
        DEFAULT_ENTITY,
        DEFAULT_USER,
      );

      expect(queryAllByTestId('history-translation--unreviewed')).toHaveLength(
        2,
      );
    });
  });

  describe('User', () => {
    it('returns a link when the author is known', () => {
      const translation = {
        ...DEFAULT_TRANSLATION,
        ...{ uid: 1, username: 'id_Sarevok', user: 'Sarevok' },
      };
      const { queryByTestId } = renderHistoryTranslationBase(
        translation,
        DEFAULT_ENTITY,
        DEFAULT_USER,
      );
      const link = queryByTestId('user');
      expect(link).toHaveTextContent('Sarevok');
      expect(link).toHaveAttribute('href', '/contributors/id_Sarevok');
    });

    it('returns no link when the author is not known', () => {
      const { queryByTestId } = renderHistoryTranslationBase(
        DEFAULT_TRANSLATION,
        DEFAULT_ENTITY,
        DEFAULT_USER,
      );

      const link = queryByTestId('user').querySelectorAll('a');
      expect(link).toHaveLength(0);
    });
  });

  describe('status', () => {
    it('shows the correct status for approved translations', () => {
      const translation = {
        ...DEFAULT_TRANSLATION,
        ...{ approved: true },
      };
      const { container } = renderHistoryTranslationBase(
        translation,
        DEFAULT_ENTITY,
        DEFAULT_USER,
      );

      expect(container.querySelectorAll('.approve')).toHaveLength(0);
      expect(container.querySelectorAll('.unapprove')).toHaveLength(1);
      expect(container.querySelectorAll('.reject')).toHaveLength(1);
      expect(container.querySelectorAll('.unreject')).toHaveLength(0);
    });

    it('shows the correct status for rejected translations', () => {
      const translation = {
        ...DEFAULT_TRANSLATION,
        ...{ rejected: true },
      };
      const { container } = renderHistoryTranslationBase(
        translation,
        DEFAULT_ENTITY,
        DEFAULT_USER,
      );

      expect(container.querySelectorAll('.approve')).toHaveLength(1);
      expect(container.querySelectorAll('.unapprove')).toHaveLength(0);
      expect(container.querySelectorAll('.reject')).toHaveLength(0);
      expect(container.querySelectorAll('.unreject')).toHaveLength(1);
    });

    it('shows the correct status for unreviewed translations', () => {
      const { container } = renderHistoryTranslationBase(
        DEFAULT_TRANSLATION,
        DEFAULT_ENTITY,
        DEFAULT_USER,
      );

      expect(container.querySelectorAll('.approve')).toHaveLength(1);
      expect(container.querySelectorAll('.unapprove')).toHaveLength(0);
      expect(container.querySelectorAll('.reject')).toHaveLength(1);
      expect(container.querySelectorAll('.unreject')).toHaveLength(0);
    });
  });

  describe('permissions', () => {
    it('allows the user to reject their own unapproved translation', () => {
      const { container } = renderHistoryTranslationBase(
        DEFAULT_TRANSLATION,
        DEFAULT_ENTITY,
        DEFAULT_USER,
      );

      expect(container.querySelectorAll('.can-reject')).toHaveLength(1);
      expect(container.querySelectorAll('.can-approve')).toHaveLength(0);
    });

    it('forbids the user to reject their own approved translation', () => {
      const translation = { ...DEFAULT_TRANSLATION, approved: true };
      const { container } = renderHistoryTranslationBase(
        translation,
        DEFAULT_ENTITY,
        DEFAULT_USER,
      );

      expect(container.querySelectorAll('.can-reject')).toHaveLength(0);
      expect(container.querySelectorAll('.can-approve')).toHaveLength(0);
    });

    it('allows translators to review the translation', () => {
      hookModule.useTranslator.mockReturnValue(true);
      const { container } = renderHistoryTranslationBase(
        DEFAULT_TRANSLATION,
        DEFAULT_ENTITY,
        DEFAULT_USER,
      );

      expect(container.querySelectorAll('.can-reject')).toHaveLength(1);
      expect(container.querySelectorAll('.can-approve')).toHaveLength(1);
    });

    it('allows translators to delete the rejected translation', () => {
      hookModule.useTranslator.mockReturnValue(true);
      const translation = { ...DEFAULT_TRANSLATION, rejected: true };
      const { container } = renderHistoryTranslationBase(
        translation,
        DEFAULT_ENTITY,
        DEFAULT_USER,
      );

      expect(container.querySelectorAll('.delete')).toHaveLength(1);
    });

    it('forbids translators to delete non-rejected translation', () => {
      hookModule.useTranslator.mockReturnValue(true);
      const translation = { ...DEFAULT_TRANSLATION, rejected: false };
      const { container } = renderHistoryTranslationBase(
        translation,
        DEFAULT_ENTITY,
        DEFAULT_USER,
      );

      expect(container.querySelectorAll('.delete')).toHaveLength(0);
    });

    it('allows the user to delete their own rejected translation', () => {
      const translation = { ...DEFAULT_TRANSLATION, rejected: true };
      const { container } = renderHistoryTranslationBase(
        translation,
        DEFAULT_ENTITY,
        DEFAULT_USER,
      );

      expect(container.querySelectorAll('.delete')).toHaveLength(1);
    });

    it('forbids the user to delete rejected translation of another user', () => {
      const translation = { ...DEFAULT_TRANSLATION, rejected: true };
      const { container } = renderHistoryTranslationBase(
        translation,
        DEFAULT_ENTITY,
        { username: 'Andy_Dwyer' },
      );

      expect(container.querySelectorAll('.delete')).toHaveLength(0);
    });
  });

  describe('DiffToggle', () => {
    it('shows default translation and no Show/Hide diff button for the first translation', () => {
      const { container, queryByTestId } = renderHistoryTranslationBase(
        DEFAULT_TRANSLATION,
        DEFAULT_ENTITY,
        DEFAULT_USER,
        DEFAULT_TRANSLATION,
        0,
      );

      expect(container.querySelectorAll('.default')).toHaveLength(1);
      expect(container.querySelectorAll('.diff-visible')).toHaveLength(0);

      expect(
        queryByTestId('history-Translation--toggle-diff'),
      ).not.toBeInTheDocument();
    });

    it('shows default translation and the Show diff button for a non-first translation', () => {
      const { container, queryByTestId } = renderHistoryTranslationBase(
        DEFAULT_TRANSLATION,
        DEFAULT_ENTITY,
        DEFAULT_USER,
        DEFAULT_TRANSLATION,
        1,
      );

      expect(container.querySelectorAll('.default')).toHaveLength(1);
      expect(container.querySelectorAll('.diff-visible')).toHaveLength(0);

      const toggle = queryByTestId('history-Translation--toggle-diff');
      expect(toggle.querySelectorAll('.toggle.diff.off')).toHaveLength(1);
      expect(toggle.querySelectorAll('.toggle.diff.on')).toHaveLength(0);
    });

    it('shows translation diff and the Hide diff button for a non-first translation if diff visible', () => {
      const { container, queryByTestId } = renderHistoryTranslationBase(
        DEFAULT_TRANSLATION,
        DEFAULT_ENTITY,
        DEFAULT_USER,
        DEFAULT_TRANSLATION,
        1,
      );
      fireEvent.click(queryByTestId('diff-toggle'));

      expect(container.querySelectorAll('.default')).toHaveLength(0);
      expect(container.querySelectorAll('.diff-visible')).toHaveLength(1);

      const toggle = queryByTestId('history-Translation--toggle-diff');
      expect(toggle.querySelectorAll('.toggle.diff.off')).toHaveLength(0);
      expect(toggle.querySelectorAll('.toggle.diff.on')).toHaveLength(1);
    });
  });
});
