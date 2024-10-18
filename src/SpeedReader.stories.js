/* Copyright 2024 Yonatan Hattav

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. */

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
