const path = require('path');

module.exports = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx|svelte)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@chromatic-com/storybook'
  ],

  framework: {
    name: '@storybook/svelte-vite',
    options: {}
  },

  core: {
    builder: '@storybook/builder-vite',
  },

  async viteFinal(config, { configType }) {
    // customize the Vite config here
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '../src'),
    };

    // Explicitly add the Svelte plugin
    const { svelte } = await import('@sveltejs/vite-plugin-svelte');
    config.plugins.push(svelte());

    // return the customized config
    return config;
  },

  docs: {
    autodocs: true
  }
};