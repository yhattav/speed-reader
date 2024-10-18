import SpeedReader from './SpeedReader.svelte';

export default {
  title: 'Components/SpeedReader',
  component: SpeedReader,
  argTypes: {
    words: { control: 'array' },
    wordsPerMinute: { control: 'number' },
    isExpanded: { control: 'boolean' },
    offsetColor: { control: 'text' },
    textSize: { control: 'number' },
  },
};

const Template = (args) => ({
  Component: SpeedReader,
  props: args,
});

export const Default = Template.bind({});
Default.args = {
  words: ['This', 'is', 'a', 'test', 'sentence', 'for', 'the', 'SpeedReader', 'component'],
  wordsPerMinute: 300,
  isExpanded: false,
  offsetColor: '255, 69, 0',
  textSize: 24,
};

export const Expanded = Template.bind({});
Expanded.args = {
  ...Default.args,
  isExpanded: true,
};

export const LargeText = Template.bind({});
LargeText.args = {
  ...Default.args,
  isExpanded: true,
  textSize: 36,
};

export const SmallText = Template.bind({});
SmallText.args = {
  ...Default.args,
  isExpanded: true,
  textSize: 16,
};
