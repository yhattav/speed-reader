import SpeedReader from './SpeedReader.svelte';

export default {
  title: 'Components/SpeedReader',
  component: SpeedReader,
  argTypes: {
    words: { control: 'array' },
    wordsPerMinute: { control: 'number' },
    isExpanded: { control: 'boolean' },
    offsetColor: { control: 'text' },
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
};

export const Expanded = Template.bind({});
Expanded.args = {
  ...Default.args,
  isExpanded: true,
};
