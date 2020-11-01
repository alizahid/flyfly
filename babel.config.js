module.exports = {
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@pickle/components': './components',
          '@pickle/lib': './lib',
          '@pickle/types': './types'
        },
        extensions: ['.ts', '.tsx'],
        root: ['.']
      }
    ]
  ],
  presets: ['next/babel']
}
