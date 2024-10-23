import { action } from '@storybook/addon-actions';
import Popup from './Popup.svelte';
import { ANIMATION_DURATIONS } from '../readerConfig';
export default {
  title: 'Components/Popup',
  component: Popup,
  argTypes: {
    isExpanded: { control: 'boolean' },
    offsetColor: { control: 'text' },
  },
};

const Template = (args) => ({
  Component: Popup,
  props: args,
  on: {
    click: action('clicked'),
  },
});

export const Default = Template.bind({});
Default.args = {
  isExpanded: false,
  offsetColor: '255, 69, 0',
};

export const Expanded = Template.bind({});
Expanded.args = {
  isExpanded: true,
  offsetColor: '255, 69, 0',
};

export const ExpandingAndShrinking = (args) => ({
  Component: Popup,
  props: args,
  on: {
    click: action('clicked'),
  },
});

ExpandingAndShrinking.args = {
  offsetColor: '255, 69, 0',
};

ExpandingAndShrinking.parameters = {
  docs: {
    description: {
      story: 'This story demonstrates the expanding and shrinking behavior of the Popup component. Click on the popup to toggle between expanded and collapsed states.',
    },
  },
};

ExpandingAndShrinking.play = async ({ canvasElement }) => {
  const popup = canvasElement.querySelector('.speed-reader-popup');
  popup.click();
  await new Promise(resolve => setTimeout(resolve, ANIMATION_DURATIONS.POPUP_EXPAND)); // Wait for animation
  popup.click();
};
