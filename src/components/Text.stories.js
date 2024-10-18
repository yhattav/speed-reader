import Text from '../components/Text.svelte';

export default {
  title: 'Components/Text',
  component: Text,
  argTypes: {
    before: { control: 'text' },
    center: { control: 'text' },
    after: { control: 'text' },
    isReading: { control: 'boolean' },
    textSize: { control: 'number' },
  },
};

const Template = (args) => ({
  Component: Text,
  props: args,
});

export const Default = Template.bind({});
Default.args = {
  before: 'This is',
  center: 'the',
  after: 'center word',
  isReading: true,
  textSize: 24,
};

export const NotReading = Template.bind({});
NotReading.args = {
  before: '',
  center: 'Click to start',
  after: '',
  isReading: false,
  textSize: 24,
};

export const LargeText = Template.bind({});
LargeText.args = {
  ...Default.args,
  textSize: 36,
};

export const SmallText = Template.bind({});
SmallText.args = {
  ...Default.args,
  textSize: 16,
};
