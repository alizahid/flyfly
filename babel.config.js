module.exports = {
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@flyfly/client': './client',
          '@flyfly/components': './components',
          '@flyfly/hooks': './hooks',
          '@flyfly/server': './server',
          '@flyfly/types': './types'
        },
        extensions: ['.ts', '.tsx'],
        root: ['.']
      }
    ]
  ],
  presets: ['next/babel']
}
