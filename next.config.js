module.exports = {
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL
  },
  async rewrites() {
    return [
      {
        destination: '/api/submit',
        source: '/submit/:slug'
      }
    ]
  }
}
