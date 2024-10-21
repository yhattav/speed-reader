import '@testing-library/jest-dom';
import { render } from '@testing-library/svelte';
import AfterText from './AfterText.svelte';

describe('AfterText', () => {
  it('renders the correct text', () => {
    const { getByText } = render(AfterText, { props: { after: '!' } });
    expect(getByText('!')).toBeInTheDocument();
  });

  it('applies the correct CSS class', () => {
    const { container } = render(AfterText, { props: { after: '!' } });
    expect(container.firstChild).toHaveClass('speed-reader-after');
  });

  it('renders empty string when no prop is provided', () => {
    const { container } = render(AfterText);
    expect(container.textContent).toBe('');
  });
});