import '@testing-library/jest-dom';

import { render, fireEvent, getByText, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import SpeedReader from '../../src/SpeedReader.svelte';

describe('SpeedReader', () => {
  it('initializes with correct props', () => {
    const { getByTestId } = render(SpeedReader, {
      props: {
        words: ['This', 'is', 'a', 'test'],
        wordsPerMinute: 300,
        isExpanded: true,
        offsetColor: '255, 69, 0',
        textSize: 24,
        onPopupIn: () => {},
        onPopupOut: () => {},
      }
    });

    const speedReader = getByTestId('speed-reader');
    expect(speedReader).toBeInTheDocument();
  });
});
