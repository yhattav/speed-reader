import '@testing-library/jest-dom';
import { render } from '@testing-library/svelte';
import BeforeText from '../../src/components/BeforeText.svelte';

describe('BeforeText', () => {
  it('renders the correct text', () => {
    const { getByText } = render(BeforeText, { props: { before: 'Hello' } });
    expect(getByText('Hello')).toBeInTheDocument();
  });

  it('applies the correct CSS class', () => {
    const { container } = render(BeforeText, { props: { before: 'Hello' } });
    expect(container.firstChild).toHaveClass('speed-reader-before');
  });

  it('renders empty string when no prop is provided', () => {
    const { container } = render(BeforeText);
    expect(container.textContent).toBe('');
  });
});

