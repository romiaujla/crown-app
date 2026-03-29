import '../app/globals.css';

import type { Preview } from '@storybook/experimental-nextjs-vite';

const withTheme = (Story: () => JSX.Element, context: { globals: { theme?: string } }) => {
  const isDark = context.globals.theme === 'dark';

  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', isDark);
  }

  return (
    <div className="min-h-screen bg-background p-6 text-foreground">
      <Story />
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
    layout: 'centered',
    nextjs: {
      appDirectory: true,
    },
  },
};

export default preview;
