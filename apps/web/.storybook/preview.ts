import * as React from 'react';
import '../app/globals.css';

import type { Preview } from '@storybook/experimental-nextjs-vite';

import {
  PLATFORM_THEME_STORAGE_KEY,
  PlatformThemeProvider,
} from '../components/platform/platform-theme-provider';

const ensureLightPlatformTheme = () => {
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.platformTheme = 'light';
  }

  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(PLATFORM_THEME_STORAGE_KEY, 'light');
    } catch (error) {
      // Ignore storage failures in preview mode and fall back to the document theme.
    }
  }
};

const withCrownPreview: NonNullable<Preview['decorators']>[number] = (Story) => {
  ensureLightPlatformTheme();

  return React.createElement(
    PlatformThemeProvider,
    null,
    React.createElement(
      'div',
      {
        className: 'min-h-screen bg-background p-6 text-foreground',
      },
      React.createElement(Story),
    ),
  );
};

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
