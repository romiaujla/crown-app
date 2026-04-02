import * as React from 'react';
import '../app/globals.css';

import type { Decorator, Preview } from '@storybook/react';

import {
  PLATFORM_THEME_STORAGE_KEY,
  PlatformThemeProvider,
} from '../components/platform/platform-theme-provider';

const ensureLightPlatformTheme = (): void => {
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.platformTheme = 'light';
  }

  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(PLATFORM_THEME_STORAGE_KEY, 'light');
    } catch {
      // Ignore storage failures in preview mode and fall back to the document theme.
    }
  }
};

const withCrownPreview: Decorator = (Story) => {
  ensureLightPlatformTheme();

  return React.createElement(
    PlatformThemeProvider,
    null,
    React.createElement(
      'div',
      {
        // Keep the preview wrapper token-aware without forcing page-sized empty space
        // around small primitives like buttons.
        className: 'inline-flex bg-background p-6 text-foreground',
      },
      React.createElement(Story, {}),
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
