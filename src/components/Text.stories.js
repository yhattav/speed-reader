import Text from '../components/Text.svelte';

export default {
  title: 'Components/Text',
  component: Text,
  argTypes: {
    before: { control: 'text' },
    center: { control: 'text' },
    after: { control: 'text' },
    isReading: { control: 'boolean' },
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
};

export const NotReading = Template.bind({});
NotReading.args = {
  before: '',
  center: 'Click to start',
  after: '',
  isReading: false,
};

