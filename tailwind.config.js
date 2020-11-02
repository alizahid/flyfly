module.exports = {
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true
  },
  plugins: [],
  purge: ['./**/*.tsx', './assets/global.scss'],
  theme: {
    extend: {
      colors: {
        modal: 'rgba(0, 0, 0, 0.8)'
      },
      fontFamily: {
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
  variants: {}
}
