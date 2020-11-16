module.exports = {
  env: {
    URL: process.env.URL
  },
  async rewrites() {
    return [
      {
        destination: '/api/respond',
        source: '/f/:slug'
      }
    ]
  }
}
