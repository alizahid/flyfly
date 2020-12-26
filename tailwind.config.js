const colors = require('tailwindcss/colors')

module.exports = {
  plugins: [],
  purge: ['./**/*.tsx', './assets/global.scss'],
  theme: {
    colors,
    extend: {
      colors: {
        modal: 'rgba(0, 0, 0, 0.8)',
        overlay: 'rgba(255, 255, 255, 0.95)'
      },
      maxWidth: {
        modal: '25rem'
      }
    },
    fontFamily: {
      body: ['Inter', 'sans-serif'],
      code: ['IBM Plex Mono', 'monospace'],
      display: ['Poppins', 'sans-serif']
    }
  },
  variants: {
    extend: {
      margin: ['first']
    }
  }
}
