import '@testing-library/jest-dom';
import { render } from '@testing-library/svelte';
import ProgressBar from '../../src/components/ProgressBar.svelte';

describe('ProgressBar', () => {
  it('renders with the correct width based on progress prop', () => {
    const { container } = render(ProgressBar, { props: { progress: 50 } });
    const progressBar = container.querySelector('.speed-reader-progress');
    expect(progressBar).toHaveStyle('width: 50%');
  });

  it('renders with 0% width when no progress prop is provided', () => {
    const { container } = render(ProgressBar);
    const progressBar = container.querySelector('.speed-reader-progress');
    expect(progressBar).toHaveStyle('width: 0%');
  });

  it('renders with 100% width when progress is greater than 100', () => {
    const { container } = render(ProgressBar, { props: { progress: 120 } });
    const progressBar = container.querySelector('.speed-reader-progress');
    expect(progressBar).toHaveStyle('width: 100%');
  });

  it('renders with 0% width when progress is less than 0', () => {
    const { container } = render(ProgressBar, { props: { progress: -20 } });
    const progressBar = container.querySelector('.speed-reader-progress');
    expect(progressBar).toHaveStyle('width: 0%');
  });
});

