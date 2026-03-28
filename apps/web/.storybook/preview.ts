import * as React from 'react';

import type { Preview } from '@storybook/experimental-nextjs-vite';

import { PlatformThemeProvider } from '../components/platform/platform-theme-provider';

const withCrownPreview: NonNullable<Preview['decorators']>[number] = (Story) =>
  React.createElement(
    PlatformThemeProvider,
    null,
    React.createElement(
      'div',
      {
        className: 'min-h-screen p-6',
      },
      React.createElement(Story),
    ),
  );

const preview: Preview = {
  decorators: [withCrownPreview],
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
