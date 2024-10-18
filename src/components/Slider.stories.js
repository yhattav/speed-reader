import { fn } from '@storybook/test';
import Slider from './Slider.svelte';

export default {
  title: 'Components/Slider',
  component: Slider,
  argTypes: {
    label: { control: 'text' },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    value: { control: 'number' },
    onChange: { action: 'changed' }
  },
};

const Template = (args) => ({
  Component: Slider,
  props: args,
  on: {
    change: args.onChange,
  },
});

export const Default = Template.bind({});
Default.args = {
  label: 'Default Slider',
  min: 0,
  max: 100,
  step: 1,
  value: 50,
  onChange: fn(),
};

export const WordsPerMinute = Template.bind({});
WordsPerMinute.args = {
  label: 'Words per minute',
  min: 100,
  max: 1000,
  step: 10,
  value: 400,
  onChange: fn(),
};

export const MinWords = Template.bind({});
MinWords.args = {
  label: 'Minimum words to activate',
  min: 5,
  max: 50,
  step: 1,
  value: 10,
  onChange: fn(),
};
