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
      maxWidth: {
        modal: '25rem'
      }
    },
    fontFamily: {
      body: ['Rubik', 'system-ui', 'sans-serif'],
      mono: ['IBM Plex Mono', 'system-ui-monospace', 'monospace']
    }
  },
  variants: {
    margin: ['responsive', 'first']
  }
}
