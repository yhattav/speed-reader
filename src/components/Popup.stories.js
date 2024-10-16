import Popup from './Popup.svelte';

export default {
  title: 'Components/Popup',
  component: Popup,
};

export const Default = () => ({
  Component: Popup,
  props: {},
  on: {
    click: () => console.log('Popup clicked'),
  },
});

Default.storyName = 'Default Popup';