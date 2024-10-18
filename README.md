# Speed Reader Chrome Extension

Speed Reader is a Chrome extension that helps users read web content faster with a focused reading experience.

## Features

- Hover over paragraphs to activate the Speed Reader
- Adjustable reading speed (words per minute)
- Customizable minimum word count to activate
- Adjustable text size for comfortable reading

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/speed-reader-extension.git
   cd speed-reader-extension
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions`
   - Enable "Developer mode" in the top right corner
   - Click "Load unpacked" and select the `public` folder in your project directory

## Development

To start the development server with hot-reloading:

```bash
npm run dev
```
## Building for Production

To create an optimized production build:

```bash
npm run build
```

## Storybook

This project uses Storybook for component development and testing. To run Storybook:

```bash
npm run storybook
```

## Using TypeScript

This project is set up to use TypeScript. The TypeScript configuration is already in place.

## License

This project is licensed under the Apache License, Version 2.0. See the [LICENSE](LICENSE) file for details.

## Notice

For additional attribution notices, please see the [NOTICE](NOTICE) file.
