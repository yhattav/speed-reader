import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/svelte';
import { tick } from 'svelte';
import Popup from './Popup.svelte';
import {jest} from '@jest/globals'

// Helper component to test slots
import { SvelteComponent } from 'svelte';
// class TestWrapper extends SvelteComponent {
//   $$prop_def = {
//     props: Object,
//     slotContent: String
//   };
// }

function createDefaultProps() {
  return {
    isExpanded: false,
    offsetColor: '255, 69, 0',
    onPopupIn: jest.fn(),
    onPopupOut: jest.fn(),
  };
}

describe('Popup', () => {
  it('renders correctly when not expanded', () => {
    const props = createDefaultProps();
    const { container } = render(Popup, { props });
    expect(container.querySelector('.speed-reader-popup')).not.toHaveClass('expanded');
  });

  it('renders correctly when expanded', () => {
    const props = { ...createDefaultProps(), isExpanded: true };
    const { container } = render(Popup, { props });
    expect(container.querySelector('.speed-reader-popup')).toHaveClass('expanded');
  });

//   it('displays content when expanded', async () => {
//     const props = { ...createDefaultProps(), isExpanded: true };
//     const { getByText } = render(TestWrapper, {
//       props: {
//         ...props,
//         slotContent: 'Test Content'
//       }
//     });
//     await tick();
//     expect(getByText('Test Content')).toBeInTheDocument();
//   });


  it('dispatches click event when clicked', async () => {
    const props = createDefaultProps();
    const { component, container } = render(Popup, { props });
    
    const mockClickHandler = jest.fn();
    component.$on('click', mockClickHandler);

    const popup = container.querySelector('.speed-reader-popup');
    await fireEvent.click(popup);
    
    expect(mockClickHandler).toHaveBeenCalled();
  });

  it('calls onPopupIn when mouse enters', async () => {
    const props = createDefaultProps();
    const { container } = render(Popup, { props });
    const popup = container.querySelector('.speed-reader-popup');
    await fireEvent.mouseEnter(popup);
    expect(props.onPopupIn).toHaveBeenCalled();
  });

  it('calls onPopupOut when mouse leaves', async () => {
    const props = createDefaultProps();
    const { container } = render(Popup, { props });
    const popup = container.querySelector('.speed-reader-popup');
    await fireEvent.mouseLeave(popup);
    expect(props.onPopupOut).toHaveBeenCalled();
  });

  it('applies the correct background color based on isExpanded', async () => {
    const props = createDefaultProps();
    const { container, component } = render(Popup, { props });
    let popup = container.querySelector('.speed-reader-popup');
    expect(popup).toHaveStyle('--background-color: rgba(0, 0, 0, 0.5)');

    await component.$set({ isExpanded: true });
    await tick();
    popup = container.querySelector('.speed-reader-popup');
    expect(popup).toHaveStyle('--background-color: rgba(250, 250, 250, 0.86)');
  });
});
