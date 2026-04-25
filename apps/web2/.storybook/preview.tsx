import '../app/globals.css';

import type { Decorator, Preview } from '@storybook/react';

import { cn } from '@/lib/utils';

const withTheme: Decorator = (Story, context) => {
  const isDark = context.globals.theme === 'dark';
  const isFullscreen = context.parameters.layout === 'fullscreen';

  return (
    <div className={cn('w-full transition-colors', isDark ? 'dark' : null)}>
      <div
        className={cn(
          'w-full bg-background text-foreground transition-colors',
          isFullscreen ? 'min-h-screen p-0' : 'grid place-items-center p-6',
        )}
      >
        <Story />
      </div>
    </div>
  );
};

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    backgrounds: {
      disable: true,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'padded',
    nextjs: {
      appDirectory: true,
    },
  },
};

export default preview;
