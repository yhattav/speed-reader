/** @type { import('@storybook/svelte').Preview } */
const preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;

export const decorators = [
  (Story) => {
    console.log('Storybook decorator called');
    // Mock chrome.storage.sync for Storybook
    console.log('chrome', chrome);
      console.log('Mocking chrome.storage.sync');
      global.chrome = {
        storage: {
          sync: {
            get: (keys, callback) => {
              console.log('Mock chrome.storage.sync.get called');
              callback({
                wordsPerMinute: 400,
                minWords: 10,
              });
            },
            set: (obj, callback) => {
              console.log('Mock chrome.storage.sync.set called with:', obj);
              if (callback) callback();
            },
          },
        },
      
    };
    return Story();
  },
];
