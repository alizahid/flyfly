module.exports = {
  async rewrites() {
    return [
      {
        destination: '/api/form',
        source: '/form/:slug'
      }
    ]
  }
}
