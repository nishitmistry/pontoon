import React from 'react';
import { act } from 'react-dom/test-utils';
import { Screenshots } from './Screenshots';
import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';

describe('<Screenshots>', () => {
  it('finds several images', () => {
    const source = `
      Here we have 2 images: http://link.to/image.png
      and https://example.org/en-US/test.jpg
    `;
    const { container } = render(<Screenshots locale='kg' source={source} />);

    expect(container.querySelectorAll('img')).toHaveLength(2);
    expect(container.querySelector('img')[0].prop('src')).toBe(
      'http://link.to/image.png',
    );
    expect(container.querySelector('img')[1].prop('src')).toBe(
      'https://example.org/kg/test.jpg',
    );
  });

  it('does not find non PNG or JPG images', () => {
    const source =
      'That is a non-supported image URL: http://link.to/image.bmp';
    const { container } = render(<Screenshots locale='kg' source={source} />);

    expect(container.querySelectorAll('img')).toHaveLength(0);
  });

  it('shows a Lightbox on image click', () => {
    const source = 'That is an image URL: http://link.to/image.png';
    const { container } = render(<Screenshots locale='kg' source={source} />);

    expect(container.querySelectorAll('.lightbox')).toHaveLength(0);

    fireEvent.click(container.querySelector('img'));

    expect(container.querySelectorAll('.lightbox')).toHaveLength(1);
  });

  it('Lightbox closes on click', () => {
    const source = 'That is an image URL: http://link.to/image.png';
    const { container } = render(<Screenshots locale='kg' source={source} />);
    fireEvent.click(container.querySelector('img'));
    fireEvent.click(container.querySelector('.lightbox'));

    expect(container.querySelectorAll('.lightbox')).toHaveLength(0);
  });

  it('Lightbox closes on key press', () => {
    const source = 'That is an image URL: http://link.to/image.png';
    const { container } = render(<Screenshots locale='kg' source={source} />);
    fireEvent.click(container.querySelector('img'));
    act(() => {
      window.document.dispatchEvent(
        new KeyboardEvent('keydown', { code: 'Escape' }),
      );
    });

    expect(container.querySelectorAll('.lightbox')).toHaveLength(0);
  });
});
