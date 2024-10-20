export default {
  transform: {
    '^.+\\.svelte$': ['svelte-jester', { preprocess: true }],
    '^.+\\.ts$': 'ts-jest'
  },
  moduleFileExtensions: ['js', 'ts', 'svelte'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts', '<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  extensionsToTreatAsEsm: ['.svelte', '.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  globals: {
    'ts-jest': {
      useESM: true
    }
  }
};