import '@testing-library/jest-dom';
import { render } from '@testing-library/svelte';
import BeforeText from './BeforeText.svelte';
import CenterText from './CenterText.svelte';
import AfterText from './AfterText.svelte';

describe('Text Components', () => {
  describe('BeforeText', () => {
    it('renders the correct text', () => {
      const { getByText } = render(BeforeText, { props: { before: 'Hello' } });
      expect(getByText('Hello')).toBeInTheDocument();
    });

    it('applies the correct CSS class', () => {
      const { container } = render(BeforeText, { props: { before: 'Hello' } });
      expect(container.firstChild).toHaveClass('speed-reader-before');
    });
  });

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
  });

  describe('AfterText', () => {
    it('renders the correct text', () => {
      const { getByText } = render(AfterText, { props: { after: '!' } });
      expect(getByText('!')).toBeInTheDocument();
    });

    it('applies the correct CSS class', () => {
      const { container } = render(AfterText, { props: { after: '!' } });
      expect(container.firstChild).toHaveClass('speed-reader-after');
    });
  });
});

