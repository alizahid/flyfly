module.exports = {
  env: {
    URL: process.env.URL
  },
  async rewrites() {
    return [
      {
        destination: '/api/submit',
        source: '/submit/:id'
      }
    ]
  }
}
