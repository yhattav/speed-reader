import ProgressBar from '../components/ProgressBar.svelte';

export default {
  title: 'Components/ProgressBar',
  component: ProgressBar,
  argTypes: {
    progress: { control: { type: 'range', min: 0, max: 100, step: 1 } },
  },
};

const Template = (args) => ({
  Component: ProgressBar,
  props: args,
});

export const Default = Template.bind({});
Default.args = {
  progress: 50,
};

