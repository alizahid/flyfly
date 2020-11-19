const colors = require('tailwindcss/colors')

module.exports = {
  plugins: [],
  purge: ['./**/*.tsx', './assets/global.scss'],
  theme: {
    colors,
    extend: {
      colors: {
        highlight: 'rgba(0, 0, 0, 0.5)',
        modal: 'rgba(0, 0, 0, 0.8)',
        overlay: 'rgba(255, 255, 255, 0.95)'
      },
      fontFamily: {
        mono: [
          'IBM Plex Mono',
          'Consolas',
          'Menlo',
          'Monaco',
          'Liberation Mono',
          'Courier New',
          'monospace'
        ],
        sans: [
          'Rubik',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Helvetica',
          'Arial',
          'sans-serif',
          'Apple Color Emoji',
          'Segoe UI Emoji'
        ]
      },
      maxWidth: {
        modal: '25rem'
      }
    }
  },
  variants: {
    margin: ['responsive', 'first']
  }
}
