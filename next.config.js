module.exports = {
  env: {
    FREE_PLAN_ID: process.env.FREE_PLAN_ID,
    STRIPE_KEY: process.env.STRIPE_KEY,
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
