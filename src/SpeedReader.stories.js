import SpeedReader from './SpeedReader.svelte';

export default {
  title: 'SpeedReader',
  component: SpeedReader,
  argTypes: {
    words: { control: 'array' },
    wordsPerMinute: { control: { type: 'number', min: 100, max: 1000, step: 50 } },
  },
};

const Template = (args) => ({
  Component: SpeedReader,
  props: args,
});

export const Default = Template.bind({});
Default.args = {
  words: ['This', 'is', 'a', 'test', 'of', 'the', 'Speed', 'Reader', 'component'],
  wordsPerMinute: 300,
};

export const LongText = Template.bind({});
LongText.args = {
  words: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'.split(' '),
  wordsPerMinute: 400,
};