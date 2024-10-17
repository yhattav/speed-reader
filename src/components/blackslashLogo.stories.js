import BackslashLogo from '../components/BackslashLogo.svelte';

export default {
  title: 'Components/BackslashLogo',
  component: BackslashLogo,
  argTypes: {
    isExpanded: { control: 'boolean' },
    offsetColor: { control: 'text' },
    position: {
      control: { type: 'select', options: ['left', 'right'] },
    },
  },
};

const Template = (args) => ({
  Component: BackslashLogo,
  props: args,
});

export const Default = Template.bind({});
Default.args = {
  isExpanded: false,
  offsetColor: '255, 69, 0',
  position: 'left',
};

export const Expanded = Template.bind({});
Expanded.args = {
  isExpanded: true,
  offsetColor: '255, 69, 0',
  position: 'left',
};

export const RightPosition = Template.bind({});
RightPosition.args = {
  isExpanded: false,
  offsetColor: '255, 69, 0',
  position: 'right',
};
