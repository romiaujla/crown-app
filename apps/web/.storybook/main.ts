import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { StorybookConfig } from '@storybook/experimental-nextjs-vite';
import { mergeConfig } from 'vite';

const storybookDir = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(storybookDir, '..');

const config: StorybookConfig = {
  stories: ['../components/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-interactions', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/experimental-nextjs-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  viteFinal: async (config) =>
    mergeConfig(config, {
      resolve: {
        alias: {
          '@': appDir,
        },
      },
    }),
};

export default config;
