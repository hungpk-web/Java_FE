import type { StorybookConfig } from '@storybook/vue3-vite';

const config: StorybookConfig = {
  framework: {
    name: '@storybook/vue3-vite',
    options: {}
  },
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)'
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions'
  ],
  docs: {
    autodocs: 'tag'
  },
  // Loại bỏ các plugin Vite không tương thích trong môi trường Storybook
  viteFinal: async (config) => {
    if (Array.isArray((config as any).plugins)) {
      (config as any).plugins = (config as any).plugins.filter((p: any) => {
        const name = p?.name || '';
        return !(
          name.includes('vite-plugin-vue-devtools') ||
          name.includes('vite-plugin-inspect') ||
          name.includes('inspect')
        );
      });
    }
    return config;
  }
};

export default config;


