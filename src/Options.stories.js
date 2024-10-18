import Options from './Options.svelte';

export default {
  title: 'Components/Options',
  component: Options,
};

const Template = (args) => ({
  Component: Options,
  props: args,
});

export const Default = Template.bind({});
// No args needed for Options
