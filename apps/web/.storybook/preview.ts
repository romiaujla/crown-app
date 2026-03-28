import type { Preview } from '@storybook/experimental-nextjs-vite';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',
    nextjs: {
      appDirectory: true,
    },
  },
};

export default preview;
