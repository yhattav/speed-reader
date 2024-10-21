import '@testing-library/jest-dom';
import { render } from '@testing-library/svelte';
import CenterText from '../../src/components/CenterText.svelte';

describe('CenterText', () => {
  it('renders the correct text', () => {
    const { getByText } = render(CenterText, { props: { center: 'World' } });
    expect(getByText('World')).toBeInTheDocument();
  });

  it('applies the correct CSS class', () => {
    const { container } = render(CenterText, { props: { center: 'World' } });
    expect(container.firstChild).toHaveClass('speed-reader-center');
  });

  it('has the correct data-testid', () => {
    const { getByTestId } = render(CenterText, { props: { center: 'World' } });
    expect(getByTestId('speed-reader-center')).toBeInTheDocument();
  });

  it('renders empty string when no prop is provided', () => {
    const { container } = render(CenterText);
    expect(container.textContent).toBe('');
  });
});

