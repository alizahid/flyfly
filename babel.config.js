module.exports = {
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@pickle/components': './components',
          '@pickle/hooks': './hooks',
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
