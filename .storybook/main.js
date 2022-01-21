module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-create-react-app',
  ],
  framework: '@storybook/react',
  previewHead: (head) => `
    ${head}
    <link rel="stylesheet"  href="/fontawesome/css/all.min.css" />
  `,
  core: {
    builder: 'webpack5',
  },
}
